"""DonorConnect: Flask + SQLite backend with admin-only API. Run: python app.py"""
import sqlite3, random, os, time, secrets
from datetime import timedelta
from functools import wraps
from flask import Flask, g, request, session, jsonify
from werkzeug.security import generate_password_hash as gh, check_password_hash as ch

app = Flask(__name__, static_folder="static", static_url_path="")
_secret_key = os.environ.get("SECRET_KEY")
if os.environ.get("VERCEL") and not _secret_key:
    raise RuntimeError("Set SECRET_KEY in the Vercel project environment variables.")
app.secret_key = _secret_key or secrets.token_hex(32)
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(hours=24)
if os.environ.get("VERCEL"):
    app.config.update(SESSION_COOKIE_SECURE=True, SESSION_COOKIE_HTTPONLY=True, SESSION_COOKIE_SAMESITE="Lax")
# Vercel's disk is read-only except /tmp, so the database lives there when deployed
_default_db = "/tmp/donorconnect.db" if os.environ.get("VERCEL") else "donorconnect.db"
app.config["DB"] = os.environ.get("DC_DB", _default_db)
TY = ["O-","O+","A-","A+","B-","B+","AB-","AB+"]
GIVE = {"O-":TY,"O+":["O+","A+","B+","AB+"],"A-":["A-","A+","AB-","AB+"],"A+":["A+","AB+"],
        "B-":["B-","B+","AB-","AB+"],"B+":["B+","AB+"],"AB-":["AB-","AB+"],"AB+":["AB+"]}
PROV = ["Kabul","Herat","Balkh","Kandahar","Nangarhar","Bamyan","Paktia","Badakhshan"]
def can_donate(d, r): return r in GIVE.get(d, [])

SCHEMA = """
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,name TEXT,email TEXT UNIQUE,password_hash TEXT,role TEXT DEFAULT 'admin',failed INTEGER DEFAULT 0,locked_until REAL DEFAULT 0);
CREATE TABLE IF NOT EXISTS donors(id INTEGER PRIMARY KEY,full_name TEXT,gender TEXT,blood_type TEXT,province_id INTEGER,phone TEXT,last_donation_days INTEGER,status TEXT DEFAULT 'pending',created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS hospitals(id INTEGER PRIMARY KEY,name TEXT,kind TEXT,province_id INTEGER);
CREATE TABLE IF NOT EXISTS requests(id INTEGER PRIMARY KEY,patient TEXT,blood_type TEXT,units INTEGER,province_id INTEGER,hospital_id INTEGER,urgency TEXT,status TEXT DEFAULT 'open',created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS audit_log(id INTEGER PRIMARY KEY,admin_id INTEGER,action TEXT,entity TEXT,entity_id INTEGER,detail TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS ix_d ON donors(blood_type,province_id,status);
CREATE INDEX IF NOT EXISTS ix_r ON requests(status,urgency);
"""
def db():
    if "db" not in g:
        g.db = sqlite3.connect(app.config["DB"]); g.db.row_factory = sqlite3.Row
    return g.db
@app.teardown_appcontext
def close(_):
    d = g.pop("db", None)
    if d: d.close()

def init_db(seed=496, n=300):
    c = sqlite3.connect(app.config["DB"]); c.executescript(SCHEMA)
    if not c.execute("SELECT 1 FROM users").fetchone():
        pw = os.environ.get("ADMIN_PASSWORD")
        if not pw:
            c.close()
            raise RuntimeError("Set ADMIN_PASSWORD before initializing the database.")
        c.execute("INSERT INTO users(name,email,password_hash) VALUES(?,?,?)", ("Admin","admin@donorconnect.af",gh(pw)))
        rnd = random.Random(seed)  # synthetic data only, fixed seed
        for i in range(n):
            c.execute("INSERT INTO donors(full_name,gender,blood_type,province_id,phone,last_donation_days,status) VALUES(?,?,?,?,?,?,?)",
                (f"Donor {i+1}", rnd.choice("MF"), rnd.choice(TY), rnd.randrange(8), "07%d%07d"%(rnd.choice([0,7,8,9]),rnd.randrange(10**7)),
                 rnd.randrange(30,260), rnd.choice(["verified"]*3+["pending","suspended"])))
        for p in range(8):
            c.execute("INSERT INTO hospitals(name,kind,province_id) VALUES(?,?,?)",(f"{PROV[p]} Regional Hospital","hospital",p))
        for t,p,u in [("O-",0,"urgent"),("B+",1,"urgent"),("A-",2,"soon"),("AB+",3,"planned")]:
            c.execute("INSERT INTO requests(patient,blood_type,units,province_id,hospital_id,urgency) VALUES(?,?,?,?,?,?)",("Patient",t,2,p,p+1,u))
    c.commit(); c.close()

def audit(action, entity, eid, detail=""):
    db().execute("INSERT INTO audit_log(admin_id,action,entity,entity_id,detail) VALUES(?,?,?,?,?)",
                 (session.get("uid"),action,entity,eid,detail)); db().commit()
def admin_required(f):
    @wraps(f)
    def w(*a, **k):
        if (not session.get("uid") or
                time.time() - session.get("auth_at", 0) >= app.permanent_session_lifetime.total_seconds()):
            session.clear()
            return jsonify(error="login required"), 401
        return f(*a, **k)
    return w
def mask(p): return "07•• ••• "+p[-4:]
@app.get("/")
def home(): return app.send_static_file("index.html")
@app.get("/admin")
def admin_page(): return app.send_static_file("admin.html")

@app.post("/api/admin/login")
def login():
    j = request.get_json(silent=True) or {}
    u = db().execute("SELECT * FROM users WHERE email=?", ((j.get("email") or "").strip().lower(),)).fetchone()
    if u and u["locked_until"] > time.time(): return jsonify(error="too many attempts, try later"), 429
    if not u or not ch(u["password_hash"], j.get("password") or ""):
        if u:
            f = u["failed"] + 1
            db().execute("UPDATE users SET failed=?,locked_until=? WHERE id=?", (f, time.time()+900 if f >= 5 else 0, u["id"])); db().commit()
        return jsonify(error="invalid credentials"), 401
    db().execute("UPDATE users SET failed=0,locked_until=0 WHERE id=?", (u["id"],)); db().commit()
    session.permanent = True
    session["uid"] = u["id"]; session["name"] = u["name"]; session["auth_at"] = time.time()
    audit("login","user",u["id"])
    return jsonify(ok=True, name=u["name"])
@app.post("/api/admin/logout")
def logout(): session.clear(); return jsonify(ok=True)
@app.get("/api/admin/me")
@admin_required
def me(): return jsonify(name=session["name"])

@app.get("/api/admin/stats")
@admin_required
def stats():
    d = db(); rows = d.execute("SELECT blood_type,province_id,status FROM donors").fetchall()
    by_t = {t: 0 for t in TY}; by_p = [0]*8; mx = {t: [0]*8 for t in TY}
    for r in rows:
        by_t[r["blood_type"]] += 1; by_p[r["province_id"]] += 1
        if r["status"] == "verified":
            for t in GIVE[r["blood_type"]]: mx[t][r["province_id"]] += 1  # donors able to give TO type t
    rq = {s: n for s, n in d.execute("SELECT status,COUNT(*) FROM requests GROUP BY status")}
    thr = int(request.args.get("threshold", 3))
    short = sorted([{"type": t, "province": PROV[p], "count": mx[t][p]} for t in TY for p in range(8) if mx[t][p] < thr], key=lambda x: (x["count"], TY.index(x["type"])))
    return jsonify(total=len(rows), verified=sum(r["status"]=="verified" for r in rows), open=rq.get("open",0), fulfilled=rq.get("fulfilled",0),
                   by_type=by_t, by_province=dict(zip(PROV, by_p)), matrix=mx, provinces=PROV, shortage=short[:12])

@app.get("/api/admin/donors")
@admin_required
def donors():
    a = request.args; w, v = [], []
    for col, key in [("blood_type","type"),("province_id","province"),("status","status")]:
        if a.get(key) not in (None, ""): w.append(f"{col}=?"); v.append(a[key])
    if a.get("q"): w.append("full_name LIKE ?"); v.append(f"%{a['q']}%")
    where = "WHERE "+" AND ".join(w) if w else ""
    lim, off = min(int(a.get("limit", 15)), 100), int(a.get("offset", 0))
    total = db().execute(f"SELECT COUNT(*) FROM donors {where}", v).fetchone()[0]
    rows = db().execute(f"SELECT * FROM donors {where} ORDER BY id DESC LIMIT ? OFFSET ?", v+[lim, off]).fetchall()
    return jsonify(total=total, items=[{**dict(r), "phone": mask(r["phone"]), "province": PROV[r["province_id"]]} for r in rows])
@app.get("/api/admin/donors/<int:i>/phone")
@admin_required
def phone(i):
    r = db().execute("SELECT phone FROM donors WHERE id=?", (i,)).fetchone()
    if not r: return jsonify(error="not found"), 404
    audit("reveal_phone","donor",i); return jsonify(phone=r["phone"])
@app.patch("/api/admin/donors/<int:i>")
@admin_required
def donor_status(i):
    s = (request.get_json(silent=True) or {}).get("status")
    if s not in ("pending","verified","suspended"): return jsonify(error="bad status"), 422
    if not db().execute("UPDATE donors SET status=? WHERE id=?", (s, i)).rowcount: return jsonify(error="not found"), 404
    db().commit(); audit("set_status","donor",i,s); return jsonify(ok=True)
@app.delete("/api/admin/donors/<int:i>")
@admin_required
def donor_del(i):
    if not db().execute("DELETE FROM donors WHERE id=?", (i,)).rowcount: return jsonify(error="not found"), 404
    db().commit(); audit("delete","donor",i); return jsonify(ok=True)

@app.get("/api/admin/requests")
@admin_required
def reqs():
    rows = db().execute("SELECT r.*,h.name hospital FROM requests r LEFT JOIN hospitals h ON h.id=r.hospital_id ORDER BY r.id DESC").fetchall()
    return jsonify([{**dict(r), "province": PROV[r["province_id"]]} for r in rows])
@app.patch("/api/admin/requests/<int:i>")
@admin_required
def req_status(i):
    s = (request.get_json(silent=True) or {}).get("status")
    if s not in ("open","matched","fulfilled","expired","rejected"): return jsonify(error="bad status"), 422
    if not db().execute("UPDATE requests SET status=? WHERE id=?", (s, i)).rowcount: return jsonify(error="not found"), 404
    db().commit(); audit("set_status","request",i,s); return jsonify(ok=True)
@app.get("/api/admin/requests/<int:i>/matches")
@admin_required
def matches(i):
    r = db().execute("SELECT * FROM requests WHERE id=?", (i,)).fetchone()
    if not r: return jsonify(error="not found"), 404
    rows = db().execute("SELECT * FROM donors WHERE province_id=? AND status='verified' AND last_donation_days>=56 ORDER BY last_donation_days DESC", (r["province_id"],)).fetchall()
    return jsonify([{"id": d["id"], "name": d["full_name"], "type": d["blood_type"], "days": d["last_donation_days"]} for d in rows if can_donate(d["blood_type"], r["blood_type"])][:20])
@app.get("/api/admin/audit")
@admin_required
def audit_list():
    return jsonify([dict(r) for r in db().execute("SELECT * FROM audit_log ORDER BY id DESC LIMIT 60")])

if os.environ.get("VERCEL"): init_db()  # create tables + seed data on every cold start
if __name__ == "__main__":
    init_db(); print("Admin: admin@donorconnect.af  ->  http://127.0.0.1:5000/admin"); app.run(debug=True)
