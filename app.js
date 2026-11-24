document.documentElement.classList.add("js");
const API = "https://script.google.com/macros/s/AKfycbxKpu-fw4o_bI0DOFLLAmE2ox2Boh5DwdWjSgrKtYWHd7fPn3hKvgjgT-A9RylTqdOB/exec";
const $ = id => document.getElementById(id) || document.createElement("div");
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const digits = p => { let d=String(p||"").replace(/\D/g,""); if(d.startsWith("84")&&d.length>=11) d="0"+d.slice(2); return d; };
const fmtPhone = p => { const d=digits(p); return d.length===10 ? d.replace(/(\d{4})(\d{3})(\d{3})/,"$1 $2 $3") : d; };
const safeUrl = u => /^https?:\/\//i.test(String(u||"").trim()) ? String(u).trim() : "";
function img(u){ u=safeUrl(u); const m=u.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]{20,})/); return m ? `https://lh3.googleusercontent.com/d/${m[1]}=w1600` : u; }
const lines = s => String(s||"").split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
const pairs = s => lines(s).map(l=>{ const i=l.indexOf("|"); return i<0 ? [l,""] : [l.slice(0,i).trim(), l.slice(i+1).trim()]; });
const initial = n => (String(n||"").trim().split(/\s+/).pop()||"?").charAt(0).toUpperCase();
const ytId = u => (String(u).match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/)||[])[1];
const regionOf = p => /hưng yên|văn giang|mỹ hào|ocean (park|city)|nghĩa trụ/i.test(p.location+" "+p.name) ? "Hưng Yên" : "Hà Nội";
const I = {
  phone:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
  mail:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm0 2v.4l8 5 8-5V7zm16 2.75-8 5-8-5V17h16z"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>'
};
let P = {}, PROJECTS = [], VIDEOS = [], region = "Tất cả";

function setAvatar(id, name, photo){
  const old=$(id); if(!old) return;
  const ini=()=>{ const s=document.createElement("span"); s.className="ini"; s.id=id; s.textContent=initial(name); return s; };
  let el;
  if(photo){ el=new Image(); el.alt=name; el.src=photo; el.onerror=()=>el.replaceWith(ini()); el.id=id; }
  else el=ini();
  if(old.tagName==="IMG" && el.tagName==="IMG" && old.src===el.src) return;
  old.replaceWith(el);
}

function renderProfile(p){
  P=p; const name=p.name||"Tư vấn bất động sản", photo=img(p.photo), tel=digits(p.phone), zalo=digits(p.zalo||p.phone);
  $("heroName").textContent=name; ["footName","footName2"].forEach(i=>$(i).textContent=name);
  $("aboutName").textContent=name.split(/\s+/).slice(-2).join(" ");
  setAvatar("heroIni", name, photo);
  $("heroRole").textContent=p.title||""; $("heroArea").textContent=p.area||""; $("footRole").textContent=p.title||"";
  $("heroSlogan").textContent=p.slogan||p.intro||""; $("footSlogan").textContent=p.slogan||"";
  if(p.slogan) $("creedQuote").textContent=p.slogan.replace(/\s*-\s*/," – ");
  const cover=img(p.cover)||img(PROJECTS[0]?.image); if(cover) $("heroBg").style.backgroundImage=`url("${cover.replace(/"/g,"%22")}")`;
  if(photo && $("portraitIni")){ const pi=$("portraitIni"); const im=new Image(); im.alt=name; im.src=photo; im.onload=()=>{ if(pi.isConnected) pi.replaceWith(im); }; }
  $("bio").textContent=p.intro||"";
  $("skills").innerHTML=lines(p.skills).map(s=>`<li>${esc(s)}</li>`).join("");
  const cl=[];
  if(tel) cl.push(`<a href="tel:${tel}"><i>${I.phone}</i><span><small>Điện thoại · Zalo</small><b>${fmtPhone(tel)}</b></span></a>`);
  if(p.email) cl.push(`<a href="mailto:${esc(p.email)}"><i>${I.mail}</i><span><small>Email</small><b>${esc(p.email)}</b></span></a>`);
  if(p.area) cl.push(`<a href="#du-an"><i>${I.pin}</i><span><small>Khu vực</small><b>${esc(p.area)}</b></span></a>`);
  $("contactList").innerHTML=cl.join("");
  const so=[]; if(safeUrl(p.facebook)) so.push(["Facebook",p.facebook]); if(safeUrl(p.tiktok)) so.push(["TikTok",p.tiktok]);  $("socials").innerHTML=so.map(([t,u])=>`<a class="btn line sm" href="${esc(safeUrl(u))}" target="_blank" rel="noopener">${esc(t)} ${I.arrow}</a>`).join("");
  if(safeUrl(p.tiktok)){ const t=$("tiktokAll"); t.href=safeUrl(p.tiktok); t.hidden=false; }
  const pl=pairs(p.pledge); $("pledge").innerHTML=pl.map(([t,d],i)=>`<div><span class="n">0${i+1}</span><b>${esc(t)}</b><p>${esc(d)}</p></div>`).join(""); $("cam-ket").hidden=!pl.length;
  const cr=pairs(p.creed); $("values").innerHTML=cr.map(([t,d])=>`<div><b>${esc(t)}</b><p>${esc(d)}</p></div>`).join(""); $("values").hidden=!cr.length;
  const st=pairs(p.process); $("steps").innerHTML=st.map(([t,d])=>`<li><b>${esc(t)}</b><p>${esc(d)}</p></li>`).join(""); $("quy-trinh").hidden=!st.length;
  const be=lines(p.benefits); $("benefits").innerHTML=be.map(b=>`<li>${esc(b)}</li>`).join("");
  // nút gọi
  const cta=[`<a class="btn gold" href="#du-an">Xem dự án đang bán</a>`];
  if(tel) cta.push(`<a class="btn light" href="tel:${tel}">${I.phone}Gọi ${fmtPhone(tel)}</a>`); else cta.push(`<a class="btn light" href="#nhan-thong-tin">Nhận bảng hàng &amp; giá</a>`);
  if(zalo) cta.push(`<a class="btn light" href="https://zalo.me/${zalo}" target="_blank" rel="noopener">Nhắn Zalo</a>`);
  $("heroCta").innerHTML=cta.join("");
  const fab=$("fab"); fab.innerHTML=(zalo?`<a class="z" href="https://zalo.me/${zalo}" target="_blank" rel="noopener" aria-label="Nhắn Zalo">Zalo</a>`:"")+(tel?`<a class="p" href="tel:${tel}" aria-label="Gọi điện">${I.phone}</a>`:""); fab.hidden=!(tel||zalo);
  const dock=$("dock"); if(tel||zalo){ dock.innerHTML=(tel?`<a class="btn gold" href="tel:${tel}">${I.phone}Gọi ngay</a>`:"")+(zalo?`<a class="btn dark" href="https://zalo.me/${zalo}" target="_blank" rel="noopener">Nhắn Zalo</a>`:""); dock.classList.add("on"); }
  const fl=[]; if(tel) fl.push(`<a href="tel:${tel}">Hotline: ${fmtPhone(tel)}</a>`); if(p.email) fl.push(`<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`); so.forEach(([t,u])=>fl.push(`<a href="${esc(safeUrl(u))}" target="_blank" rel="noopener">${esc(t)}</a>`));
  $("footLinks").innerHTML=fl.join("");
  renderStats();
}
function renderStats(){
  const s=[]; if(PROJECTS.length) s.push([PROJECTS.length,"dự án đang phân phối"]); if(VIDEOS.length) s.push([VIDEOS.length,"video đi thực tế"]); if(P.years) s.push([P.years+"+","năm kinh nghiệm"]);
  const regs=[...new Set(PROJECTS.map(regionOf))]; if(regs.length) s.push([regs.length,"khu vực: "+regs.join(", ")]);
  $("heroStats").innerHTML=s.map(([b,t])=>`<div><b>${esc(b)}</b><span>${esc(t)}</span></div>`).join("");
}
function renderProjects(list){
  PROJECTS=list;
  const regs=["Tất cả",...new Set(list.map(regionOf))];
  $("filters").innerHTML = regs.length>2 ? regs.map(r=>`<button type="button" data-r="${esc(r)}" aria-pressed="${r===region}">${esc(r)}</button>`).join("") : "";
  const shown=list.map((p,i)=>({p,i})).filter(x=>region==="Tất cả"||regionOf(x.p)===region);
  $("projects").innerHTML = shown.length ? shown.map(({p,i})=>{
    const cover=img(p.image); const tags=[p.type?`<span>${esc(p.type.split("·")[0].trim())}</span>`:"", p.handover?`<span class="gold">Bàn giao ${esc(p.handover.replace(/^dự kiến\s*/i,""))}</span>`:""].join("");
    return `<a class="card reveal" href="/${slug(p.name)}" data-i="${i}" aria-label="Xem chi tiết ${esc(p.name)}">
      ${cover?`<img src="${esc(cover)}" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'ph'}))">`:`<div class="ph"></div>`}
      <div class="tags">${tags}</div>
      <div class="txt"><h3>${esc(p.name)}</h3>${p.location?`<div class="loc">${I.pin}<span>${esc(p.location)}</span></div>`:""}<span class="more">Xem chi tiết ${I.arrow}</span></div></a>`;}).join("")
    : `<p class="lead">Danh sách dự án đang được cập nhật.</p>`;
  $("lf-project").innerHTML=`<option value="">Chưa chọn, cần tư vấn</option>`+list.map(p=>`<option>${esc(p.name)}</option>`).join("");
  $("footProj").innerHTML=list.map((p,i)=>`<a href="/${slug(p.name)}" data-i="${i}">${esc(p.name)}</a>`).join("");
  observe(); renderStats();
}
function renderVideos(list){
  VIDEOS=[]; const box=document.getElementById("videos"); if(!box) return;
  if(!list.length){ $("video").hidden=true; return; } $("video").hidden=false;
  box.innerHTML=list.map(v=>{
    const id=ytId(v.url), proj=PROJECTS.find(p=>p.name.toLowerCase()===String(v.project).toLowerCase());
    const thumb = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : img(proj?.image);
    const src = /tiktok/i.test(v.url) ? "TikTok" : (id ? "YouTube" : "Video");
    return `<a class="vcard" href="${esc(safeUrl(v.url))}" target="_blank" rel="noopener">
      ${thumb?`<img src="${esc(thumb)}" alt="" loading="lazy">`:""}<span class="src">${src}</span><span class="play">${I.play}</span>
      <span class="cap">${v.project?`<small>${esc(v.project)}</small>`:""}${esc(v.title)}</span></a>`;}).join("");
  renderStats();
}

/* chi tiết dự án */
const pd=$("pd");
function openProject(i, fromRoute){
  const p=PROJECTS[i]; if(!p) return;
  $("pdImg").src=img(p.image)||""; $("pdImg").alt="Phối cảnh "+p.name; $("pdTitle").textContent=p.name;
  const f=[["Tên dự án",p.name],["Vị trí",p.location],["Khu vực",regionOf(p)],["Loại sản phẩm",p.type],["Pháp lý",p.legal],["Bàn giao",p.handover]].filter(x=>x[1]);
  $("pdSub1").textContent="Tổng quan dự án "+p.name;
  $("pdFacts").innerHTML=f.map(([k,v])=>`<li><b>${esc(k)}:</b> ${esc(v)}</li>`).join("");
  $("pdDesc").textContent=p.desc||"Liên hệ để nhận thông tin chi tiết về dự án, bảng hàng và chính sách bán hàng mới nhất.";
  const vids=VIDEOS.filter(v=>String(v.project).toLowerCase()===p.name.toLowerCase());
  $("pdVids").innerHTML=vids.map(v=>`<a href="${esc(safeUrl(v.url))}" target="_blank" rel="noopener">${I.play}${esc(v.title)}</a>`).join("");
  renderRich(p);
  const tel=digits(P.phone), zalo=digits(P.zalo||P.phone);
  $("pdActs").innerHTML=`<a class="btn gold" href="#nhan-thong-tin" data-proj="${esc(p.name)}">Đăng ký nhận bảng giá ${esc(p.name)}</a>`+(tel?`<a class="btn line" href="tel:${tel}">${I.phone}Gọi ${fmtPhone(tel)}</a>`:"")+(zalo?`<a class="btn line" href="https://zalo.me/${zalo}" target="_blank" rel="noopener">Nhắn Zalo</a>`:"");
  $("pdBarActs").innerHTML=tel?`<a class="btn gold sm" href="tel:${tel}">${I.phone}Gọi ngay</a>`:"";
  const others=PROJECTS.map((q,j)=>({q,j})).filter(x=>x.j!==i);
  $("pdOthers").innerHTML=others.map(({q,j})=>`<a class="card" href="/${slug(q.name)}" data-i="${j}">${img(q.image)?`<img src="${esc(img(q.image))}" alt="" loading="lazy">`:`<div class="ph"></div>`}<div class="txt"><h3>${esc(q.name)}</h3>${q.location?`<div class="loc">${I.pin}<span>${esc(q.location)}</span></div>`:""}</div></a>`).join("");
  if(!pd.open){ if(pd.showModal) pd.showModal(); else pd.setAttribute("open",""); }
  pd.querySelector(".pd-in").scrollTop=0;
  const h="/"+slug(p.name); if(!fromRoute && curSlug()!==slug(p.name)){ history.pushState({pd:1},"",h); PUSHED=true; }
  if(!fromRoute) document.title=p.name+" – mặt bằng, tiện ích, giá bán | "+(P.name||"Tư vấn bất động sản");
}
const slug=s=>String(s).normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/đ/gi,"d").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
function hideProject(){ if(pd.open){ if(pd.close) pd.close(); else pd.removeAttribute("open"); } document.title=BASE_TITLE; }
const BASE_TITLE=document.title;
let PUSHED=false;
const curSlug=()=>{ const m=location.hash.match(/^#da\/(.+)$/); if(m) return decodeURIComponent(m[1]); const p=decodeURIComponent(location.pathname.replace(/^\/+|\.html$|\/$/g,"")); return p && p!=="index" ? p : ""; };
function goHome(hash){ if(document.querySelector(".seo-proj")){ location.href="/"+(hash||""); return; } hideProject(); history.replaceState(null,"","/"+(hash||"")); }
function closeProject(){ if(PUSHED){ PUSHED=false; history.back(); } else goHome(); }
function route(){ const sl=curSlug(); if(!sl) PUSHED=false; if(sl){ const i=PROJECTS.findIndex(p=>slug(p.name)===sl); if(i>=0) return openProject(i,true); } hideProject(); }
addEventListener("popstate", route);
pd.addEventListener("cancel", e=>{ e.preventDefault(); closeProject(); });
document.addEventListener("click", e=>{ const c=e.target.closest("[data-open]"); if(!c) return; const i=PROJECTS.findIndex(p=>slug(p.name)===c.dataset.open); if(i>=0){ e.preventDefault(); openProject(i, true); } });
$("pdOthers").addEventListener("click", e=>{ const c=e.target.closest("[data-i]"); if(c){ e.preventDefault(); openProject(+c.dataset.i); } });
$("projects").addEventListener("click", e=>{ const c=e.target.closest("[data-i]"); if(c){ e.preventDefault(); openProject(+c.dataset.i); } });
$("footProj").addEventListener("click", e=>{ const c=e.target.closest("[data-i]"); if(c){ e.preventDefault(); openProject(+c.dataset.i); } });
$("filters").addEventListener("click", e=>{ const b=e.target.closest("[data-r]"); if(b){ region=b.dataset.r; renderProjects(PROJECTS); } });
$("pdClose").addEventListener("click", ()=>{ PUSHED=false; goHome("#du-an"); $("du-an").scrollIntoView(); });
pd.addEventListener("click", e=>{ if(e.target===pd) closeProject(); });
document.addEventListener("click", e=>{
  const a=e.target.closest("[data-proj]"); if(a){ e.preventDefault(); $("lf-project").value=a.dataset.proj; hideProject(); history.replaceState(null,"","#nhan-thong-tin"); $("nhan-thong-tin").scrollIntoView(); }
  const n=e.target.closest("[data-need]"); if(n){ document.querySelectorAll('#needs input').forEach(i=>{ if(i.value===n.dataset.need) i.checked=true; }); }
});

/* nội dung chi tiết: tiện ích kèm ảnh, mặt bằng theo nhóm, thư viện ảnh */
const parseRows = s => lines(s).map(l => { const p = l.split(/\s*\|\s*/); const last = (p[p.length-1]||"").trim(); const u = /^https?:\/\//i.test(last) ? p.pop().trim() : ""; return { u, parts: p.map(x=>x.trim()).filter(Boolean) }; });
const thumb = (u, w=520) => /^https:\/\/lh3\.googleusercontent\.com\/d\//.test(u) ? u.replace(/=w\d+$/, "=w"+w) : /^https:\/\/(cdn|server)\.g-hub\.vn\//i.test(u) ? `https://wsrv.nl/?url=${encodeURIComponent(u)}&w=${w}&output=webp&q=80` : u;
const big = u => /^https:\/\/lh3\.googleusercontent\.com\/d\//.test(u) ? u.replace(/=w\d+$/, "=w2600") : u;
const pdfOrig = u => /#pdf$/.test(u) ? u.replace(/#pdf$/, "") : "";
const ERR = `onerror="if(this.dataset.f){this.closest('figure')&&this.closest('figure').remove()}else{this.dataset.f=1;this.src=this.dataset.full}"`;
const isPdf = u => /\.pdf(\?|$)/i.test(u);
const tile = (u, cap) => isPdf(u)
  ? `<a class="pdf" href="${esc(u)}" target="_blank" rel="noopener"><i>PDF</i><span>${esc(cap||"Tài liệu")}</span><small>Bấm để xem · phóng to bằng 2 ngón</small></a>`
  : `<figure class="tile"><button type="button" data-lb="${esc(big(img(u)))}" data-cap="${esc(cap||"")}" data-orig="${esc(pdfOrig(u))}" aria-label="Phóng to ${esc(cap||"ảnh")}"><img src="${esc(thumb(img(u)))}" data-full="${esc(img(u))}" alt="${esc(cap||"")}" loading="lazy" ${ERR}></button>${cap?`<figcaption>${esc(cap)}</figcaption>`:""}</figure>`;
let PLAN_GROUPS = [], planTab = 0;
function renderPlanGroup(){
  const g = PLAN_GROUPS[planTab]; if(!g){ $("pdPlanImgs").innerHTML=""; return; }
  $("pdPlanTabs").querySelectorAll("button").forEach((b,i)=>b.setAttribute("aria-selected", String(i===planTab)));
  const one = g.items.length===1 && !isPdf(g.items[0].u);
  $("pdPlanImgs").className = "plan-grid" + (one ? " one" : "");
  $("pdPlanImgs").innerHTML = g.items.map(it=>tile(it.u, it.cap)).join("");
}
function renderRich(p){
  const am = parseRows(p.amenities);
  const withImg = am.some(x=>x.u);
  $("pdAmenT").textContent = "Tiện ích dự án " + p.name;
  $("pdAmen").className = withImg ? "amen-cards" : "amen";
  $("pdAmen").innerHTML = am.map(x => { const t = x.parts.join(" | "); const k = t.search(/\s[–-]\s/); const title = k>0 ? t.slice(0,k) : t, note = k>0 ? t.slice(k+3) : "";
    if(!withImg) return `<div class="am-li"><b>${esc(title)}</b>${note?` <span>– ${esc(note)}</span>`:""}</div>`;
    return `<figure class="am-card">${x.u?`<button type="button" data-lb="${esc(img(x.u))}" data-cap="${esc(title+(note?" — "+note:""))}" aria-label="Phóng to ${esc(title)}"><img src="${esc(thumb(img(x.u)))}" data-full="${esc(img(x.u))}" alt="${esc(title)}" loading="lazy" ${ERR}></button>`:""}<figcaption><b>${esc(title)}</b>${note?`<span>${esc(note)}</span>`:""}</figcaption></figure>`; }).join("");
  $("pdAmenBox").hidden = !am.length;
  // mặt bằng: mỗi dòng "Nhóm | Chú thích | link" (hoặc chỉ link)
  const rows = parseRows(p.planImages).filter(x=>x.u);
  const map = new Map();
  rows.forEach(x => { const grp = x.parts.length>=2 ? x.parts[0] : "Tổng mặt bằng"; const cap = x.parts.length>=2 ? x.parts.slice(1).join(" · ") : (x.parts[0]||""); if(!map.has(grp)) map.set(grp, []); map.get(grp).push({u:x.u, cap}); });
  PLAN_GROUPS = [...map].map(([name, items]) => ({name, items})); planTab = 0;
  $("pdPlanT").textContent = "Mặt bằng dự án " + p.name;
  $("pdPlan").textContent = p.plan || ""; $("pdPlan").hidden = !p.plan;
  $("pdPlanTabs").innerHTML = PLAN_GROUPS.length>1 ? PLAN_GROUPS.map((g,i)=>`<button type="button" role="tab" data-t="${i}">${esc(g.name)} <small>${g.items.length}</small></button>`).join("") : "";
  $("pdPlanTabs").hidden = PLAN_GROUPS.length<2;
  renderPlanGroup();
  $("pdPlanBox").hidden = !(p.plan || rows.length);
  const gal = parseRows(p.gallery).filter(x=>x.u);
  $("pdGalT").textContent = "Hình ảnh dự án " + p.name;
  $("pdGal").innerHTML = gal.map(x=>tile(x.u, x.parts.join(" · "))).join("");
  $("pdGalBox").hidden = !gal.length;
}
$("pdPlanTabs").addEventListener("click", e => { const b = e.target.closest("[data-t]"); if(b){ planTab = +b.dataset.t; renderPlanGroup(); } });

/* khung xem ảnh: chạm 2 lần / 2 ngón / con lăn để phóng to, kéo để di chuyển, vuốt để chuyển ảnh */
const lb = $("lb"), lbImg = $("lbImg"), lbStage = $("lbStage");
const LB = { list: [], i: 0, s: 1, x: 0, y: 0 };
const lbApply = () => { lbImg.style.transform = `translate(${LB.x}px,${LB.y}px) scale(${LB.s})`; lb.classList.toggle("zoomed", LB.s>1.01); };
function lbClamp(){ const r = lbStage.getBoundingClientRect(), w = lbImg.offsetWidth*LB.s, h = lbImg.offsetHeight*LB.s; const mx = Math.max(0,(w-r.width)/2), my = Math.max(0,(h-r.height)/2); LB.x = Math.min(mx, Math.max(-mx, LB.x)); LB.y = Math.min(my, Math.max(-my, LB.y)); }
function lbZoom(ns, cx=0, cy=0){ ns = Math.min(6, Math.max(1, ns)); const k = ns/LB.s; LB.x = cx-(cx-LB.x)*k; LB.y = cy-(cy-LB.y)*k; LB.s = ns; if(ns===1){ LB.x=0; LB.y=0; } lbClamp(); lbApply(); }
function lbShow(){ const it = LB.list[LB.i]; LB.s=1; LB.x=0; LB.y=0; lbApply(); lbImg.src = it.u; lbImg.alt = it.c||""; $("lbCap").textContent = it.c||""; $("lbCount").textContent = LB.list.length>1 ? `${LB.i+1} / ${LB.list.length}` : ""; $("lbPrev").hidden = $("lbNext").hidden = LB.list.length<2; const o=$("lbOrig"); o.hidden=!it.o; if(it.o) o.href=it.o; }
function lbOpen(list, i){ LB.list = list; LB.i = i; lbShow(); if(!lb.open){ if(lb.showModal) lb.showModal(); else lb.setAttribute("open",""); } }
const lbGo = d => { if(LB.list.length<2) return; LB.i = (LB.i + d + LB.list.length) % LB.list.length; lbShow(); };
const lbClose = () => { if(lb.close) lb.close(); else lb.removeAttribute("open"); };
document.addEventListener("click", e => { const b = e.target.closest("[data-lb]"); if(!b) return; e.preventDefault();
  const box = b.closest("[data-lbg]") || document; const all = [...box.querySelectorAll("[data-lb]")];
  lbOpen(all.map(x=>({u:x.dataset.lb, c:x.dataset.cap, o:x.dataset.orig||""})), Math.max(0, all.indexOf(b))); });
$("lbX").addEventListener("click", lbClose); $("lbPrev").addEventListener("click", ()=>lbGo(-1)); $("lbNext").addEventListener("click", ()=>lbGo(1));
$("lbIn").addEventListener("click", ()=>lbZoom(LB.s*1.6)); $("lbOut").addEventListener("click", ()=>lbZoom(LB.s/1.6));
lb.addEventListener("keydown", e => { if(e.key==="ArrowLeft") lbGo(-1); if(e.key==="ArrowRight") lbGo(1); if(e.key==="+"||e.key==="=") lbZoom(LB.s*1.4); if(e.key==="-") lbZoom(LB.s/1.4); });
const center = (cx, cy) => { const r = lbStage.getBoundingClientRect(); return [cx-(r.left+r.width/2), cy-(r.top+r.height/2)]; };
lbStage.addEventListener("wheel", e => { e.preventDefault(); const [x,y] = center(e.clientX, e.clientY); lbZoom(LB.s*(e.deltaY<0?1.2:1/1.2), x, y); }, {passive:false});
const ptr = new Map(); let g0 = null, lastTap = 0, moved = false;
lbStage.addEventListener("pointerdown", e => { try{ lbStage.setPointerCapture(e.pointerId); }catch(_){} ptr.set(e.pointerId, {x:e.clientX, y:e.clientY}); if(ptr.size===1) moved = false;
  const p = [...ptr.values()];
  g0 = p.length===2 ? { d: Math.hypot(p[0].x-p[1].x, p[0].y-p[1].y), s: LB.s, mx:(p[0].x+p[1].x)/2, my:(p[0].y+p[1].y)/2, x: LB.x, y: LB.y } : { px: e.clientX, py: e.clientY, x: LB.x, y: LB.y }; });
lbStage.addEventListener("pointermove", e => { if(!ptr.has(e.pointerId)) return; ptr.set(e.pointerId, {x:e.clientX, y:e.clientY}); const p = [...ptr.values()];
  if(p.length===2 && g0 && g0.d){ const d = Math.hypot(p[0].x-p[1].x, p[0].y-p[1].y); const [cx,cy] = center(g0.mx, g0.my); LB.x=g0.x; LB.y=g0.y; LB.s=g0.s; lbZoom(g0.s*d/g0.d, cx, cy); moved = true; return; }
  if(p.length===1 && g0 && g0.px!=null){ const dx = e.clientX-g0.px, dy = e.clientY-g0.py; if(Math.abs(dx)+Math.abs(dy)>6) moved = true;
    if(LB.s>1.01){ LB.x = g0.x+dx; LB.y = g0.y+dy; lbClamp(); lbApply(); } else if(moved){ lbImg.style.transform = `translateX(${dx}px)`; } } });
const endPtr = e => { if(!ptr.has(e.pointerId)) return; const wasOne = ptr.size===1; ptr.delete(e.pointerId);
  if(wasOne && g0 && g0.px!=null){ const dx = e.clientX-g0.px;
    if(LB.s<=1.01 && moved && Math.abs(dx)>60){ lbGo(dx<0?1:-1); }
    else if(!moved){ const now = Date.now(); if(now-lastTap<320){ const [x,y] = center(e.clientX, e.clientY); lbZoom(LB.s>1.01?1:2.5, x, y); lastTap = 0; } else { lastTap = now; } }
    if(LB.s<=1.01) lbApply(); }
  const p = [...ptr.values()]; g0 = p.length===1 ? { px:p[0].x, py:p[0].y, x:LB.x, y:LB.y } : null; };
lbStage.addEventListener("pointerup", endPtr); lbStage.addEventListener("pointercancel", endPtr);

/* tính vay */
const num = id => { const v=parseFloat(String($(id).value).replace(/\s/g,"").replace(",",".")); return isFinite(v)?v:0; };
const money = v => { const m=v/1e6; if(!isFinite(m)||m<=0) return "–"; return m>=1000 ? (m/1000).toFixed(2).replace(/\.?0+$/,"").replace(".",",")+" tỷ" : Math.round(m).toLocaleString("vi-VN")+" triệu"; };
function loan(){
  const price=num("ln-price")*1e9, P=price*Math.min(100,num("ln-ltv"))/100, n=Math.max(1,Math.round(num("ln-yrs")*12)), r=num("ln-rate")/1200, g=Math.min(Math.round(num("ln-grace")),n-1);
  const first = g>0 ? P*r : P/(n-g)+P*r;
  let tot=0, bal=P; for(let k=0;k<n;k++){ tot+=bal*r; if(k>=g) bal-=P/(n-g); }
  const left=n-g, eq = g>0 ? P*r : (r===0 ? P/left : P*r/(1-Math.pow(1+r,-left)));
  $("ln-first").textContent=money(first); $("ln-own").textContent=money(price-P); $("ln-loan").textContent=money(P); $("ln-eq").textContent=money(eq); $("ln-int").textContent=money(tot);
}
$("loanForm").addEventListener("input", loan); $("loanForm").addEventListener("submit", e=>e.preventDefault()); loan();

/* hiệu ứng khi cuộn */
let io=null;
function observe(){
  if(!("IntersectionObserver" in window)){ document.querySelectorAll(".reveal").forEach(el=>el.classList.add("in")); return; }
  io = io || new IntersectionObserver(es=>es.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } }),{rootMargin:"0px 0px -8% 0px"});
  document.querySelectorAll(".reveal:not(.in)").forEach(el=>io.observe(el));
}
const top_=$("top"); const onScroll=()=>top_.classList.toggle("solid", scrollY>60); addEventListener("scroll", onScroll, {passive:true}); onScroll();

/* tải dữ liệu từ Google Sheet */
function apply(d){ renderProjects(d.projects||[]); renderVideos(d.videos||[]); renderProfile(d.profile||{}); observe(); route(); }
async function load(){
  let cache=null; try{ cache=JSON.parse(localStorage.getItem("site-cache-v2")||"null"); }catch(e){}
  if(cache) apply(cache);
  try{ const r=await fetch(API+"?action=site&t="+Date.now(),{cache:"no-store"}); const j=await r.json();
    if(j.ok){ apply(j); try{ localStorage.setItem("site-cache-v2",JSON.stringify(j)); }catch(e){} return; } }catch(e){}
  if(!cache) apply({profile:{name:"Nguyễn Trí Trung",title:"Chuyên viên kinh doanh · Galaxy Group",area:"Hà Nội - Hưng Yên"},projects:[],videos:[]});
}
$("year").textContent=new Date().getFullYear();

/* form khách để lại thông tin */
$("leadForm").addEventListener("submit", async e=>{
  e.preventDefault();
  const f=new FormData(e.target), err=$("lf-err"), btn=$("lf-btn");
  const name=String(f.get("name")||"").trim(), phone=digits(f.get("phone"));
  err.hidden=true;
  if(!name){ err.textContent="Anh chị nhập giúp họ tên."; err.hidden=false; $("lf-name").focus(); return; }
  if(!/^0\d{9,10}$/.test(phone)){ err.textContent="Số điện thoại chưa đúng, anh chị kiểm tra lại giúp."; err.hidden=false; $("lf-phone").focus(); return; }
  const needs=f.getAll("need"), msg=[needs.length?"Nhu cầu: "+needs.join(", "):"", String(f.get("message")||"").trim()].filter(Boolean).join(". ");
  btn.disabled=true; btn.textContent="Đang gửi…";
  try{
    const r=await fetch(API,{method:"POST",body:JSON.stringify({action:"lead",name,phone,project:f.get("project"),message:msg,website:f.get("website")})});
    const j=await r.json(); if(!j.ok) throw new Error(j.error);
    e.target.hidden=true; $("lf-done").hidden=false;
  }catch(x){
    err.textContent = P.phone ? `Chưa gửi được. Anh chị gọi trực tiếp ${fmtPhone(P.phone)} giúp tôi.` : "Chưa gửi được, anh chị thử lại sau ít phút."; err.hidden=false;
  }finally{ btn.disabled=false; btn.textContent="Gửi thông tin"; }
});
load(); observe();
