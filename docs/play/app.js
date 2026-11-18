(() => {
  const $=id=>document.getElementById(id);
  const modules={
    grayhaven:{story:Story,key:'grayhaven-night-shift.v12',title:'停播之前',setting:'1997 年 10 月 / 美国西北沿岸',chapter:'1997 · 格雷港',character:'杰克·摩根',mapTitle:'格雷港',credit:'《停播之前》· 第十二版互动试玩',edition:'原创模组 · 没有任务倒计时'},
    crimson:{story:CrimsonStory,key:'crimson-letters.demo.v1',title:'猩红文档',setting:'1920 年代 · 十月 / 阿卡姆',chapter:'阿卡姆 · 文档失窃案',character:'亚历克斯·里德',mapTitle:'阿卡姆 · 地点示意',credit:'《猩红文档》· 单人选项改编 / 原作 Alan Bligh',edition:'原作单人改编 · 固定案件版本 · 按事件推进'}
  };
  let moduleId=null, story=null, key=null, state=null;
  function readSave(id){try{return modules[id].story.restore(JSON.parse(localStorage.getItem(modules[id].key)));}catch{return null;}}
  function pick(id){moduleId=id;const m=modules[id];story=m.story;key=m.key;state=readSave(id)||story.opening();previous=0;document.body.dataset.module=id;$('module-picker').hidden=true;$('play-root').hidden=false;$('choose-module').hidden=false;$('reset').hidden=false;$('export-log').hidden=false;$('save-status').hidden=false;$('setting-label').textContent=m.setting;$('title').replaceChildren(document.createTextNode(m.title),el('span','.'));$('edition-label').textContent=m.edition;$('character-name').textContent=m.character;$('map-title').textContent=m.mapTitle;$('map-tab').textContent=id==='crimson'?'调查地点':'港区地图';$('module-credit').textContent=m.credit;document.title=m.title+' · 调查档案室';changeView('room');render();window.scrollTo(0,0);}
  function showPicker(){if(state)try{localStorage.setItem(key,JSON.stringify(state));}catch{}$('module-picker').hidden=false;$('play-root').hidden=true;for(const id of ['choose-module','reset','export-log','save-status'])$(id).hidden=true;delete document.body.dataset.module;document.title='调查档案室 · 选择一场调查';for(const id of Object.keys(modules)){const s=readSave(id);$(id+'-progress').textContent=s?(s.phase==='end'?'已有结局 · 可以回看或重开':'已调查 '+s.visited.length+' 处 · '+s.notes.length+' 条线索'):'尚未开始';$('play-'+id).replaceChildren(document.createTextNode(s?'继续调查 ':'进入调查 '),el('span','↗'));}window.scrollTo(0,0);}
  const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;};
  let previous=0;
  function save(){try{localStorage.setItem(key,JSON.stringify(state));$('save-status').textContent='进度已保存';}catch{$('save-status').textContent='本次进度暂留当前页面';}render();}
  function button(action){const b=el('button',null,'choice'+(action.complete?' is-used':'')+(action.locked?' is-locked':''));b.type='button';b.disabled=action.disabled;b.dataset.action=action.id;const label=el('span',action.label,'choice-label');b.append(label);if(action.badge)b.append(el('span',action.badge,'choice-badge'));if(action.locked&&!action.complete){b.title=action.reason;b.append(el('small',action.reason,'choice-reason'));}b.addEventListener('click',()=>{if(story.act(state,action.id))save();});return b;}
  function changeView(view){$('room-view').hidden=view!=='room';$('map-view').hidden=view!=='map';$('room-tab').setAttribute('aria-pressed',String(view==='room'));$('map-tab').setAttribute('aria-pressed',String(view==='map'));}
  function mapButton(p,id,current,ended){const available=story.canTravel(state,id);const b=el('button',null,(moduleId==='crimson'?'town-place':'marker')+(!available&&!current?' locked':'')+(state.visited.includes(id)&&!current?' is-used':''));b.type='button';if(moduleId==='grayhaven'){b.style.setProperty('--x',p.x/Harbor.width*100+'%');b.style.setProperty('--y',p.y/Harbor.height*100+'%');}b.append(el('i',p.number),el('span',p.short));b.disabled=!available||current||ended;b.title=current?'当前位置':available?'前往'+p.label:'信息不足：还没有前往这里的线索';b.setAttribute('aria-label',p.label+(current?'，当前位置':available?'，可以前往':'，尚未开放'));if(current)b.setAttribute('aria-current','location');b.addEventListener('click',()=>{if(story.move(state,id)){changeView('room');save();}});return b;}
  function render(){
    const ended=state.phase==='end', room=story.rooms[state.loc];
    $('building').textContent=room.area;$('room-title').textContent=room.title;
    $('chapter').textContent=ended?'这一段调查结束':moduleId==='grayhaven'&&state.loc==='reality'?'醒来以后':modules[moduleId].chapter;
    $('scene-title').textContent=ended?state.choice:room.title;$('clock').textContent=moduleId==='crimson'?(state.phase==='manifestation'?'显形 '+state.rounds+' 轮':'阿卡姆'):state.loc==='reality'?'现实':'雨夜';
    $('mission-text').textContent=moduleId==='crimson'?(state.flags.resolved?'危险已处理，可以回大学汇报。':state.flags.original?'原件已找到；危险仍需处理。':state.notes.includes('commission')?'查明莱特之死，寻回审判文档。':'反锁的办公室，失窃的文档。'):state.flags.rescued?'两名真人已获救，复制装置已停止。':state.notes.includes('case')?'找回露丝与奥斯卡，停止冒用他们身份的录制。':'一盘录像，一个尚未拆开的信封。';
    $('hp').textContent=`${state.hp} / ${state.maxHp}`;$('mp').textContent=`${state.mp} / ${state.maxMp}`;$('san').textContent=state.san;
    $('inventory').textContent=moduleId==='crimson'?story.inventory(state):[state.needle?'回声针':null,state.flags.hammer?'检修锤':null,'手电','随身证件'].filter(Boolean).join(' · ');
    const exits=story.exits(state);$('rooms').replaceChildren(...exits.map(x=>{const b=el('button',x.label,'exit-link'+(state.visited.includes(x.id)?' is-used':''));b.type='button';b.disabled=!x.available||ended;b.addEventListener('click',()=>{if(story.move(state,x.id)){save();}});return b;}));$('rooms').hidden=!exits.length;
    const people=story.npcs(state);$('people').replaceChildren(...people.map(p=>el('p',p)));$('people-section').hidden=!people.length;
    const objects=story.choices(state,'objects');$('objects').replaceChildren(...objects.map(button));$('object-help').hidden=objects.length>0||ended;$('object-section').hidden=ended;
    const choices=story.choices(state,'actions');const explore=choices.filter(x=>x.kind==='explore'),other=choices.filter(x=>x.kind!=='explore');
    $('explore-actions').replaceChildren(...explore.map(button));$('actions').replaceChildren(...other.map(button));$('actions-title').hidden=!other.length;
    $('interact').hidden=ended;$('ending-actions').hidden=!ended;
    const newEntries=state.entries.length>previous;const oldScroll=$('log').scrollTop;
    $('log').replaceChildren(...state.entries.map((e,i)=>{const row=el('div',null,'entry entry--'+e.kind);row.dataset.entry=i;if(e.kind==='divider'){row.append(el('h3',e.text));return row;}if(e.speaker)row.append(el('b',e.speaker));row.append(el('p',e.text));return row;}));
    if(newEntries){const lastDivider=state.entries.findLastIndex(e=>e.kind==='divider');const target=lastDivider>=previous?$('log').querySelector(`[data-entry="${lastDivider}"]`):null;if(target)$('log').scrollTop=target.offsetTop-$('log').offsetTop;else $('log').scrollTop=$('log').scrollHeight;}else $('log').scrollTop=oldScroll;previous=state.entries.length;
    $('note-count').textContent=state.notes.length;$('empty-notes').hidden=!!state.notes.length;
    const opened=new Set([...$('note-list').querySelectorAll('details[open]')].map(e=>e.dataset.note));$('note-list').replaceChildren(...state.notes.filter(n=>story.intel[n]).map(n=>{const d=el('details');d.dataset.note=n;d.open=opened.has(n);d.append(el('summary',story.intel[n][0]),el('p',story.intel[n][1]));return d;}));
    if(moduleId==='grayhaven'){
      $('harbor').hidden=false;$('markers').className='markers';$('export-map').hidden=false;
      const place=['laundry','floor'].includes(state.loc)?'laundry':['reception','basement'].includes(state.loc)?'gate':state.loc==='hall'?'ferry':state.loc;
      Harbor.paint($('harbor').getContext('2d'),place);$('markers').replaceChildren(...Harbor.places.map(p=>mapButton(p,p.id==='laundry'?'floor':p.id,p.id===place,ended)));
    }else{
      $('harbor').hidden=true;$('markers').className='crimson-map';$('export-map').hidden=true;
      const locations=[{id:'dean',label:'密斯卡托尼克大学',number:'01',short:'大学 · 校内房间'},{id:'cottage',label:'莱特小屋',number:'02',short:'莱特小屋'},{id:'tavern',label:'希布酒馆',number:'03',short:'希布酒馆'},{id:'apartment',label:'画家公寓',number:'04',short:'画家公寓'},{id:'asylum',label:'阿卡姆疗养院',number:'05',short:'疗养院'},{id:'wick',label:'轻率琐事',number:'06',short:'古董店'},{id:'student',label:'学生住处',number:'07',short:'学生住处'},{id:'mansion',label:'霍布豪斯宅邸',number:'08',short:'霍布豪斯宅邸'}];
      $('markers').replaceChildren(...locations.map(p=>mapButton(p,p.id,p.id==='dean'?['dean','office','morgue'].includes(state.loc):p.id===state.loc,ended)));
    }
    const last=state.rolls.at(-1);$('last-roll').textContent=last?`${last.hidden?'暗骰':'检定'} · ${last.skill} ${last.value} / ${last.target} · ${['失败','成功','困难成功','极难成功','大成功'][last.quality]}`:'选择“调查房间”后自动暗骰；失败也有基本信息。';
  }
  function restart(){state=story.opening();previous=0;changeView('room');save();}
  $('room-tab').addEventListener('click',()=>changeView('room'));$('map-tab').addEventListener('click',()=>changeView('map'));
  $('reset').addEventListener('click',()=>$('restart-dialog').showModal());$('restart-dialog').addEventListener('close',()=>{if($('restart-dialog').returnValue==='restart')restart();});$('replay').addEventListener('click',()=>$('restart-dialog').showModal());
  $('export-map').addEventListener('click',Harbor.download);
  $('export-log').addEventListener('click',()=>{const text=['《'+modules[moduleId].title+'》调查记录',...state.entries.map(e=>(e.kind==='divider'?'\n—— '+e.text+' ——\n':(e.speaker?e.speaker+'：':'')+e.text))].join('\n\n');const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=el('a');a.href=url;a.download=modules[moduleId].title+'_调查记录.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  for(const id of Object.keys(modules))$('play-'+id).addEventListener('click',()=>pick(id));
  $('choose-module').addEventListener('click',showPicker);
  $('top').addEventListener('click',event=>{event.preventDefault();showPicker();});
  showPicker();
})();
