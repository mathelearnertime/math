/* Console look + controller support for FL0W3R Proxy.
   Uses globals from index.html: APPS, FLStore, wins, activeId, openApp, closeApp, ico, store, toast. */
(function(){
"use strict";
const KEY="fl-console";
const DESC={browser:"Browse the web.",geforce:"Cloud gaming. Coming soon.",pyrite:"Watch movies.",ripple:"Listen to music.",social:"Chat and call your friends.",settings:"Change the background, colors and more.",store:"Add more games to your Home Screen."};
const TABS=[
  {id:"games",name:"Games",items:()=>APPS.filter(a=>a.game)},
  {id:"apps",name:"Apps",items:()=>APPS.filter(a=>!a.game)}
];
let tab=0, idx=0, enabled=store.get(KEY,"1")!=="0";
const last={games:0,apps:0};

/* ---------- build the home screen ---------- */
const con=document.createElement("div"); con.id="con";
con.innerHTML='<div class="c-bg"><div class="c-glow"></div></div>'+
'<header class="c-top"><nav class="c-tabs" id="c-tabs"></nav><div class="c-right"><span class="c-pad"><svg viewBox="0 0 24 24"><path d="M6.5 7h11a4.5 4.5 0 0 1 4.4 5.4l-.8 4A2.6 2.6 0 0 1 16.6 17l-1.4-2H8.8l-1.4 2a2.6 2.6 0 0 1-4.5-.6l-.8-4A4.5 4.5 0 0 1 6.5 7z"/><path d="M8 10v3M6.5 11.5h3"/></svg></span><span id="c-clock"></span><div class="c-av">F</div></div></header>'+
'<main class="c-main"><div class="c-rowwrap"><div class="c-row" id="c-row"></div></div><div class="c-info" id="c-info"></div></main>'+
'<footer class="c-hints" id="c-hints"></footer>';
document.body.appendChild(con);
const $row=con.querySelector("#c-row"), $info=con.querySelector("#c-info"), $tabs=con.querySelector("#c-tabs"), $hints=con.querySelector("#c-hints"), $clock=con.querySelector("#c-clock");
for(let i=0;i<46;i++){const s=document.createElement("i");s.style.cssText="left:"+(Math.random()*100)+"%;top:"+(Math.random()*100)+"%;animation-delay:"+(Math.random()*4)+"s;opacity:"+(.2+Math.random()*.5);con.querySelector(".c-bg").appendChild(s)}

const hue=id=>{let h=0;for(let i=0;i<id.length;i++)h=(h*31+id.charCodeAt(i))%360;return h};
const emoji=id=>(FLStore.emoji&&FLStore.emoji[id])||"";
const cur=()=>TABS[tab].items();

function renderTabs(){
  $tabs.innerHTML='<span class="c-lr">L1</span>'+TABS.map((t,i)=>'<button class="c-tab'+(i===tab?" on":"")+'" data-tab="'+i+'">'+t.name+'</button>').join("")+'<span class="c-lr">R1</span>';
  const lr=$tabs.querySelectorAll(".c-lr"); lr[0].textContent=PADLBL().l; lr[1].textContent=PADLBL().r;
}
function renderRow(){
  const items=cur(); if(idx>=items.length) idx=Math.max(0,items.length-1);
  $row.innerHTML=items.map((a,i)=>{
    const art=a.game?'<span class="art">'+emoji(a.id)+'</span>':'<span class="art"><img data-ico="'+a.id+'" src="'+ico(a.id)+'" alt=""></span>';
    return '<button class="c-tile" data-i="'+i+'" style="--th:'+hue(a.id)+'" tabindex="-1">'+art+'<span class="lbl">'+a.name+'</span></button>';
  }).join("");
  setFocus(idx,true);
}
function setFocus(i,instant){
  const items=cur(); if(!items.length) return;
  idx=Math.max(0,Math.min(items.length-1,i)); last[TABS[tab].id]=idx;
  const tiles=$row.children;
  [...tiles].forEach((t,k)=>t.classList.toggle("on",k===idx));
  const el=tiles[idx], a=items[idx];
  if(el){
    if(instant){$row.style.transition="none"}
    $row.style.transform="translateX("+(-Math.max(0,el.offsetLeft-el.parentElement.parentElement.clientWidth*.07))+"px)";
    if(instant){void $row.offsetWidth;$row.style.transition=""}
    con.style.setProperty("--h",el.style.getPropertyValue("--th"));
  }
  const d=a.game?((FLStore.byId[a.id]&&FLStore.byId[a.id].d)||""):(DESC[a.id]||"");
  $info.innerHTML='<h1>'+a.name+'</h1><p>'+d+'</p><button class="c-play" tabindex="-1"><svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg>'+(a.game?"Play":"Open")+'</button>';
  $info.classList.remove("pop"); void $info.offsetWidth; $info.classList.add("pop");
}
function switchTab(d){
  const n=(tab+d+TABS.length)%TABS.length; last[TABS[tab].id]=idx; tab=n; idx=last[TABS[n].id]||0; renderTabs(); renderRow(); buzz(.15);
}
function openCurrent(){const a=cur()[idx]; if(a) openApp(a.id)}

/* ---------- pointer / touch ---------- */
$row.addEventListener("click",e=>{const t=e.target.closest(".c-tile"); if(!t) return; const i=+t.dataset.i; if(i===idx) openCurrent(); else setFocus(i)});
$tabs.addEventListener("click",e=>{const b=e.target.closest("[data-tab]"); if(!b) return; const n=+b.dataset.tab; if(n!==tab){last[TABS[tab].id]=idx;tab=n;idx=last[TABS[n].id]||0;renderTabs();renderRow()}});
$info.addEventListener("click",e=>{if(e.target.closest(".c-play")) openCurrent()});
document.addEventListener("pointerdown",()=>document.body.classList.remove("c-nav"),true);

/* ---------- controller labels ---------- */
let pad=null, kind="generic";
function detect(g){const id=(g&&g.id||"").toLowerCase(); return /054c|dualsense|dualshock|wireless controller|playstation/.test(id)?"ps":/045e|xbox|xinput/.test(id)?"xbox":"generic"}
function PADLBL(){return kind==="ps"?{ok:"✕",back:"○",l:"L1",r:"R1",combo:"Create + Options"}:{ok:"A",back:"B",l:"LB",r:"RB",combo:"View + Menu"}}
function renderHints(){
  const L=PADLBL(), usePad=!!pad;
  $hints.innerHTML=usePad
    ? '<span><i class="gb">'+L.ok+'</i>Select</span><span><i class="gb">'+L.l+'</i><i class="gb">'+L.r+'</i>Switch tab</span><span class="opt"><i class="gb">'+(kind==="ps"?"Options":"Menu")+'</i>Settings</span>'
    : '<span><i class="gb">Enter</i>Select</span><span><i class="gb">← →</i>Move</span><span><i class="gb">↑ ↓</i>Switch tab</span><span class="opt"><i class="gb">Esc</i>Back</span>';
  document.body.classList.toggle("c-padon",usePad);
}
function appHint(force){
  const w=appWin(); if(!w) return;
  const L=PADLBL(), h=w.querySelector(".win-head .win-title"); if(!h) return;
  let s=w.querySelector(".c-exit");
  if(!pad&&!force) return;
  if(!s){s=document.createElement("span");s.className="c-exit";s.style.cssText="margin-left:12px;font-size:12px;opacity:.65;font-weight:400";h.appendChild(s)}
  const native=nativeApp(w), prof=M.doc?M.prof:null;
  const how=prof==="fps"?(L.ok+" jump · left stick move · right stick look · "):prof==="cursor"?("sticks move the pointer · "+L.ok+" click · "):prof==="plat"?(L.ok+" jump · stick move · "):"";
  s.textContent=(mapOn&&how?how:"")+"hold "+L.combo+" to go back";
  if(native&&!w.querySelector(".c-map")){
    const b=document.createElement("button"); b.className="c-map"; b.type="button";
    b.style.cssText="margin-left:auto;margin-right:10px;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.1);color:#fff;border-radius:14px;padding:4px 12px;font-size:12px;cursor:pointer";
    const set=()=>{b.textContent="Controller: "+(mapOn?"On":"Off")};
    b.onclick=()=>{mapOn=!mapOn;store.set(MAPKEY,mapOn?"1":"0");set();if(!mapOn)releaseAll();appHint(true)};
    set(); h.parentElement.insertBefore(b,w.querySelector(".win-head .wc")||null);
  }
}
window.addEventListener("gamepadconnected",e=>{pad=e.gamepad;kind=detect(pad);renderHints();renderTabs();toast("Controller connected");document.body.classList.add("c-nav");appHint()});
window.addEventListener("gamepaddisconnected",()=>{pad=null;renderHints();renderTabs();toast("Controller disconnected")});

/* ---------- actions ---------- */
function buzz(m){try{const a=pad&&pad.vibrationActuator;a&&a.playEffect&&a.playEffect("dual-rumble",{duration:30,strongMagnitude:m||.2,weakMagnitude:m||.2})}catch(e){}}
const appWin=()=>activeId&&wins[activeId]?wins[activeId]:null;
const nativeApp=w=>!!(w&&w.querySelector(".win-body iframe"));
const FOCUSABLE='button,input,select,textarea,a[href],[data-d],[data-wall],[data-theme],[data-act],[tabindex="0"]';
function visible(el){const r=el.getBoundingClientRect();return r.width>2&&r.height>2&&!el.disabled&&getComputedStyle(el).visibility!=="hidden"}
function spatial(root,dir){
  const els=[...root.querySelectorAll(FOCUSABLE)].filter(visible);
  if(!els.length) return false;
  const a=document.activeElement, from=els.includes(a)?a:null;
  if(!from){focusEl(els[0]);return true}
  const r=from.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height/2;
  let best=null,bs=1e9;
  for(const el of els){ if(el===from) continue;
    const q=el.getBoundingClientRect(), dx=q.left+q.width/2-cx, dy=q.top+q.height/2-cy;
    let ok,cost;
    if(dir==="right"){ok=dx>4&&Math.abs(dy)<Math.abs(dx)*2+40;cost=dx+3*Math.abs(dy)}
    else if(dir==="left"){ok=dx<-4&&Math.abs(dy)<Math.abs(dx)*2+40;cost=-dx+3*Math.abs(dy)}
    else if(dir==="down"){ok=dy>4;cost=dy+3*Math.abs(dx)}
    else {ok=dy<-4;cost=-dy+3*Math.abs(dx)}
    if(ok&&cost<bs){bs=cost;best=el}
  }
  if(best){focusEl(best);return true}
  return false;
}
function focusEl(el){ if(el.tabIndex<0) el.tabIndex=0; el.focus({preventScroll:true}); el.scrollIntoView({block:"nearest",inline:"nearest"}) }

function act(name,src){
  const w=appWin();
  if(src!=="mouse") document.body.classList.add("c-nav");
  if(w){
    const native=nativeApp(w);
    if(name==="back"&&(src==="key"||!native)){closeApp(activeId);return}
    if(native) return;                       // the page inside handles its own input
    const body=w.querySelector(".win-body"), head=w.querySelector(".win-head .wb.x");
    if(name==="ok"){const a=document.activeElement; if(a&&w.contains(a)&&a!==document.body){ if(/^(text|search|url|password|email|number)$/.test(a.type||"")){a.focus()} else a.click(); } else if(body){spatial(w,"down")} return}
    if(name==="left"||name==="right"||name==="up"||name==="down"){
      const root=w;
      if(!spatial(root,name)&&body&&(name==="up"||name==="down")) body.scrollBy({top:name==="down"?160:-160,behavior:"smooth"});
      buzz(.1);
    }
    return;
  }
  /* home */
  if(name==="left"){setFocus(idx-1);buzz(.1)}
  else if(name==="right"){setFocus(idx+1);buzz(.1)}
  else if(name==="up"||name==="l1"){switchTab(-1)}
  else if(name==="down"||name==="r1"){switchTab(1)}
  else if(name==="ok"){openCurrent();buzz(.35)}
  else if(name==="menu"){openApp("settings")}
}

/* ---------- keyboard ---------- */
document.addEventListener("keydown",e=>{
  if(!enabled) return;
  const t=e.target, typing=t&&/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)&&/^(text|search|url|password|email|number|textarea|select-one)?$/.test(t.type||"");
  if(e.key==="Escape"){if(appWin()){e.preventDefault();act("back","key")} return}
  if(typing) return;
  const w=appWin();
  const map={ArrowLeft:"left",ArrowRight:"right",ArrowUp:"up",ArrowDown:"down",Enter:"ok",q:"l1",e:"r1"};
  const n=map[e.key]; if(!n) return;
  if(w&&nativeApp(w)) return;
  if(w&&n==="ok"&&t&&/^(BUTTON|A)$/.test(t.tagName)) return;      // native click handles it
  if(w&&(n==="l1"||n==="r1")) return;
  e.preventDefault(); document.body.classList.add("c-nav"); act(n,"key");
});


/* ---------- controller -> keyboard/mouse for the games (they only understand keys + mouse) ---------- */
const MAPKEY="fl-padmap";
let mapOn=store.get(MAPKEY,"1")!=="0";
const M={doc:null,win:null,held:{},btn:{},x:0,y:0,prof:"fps",last:0,dot:null,hands:false};
const KEYS={KeyW:[87,"w"],KeyA:[65,"a"],KeyS:[83,"s"],KeyD:[68,"d"],Space:[32," "],ControlLeft:[17,"Control"],ShiftLeft:[16,"Shift"],KeyE:[69,"e"],KeyR:[82,"r"],KeyQ:[81,"q"],KeyF:[70,"f"],KeyZ:[90,"z"],KeyX:[88,"x"],KeyC:[67,"c"],Escape:[27,"Escape"],Enter:[13,"Enter"],ArrowUp:[38,"ArrowUp"],ArrowDown:[40,"ArrowDown"],ArrowLeft:[37,"ArrowLeft"],ArrowRight:[39,"ArrowRight"]};
function gameDoc(){const w=appWin(),f=w&&w.querySelector(".win-body iframe"); if(!f) return null; try{const d=f.contentDocument; if(d&&d.body&&f.contentWindow) return {d,win:f.contentWindow,src:f.src||""}}catch(e){} return null}
const tgt=()=>{const d=M.doc,a=d.activeElement; return d.pointerLockElement||((a&&a!==d.body)?a:(d.querySelector("canvas")||d.body))};
function kev(type,code){
  const [kc,key]=KEYS[code], win=M.win;
  const ev=new win.KeyboardEvent(type,{key,code,keyCode:kc,which:kc,bubbles:true,cancelable:true,view:win});
  try{Object.defineProperty(ev,"keyCode",{get:()=>kc});Object.defineProperty(ev,"which",{get:()=>kc})}catch(e){}
  tgt().dispatchEvent(ev);
}
function setKey(code,down){ if(!!M.held[code]===down) return; M.held[code]=down; try{kev(down?"keydown":"keyup",code)}catch(e){} }
const mask=()=>(M.btn[0]?1:0)|(M.btn[2]?2:0);
function mev(type,btn,dx,dy){
  const win=M.win,d=M.doc;
  const o={bubbles:true,cancelable:true,view:win,clientX:M.x,clientY:M.y,screenX:M.x,screenY:M.y,button:btn||0,buttons:mask(),movementX:dx||0,movementY:dy||0};
  const t=d.pointerLockElement||d.elementFromPoint(M.x,M.y)||d.querySelector("canvas")||d.body;
  t.dispatchEvent(new win.MouseEvent(type,o));
}
function setBtn(b,down){ if(!!M.btn[b]===down) return; M.btn[b]=down; try{ if(down) mev("mousedown",b); else {mev("mouseup",b); if(b===0||b===2) mev(b===0?"click":"contextmenu",b)} }catch(e){} }
function dot(on){
  try{ const d=M.doc; if(!d) return;
    if(!on){ if(M.dot&&M.dot.remove) M.dot.remove(); M.dot=null; return }
    if(!M.dot||!M.dot.isConnected){ const e=d.createElement("div"); e.style.cssText="position:fixed;left:0;top:0;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;background:#fff;border:2px solid #111;box-shadow:0 0 8px rgba(0,0,0,.6);pointer-events:none;z-index:2147483647"; d.body.appendChild(e); M.dot=e }
    M.dot.style.transform="translate("+M.x+"px,"+M.y+"px)";
  }catch(e){}
}
function releaseAll(){
  try{ if(M.doc){ for(const k in M.held) if(M.held[k]) kev("keyup",k); for(const b in M.btn) if(M.btn[b]) mev("mouseup",+b); dot(false) } }catch(e){}
  M.held={}; M.btn={}; M.doc=null; M.win=null; M.dot=null;
}
function mapPad(g,now){
  const gd=gameDoc();
  if(!gd||!mapOn){ if(M.doc) releaseAll(); return }
  if(gd.d!==M.doc){
    releaseAll(); M.doc=gd.d; M.win=gd.win; M.last=now;
    M.prof=gd.d.getElementById("MMFCanvas")?"cursor":gd.d.getElementById("c2canvas")?"plat":"fps";
    M.hands=/gorilla/i.test(gd.src); M.x=gd.win.innerWidth/2; M.y=gd.win.innerHeight/2;
    appHint(true);
  }
  const dt=Math.min(50,now-(M.last||now)); M.last=now;
  const B=i=>!!(g.buttons[i]&&(g.buttons[i].pressed||g.buttons[i].value>.5));
  const ax=i=>{const v=g.axes[i]||0;return Math.abs(v)<.18?0:v};
  const lx=ax(0),ly=ax(1),rx=ax(2),ry=ax(3);
  const sel=B(8);
  const curve=v=>Math.sign(v)*v*v;
  if(M.prof==="fps"){
    setKey("KeyW",ly<-.35||B(12)); setKey("KeyS",ly>.35||B(13)); setKey("KeyA",lx<-.35||B(14)); setKey("KeyD",lx>.35||B(15));
    setKey("Space",B(0)); setKey("ControlLeft",B(1)); setKey("KeyE",B(2)); setKey("KeyR",B(3));
    setKey("ShiftLeft",B(10)||B(4)); setKey("KeyQ",B(5)); setKey("Escape",B(9)&&!sel);
    setBtn(0,M.hands?B(6):B(7)); setBtn(2,M.hands?B(7):B(6));
    const dx=curve(rx)*1.3*dt, dy=curve(ry)*1.3*dt;
    if(dx||dy){ M.x=Math.max(0,Math.min(M.win.innerWidth-1,M.x+dx)); M.y=Math.max(0,Math.min(M.win.innerHeight-1,M.y+dy)); try{mev("mousemove",0,dx,dy)}catch(e){} }
  } else if(M.prof==="cursor"){
    const mx=lx||rx, my=ly||ry;
    if(mx||my){ M.x=Math.max(0,Math.min(M.win.innerWidth-1,M.x+curve(mx)*1.1*dt)); M.y=Math.max(0,Math.min(M.win.innerHeight-1,M.y+curve(my)*1.1*dt)); try{mev("mousemove",0,0,0)}catch(e){} }
    dot(true);
    setBtn(0,B(0)||B(7)); setBtn(2,B(1));
    setKey("ArrowUp",B(12)); setKey("ArrowDown",B(13)); setKey("ArrowLeft",B(14)); setKey("ArrowRight",B(15));
    setKey("Space",B(2)); setKey("Escape",B(9)&&!sel);
  } else { // platformer
    setKey("ArrowUp",ly<-.5||B(12)); setKey("ArrowDown",ly>.5||B(13)); setKey("ArrowLeft",lx<-.4||B(14)); setKey("ArrowRight",lx>.4||B(15));
    setKey("Space",B(0)); setKey("KeyZ",B(2)); setKey("KeyX",B(3)); setKey("KeyC",B(1)); setKey("Escape",B(9)&&!sel);
  }
}

/* ---------- gamepad polling ---------- */
const st={}; let comboT=0;
function readPad(){
  const list=(navigator.getGamepads?navigator.getGamepads():[])||[];
  for(const g of list) if(g&&g.connected) return g;
  for(const f of document.querySelectorAll(".win iframe")){ try{const l=f.contentWindow.navigator.getGamepads(); for(const g of l) if(g&&g.connected) return g}catch(e){} }
  return null;
}
const DIRS=[["up",12],["down",13],["left",14],["right",15]];
function dirActive(g,name,btn){
  const b=g.buttons[btn]&&g.buttons[btn].pressed; const ax=g.axes[0]||0, ay=g.axes[1]||0;
  if(name==="left") return b||ax<-.55; if(name==="right") return b||ax>.55;
  if(name==="up") return b||ay<-.55; return b||ay>.55;
}
function tick(now){
  requestAnimationFrame(tick);
  if(!enabled) return;
  const g=readPad();
  if(g&&(!pad||pad.id!==g.id)){pad=g;kind=detect(g);renderHints();renderTabs()}
  if(!g) return;
  const B=i=>!!(g.buttons[i]&&g.buttons[i].pressed);
  const edge=(k,v)=>{const was=st[k];st[k]=v;return v&&!was};
  const w=appWin(), native=nativeApp(w);
  if(w) appHint();
  // hold Select+Start (Create+Options) to leave an app; Guide button also works where the browser reports it
  if(B(8)&&B(9)){ if(!comboT) comboT=now; else if(now-comboT>650&&w){comboT=0;st.combo=true;closeApp(activeId);buzz(.5);return} } else comboT=0;
  if(edge("guide",B(16))&&w){closeApp(activeId);return}
  if(st.combo){ if(!B(8)&&!B(9)) st.combo=false; return }
  if(!native&&M.doc) releaseAll();
  if(native) { // keep edges fresh so nothing fires when we return to the home screen
    for(const [n,b] of DIRS) st[n]=dirActive(g,n,b); st.ok=B(0); st.back=B(1); st.l1=B(4); st.r1=B(5); st.menu=B(9); mapPad(g,now); return }
  for(const [n,b] of DIRS){
    const on=dirActive(g,n,b), was=st[n];
    if(on&&!was){st[n]=true;st[n+"T"]=now+360;act(n,"pad")}
    else if(on&&now>=st[n+"T"]){st[n+"T"]=now+105;act(n,"pad")}
    else if(!on) st[n]=false;
  }
  if(edge("ok",B(0))) act("ok","pad");
  if(edge("back",B(1))) act("back","pad");
  if(edge("l1",B(4))&&!w) act("l1","pad");
  if(edge("r1",B(5))&&!w) act("r1","pad");
  if(edge("menu",B(9))&&!w) act("menu","pad");
}

/* ---------- clock ---------- */
function clock(){const d=new Date();$clock.textContent=d.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}

/* ---------- on / off ---------- */
function apply(){document.body.classList.toggle("console",enabled)}
window.FLConsole={
  get enabled(){return enabled},
  set(v){enabled=!!v;store.set(KEY,enabled?"1":"0");apply();if(enabled)renderRow()},
  refresh(){renderRow()}
};
apply(); renderTabs(); renderRow(); renderHints(); clock(); setInterval(clock,20000);
requestAnimationFrame(tick);
/* games added/removed from the Store don't change this screen: all games are always listed */
})();
