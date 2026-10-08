/* helpers shared by the three home-page mockups (a/b/c) */
const M=(()=>{
  const W={sh:['شيخ واحد','شيخان','مشايخ','شيخ','شيخ'],s:['سلسلة واحدة','سلسلتان','سلاسل','سلسلة','سلسلة'],
           l:['درس واحد','درسان','دروس','درس','درس'],h:['ساعة واحدة','ساعتان','ساعات','ساعة','ساعة']};
  const IC={sh:'<path d="M16 20v-1.5a4 4 0 0 0-4-4H6.5a4 4 0 0 0-4 4V20"/><circle cx="9.25" cy="7.5" r="3.75"/><path d="M21.5 20v-1.5a4 4 0 0 0-3-3.85M15.5 3.85a3.75 3.75 0 0 1 0 7.3"/>',
    fav:'<path d="m12 3.5 2.6 5.3 5.9.9-4.25 4.1 1 5.8L12 16.9l-5.25 2.7 1-5.8L3.5 9.7l5.9-.9Z"/>',
    st:'<path d="M4 20h16M7 16v-5M12 16V6M17 16v-8"/>',
    ctl:'<path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h11M19 17h1"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="17" r="2"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    chev:'<path d="m15 18-6-6 6-6"/>',
    play:'<path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/>'};
  let AR=false;
  const num=n=>AR?n.toLocaleString('ar-EG'):String(n);
  const cnt=(n,k)=>{if(!n)return'';const[o,t,f,m,h]=W[k];if(n===1)return o;if(n===2)return t;
    const r=n%100;return num(n)+' '+(r>=3&&r<=10?f:r===0?h:m)};
  const norm=s=>s.replace(/[\u064B-\u0652\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي');
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const ini=s=>esc(s.trim().split(/\s+/).pop().replace(/^ال/,'')[0]||'');
  const img=x=>x.photo?`<img loading="lazy" src="${esc(x.photo)}" alt="" onerror="this.remove()">`:'';
  const svg=(k,c='')=>`<svg class="${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${IC[k]}</svg>`;
  function toast(t){let e=document.getElementById('toast');if(!e){e=document.createElement('div');e.id='toast';document.body.append(e)}
    e.textContent=t;e.className='on';clearTimeout(e._t);e._t=setTimeout(()=>e.className='',1600)}
  function start(o){
    AR=!!o.ar;Object.assign(W,o.words||{});
    const S=window.SHEIKHS,list=document.getElementById('list');
    document.getElementById('sub').textContent=[cnt(S.length,'sh'),cnt(S.reduce((a,x)=>a+x.series,0),'s')].join(' · ');
    document.getElementById('favs').innerHTML=window.FAVS.map(o.fav).join('');
    document.getElementById('nav').innerHTML=[['sh','المشايخ'],['fav','المفضلة'],['st','إحصائي'],['ctl','التحكم']]
      .map(([k,t])=>`<a href="#" class="${k==='sh'?'on':''}"><span class="ic">${svg(k)}</span><span>${t}</span></a>`).join('');
    const draw=v=>{const n=norm(v.trim()),r=S.filter(x=>!n||norm(x.name).includes(n));
      list.innerHTML=r.length?r.map(o.row).join(''):'<p class="empty">لا يوجد شيخ بهذا الاسم</p>'};
    document.getElementById('q').addEventListener('input',e=>draw(e.target.value));draw('');
    document.addEventListener('click',e=>{if(e.target.closest('a[href="#"]')){e.preventDefault();toast('هذه معاينة للشكل فقط')}});
  }
  return {start,cnt,esc,ini,img,svg};
})();
