// ===== data =====
const TY=["O-","O+","A-","A+","B-","B+","AB-","AB+"];
const GIVE={"O-":TY,"O+":["O+","A+","B+","AB+"],"A-":["A-","A+","AB-","AB+"],"A+":["A+","AB+"],"B-":["B-","B+","AB-","AB+"],"B+":["B+","AB+"],"AB-":["AB-","AB+"],"AB+":["AB+"]};
const PCT={"O+":37,"A+":36,"B+":9,"O-":7,"A-":6,"AB+":3,"B-":2,"AB-":1};// US share, American Red Cross
const COL=["#6b0f24","#9c1432","#d90b2b","#f0384f","#e0566b","#c4304a","#a3203a","#7d1530"];
const PROV={en:["Kabul","Herat","Balkh","Kandahar","Nangarhar","Bamyan","Paktia","Badakhshan"],fa:["کابل","هرات","بلخ","کندهار","ننگرهار","بامیان","پکتیا","بدخشان"],ps:["کابل","هرات","بلخ","کندهار","ننګرهار","بامیان","پکتیا","بدخشان"]};
const L={
en:{dir:"ltr",nav:["Blood types","Compatibility","Find donors","Requests","Eligibility","Hospitals","Learn"],tag:"Prototype · sample data",h:"Blood, found in <em>minutes.</em>",sub:"Volunteer donors, an emergency request board and a hospital directory for every province, in Dari, Pashto and English.",c1:"Find a donor",c2:"Become a donor",qt:"Quick search · patient needs",go:"Search donors",sd:["sample donors","provinces","languages","blood types"],
tt:"Eight blood types, one tap each",tl:"Tap or hover a card to flip it.",give:"Can give to",get:"Can receive from",pc:"of people (US)",
mt:"Compatibility checker",ml:"Pick the patient's blood type. Highlighted donors can give to that patient. Tap a column to change it.",mg:"{n} blood types can give to {t}",
ft:"Find a donor",fl:"Pick the patient's blood type and province. Longest-rested donors appear first.",pr:"Province",rs:"{n} potential donors in {p}",ct:"Contact",nd:"No donors yet for this search. Try another province or post a request.",lg:"last gave {n} days ago",ready:"Ready",
bt:"Emergency requests",bl:"Hospitals and families post urgent needs here.",ur:"Urgent",so:"Soon",pt:"Post a request",ps:"Post",hosp:"Hospital",
et:"Can I donate?",el:"A quick check against common guidelines. The hospital always decides.",ag:"Age",kg:"Weight (kg)",dy:"Days since last donation",ey:"You may be able to donate. Visit a hospital for a health check.",en:"Not eligible right now. Check age 18–60, weight above 50 kg and 56+ days since last donation.",
dt:"Hospitals and blood banks",dl:"Sample listings. Real data comes from the database.",
jt:"The donation journey",jl:"From sign-up to a saved life in four steps.",js:[["Register","Sign up with blood type and province."],["Get matched","Families find compatible donors."],["Health check","Staff check health, age and weight."],["Donate and rest","Donate under care, then rest."]],
mh:"Myth or fact?",mm:"Tap a card to reveal the truth.",my:[["Giving blood makes you weak.","Fact: the body replaces the fluid within hours and red cells within weeks."],["Donating is painful.","Fact: you feel a quick pinch. The donation itself takes about 10 minutes."],["Fasting? Then you can never donate.","Fact: ask your hospital. Many donors simply donate outside fasting hours."],["Women should not donate.","Fact: women can donate if they meet the health and weight checks."]],
ab:"DonorConnect connects volunteer donors with patients in Afghanistan. It does not replace a doctor or blood bank. Hospitals must confirm compatibility and eligibility.",pg:"Pages",pn:"Prototype: names and numbers are examples, not real people.",sos:"Need blood now",donor:"Donor"},
fa:{dir:"rtl",nav:["گروه‌های خون","سازگاری","یافتن دهنده","درخواست‌ها","شرایط اهدا","شفاخانه‌ها","آموزش"],tag:"نمونهٔ آزمایشی · اطلاعات نمونه",h:"خون، در چند <em>دقیقه.</em>",sub:"دهنده‌های داوطلب، تختهٔ درخواست‌های اضطراری و فهرست شفاخانه‌ها برای هر ولایت، به دری، پشتو و انگلیسی.",c1:"یافتن دهنده",c2:"دهنده شوید",qt:"جستجوی سریع · گروه خون مریض",go:"جستجو",sd:["دهندهٔ نمونه","ولایت","زبان","گروه خون"],
tt:"هشت گروه خون، هر کدام یک ضربه",tl:"برای چرخاندن کارت لمس کنید.",give:"می‌تواند بدهد به",get:"می‌تواند بگیرد از",pc:"مردم (امریکا)",
mt:"بررسی سازگاری",ml:"گروه خون مریض را انتخاب کنید. دهنده‌های رنگی می‌توانند به او خون بدهند.",mg:"{n} گروه خون می‌تواند به {t} بدهد",
ft:"یافتن دهنده",fl:"گروه خون مریض و ولایت را انتخاب کنید.",pr:"ولایت",rs:"{n} دهندهٔ احتمالی در {p}",ct:"تماس",nd:"هنوز دهنده‌ای نیست. ولایت دیگر را امتحان کنید یا درخواست بگذارید.",lg:"{n} روز پیش اهدا کرد",ready:"آماده",
bt:"درخواست‌های اضطراری",bl:"شفاخانه‌ها و خانواده‌ها نیاز فوری را اینجا می‌گذارند.",ur:"فوری",so:"به زودی",pt:"ثبت درخواست",ps:"ثبت",hosp:"شفاخانه",
et:"آیا می‌توانم خون بدهم؟",el:"یک بررسی سریع؛ تصمیم نهایی با شفاخانه است.",ag:"سن",kg:"وزن (کیلو)",dy:"روز از آخرین اهدا",ey:"شاید بتوانید اهدا کنید. برای معاینه به شفاخانه بروید.",en:"فعلاً مناسب نیستید. سن ۱۸–۶۰، وزن بالاتر از ۵۰ و ۵۶ روز از اهدای قبلی.",
dt:"شفاخانه‌ها و بانک‌های خون",dl:"نمونه؛ اطلاعات واقعی از پایگاه داده می‌آید.",
jt:"مسیر اهدا",jl:"از ثبت‌نام تا نجات یک جان در چهار گام.",js:[["ثبت‌نام","با گروه خون و ولایت ثبت شوید."],["همخوانی","خانواده‌ها دهندهٔ سازگار را می‌یابند."],["معاینه","کارمندان صحت، سن و وزن را می‌بینند."],["اهدا و استراحت","زیر نظر داکتر اهدا و استراحت کنید."]],
mh:"افسانه یا واقعیت؟",mm:"برای دیدن حقیقت کارت را لمس کنید.",my:[["اهدای خون آدم را ضعیف می‌کند.","واقعیت: بدن مایعات را در ساعاتی و گلبول‌ها را در چند هفته جبران می‌کند."],["اهدای خون دردناک است.","واقعیت: فقط یک سوزن‌خوردگی کوتاه؛ حدود ۱۰ دقیقه."],["روزه‌دار هرگز نمی‌تواند اهدا کند.","واقعیت: از شفاخانه بپرسید؛ بسیاری بیرون از ساعات روزه اهدا می‌کنند."],["زن‌ها نباید اهدا کنند.","واقعیت: زنان با شرایط صحی و وزن مناسب می‌توانند اهدا کنند."]],
ab:"دونرکنکت دهنده‌های داوطلب را با مریضان در افغانستان وصل می‌کند و جای داکتر یا بانک خون را نمی‌گیرد.",pg:"صفحات",pn:"نمونهٔ آزمایشی: نام‌ها و شماره‌ها مثال هستند.",sos:"خون فوری",donor:"دهنده"},
ps:{dir:"rtl",nav:["د وینې ډولونه","مطابقت","ورکوونکي موندل","غوښتنې","د ورکړې شرایط","روغتونونه","زده کړه"],tag:"آزمایښتي بڼه · نمونه معلومات",h:"وینه، په څو <em>دقیقو</em> کې.",sub:"داوطلب ورکوونکي، د بیړنیو غوښتنو تخته او د هر ولایت د روغتونونو لارښود، په دري، پښتو او انګلیسي.",c1:"ورکوونکی ومومئ",c2:"ورکوونکی شئ",qt:"چټک لټون · د ناروغ د وینې ډول",go:"لټون",sd:["نمونه ورکوونکي","ولایتونه","ژبې","د وینې ډولونه"],
tt:"اته د وینې ډولونه، هر یو یو ټچ",tl:"د کارت اړولو لپاره یې ټچ کړئ.",give:"ورکولی شي",get:"اخیستلی شي",pc:"خلک (امریکا)",
mt:"د مطابقت وارزونه",ml:"د ناروغ د وینې ډول وټاکئ. رنګین ورکوونکي ورته وینه ورکولی شي.",mg:"{n} د وینې ډولونه {t} ته ورکولی شي",
ft:"ورکوونکی ومومئ",fl:"د ناروغ د وینې ډول او ولایت وټاکئ.",pr:"ولایت",rs:"په {p} کې {n} احتمالي ورکوونکي",ct:"اړیکه",nd:"تر اوسه ورکوونکی نشته. بل ولایت وازمایئ یا غوښتنه ولیکئ.",lg:"{n} ورځې مخکې یې ورکړه",ready:"چمتو",
bt:"بیړنۍ غوښتنې",bl:"روغتونونه او کورنۍ دلته بیړنۍ اړتیاوې ږدي.",ur:"بیړنی",so:"ژر",pt:"غوښتنه ولیکئ",ps:"ولیکئ",hosp:"روغتون",
et:"ایا زه وینه ورکولی شم؟",el:"چټکه ازموینه؛ وروستی پریکړه د روغتون ده.",ag:"عمر",kg:"وزن (کیلو)",dy:"له وروستۍ ورکړې ورځې",ey:"شاید وینه ورکولی شئ. د معاینې لپاره روغتون ته ورشئ.",en:"اوس مناسب نه یاست. عمر ۱۸–۶۰، وزن له ۵۰ پورته او ۵۶ ورځې.",
dt:"روغتونونه او د وینې بانکونه",dl:"نمونه؛ ریښتینی معلومات له ډیټابیس راځي.",
jt:"د ورکړې لاره",jl:"له ثبت نه د ژوند ژغورلو پورې په څلورو ګامونو کې.",js:[["ثبت","د وینې ډول او ولایت سره ثبت شئ."],["مطابقت","کورنۍ مناسب ورکوونکی مومي."],["معاینه","کارمندان روغتیا، عمر او وزن ګوري."],["ورکړه او آرام","د ډاکتر تر څارنې لاندې وینه ورکړئ."]],
mh:"افسانه که حقیقت؟",mm:"د حقیقت لپاره کارت ټچ کړئ.",my:[["وینه ورکول کمزوری کوي.","حقیقت: بدن مایعات په ساعتونو او کروښې په څو اونیو کې ډکوي."],["وینه ورکول دردناک دی.","حقیقت: یوازې لنډ ستن؛ نژدې ۱۰ دقیقې."],["روژه‌دار هیڅکله نشي ورکولی.","حقیقت: له روغتون وپوښتئ؛ ډیر کسان د روژې له وخته بهر ورکوي."],["ښځې باید وینه ورنکړي.","حقیقت: ښځې د روغتیا او وزن شرایطو سره ورکولی شي."]],
ab:"دونرکنکټ داوطلب ورکوونکي په افغانستان کې ناروغانو سره نښلوي او د ډاکتر یا وینې بانک ځای نه نیسي.",pg:"پاڼې",pn:"آزمایښتي بڼه: نومونه او شمېرې بېلګې دي.",sos:"اوس وینه پکار ده",donor:"ورکوونکی"}};
// ===== state / helpers =====
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let lang="en",need="O-",prov=0,sel="O+";
const t=k=>L[lang][k],dsp=x=>x.replace("-","−"),fill=(s,o)=>s.replace(/\{(\w+)\}/g,(_,k)=>o[k]);
let seed=7;const rnd=()=>(seed=seed*16807%2147483647)/2147483647;
const DON=Array.from({length:160},(_,i)=>({id:i,t:TY[Math.floor(rnd()*8)],p:Math.floor(rnd()*8),days:Math.floor(rnd()*200)+40,n:String.fromCharCode(65+i%26)}));
const REQ=[{t:"O-",p:0,h:0,u:1},{t:"B+",p:1,h:1,u:1},{t:"A-",p:2,h:0,u:0}];
const ic=(p,s=22)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const I={drop:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',siren:'<path d="M6 18v-5a6 6 0 0 1 12 0v5M4 18h16M12 3v2M4 7l1.5 1M20 7l-1.5 1"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',pin:'<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2"/>',hosp:'<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/>',check:'<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',swap:'<path d="M4 8h14l-3-3M20 16H6l3 3"/>',moon:'<path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10z"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',alert:'<path d="M12 3l10 18H2L12 3z"/><path d="M12 10v4M12 17.5v.01"/>',cal:'<rect x="4" y="5" width="16" height="16" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>'};
const LOGO=(s=36)=>`<svg viewBox="0 0 40 40" width="${s}" height="${s}"><path d="M20 2S6 17 6 26a14 14 0 0 0 28 0C34 17 20 2 20 2z" fill="#D90B2B"/><path d="M9 26h7l3-7 4 12 3-7h5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const HERO=`<svg viewBox="0 0 200 250"><defs><clipPath id="cp"><path d="M100 10S25 95 25 150a75 75 0 0 0 150 0C175 95 100 10 100 10z"/></clipPath><linearGradient id="gr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff6b80"/><stop offset="1" stop-color="#b3081f"/></linearGradient></defs><path d="M100 10S25 95 25 150a75 75 0 0 0 150 0C175 95 100 10 100 10z" fill="url(#gr)"/><g clip-path="url(#cp)"><path class="wave" d="M-60 120q30-18 60 0t60 0 60 0 60 0 60 0 60 0V260H-60z" fill="#fff" opacity=".22"/></g><path class="ecg" d="M45 150h35l12-30 18 62 14-42 10 10h35" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const sec=(id,ico,tk,lk)=>`<section id="${id}"><div class="w"><div class="head rv"><div class="ico">${ic(I[ico],28)}</div><h2 data-t="${tk}"></h2><p data-t="${lk}"></p></div>`;
// ===== build =====
const IDS=["types","match","find","board","elig","dir","learn"],NI=["drop","swap","search","siren","check","hosp","bulb"];
$("#app").innerHTML=`
<nav><div class="w"><a class="brand" href="#top">${LOGO()}DonorConnect</a><div class="links" id="lk"></div>
<a class="btn p stf" href="/admin">${ic(I.user,16)}Staff login</a><div class="pill" id="lg"><button data-l="en" class="on">EN</button><button data-l="fa">دری</button><button data-l="ps">پښتو</button></div>
<button class="ib" id="th" aria-label="theme">${ic(I.moon,18)}</button><button class="ib burger" id="bg" aria-label="menu">${ic(I.menu,18)}</button></div></nav>
<header class="hero" id="top"><i class="blob b1"></i><i class="blob b2"></i><div class="w"><div class="hg"><div class="rv"><span class="tag"><i></i><span data-t="tag"></span></span><h1 data-h="h"></h1><p class="sub" data-t="sub"></p>
<a class="btn p" href="#find">${ic(I.search,20)}<span data-t="c1"></span></a> <a class="btn g" href="#elig">${ic(I.heart,20)}<span data-t="c2"></span></a></div>
<div class="art"><i class="ring"></i><i class="ring"></i>${HERO}</div></div>
<div class="card quick rv"><h3>${ic(I.drop,20)}<span data-t="qt"></span></h3><div class="chips nc"></div><div class="row"><select class="ps"></select><a class="btn p" href="#find" style="justify-content:center"><span data-t="go"></span>${ic(I.arrow,18)}</a></div></div>
<div class="stats" id="st"></div></div></header>
${sec("types","drop","tt","tl")}<div class="grid4" id="fc"></div></div></section>
${sec("match","swap","mt","ml")}<div class="card rv"><div class="chips nc" style="justify-content:center"></div><div class="legend" id="mg" style="font-weight:800;color:var(--red);margin:0 0 14px"></div><div class="scroll"><table id="mx"></table></div></div></div></section>
${sec("find","search","ft","fl")}<div class="card rv"><div class="chips nc"></div><select class="ps"></select><div id="rc" style="margin-top:14px;font-weight:800;color:var(--red)"></div><div class="res" id="rs"></div></div></div></section>
${sec("board","siren","bt","bl")}<div class="two"><div id="rq"></div><div class="card rv"><h3 data-t="pt" style="margin-bottom:12px"></h3><div class="chips" id="pc"></div><select id="pp" class="ps2" style="margin-bottom:12px"></select><select id="pu"><option value="1"></option><option value="0"></option></select><br><br><button class="btn p" id="pb" style="width:100%;justify-content:center"><span data-t="ps"></span></button></div></div></div></section>
${sec("elig","check","et","el")}<div class="card rv" style="max-width:640px;margin:auto"><div class="row"><div><label data-t="ag"></label><input id="ea" type="number" value="25"></div><div><label data-t="kg"></label><input id="ek" type="number" value="65"></div><div><label data-t="dy"></label><input id="ed" type="number" value="90"></div></div><div id="er"></div></div></div></section>
${sec("dir","hosp","dt","dl")}<div class="grid3" id="dr"></div></div></section>
<section><div class="w"><div class="head rv"><div class="ico">${ic(I.heart,28)}</div><h2 data-t="jt"></h2><p data-t="jl"></p></div><div class="steps" id="sp"></div></div></section>
${sec("learn","bulb","mh","mm")}<div class="grid4 myth" id="my"></div></div></section>
<a class="adm-fab" href="/admin" title="Admin panel">Admin</a><footer><div class="w"><div class="fg"><div><div class="brand" style="color:#fff">${LOGO(34)}DonorConnect</div><p data-t="ab" style="margin-top:12px"></p></div><div><h5 data-t="pg"></h5><div id="fl"></div></div><div><h5>Group 08 · ITC 496</h5><a>AUAF · Senior Project I</a><a>Flask · SQLite · HTML · CSS · JS</a><a href="/admin">Admin login</a></div></div><div class="fine" data-t="pn"></div></div></footer>
<a class="btn p sos" href="#find">${ic(I.siren,20)}<span data-t="sos"></span></a>`;
// ===== render =====
const chips=(cur,fn,list=TY)=>list.map(x=>`<button class="${x===cur?"on":""}" onclick="${fn}('${x}')">${dsp(x)}</button>`).join("");
function drawStatic(){const l=L[lang];document.documentElement.lang=lang;document.documentElement.dir=l.dir;
 $$("[data-t]").forEach(e=>e.textContent=t(e.dataset.t));$$("[data-h]").forEach(e=>e.innerHTML=t(e.dataset.h));
 $("#lk").innerHTML=IDS.map((id,i)=>`<a href="#${id}" onclick="$('#lk').classList.remove('open')">${ic(I[NI[i]],16)}${l.nav[i]}</a>`).join("");
 $("#fl").innerHTML=IDS.map((id,i)=>`<a href="#${id}">${l.nav[i]}</a>`).join("");
 $$("#lg button").forEach(b=>b.classList.toggle("on",b.dataset.l===lang));
 const po=PROV[lang].map((p,i)=>`<option value="${i}">${p}</option>`).join("");$$(".ps").forEach(s=>{s.innerHTML=po;s.value=prov});$("#pp").innerHTML=po;
 $("#pu").innerHTML=`<option value="1">${l.ur}</option><option value="0">${l.so}</option>`;
 $("#st").innerHTML=[DON.length,8,3,8].map((n,i)=>`<div class="card stat rv in"><b>${n}</b><span>${l.sd[i]}</span></div>`).join("");
 $("#fc").innerHTML=TY.map((x,i)=>`<div class="flip rv" onclick="this.classList.toggle('on')"><div class="fi"><div class="fa" style="background:linear-gradient(145deg,${COL[i]},#ff6b80)"><b>${dsp(x)}</b><small>${PCT[x]}% ${l.pc}</small><div class="bar"><i style="width:${PCT[x]*2.4}%"></i></div></div><div class="fb"><h4>${l.give}</h4><div class="mini">${GIVE[x].map(y=>`<span>${dsp(y)}</span>`).join("")}</div><h4>${l.get}</h4><div class="mini">${TY.filter(y=>GIVE[y].includes(x)).map(y=>`<span>${dsp(y)}</span>`).join("")}</div></div></div></div>`).join("");
 $("#sp").innerHTML=l.js.map((s,i)=>`<div class="card step rv">${ic(I[["user","search","check","heart"][i]],28)}<h4>${s[0]}</h4><p>${s[1]}</p></div>`).join("");
 $("#my").innerHTML=l.my.map(m=>`<div class="flip myth rv" onclick="this.classList.toggle('on')"><div class="fi"><div class="fa">${m[0]}</div><div class="fb"><em>${m[1]}</em></div></div></div>`).join("");
 $("#dr").innerHTML=[0,1].flatMap(k=>[prov,(prov+1+k)%8]).slice(0,3).map((p,i)=>`<div class="card rv in" style="display:flex;gap:14px;align-items:center"><div class="av" style="background:var(--red)">${ic(I[i===1?"drop":"hosp"],26)}</div><div><b>${PROV[lang][p]} ${i===1?"· Blood bank":l.hosp}</b><small style="display:block;color:var(--mut)">${ic(I.pin,13)} ${PROV[lang][p]}</small></div></div>`).join("");
 drawDyn();watch()}
function drawDyn(){const l=L[lang];
 $$(".nc").forEach(c=>c.innerHTML=chips(need,"setNeed"));$("#pc").innerHTML=chips(sel,"setSel");
 $("#mg").textContent=fill(l.mg,{n:TY.filter(x=>GIVE[x].includes(need)).length,t:dsp(need)});
 $("#mx").innerHTML="<tr><th></th>"+TY.map(c=>`<th class="${c===need?"hl":""}" onclick="setNeed('${c}')">${dsp(c)}</th>`).join("")+"</tr>"+TY.map(r=>`<tr><th>${dsp(r)}</th>${TY.map(c=>`<td class="${GIVE[r].includes(c)?"y":"n"} ${c===need?"hl":""}">${GIVE[r].includes(c)?"✓":"·"}</td>`).join("")}</tr>`).join("");
 const m=DON.filter(d=>d.p===prov&&GIVE[d.t].includes(need)).sort((a,b)=>b.days-a.days);
 $("#rc").textContent=fill(l.rs,{n:m.length,p:PROV[lang][prov]});
 $("#rs").innerHTML=m.length?m.slice(0,12).map(d=>`<div class="card don"><div class="av" style="background:${COL[TY.indexOf(d.t)]}">${dsp(d.t)}</div><div><b>${l.donor} ${d.n}.</b><small>${fill(l.lg,{n:d.days})}</small>${d.days>=56?`<span class="badge">${l.ready}</span>`:""}</div><button onclick="this.textContent='07X XXX '+(1000+${d.id*37}%9000)">${l.ct}</button></div>`).join(""):`<p style="color:var(--mut)">${l.nd}</p>`;
 $("#rq").innerHTML=REQ.map(r=>`<div class="card req ${r.u?"":"s"} rv in"><div class="t">${dsp(r.t)}</div><div><p>${l.hosp} · ${PROV[lang][r.p]}</p><small>${ic(I.pin,13)} ${PROV[lang][r.p]}</small></div><span class="u">${r.u?l.ur:l.so}</span></div>`).join("");
 chk()}
function chk(){const a=+$("#ea").value,k=+$("#ek").value,d=+$("#ed").value,ok=a>=18&&a<=60&&k>50&&d>=56;$("#er").innerHTML=`<div class="ans ${ok?"okk":"bad"}">${ic(I[ok?"check":"alert"],26)}${L[lang][ok?"ey":"en"]}</div>`}
function setNeed(x){need=x;drawDyn()}function setSel(x){sel=x;drawDyn()}
function watch(){const o=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&(x.target.classList.add("in"),o.unobserve(x.target))),{threshold:.12});$$(".rv:not(.in)").forEach(e=>o.observe(e))}
// ===== events =====
$("#lg").onclick=e=>{if(e.target.dataset.l){lang=e.target.dataset.l;drawStatic()}};
$("#th").onclick=()=>{const d=document.documentElement.dataset.theme==="dark";document.documentElement.dataset.theme=d?"":"dark";$("#th").innerHTML=ic(I[d?"moon":"sun"],18)};
$("#bg").onclick=()=>$("#lk").classList.toggle("open");
document.addEventListener("change",e=>{if(e.target.classList.contains("ps")){prov=+e.target.value;$$(".ps").forEach(s=>s.value=prov);drawDyn()}});
$("#pb").onclick=()=>{REQ.unshift({t:sel,p:+$("#pp").value,h:0,u:+$("#pu").value});drawDyn()};
["ea","ek","ed"].forEach(i=>$("#"+i).oninput=chk);
drawStatic();
