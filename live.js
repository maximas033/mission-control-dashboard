async function loadLive(){
  try{
    const r=await fetch('/live.json?ts='+Date.now());
    const d=await r.json();
    const set=(id,val)=>{const el=document.getElementById(id); if(el) el.textContent=val;};
    set('agentName', d.agent?.name||'OpenClaw Main Agent');
    set('agentUpdated', d.updatedAt?`Session updated: ${new Date(d.updatedAt).toLocaleString()}`:'');
    set('fiveLeft', (d.usage?.fiveHourLeft ?? '--') + '%');
    set('dayLeft', (d.usage?.dayLeft ?? '--') + '%');
    set('tokensIn', Number(d.usage?.tokensIn||0).toLocaleString());
    set('tokensOut', Number(d.usage?.tokensOut||0).toLocaleString());

    const a=document.getElementById('agentStatus');
    if(a){ a.className='status ' + (d.agent?.online ? 'online':'offline'); a.innerHTML=`<span class='dot'></span>${d.agent?.online?'Live':'Offline'}`; }

    const act=document.getElementById('liveActivity');
    if(act && d.currentActivity){ act.innerHTML=`<b>${d.currentActivity.title}</b><div class='muted'>${d.currentActivity.detail}</div>`; }

    const p5=document.getElementById('bar5'); if(p5){ const v=Math.max(0,Math.min(100,d.usage?.fiveHourLeft||0)); p5.style.width=v+'%'; p5.className=v>=70?'p-good':(v>=35?'p-warn':'p-bad'); }
    const pd=document.getElementById('barDay'); if(pd){ const v=Math.max(0,Math.min(100,d.usage?.dayLeft||0)); pd.style.width=v+'%'; pd.className=v>=70?'p-good':(v>=35?'p-warn':'p-bad'); }

    const list=document.getElementById('recentProjects');
    if(list && Array.isArray(d.projects)){
      list.innerHTML=d.projects.slice(0,8).map(p=>`<div class='item row'><div><b>${p.name}</b><div class='muted'>${p.owner||'Assistant'} • ${p.updated||''}</div></div><span class='state ${p.state==='done'?'done':(p.state==='in-progress'?'progress':'todo')}'>${p.state}</span></div>`).join('');
    }

    const agentsList=document.getElementById('agentsList'); const agentsCount=document.getElementById('agentsCount');
    if(agentsList && Array.isArray(d.agents)){
      agentsCount && (agentsCount.textContent = `${d.agents.length} agents`);
      agentsList.innerHTML=d.agents.map(a=>`<div class='item row'><div><b>${a.id}</b><div class='muted'>${a.workspace || 'workspace unknown'} • sessions: ${a.sessions ?? 0}</div></div><span class='status ${a.status==='online'?'online':'offline'}'><span class='dot'></span>${a.status || 'offline'}</span></div>`).join('') || `<div class='item'>No agents found.</div>`;
    }

    const wl=document.getElementById('workshopList'); const wc=document.getElementById('workshopCount');
    if(wl && Array.isArray(d.workshop)){
      wc && (wc.textContent=`${d.workshop.length} items`);
      wl.innerHTML=d.workshop.map((w,i)=>`<div class='item row clickable' onclick='openTaskModal(${i})'><div><b>${w.title}</b><div class='muted'>${w.owner} • ${w.updated}</div></div><span class='state ${w.state==='done'?'done':(w.state==='in-progress'?'progress':'todo')}'>${w.state}</span></div>`).join('');
      window.__workshop = d.workshop;
    }

    const jl=document.getElementById('journalList'); const jp=document.getElementById('obsPath');
    if(jl && Array.isArray(d.journal)){
      jp && (jp.textContent = `Vault: ${d.obsidian?.path || 'not connected'}`);
      jl.innerHTML=d.journal.map(j=>`<div class='item'><b>${j.title}</b><div class='muted'>${j.path}</div></div>`).join('') || '<div class="item">No journal entries found.</div>';
    }

    const wr=document.getElementById('weeklyRecap');
    if(wr && d.weeklyRecap){
      wr.innerHTML=`<div class='list'>
        <div class='item'><b>Completed:</b> ${d.weeklyRecap.completed}</div>
        <div class='item'><b>In Progress:</b> ${d.weeklyRecap.inProgress}</div>
        <div class='item'><b>Upcoming:</b> ${d.weeklyRecap.upcoming}</div>
        <div class='item'><b>Summary:</b> ${d.weeklyRecap.summary}</div>
      </div>`;
    }
  }catch(e){/*silent*/}
}

window.openTaskModal=function(i){
  const w=(window.__workshop||[])[i]; if(!w) return;
  const m=document.getElementById('taskModal'); if(!m) return;
  document.getElementById('mTitle').textContent=w.title;
  document.getElementById('mDesc').textContent=w.description||'';
  document.getElementById('mStatus').textContent=w.state||'';
  document.getElementById('mProgress').textContent=(w.progress??0)+'%';
  document.getElementById('mCreated').textContent=w.created||'-';
  document.getElementById('mStarted').textContent=w.started||'-';
  document.getElementById('mFinished').textContent=w.finished||'-';
  const log=document.getElementById('mLog');
  log.innerHTML=(w.log||[]).map(x=>`<div class='item'>${x}</div>`).join('') || '<div class="item">No log entries</div>';
  m.classList.remove('hidden');
}
window.closeTaskModal=function(){ const m=document.getElementById('taskModal'); m && m.classList.add('hidden'); }

loadLive(); setInterval(loadLive,30000);