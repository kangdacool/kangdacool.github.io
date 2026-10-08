/* EvidenceBook · 공통 스크립트 */
(function(){
  const CHAPTERS = [
    {n:'00', href:'index.html', t:'홈 · 근거 좌표 지도'},
    {n:'01', href:'likelihood.html', t:'우도비와 베이즈 갱신'},
    {n:'02', href:'design.html', t:'진단 정확도 연구의 설계'},
    {n:'03', href:'hierarchy.html', t:'질문별 근거 위계'},
    {n:'04', href:'tpp.html', t:'목표 제품 특성(TPP)'},
    {n:'05', href:'implementation.html', t:'실행 연구와 하이브리드 설계'},
    {n:'06', href:'etiology.html', t:'병인 연구 안의 측정 정확도'},
    {n:'07', href:'summary.html', t:'정리 · 종합 퀴즈 · 참고문헌'}
  ];
  const store = {
    get(k){try{return localStorage.getItem(k)}catch(e){return null}},
    set(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  };
  const saved = store.get('eb-theme');
  let sysDark=false; try{sysDark=matchMedia('(prefers-color-scheme: dark)').matches}catch(e){}
  document.documentElement.setAttribute('data-theme', saved || (sysDark?'dark':'light'));

  const ICON = {
    menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/></svg>'
  };

  function buildChrome(){
    const here = location.pathname.split('/').pop() || 'index.html';
    const top = document.createElement('header');
    top.className = 'topbar';
    top.innerHTML = `
      <button class="iconbtn" id="ebMenu" aria-label="챕터 목록">${ICON.menu}</button>
      <a class="brand" href="index.html"><span class="logo">E</span>EvidenceBook <small>근거의 좌표</small></a>
      <div class="spacer"></div>
      <a class="iconbtn" href="summary.html#refs" title="참고문헌">${ICON.book}<span class="reflab" style="font-size:13px">참고문헌</span></a>
      <button class="iconbtn" id="ebTheme" aria-label="밝기 전환"></button>
      <div class="progress" id="ebProg"></div>`;
    document.body.prepend(top);
    const dr = document.createElement('nav');
    dr.className = 'drawer'; dr.id = 'ebDrawer';
    dr.innerHTML = '<div class="eyebrow">Chapters</div>' + CHAPTERS.map(c =>
      `<a href="${c.href}" class="${c.href===here?'cur':''}"><span class="n">${c.n}</span><span>${c.t}</span></a>`).join('');
    const scrim = document.createElement('div'); scrim.className='scrim';
    document.body.append(dr, scrim);
    const toggle = (o)=>{dr.classList.toggle('open',o);scrim.classList.toggle('show',o)};
    top.querySelector('#ebMenu').onclick = ()=>toggle(!dr.classList.contains('open'));
    scrim.onclick = ()=>toggle(false);
    document.addEventListener('keydown',e=>{if(e.key==='Escape')toggle(false)});

    const tb = top.querySelector('#ebTheme');
    const paint = ()=>{const l=document.documentElement.getAttribute('data-theme')!=='dark';tb.innerHTML=l?ICON.moon:ICON.sun};
    paint();
    tb.onclick = ()=>{
      const l = document.documentElement.getAttribute('data-theme')!=='dark';
      document.documentElement.setAttribute('data-theme', l?'dark':'light');
      store.set('eb-theme', l?'dark':'light'); paint();
      document.dispatchEvent(new CustomEvent('eb-theme'));
    };
    const prog = top.querySelector('#ebProg');
    addEventListener('scroll',()=>{const h=document.documentElement;prog.style.width=(100*h.scrollTop/Math.max(1,h.scrollHeight-h.clientHeight))+'%'},{passive:true});

    // chapter nav
    const cn = document.querySelector('[data-chapnav]');
    if(cn){
      const i = CHAPTERS.findIndex(c=>c.href===here);
      const p = CHAPTERS[i-1], n = CHAPTERS[i+1];
      cn.className='chapnav';
      cn.innerHTML = (p?`<a href="${p.href}"><small>← ${p.n}</small>${p.t}</a>`:'<span></span>') +
                     (n?`<a class="next" href="${n.href}"><small>${n.n} →</small>${n.t}</a>`:'<span></span>');
    }
    const ft = document.createElement('footer'); ft.className='foot';
    ft.innerHTML = 'EvidenceBook · 진단·근거 위계·실행 연구 인터랙티브 교재 · kangdacool · 2026.10.08<br>시뮬레이터는 개념을 보여 주기 위한 단순화 모형이며, 문헌에서 가져온 내용은 본문과 참고문헌에 출처를 표기합니다.';
    document.body.append(ft);
  }

  function buildTOC(){
    const toc = document.querySelector('.toc');
    if(!toc) return;
    const hs = [...document.querySelectorAll('.content h2[id]')];
    toc.innerHTML = '<div class="eyebrow">On this page</div>' + hs.map(h=>`<a href="#${h.id}">${h.textContent.replace(/^\d+\s*/,'')}</a>`).join('');
    const links = [...toc.querySelectorAll('a')];
    const io = new IntersectionObserver(es=>{
      es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}});
    },{rootMargin:'-20% 0px -70% 0px'});
    hs.forEach(h=>io.observe(h));
  }

  function initQuiz(){
    document.querySelectorAll('.quiz').forEach(q=>{
      const ans = +q.dataset.ans;
      const opts = [...q.querySelectorAll('.opt')];
      opts.forEach((o,i)=>o.addEventListener('click',()=>{
        if(q.classList.contains('done')) return;
        q.classList.add('done');
        o.classList.add(i===ans?'right':'wrong');
        opts[ans].classList.add('right');
        const ex = q.querySelector('.exp');
        if(ex && !ex.dataset.pref){ex.dataset.pref=1;ex.insertAdjacentHTML('afterbegin',`<b style="color:${i===ans?'var(--ok)':'var(--bad)'}">${i===ans?'정답':'오답'}</b> · `)}
        document.dispatchEvent(new CustomEvent('eb-quiz',{detail:{ok:i===ans}}));
      }));
    });
  }

  /* drag-or-tap sorter: .token[data-cat] into .bin[data-cat] */
  function sorter(root, onCheck){
    let sel = null;
    const pool = root.querySelector('.pool');
    const bins = [...root.querySelectorAll('.bin')];
    const place = (tok, bin)=>{ (bin ? bin.querySelector('.items') : pool).appendChild(tok); tok.classList.remove('right','wrong','sel'); };
    root.querySelectorAll('.token').forEach(tok=>{
      tok.addEventListener('pointerdown', e=>{
        e.preventDefault();
        const r = tok.getBoundingClientRect();
        const ghost = tok.cloneNode(true);
        Object.assign(ghost.style,{position:'fixed',left:r.left+'px',top:r.top+'px',width:r.width+'px',pointerEvents:'none',zIndex:999,opacity:.9});
        let moved=false; const sx=e.clientX, sy=e.clientY;
        const mv = ev=>{
          if(!moved && Math.hypot(ev.clientX-sx,ev.clientY-sy)>5){moved=true;document.body.appendChild(ghost);tok.style.opacity=.3}
          if(!moved) return;
          ghost.style.left=(r.left+ev.clientX-sx)+'px'; ghost.style.top=(r.top+ev.clientY-sy)+'px';
          bins.forEach(b=>{const br=b.getBoundingClientRect();b.classList.toggle('over',ev.clientX>br.left&&ev.clientX<br.right&&ev.clientY>br.top&&ev.clientY<br.bottom)});
        };
        const up = ev=>{
          removeEventListener('pointermove',mv); removeEventListener('pointerup',up);
          tok.style.opacity='';
          if(moved){
            ghost.remove();
            const b = bins.find(b=>b.classList.contains('over'));
            bins.forEach(b=>b.classList.remove('over'));
            if(b) place(tok,b);
            else { const pr=pool.getBoundingClientRect(); if(ev.clientY>pr.top&&ev.clientY<pr.bottom) place(tok,null); }
          } else {
            if(sel && sel!==tok && sel.parentElement!==tok.parentElement){place(sel, tok.closest('.bin'));sel=null}
            else if(sel===tok){tok.classList.remove('sel');sel=null}
            else {if(sel)sel.classList.remove('sel');sel=tok;tok.classList.add('sel')}
          }
        };
        addEventListener('pointermove',mv); addEventListener('pointerup',up);
      });
    });
    bins.forEach(b=>b.addEventListener('click',e=>{ if(sel && !e.target.classList.contains('token')){place(sel,b);sel=null} }));
    pool.addEventListener('click',e=>{ if(sel && e.target===pool){place(sel,null);sel=null} });
    const chk = root.querySelector('[data-check]'), rst = root.querySelector('[data-reset]'), out = root.querySelector('[data-out]');
    if(chk) chk.onclick = ()=>{
      let ok=0,tot=0,placed=0;
      root.querySelectorAll('.token').forEach(t=>{tot++;const b=t.closest('.bin');t.classList.remove('right','wrong');if(b){placed++;const good=t.dataset.cat===b.dataset.cat;t.classList.add(good?'right':'wrong');if(good)ok++}});
      if(out) out.innerHTML = `<b>${ok} / ${tot}</b> 정답` + (placed<tot?` · 아직 ${tot-placed}개를 옮기지 않았습니다`:'') + (ok===tot?' · 모두 맞혔습니다':'');
      if(onCheck) onCheck(ok,tot);
    };
    if(rst) rst.onclick = ()=>{ root.querySelectorAll('.token').forEach(t=>place(t,null)); if(out) out.textContent=''; };
  }

  /* small helpers */
  const NS='http://www.w3.org/2000/svg';
  function S(tag, attrs, parent){const e=document.createElementNS(NS,tag);for(const k in attrs)if(attrs[k]!=null)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e}
  function css(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim()}
  function rng(seed){let s=seed>>>0||1;return ()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return ((s>>>0)%1e9)/1e9}}
  function bindRange(id, fmt, cb){const el=document.getElementById(id);const lab=document.getElementById(id+'V');const f=()=>{if(lab)lab.textContent=fmt?fmt(+el.value):el.value;cb&&cb(+el.value)};el.addEventListener('input',f);f();return el}

  /* numeric helpers */
  function erf(x){const t=1/(1+0.3275911*Math.abs(x));const y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x);return x>=0?y:-y}
  function pnorm(x,m=0,s=1){return 0.5*(1+erf((x-m)/(s*Math.SQRT2)))}
  function dnorm(x,m=0,s=1){const z=(x-m)/s;return Math.exp(-z*z/2)/(s*Math.sqrt(2*Math.PI))}
  function pct(v,d=1){return (100*v).toFixed(d)+'%'}
  function wilson(x,n,z=1.96){if(n<=0)return [0,1];const p=x/n,den=1+z*z/n,c=p+z*z/(2*n),h=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n));return [Math.max(0,(c-h)/den),Math.min(1,(c+h)/den)]}
  const odds=p=>p/(1-p), prob=o=>o/(1+o);
  window.EB = {sorter,S,css,rng,bindRange,CHAPTERS,pnorm,dnorm,pct,wilson,odds,prob};
  document.addEventListener('DOMContentLoaded',()=>{buildChrome();buildTOC();initQuiz();});
})();
