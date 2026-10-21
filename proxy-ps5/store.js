/* FL0W3R Store. Self-contained: window.FLStore */
(function(){
const GAMES=[];

/* ---- styles ---- */
const css=document.createElement("style");css.textContent=`
.gm{display:flex;flex-direction:column;align-items:center;gap:12px;max-width:420px;margin:0 auto}
.gh{display:flex;width:100%;align-items:center;gap:8px;font-size:13px}.gh .gl{flex:1;color:var(--muted)}.gh .gr{font-weight:600}
.gh button{padding:5px 11px;border-radius:6px;border:1px solid var(--win-border);background:var(--chrome);cursor:pointer}
.ga{width:100%;display:flex;flex-direction:column;align-items:center;gap:12px}
.gc{width:100%;max-width:340px;border-radius:10px;border:1px solid var(--win-border);touch-action:none}
.gg{display:grid;gap:6px;width:100%;max-width:340px}.gg.s7,.gg.s8{gap:3px}.gg.s2{max-width:240px}
.cell{aspect-ratio:1;border:0;border-radius:10px;background:#2a2a36;color:#fff;font-size:26px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}
.cell.sm{font-size:16px;border-radius:5px}.cell.round{border-radius:50%}.cell.open{background:#444}
.gg.t .cell{cursor:default;font-size:22px}
.big{width:100%;max-width:340px;height:200px;border:0;border-radius:14px;color:#fff;font-size:26px;font-weight:700;cursor:pointer}
.btn2{padding:10px 18px;border-radius:8px;border:1px solid var(--win-border);background:var(--accent);color:var(--on-accent);font-weight:600;cursor:pointer;font-size:15px}
.row2{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}.row2 .cell{width:72px}
.gtxt{text-align:center;min-height:30px}
.inp{padding:10px 14px;border-radius:8px;border:1px solid var(--win-border);background:var(--win);color:inherit;font-size:16px;width:160px;text-align:center}
.st{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px;margin-top:14px}
.sc{display:flex;gap:12px;align-items:center;background:var(--card);border:1px solid var(--win-border);border-radius:10px;padding:12px}
.sc .ic{width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:28px;flex:0 0 auto}
.sc .tx{flex:1;min-width:0}.sc b{display:block}.sc small{color:var(--muted);font-size:12px;line-height:1.3;display:block}
.sc .bt{display:flex;flex-direction:column;gap:4px}.sc .bt button{padding:6px 12px;border-radius:6px;border:1px solid var(--win-border);background:var(--chrome);cursor:pointer;font-size:12px}
.sc .bt .in{background:var(--accent);border-color:var(--accent);color:var(--on-accent);font-weight:600}
`;document.head.appendChild(css);

/* ---- public API ---- */
const EXT=[{"id":"x-capuchinsfremake","name":"Capuchin's Remake","e":"🐒","d":"Full game — opens in its own window.","src":"games/capuchinsfremake.html"},{"id":"x-clfnac1remake","name":"Five Nights at Candy's 1","e":"🍬","d":"Full game — opens in its own window.","src":"games/clfnac1remake.html"},{"id":"x-clfnac2remake","name":"Five Nights at Candy's 2","e":"🍭","d":"Full game — opens in its own window.","src":"games/clfnac2remake.html"},{"id":"x-clfnaf2remake","name":"Five Nights at Freddy's 2","e":"🧸","d":"Full game — opens in its own window.","src":"games/clFNAF2remake%27.html"},{"id":"x-clfnaf3remake","name":"Five Nights at Freddy's 3","e":"🐰","d":"Full game — opens in its own window.","src":"games/clFNAF3remake.html"},{"id":"x-clfnaf3remasteredemake","name":"Five Nights at Freddy's 3 Remastered","e":"🐰","d":"Full game — opens in its own window.","src":"games/clfnaf3remasteredemake.html"},{"id":"x-clfnaf4halloweenremake","name":"Five Nights at Freddy's 4: Halloween","e":"🎃","d":"Full game — opens in its own window.","src":"games/clfnaf4halloweenremake.html"},{"id":"x-clfnaf4remake","name":"Five Nights at Freddy's 4","e":"🌙","d":"Full game — opens in its own window.","src":"games/clFNAF4remake.html"},{"id":"x-clfnafpsremake","name":"Five Nights at Freddy's: Pizzeria Simulator","e":"🍕","d":"Full game — opens in its own window.","src":"games/clfnafpsremake.html"},{"id":"x-clfnafremake","name":"Five Nights at Freddy's","e":"🐻","d":"Full game — opens in its own window.","src":"games/clFNAFremake.html"},{"id":"x-clfnafshooterremake","name":"FNAF Shooter","e":"🔫","d":"Full game — opens in its own window.","src":"games/clfnafshooterremake.html"},{"id":"x-clfnafslremake","name":"Five Nights at Freddy's: Sister Location","e":"🤡","d":"Full game — opens in its own window.","src":"games/clfnafslremake.html"},{"id":"x-clfnafucnremake","name":"Five Nights at Freddy's: Ultimate Custom Night","e":"👾","d":"Full game — opens in its own window.","src":"games/clfnafucnremake.html"},{"id":"x-clfnafworlddremake","name":"Five Nights at Freddy's: World","e":"🌍","d":"Full game — opens in its own window.","src":"games/clfnafworlddremake.html"},{"id":"x-clgorillatagremake","name":"Gorilla Tag","e":"🦍","d":"Full game — opens in its own window.","src":"games/clgorillatagremake.html"},{"id":"x-clgrannyyremake","name":"Granny","e":"👵","d":"Full game — opens in its own window.","src":"games/clgrannyyremake.html"},{"id":"x-clsuperkidadventure","name":"Super Kid Adventure","e":"🦸","d":"Full game — opens in its own window.","src":"games/clsuperkidadventure.html"}];
GAMES.unshift(...EXT);
const byId={},emoji={};GAMES.forEach(x=>{byId[x.id]=x;emoji[x.id]=x.e});

function run(id,root){
  const gm=byId[id];if(!root||!gm)return()=>{};
  if(gm.src){
    root.innerHTML='<div style="display:flex;align-items:center;gap:10px;padding:6px 10px;font-size:13px"><button class="fl-save" type="button" style="padding:5px 12px;border-radius:6px;border:1px solid rgba(128,128,128,.5);background:transparent;color:inherit;cursor:pointer">⬇ Save for offline</button><span class="fl-st" style="opacity:.75"></span></div><iframe src="'+gm.src+'" allow="fullscreen; autoplay; gamepad" allowfullscreen style="width:100%;height:calc(100vh - 160px);min-height:440px;border:0;background:#000;display:block"></iframe>';
    const btn=root.querySelector(".fl-save"),st=root.querySelector(".fl-st");
    let inBlank=false;try{inBlank=window.top!==window&&(window.top.location.href==="about:blank"||/[?&]blank\b/.test(location.search))}catch(e){}
    if(inBlank){const w=document.createElement("div");w.style.cssText="margin:0 10px 6px;padding:8px 12px;border-radius:6px;background:rgba(245,197,66,.18);border:1px solid rgba(245,197,66,.6);font-size:12.5px";w.textContent="⚠ Offline saving doesn't work in an about:blank tab. Open the site in a normal tab (add ?direct to the address, or turn off Auto-open in about:blank in Settings) to save games for offline.";root.insertBefore(w,root.firstChild)}
    btn.onclick=async()=>{
      if(!navigator.onLine){st.textContent="Connect to the internet to save this game.";return}
      const reg=navigator.serviceWorker&&await navigator.serviceWorker.ready.catch(()=>null);
      if(!reg||!reg.active){st.textContent="Offline mode isn't ready yet. Reload the site once and try again.";return}
      btn.disabled=true;st.textContent="Starting…";
      if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{});
      const ch=new MessageChannel();
      ch.port1.onmessage=async e=>{const m=e.data;
        if(m.type==="progress")st.textContent="Saving… "+m.done+" / "+m.total+" files";
        else if(m.type==="done"){
          const q=navigator.storage&&navigator.storage.estimate?await navigator.storage.estimate().catch(()=>null):null;
          const mb=q?" Storage used: "+Math.round(q.usage/1048576)+" MB of "+Math.round(q.quota/1048576)+" MB.":"";
          if(m.total===0)st.textContent="Found no files to save (the file list didn't load)."+mb;
          else if(m.failed)st.textContent="Saved "+m.ok+" of "+m.total+" files; "+m.failed+" failed ("+m.err+"). Not fully offline yet."+mb;
          else st.textContent="✓ Saved all "+m.ok+" files."+mb;
          btn.disabled=false;btn.textContent="↻ Re-check";}
        else{st.textContent="Couldn't finish: "+m.message+". Playing it once online also saves it.";btn.disabled=false}};
      reg.active.postMessage({type:"save-game",src:new URL(gm.src,document.baseURI).href},[ch.port2]);
    };
    return()=>{root.innerHTML=""}}
  return()=>{};
}

function mountStore(root,h){
  const draw=q=>{q=(q||"").toLowerCase();const ins=h.installed();
    root.querySelector(".st").innerHTML=GAMES.filter(x=>!q||x.name.toLowerCase().includes(q)).map(x=>`<div class="sc"><div class="ic">${x.e}</div><div class="tx"><b>${x.name}</b><small>${x.d}</small></div><div class="bt">${ins.has(x.id)?`<button class="in" data-o="${x.id}">Open</button><button data-u="${x.id}">Remove</button>`:`<button class="in" data-i="${x.id}">Install</button>`}</div></div>`).join("")||'<p>No games found.</p>'};
  root.innerHTML='<h2>Store</h2><p style="margin:0">Free games. Install one to add it to your Home Screen.</p><input class="inp" style="width:100%;margin-top:12px;text-align:left" placeholder="Search games"><div class="st"></div>';
  const s=root.querySelector("input");s.oninput=()=>draw(s.value);
  root.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
    if(b.dataset.i)h.install(b.dataset.i);else if(b.dataset.u)h.uninstall(b.dataset.u);else if(b.dataset.o)h.open(b.dataset.o);draw(s.value)});
  draw("");
}

window.FLStore={games:GAMES,byId,emoji,run,mountStore};
})();
