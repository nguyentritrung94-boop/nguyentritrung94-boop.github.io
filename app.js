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
  $("heroRole").textContent=p.title||""; $("heroArea").textContent=p.area||"";  $("heroSlogan").textContent=p.slogan||p.intro||""; $("footSlogan").textContent=p.slogan||"";
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
const byRoom = p => /PN/i.test(p.price||"");
const prices = p => [...String(p.price||"").matchAll(/(\d+(?:[.,]\d+)?)\s*tỷ/gi)].map(m=>+m[1].replace(",","."));
const fmtTy = n => String(n).replace(".",",")+" tỷ";
const priceTxt = p => { const a=prices(p); return a.length ? `<small>Chỉ từ</small>${fmtTy(Math.min(...a))}` : `<small>Giá</small>Liên hệ`; };
const vonTxt = p => p.von ? `<div class="von">${esc(p.von)}</div>` : "";
const BUDGETS = [["Mọi mức giá",0,1e9],["Dưới 5 tỷ",0,5],["5 – 10 tỷ",5,10],["Trên 10 tỷ",10,1e9]];
let budget = 0;
const inBudget = p => { if(!budget) return true; const [,lo,hi]=BUDGETS[budget]; return prices(p).some(v=>v>=lo&&v<hi); };
const priceLabel = p => !p.price ? "Giá bán" : byRoom(p) ? "Giá thanh toán sớm" : "Giá từ";
const priceAns = p => byRoom(p) ? `Giá thanh toán sớm ${p.name}: ${p.price}. Giá từng căn phụ thuộc diện tích, tầng, hướng và chính sách tại thời điểm mua — liên hệ để nhận bảng giá chi tiết.` : `Giá ${p.name} từ ${p.price}. Giá từng căn phụ thuộc diện tích, tầng, hướng và chính sách tại thời điểm mua — liên hệ để nhận bảng giá chi tiết.`;
const zaloMsg = p => `Chào anh, em quan tâm dự án ${p.name}. Anh gửi em bảng giá, mặt bằng và chính sách bán hàng mới nhất nhé.`;
const zaloBtn = (p, cls="btn zalo") => { const z=digits(P.zalo||P.phone); return z ? `<a class="${cls}" href="https://zalo.me/${z}" target="_blank" rel="noopener" data-zmsg="${esc(zaloMsg(p))}">Nhận bảng giá qua Zalo</a>` : ""; };
function faqOf(p){
  const own = pairs(p.faq).filter(([q,a])=>q&&a);
  const has = re => own.some(([q])=>re.test(q));
  const d = [];
  if(p.location && !has(/ở đâu|vị trí/i)) d.push([`${p.name} nằm ở đâu?`, `${p.name} tọa lạc tại ${p.location} (${regionOf(p)}).`]);
  if(!has(/giá/i)) d.push([`Giá bán ${p.name} bao nhiêu?`, p.price ? priceAns(p) : `Giá ${p.name} thay đổi theo từng đợt mở bán và từng căn. Liên hệ để nhận bảng giá và chính sách mới nhất.`]);
  if(p.type && !has(/loại|sản phẩm|phòng ngủ/i)) d.push([`${p.name} có những loại sản phẩm nào?`, `${p.name} gồm: ${p.type}.`]);
  if(p.legal && !has(/pháp lý|sổ/i)) d.push([`Pháp lý dự án ${p.name} thế nào?`, `Pháp lý ${p.name}: ${p.legal}. Liên hệ để được tư vấn chi tiết về hồ sơ pháp lý.`]);
  if(p.handover && !has(/bàn giao/i)) d.push([`Khi nào ${p.name} bàn giao?`, `Dự kiến bàn giao ${p.handover.replace(/^dự kiến\s*/i,"")}.`]);
  if(!has(/vay/i)) d.push([`Mua ${p.name} có hỗ trợ vay ngân hàng không?`, `Chính sách vay, hỗ trợ lãi suất và ân hạn gốc thay đổi theo từng đợt mở bán. Liên hệ để nhận phương án vay mới nhất cho ${p.name}.`]);
  return own.concat(d);
}
function toast(msg){ const t=document.createElement("div"); t.className="toast"; t.textContent=msg; (pd.open?pd:document.body).appendChild(t); setTimeout(()=>t.remove(),3500); }
/* loại căn cho khách chọn: lấy từ cột "Loại căn" của dự án; trống thì tự suy ra từ loại sản phẩm, giá, căn nổi bật */
const UNIT_ORDER=["Studio","1PN","2PN","3PN","4PN","5PN+","Duplex","Penthouse","Sky Villa","Liền kề","Shophouse","Biệt thự"];
const UNIT_ALL=["Studio","1PN","2PN","3PN","4PN","Duplex","Penthouse"];
function unitsOf(p){
  if(!p) return UNIT_ALL;
  const own=String(p.units||"").split(/[,·;\n]+/).map(s=>s.trim()).filter(Boolean);
  if(own.length) return own;
  const t=[p.type,p.price,lines(p.hot).map(l=>l.split("|")[0]).join(" ")].join(" ");
  const set=new Set();
  if(/studio/i.test(t)) set.add("Studio");
  const rng=t.match(/(studio|(\d)\s*PN)\s*(?:→|->|–|-|đến)\s*(\d)\s*PN/i);
  if(rng){ const a=/studio/i.test(rng[1])?0:+rng[2], b=+rng[3]; if(a===0) set.add("Studio"); for(let k=Math.max(1,a);k<=b;k++) set.add(k>=5?"5PN+":k+"PN"); }
  [...t.matchAll(/(\d)\s*(?:PN|BR|phòng ngủ)/gi)].forEach(m=>{ const k=+m[1]; if(k>=1) set.add(k>=5?"5PN+":k+"PN"); });
  [["Duplex",/duplex/i],["Penthouse",/penthouse/i],["Sky Villa",/sky\s*villa/i],["Liền kề",/liền kề/i],["Shophouse",/shophouse/i],["Biệt thự",/biệt thự/i]].forEach(([n,re])=>{ if(re.test(t)) set.add(n); });
  const out=UNIT_ORDER.filter(u=>set.has(u));
  return out.length?out:UNIT_ALL;
}
/* bấm nút Zalo → mở cửa sổ để khách để lại thông tin trước, gửi xong mới mở Zalo */
let ZQ={href:"",msg:"",project:""};
document.addEventListener("click", e=>{ const a=e.target.closest("[data-zmsg]"); if(!a || a.closest("#zq")) return; e.preventDefault();
  const card=a.closest("[data-proj]"); const proj=a.dataset.proj||(PROJECTS.find(p=>a.dataset.zmsg.includes(p.name))||{}).name||"";
  ZQ={href:a.href,msg:a.dataset.zmsg,project:proj};
  const unit=(a.dataset.zmsg.match(/căn (Studio|\dPN)/i)||[])[1]||"";
  $("zqProj").textContent=proj?("Dự án "+proj):"Nhận bảng giá và chính sách mới nhất";
  $("zqForm").hidden=false; $("zqDone").hidden=true; $("zqErr").hidden=true; $("zqForm").reset();
  $("zqTypes").innerHTML=unitsOf(PROJECTS.find(p=>p.name===proj)).map(u=>`<label><input type="checkbox" name="type" value="${esc(u)}">${esc(u)}</label>`).join("");
  if(unit) $("zqForm").querySelectorAll('input[name="type"]').forEach(i=>{ i.checked=i.value.toLowerCase()===unit.toLowerCase(); });
  const d=$("zq"); if(d.showModal) d.showModal(); else d.setAttribute("open",""); setTimeout(()=>$("zq-phone").focus(),50);
});
$("zqClose").addEventListener("click", ()=>{ const d=$("zq"); if(d.close) d.close(); else d.removeAttribute("open"); });
$("zq").addEventListener("click", e=>{ if(e.target.id==="zq"){ const d=$("zq"); if(d.close) d.close(); else d.removeAttribute("open"); } });
$("zqForm").addEventListener("submit", async e=>{
  e.preventDefault();
  const f=new FormData(e.target), err=$("zqErr"), btn=$("zqBtn");
  const phone=digits(f.get("phone")), name=String(f.get("name")||"").trim(), types=f.getAll("type"), note=String(f.get("note")||"").trim();
  err.hidden=true;
  if(!/^0\d{9,10}$/.test(phone)){ err.textContent="Số điện thoại chưa đúng, anh chị kiểm tra lại giúp."; err.hidden=false; $("zq-phone").focus(); return; }
  if(!name){ err.textContent="Anh chị nhập giúp họ và tên."; err.hidden=false; $("zq-name").focus(); return; }
  if(!types.length && !note){ err.textContent="Anh chị chọn giúp loại căn quan tâm."; err.hidden=false; return; }
  ZQ.types=types;
  const need=[types.length?"Nhu cầu: "+types.join(", "):"", note].filter(Boolean).join(". ");
  btn.disabled=true; btn.textContent="Đang gửi…";
  try{
    const r=await fetch(API,{method:"POST",body:JSON.stringify({action:"lead",name,phone,project:ZQ.project,message:need+" (bấm Nhận bảng giá qua Zalo)",website:f.get("website")})});
    const j=await r.json(); if(!j.ok) throw new Error(j.error);
    ZQ.msg=`Chào anh, em là ${name}${types.length?`, quan tâm căn ${types.join("/")}`:""}${ZQ.project?` dự án ${ZQ.project}`:""}. Anh gửi em bảng giá, mặt bằng và chính sách bán hàng mới nhất nhé. SĐT của em: ${phone}.`;
    $("zqGo").href=ZQ.href; $("zqForm").hidden=true; $("zqDone").hidden=false;
  }catch(x){ err.textContent=P.phone?`Chưa gửi được. Anh chị gọi trực tiếp ${fmtPhone(P.phone)} giúp tôi.`:"Chưa gửi được, anh chị thử lại sau ít phút."; err.hidden=false; }
  finally{ btn.disabled=false; btn.textContent="Nhận bảng giá"; }
});
$("zqGo").addEventListener("click", ()=>{ try{ navigator.clipboard.writeText(ZQ.msg).then(()=>toast("Đã chép sẵn tin nhắn — dán vào Zalo để gửi"),()=>{}); }catch(err){} });
function renderProjects(list){
  PROJECTS=list;
  const regs=["Tất cả",...new Set(list.map(regionOf))];
  $("filters").innerHTML = regs.length>2 ? regs.map(r=>`<button type="button" data-r="${esc(r)}" aria-pressed="${r===region}">${esc(r)}</button>`).join("") : "";
  $("budget").innerHTML = list.some(p=>prices(p).length) ? `<span>Ngân sách</span>`+BUDGETS.map((b,k)=>`<button type="button" data-b="${k}" aria-pressed="${k===budget}">${b[0]}</button>`).join("") : "";
  const shown=list.map((p,i)=>({p,i})).filter(x=>(region==="Tất cả"||regionOf(x.p)===region)&&inBudget(x.p));
  $("projects").innerHTML = shown.length ? shown.map(({p,i})=>{
    const cover=img(p.image); const tags=[p.badge?`<span class="hot">${esc(p.badge)}</span>`:"", (p.type&&!p.badge)?`<span>${esc(p.type.split("·")[0].trim())}</span>`:"", p.handover?`<span class="gold">Bàn giao ${esc(p.handover.replace(/^dự kiến\s*/i,""))}</span>`:""].join("");
    return `<a class="card reveal" href="/${slug(p.name)}" data-i="${i}" aria-label="Xem chi tiết ${esc(p.name)}">
      ${cover?`<img src="${esc(cover)}" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'ph'}))">`:`<div class="ph"></div>`}
      <div class="tags">${tags}</div>
      <div class="txt"><h3>${esc(p.name)}</h3>${p.location?`<div class="loc">${I.pin}<span>${esc(p.location)}</span></div>`:""}<div class="price">${priceTxt(p)}</div>${vonTxt(p)}<span class="more">Xem chi tiết ${I.arrow}</span></div></a>`;}).join("")
    : budget ? `<p class="lead">Chưa có dự án trong mức ngân sách này — liên hệ để được tư vấn căn phù hợp.</p>` : `<p class="lead">Danh sách dự án đang được cập nhật.</p>`;
  $("lf-project").innerHTML=`<option value="">Chưa chọn, cần tư vấn</option>`+list.map(p=>`<option>${esc(p.name)}</option>`).join("");
  $("footProj").innerHTML=list.map((p,i)=>`<a href="/${slug(p.name)}" data-i="${i}">${esc(p.name)}</a>`).join("");
  observe(); renderStats(); renderHero(list); renderHot(list);
}
/* chính sách: "@ ghi chú", "+ ưu đãi", còn lại "Tên | Nổi bật | Mốc: giá trị; Mốc: giá trị" */
function renderPolicy(p){
  const L=lines(p.policy); const note=L.filter(l=>/^@/.test(l)).map(l=>l.replace(/^@\s*/,"")).join(" · ");
  const perks=L.filter(l=>/^\+/.test(l)).map(l=>l.replace(/^\+\s*/,""));
  const plans=L.filter(l=>!/^[@+]/.test(l)).map(l=>{ const a=l.split(/\s*\|\s*/); return {name:a[0], badge:a[1]||"", steps:(a[2]||"").split(/\s*;\s*/).filter(Boolean).map(s=>{ const i=s.indexOf(":"); return i>0?{k:s.slice(0,i).trim(),v:s.slice(i+1).trim()}:{k:"",v:s.trim()}; })}; });
  $("pdPolBox").hidden=!plans.length&&!perks.length; $("pdPolT").textContent="Chính sách bán hàng "+p.name;
  $("pdPolNote").textContent=note; $("pdPolNote").hidden=!note;
  $("pdPol").innerHTML=plans.map(x=>`<div class="pl"><div class="pl-h"><b>${esc(x.name)}</b>${x.badge?`<span>${esc(x.badge)}</span>`:""}</div><div class="pl-s">${x.steps.map(s=>`<div><b>${esc(s.v)}</b><small>${esc(s.k)}</small></div>`).join("")}</div></div>`).join("");
  $("pdPerk").innerHTML=perks.map(t=>`<li>${esc(t)}</li>`).join("");
}
function renderInfo(p){
  $("pdInfo").innerHTML=pairs(p.info).filter(([k,v])=>k&&v).map(([k,v])=>`<div><small>${esc(k)}</small><b>${esc(v)}</b></div>`).join("");
  $("pdIntroT").textContent="Giới thiệu dự án "+p.name;
}
function renderLoc(p){
  const L=pairs(p.loc).filter(([k,v])=>k&&v); const q=[p.name,p.location].filter(Boolean).join(", ");
  $("pdLocBox").hidden=!L.length&&!p.location; $("pdLocT").textContent="Vị trí và kết nối "+p.name;
  $("pdLoc").innerHTML=L.map(([k,v])=>`<li><b>${esc(k)}</b><span>${esc(v)}</span></li>`).join("");
  $("pdMap").innerHTML=q?`<iframe title="Bản đồ ${esc(p.name)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=14&output=embed"></iframe>`:"";
}
function renderProg(p){
  const L=lines(p.prog), urls=L.filter(l=>/^https?:\/\//i.test(l)), txt=L.filter(l=>!/^https?:\/\//i.test(l));
  $("pdProgBox").hidden=!L.length; $("pdProgT").textContent="Tiến độ xây dựng "+p.name+(txt[0]?" · "+txt[0]:"");
  $("pdProgTxt").innerHTML=txt.slice(1).map(t=>`<li>${esc(t)}</li>`).join("");
  $("pdProgImg").innerHTML=urls.map(u=>`<a href="${esc(safeUrl(u))}"><img src="${esc(safeUrl(u))}" alt="Tiến độ ${esc(p.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.closest('a').remove()"></a>`).join("");
}
let CALC={note:""};
function setupCalc(p){
  const a=String(p.loan||"").split(/\s*\|\s*/); const ltv=parseFloat(a[0])||(/(\d+)%/.exec(p.von||"")||[])[1]||70;
  const h=hotRows(p)[0]; const pr=h?hotNum(h):(prices(p).length?Math.min(...prices(p)):0);
  $("pdCalcBox").hidden=!pr; if(!pr) return;
  $("pc-price").value=String(pr).replace(".",","); $("pc-ltv").value=ltv; $("pc-rate").value=a[1]||"9,5"; $("pc-yrs").value=25;
  CALC.note=a[2]||""; $("pdCalcT").textContent="Tính khoản vay "+p.name; pcalc();
}
function pcalc(){
  const n=id=>{ const v=parseFloat(String($(id).value).replace(/\s/g,"").replace(",",".")); return isFinite(v)?v:0; };
  const price=n("pc-price")*1e9, L=price*Math.min(100,n("pc-ltv"))/100, m=Math.max(1,Math.round(n("pc-yrs")*12)), r=n("pc-rate")/1200;
  $("pc-own").textContent=money(price-L); $("pc-loan").textContent=money(L);
  const zero=/0%/.test(CALC.note), grace=/ân hạn gốc/i.test(CALC.note);
  $("pc-promo").textContent=zero?(grace?"Không trả gốc, không trả lãi":"Không trả lãi"):"Theo chính sách ngân hàng";
  $("pc-promoN").textContent=CALC.note; $("pc-after").textContent=money(L/m+L*r);
}
$("pcForm").addEventListener("input", pcalc); $("pcForm").addEventListener("submit", e=>e.preventDefault());
$("pdHot").addEventListener("click", e=>{ const b=e.target.closest("[data-calc]"); if(!b) return; $("pc-price").value=b.dataset.calc.replace(".",","); pcalc(); $("pdCalcBox").scrollIntoView({behavior:"smooth",block:"start"}); });
function buildToc(){
  const secs=[...$("pd").querySelectorAll(".pd-body [data-toc]")].filter(e=>!e.hidden&&e.innerHTML.trim());
  $("pdToc").innerHTML=secs.map(e=>`<a href="#${e.id}" data-go="${e.id}">${esc(e.dataset.toc)}</a>`).join("");
}
/* mục lục: tự cuộn khung dự án tới phần được bấm (trừ chiều cao thanh mục lục đang dính trên cùng) */
let TOC_LOCK=0;
function tocMark(cur){ const toc=$("pdToc"); toc.querySelectorAll("a").forEach(a=>a.classList.toggle("on",a===cur)); if(!cur) return; const l=cur.offsetLeft-toc.offsetLeft, r=l+cur.offsetWidth; if(l<toc.scrollLeft) toc.scrollLeft=l-16; else if(r>toc.scrollLeft+toc.clientWidth) toc.scrollLeft=r-toc.clientWidth+16; }
$("pdToc").addEventListener("click", e=>{ const a=e.target.closest("[data-go]"); if(!a) return; e.preventDefault(); const el=$(a.dataset.go); if(!el) return;
  tocGo(el); tocMark(a); });
/* cuộn tới phần cần xem; tính lại đích mỗi khung hình vì ảnh phía trên tải xong sẽ đẩy nội dung xuống */
let TOC_RUN=0;
function tocGo(el){
  const sc=$("pd").querySelector(".pd-in"), toc=$("pdToc"), run=++TOC_RUN;
  const goal=()=>Math.max(0,Math.min(sc.scrollHeight-sc.clientHeight, el.getBoundingClientRect().top-toc.getBoundingClientRect().bottom+sc.scrollTop-8));
  const stop=()=>{ TOC_RUN++; }; ["wheel","touchstart","keydown"].forEach(t=>sc.addEventListener(t,stop,{once:true,passive:true}));
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches, from=sc.scrollTop, t0=performance.now(), dur=reduce?0:450;
  const step=now=>{ if(run!==TOC_RUN) return; const k=dur?Math.min(1,(now-t0)/dur):1, e=1-Math.pow(1-k,3);
    TOC_LOCK=Date.now()+200; sc.scrollTop=from+(goal()-from)*e;
    if(now-t0<dur+1500) requestAnimationFrame(step); else TOC_LOCK=0; };
  requestAnimationFrame(step);
}
$("pd").querySelector(".pd-in").addEventListener("scroll", ()=>{ if(Date.now()<TOC_LOCK) return; const toc=$("pdToc"), lim=toc.getBoundingClientRect().bottom+12; let cur=null; for(const a of toc.querySelectorAll("a")){ const el=$(a.dataset.go); if(el && el.getBoundingClientRect().top<lim) cur=a; } tocMark(cur); }, {passive:true});
/* căn giá tốt: mỗi dòng "Loại | Diện tích | Tầng | Hướng | Giá" */
const hotRows = p => lines(p.hot).map(l=>{ const a=l.split(/\s*\|\s*/); return {type:a[0]||"",area:a[1]||"",floor:a[2]||"",dir:a[3]||"",price:a[4]||""}; }).filter(r=>r.type&&r.price);
const hotNum = r => parseFloat(String(r.price).replace(",","."))||1e9;
const hotMeta = r => [r.area, r.floor&&("Tầng "+String(r.floor).replace(/^tầng\s*/i,"")), r.dir&&("Hướng "+r.dir)].filter(Boolean).join(" · ");
const hotMsg = (p,r) => `Chào anh, em quan tâm căn ${r.type} ${r.area} tầng ${String(r.floor).replace(/^tầng\s*/i,"")} dự án ${p.name}, giá ${r.price}. Căn này còn không anh?`;
const hotAsk = (p,r,cls,txt) => { const z=digits(P.zalo||P.phone); return z?`<a class="${cls}" href="https://zalo.me/${z}" target="_blank" rel="noopener" data-zmsg="${esc(hotMsg(p,r))}">${txt}</a>`:""; };
function renderHot(list){
  const box=document.getElementById("can-tot"); if(!box) return;
  const items=list.map((p,i)=>({p,i,r:hotRows(p)[0]})).filter(x=>x.r).sort((a,b)=>hotNum(a.r)-hotNum(b.r));
  box.hidden=!items.length;
  $("hotGrid").innerHTML=items.map(({p,i,r})=>{ const c=img(p.image); return `<div class="hc">
    <a class="hc-img" href="/${slug(p.name)}" data-i="${i}" style="${c?`background-image:url('${esc(c)}')`:""}"><span>${esc(r.type)}</span></a>
    <div class="hc-b"><a class="hc-p" href="/${slug(p.name)}" data-i="${i}">${esc(p.name)}</a>
    <div class="hc-t">${esc(r.type)} · ${esc(r.area)}</div><div class="hc-m">${esc([r.floor&&("Tầng "+String(r.floor).replace(/^tầng\s*/i,"")), r.dir&&("Hướng "+r.dir)].filter(Boolean).join(" · "))}</div>
    <div class="hc-pr"><b>${esc(r.price)}</b><small>Giá TT sớm</small></div>
    ${hotAsk(p,r,"btn zalo","Hỏi căn này qua Zalo")}</div></div>`; }).join("");
}
function renderHero(list){
  const all=list.flatMap(prices); const vons=list.map(p=>(String(p.von||"").match(/từ\s*~?\s*(\d+(?:[.,]\d+)?)\s*tỷ/i)||[])[1]).filter(Boolean).map(x=>+x.replace(",","."));
  const set=(id,v)=>{const e=document.getElementById(id); if(e) e.textContent=v;};
  if(all.length){ const m=fmtTy(Math.min(...all)); set("cvMin",m); set("cvMin2",m); }
  if(vons.length){ const v=fmtTy(Math.min(...vons)); set("cvVon",v); set("cvVon2",v); }
  const n=list.filter(p=>/đang mở bán/i.test(p.badge||"")).length; if(n) set("cvN",n);
}
(function(){ const t=document.getElementById("tick"); if(!t) return; const end=new Date(t.dataset.until+"T23:59:59+07:00"); const left=Math.ceil((end-Date.now())/864e5);
  if(left<1){ t.remove(); return; } t.querySelector(".tick-left").textContent=left; const row=t.querySelector(".tick-row"); const cp=row.cloneNode(true); cp.setAttribute("aria-hidden","true"); cp.querySelectorAll("a").forEach(a=>a.tabIndex=-1); row.parentNode.appendChild(cp); })();
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
  const hr=hotRows(p); $("pdHotBox").hidden=!hr.length; $("pdHotT").textContent="Căn giá tốt đang có tại "+p.name;
  $("pdHot").innerHTML=hr.map(r=>`<div class="hr"><div><strong>${esc(r.type)} · ${esc(r.area)}</strong>${esc([r.floor&&("Tầng "+String(r.floor).replace(/^tầng\s*/i,"")), r.dir&&("Hướng "+r.dir)].filter(Boolean).join(" · "))}</div><b>${esc(r.price)}</b><span style="display:flex;gap:14px;align-items:center">${hotAsk(p,r,"","Hỏi căn này →")}<button type="button" class="ca" data-calc="${esc(String(hotNum(r)))}">Tính vay</button></span></div>`).join("");
  renderPolicy(p); renderInfo(p); renderLoc(p); renderProg(p); setupCalc(p);
  const z=digits(P.zalo||P.phone), t0=digits(P.phone); $("pdDock").innerHTML=(t0?`<a class="btn line" href="tel:${t0}">${I.phone}Gọi ngay</a>`:"")+(z?`<a class="btn zalo" href="https://zalo.me/${z}" target="_blank" rel="noopener" data-zmsg="${esc(zaloMsg(p))}">Nhận bảng giá Zalo</a>`:"");
  const tel=digits(P.phone);
  $("pdHl").innerHTML=`<div><small>${priceLabel(p)}</small><b>${esc(p.price||"Liên hệ")}</b>${vonTxt(p)}${p.badge?`<br><span class="hot">${esc(p.badge)}</span>`:""}</div><div class="go">${zaloBtn(p)}${tel?`<a class="btn line" href="tel:${tel}">${I.phone}Gọi ${fmtPhone(tel)}</a>`:""}</div>`;
  const fq=faqOf(p); $("pdFaqT").textContent="Hỏi – đáp về "+p.name;
  $("pdFaq").innerHTML=fq.map(([q,a],k)=>`<details${k===0?" open":""}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join(""); $("pdFaqBox").hidden=!fq.length;
  $("pdActs").innerHTML=`<a class="btn gold" href="#nhan-thong-tin" data-proj="${esc(p.name)}">Đăng ký nhận bảng giá ${esc(p.name)}</a>`+zaloBtn(p,"btn line")+(tel?`<a class="btn line" href="tel:${tel}">${I.phone}Gọi ${fmtPhone(tel)}</a>`:"");
  $("pdBarActs").innerHTML=tel?`<a class="btn gold sm" href="tel:${tel}">${I.phone}Gọi ngay</a>`:"";
  const others=PROJECTS.map((q,j)=>({q,j})).filter(x=>x.j!==i);
  $("pdOthers").innerHTML=others.map(({q,j})=>`<a class="card" href="/${slug(q.name)}" data-i="${j}">${img(q.image)?`<img src="${esc(img(q.image))}" alt="" loading="lazy">`:`<div class="ph"></div>`}<div class="txt"><h3>${esc(q.name)}</h3>${q.location?`<div class="loc">${I.pin}<span>${esc(q.location)}</span></div>`:""}</div></a>`).join("");
  if(!pd.open){ if(pd.showModal) pd.showModal(); else pd.setAttribute("open",""); }
  buildToc(); pd.querySelector(".pd-in").scrollTop=0;
  const h="/"+slug(p.name); if(!fromRoute && curSlug()!==slug(p.name)){ history.pushState({pd:1},"",h); PUSHED=true; }
  if(!fromRoute) document.title=p.name+" – mặt bằng, tiện ích, giá bán | ChọnCăn";
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
$("budget").addEventListener("click", e=>{ const b=e.target.closest("[data-b]"); if(b){ budget=+b.dataset.b; renderProjects(PROJECTS); } });
$("pdClose").addEventListener("click", ()=>{ PUSHED=false; goHome("#du-an"); $("du-an").scrollIntoView(); });
pd.addEventListener("click", e=>{ if(e.target===pd) closeProject(); });
document.addEventListener("click", e=>{
  const a=e.target.closest("[data-proj]"); if(a){ e.preventDefault(); $("lf-project").value=a.dataset.proj; hideProject(); history.replaceState(null,"","#nhan-thong-tin"); $("nhan-thong-tin").scrollIntoView(); }
  const n=e.target.closest("[data-need]"); if(n){ document.querySelectorAll('#needs input').forEach(i=>{ if(i.value===n.dataset.need) i.checked=true; }); }
});

/* nội dung chi tiết: tiện ích kèm ảnh, mặt bằng theo nhóm, thư viện ảnh */
const parseRows = s => lines(s).map(l => { const p = l.split(/\s*\|\s*/); const last = (p[p.length-1]||"").trim(); const u = /^https?:\/\//i.test(last) ? p.pop().trim() : ""; return { u, parts: p.map(x=>x.trim()).filter(Boolean) }; });
const thumb = (u, w=520) => /^https:\/\/lh3\.googleusercontent\.com\/d\//.test(u) ? u.replace(/=w\d+$/, "=w"+w) : /^https:\/\/(cdn|server)\.g-hub\.vn\//i.test(u) ? `https://wsrv.nl/?url=${encodeURIComponent(u)}&w=${w}&we&output=webp&q=82` : u;
const big = u => /^https:\/\/lh3\.googleusercontent\.com\/d\//.test(u) ? u.replace(/=w\d+$/, "=w2600") : u;
const pdfOrig = u => /#pdf$/.test(u) ? u.replace(/#pdf$/, "") : "";
const ERR = `onerror="if(this.dataset.f){this.closest('figure')&&this.closest('figure').remove()}else{this.dataset.f=1;this.src=this.dataset.full}"`;
const isPdf = u => /\.pdf(\?|$)/i.test(u);
const tile = (u, cap, w) => isPdf(u)
  ? `<a class="pdf" href="${esc(u)}" target="_blank" rel="noopener"><i>PDF</i><span>${esc(cap||"Tài liệu")}</span><small>Bấm để xem · phóng to bằng 2 ngón</small></a>`
  : `<figure class="tile"><button type="button" data-lb="${esc(big(img(u)))}" data-cap="${esc(cap||"")}" data-orig="${esc(pdfOrig(u))}" aria-label="Phóng to ${esc(cap||"ảnh")}"><img src="${esc(thumb(img(u), w||520))}" data-full="${esc(img(u))}" alt="${esc(cap||"")}" loading="lazy" ${ERR}></button>${cap?`<figcaption>${esc(cap)}</figcaption>`:""}</figure>`;
let PLAN_GROUPS = [], planTab = 0;
function renderPlanGroup(){
  const g = PLAN_GROUPS[planTab]; if(!g){ $("pdPlanImgs").innerHTML=""; return; }
  $("pdPlanTabs").querySelectorAll("button").forEach((b,i)=>b.setAttribute("aria-selected", String(i===planTab)));
  const one = g.items.length===1 && !isPdf(g.items[0].u);
  $("pdPlanImgs").className = "plan-grid" + (one ? " one" : "");
  $("pdPlanImgs").innerHTML = g.items.map(it=>tile(it.u, it.cap, one ? 2000 : 1200)).join("");
}
function renderRich(p){
  const am = parseRows(p.amenities);
  const withImg = am.some(x=>x.u);
  $("pdAmenT").textContent = "Tiện ích dự án " + p.name;
  $("pdAmen").className = withImg ? "amen-cards" : "amen";
  $("pdAmen").innerHTML = am.map(x => { const t = x.parts.join(" | "); const k = t.search(/\s[–-]\s/); const title = k>0 ? t.slice(0,k) : t, note = k>0 ? t.slice(k+3) : "";
    if(!withImg) return `<div class="am-li"><b>${esc(title)}</b>${note?` <span>– ${esc(note)}</span>`:""}</div>`;
    return `<figure class="am-card">${x.u?`<button type="button" data-lb="${esc(img(x.u))}" data-cap="${esc(title+(note?" — "+note:""))}" aria-label="Phóng to ${esc(title)}"><img src="${esc(thumb(img(x.u), 800))}" data-full="${esc(img(x.u))}" alt="${esc(title)}" loading="lazy" ${ERR}></button>`:""}<figcaption><b>${esc(title)}</b>${note?`<span>${esc(note)}</span>`:""}</figcaption></figure>`; }).join("");
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
  $("pdGal").innerHTML = gal.map(x=>tile(x.u, x.parts.join(" · "), 900)).join("");
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
function apply(d){ const X=window.__PREVIEW; if(X){ d.projects=d.projects||[]; d.projects.forEach(p=>Object.assign(p,X[p.name]||{})); Object.entries(X).forEach(([n,o])=>{ if(o.__new && !d.projects.some(p=>p.name===n)) d.projects.push(Object.assign({name:n},o)); }); } renderProjects(d.projects||[]); renderVideos(d.videos||[]); renderProfile(d.profile||{}); renderHot(d.projects||[]); observe(); route(); }
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
