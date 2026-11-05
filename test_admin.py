import pytest, app as A
@pytest.fixture
def c(tmp_path, monkeypatch):
    monkeypatch.setenv("ADMIN_PASSWORD", "test-only-password")
    A.app.config.update(DB=str(tmp_path/"t.db"), TESTING=True); A.init_db()
    return A.app.test_client()
def login(c, pw="test-only-password"): return c.post("/api/admin/login", json={"email":"admin@donorconnect.af","password":pw})
def test_requires_login(c): assert c.get("/api/admin/stats").status_code == 401
def test_login_ok(c): assert login(c).status_code == 200 and c.get("/api/admin/stats").status_code == 200
def test_init_db_requires_password(tmp_path, monkeypatch):
    monkeypatch.delenv("ADMIN_PASSWORD", raising=False)
    A.app.config["DB"] = str(tmp_path/"unconfigured.db")
    with pytest.raises(RuntimeError, match="Set ADMIN_PASSWORD"):
        A.init_db()
def test_session_expires_after_24_hours(c, monkeypatch):
    assert login(c).status_code == 200
    with c.session_transaction() as s:
        assert s.permanent
        authenticated_at = s["auth_at"]
    monkeypatch.setattr(A.time, "time", lambda: authenticated_at + 24 * 60 * 60 + 1)
    assert c.get("/api/admin/stats").status_code == 401
    assert login(c).status_code == 200
    assert c.get("/api/admin/stats").status_code == 200
def test_lockout(c):
    for _ in range(5): assert login(c, "bad").status_code == 401
    assert login(c).status_code == 429
def test_compat_64():
    assert sum(A.can_donate(d, r) for d in A.TY for r in A.TY) == 27
def test_phone_masked_and_reveal_logged(c):
    login(c); it = c.get("/api/admin/donors").json["items"][0]; assert "•" in it["phone"]
    c.get(f"/api/admin/donors/{it['id']}/phone"); assert any(a["action"]=="reveal_phone" for a in c.get("/api/admin/audit").json)
def test_matches_are_compatible(c):
    login(c)
    for r in c.get("/api/admin/requests").json:
        for m in c.get(f"/api/admin/requests/{r['id']}/matches").json: assert A.can_donate(m["type"], r["blood_type"])
def test_bad_status(c):
    login(c); assert c.patch("/api/admin/donors/1", json={"status":"x"}).status_code == 422
