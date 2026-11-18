const Harbor = (() => {
  const places = [
    { id:"laundry", number:"01", label:"第六码头洗衣店", short:"洗衣店", x:711, y:126 },
    { id:"port", number:"02", label:"港务局夜班窗", short:"港务局", x:709, y:298 },
    { id:"shelter", number:"03", label:"西侧候车亭", short:"候车亭", x:304, y:177 },
    { id:"relay", number:"04", label:"坡顶中继站", short:"中继站", x:581, y:205 },
    { id:"ferry", number:"05", label:"旧渡轮站", short:"渡轮站", x:409, y:272 },
    { id:"gate", number:"06", label:"内港接收库", short:"接收库", x:621, y:423 }
  ];
  places.push({id:"shoe",number:"07",label:"沃尔特修鞋铺",short:"修鞋铺",x:799,y:222});
  const width=880, height=550;
  const land=[[-20,-15],[307,-15],[288,32],[292,58],[319,94],[320,134],[287,161],[282,207],[244,224],[257,262],[228,277],[244,311],[293,339],[334,334],[363,374],[405,393],[435,422],[480,439],[478,463],[521,487],[540,511],[614,545],[660,565],[906,565],[906,-15]];
  const roads=[
    [[710,-10],[711,129],[710,295],[695,359],[625,423],[641,487],[715,550]],
    [[298,181],[361,161],[445,173],[521,197],[580,204],[710,126],[812,126],[902,99]],
    [[260,294],[339,292],[405,272],[501,285],[582,268],[710,298],[803,309],[903,279]],
    [[406,273],[439,332],[458,358],[531,408],[619,424],[753,411],[902,422]],
    [[406,270],[478,248],[580,205],[594,124],[600,64],[725,60],[902,42]],
    [[538,551],[599,519],[687,519],[747,490],[801,465],[903,481]]
  ];
  const line=(ctx, points, color, size, dash=[])=>{
    ctx.beginPath();
    points.forEach(([x,y],i)=>i===0?ctx.moveTo(x,y):ctx.lineTo(x,y));
    ctx.strokeStyle=color;ctx.lineWidth=size;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);
  };
  const poly=(ctx, points, color)=>{
    ctx.beginPath();
    points.forEach(([x,y],i)=>i===0?ctx.moveTo(x,y):ctx.lineTo(x,y));
    ctx.closePath();ctx.fillStyle=color;ctx.fill();
  };
  function paint(ctx, position=null, print=false){
    const sea=ctx.createLinearGradient(0,0,540,540);
    sea.addColorStop(0,"#153032");sea.addColorStop(1,"#234043");
    ctx.fillStyle=sea;ctx.fillRect(0,0,width,height);
    for(let y=20;y<height;y+=17){
      for(let x=10;x<650;x+=39){
        const off=(y*13+x*7)%31;
        line(ctx,[[x+off,y],[x+off+7+(x+y)%13,y]],"#6b94921f",1);
      }
    }
    poly(ctx,land,"#303e39");
    ctx.save();
    ctx.clip();
    let seed=41997;
    const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
    for(let y=23;y<580;y+=27){
      for(let x=249;x<904;x+=32){
        if(random()<.22)continue;
        const dx=random()*10,dy=random()*11,w=11+random()*15,h=7+random()*10;
        ctx.fillStyle=random()>.6?"#73807528":"#0d19184a";
        ctx.fillRect(x+dx,y+dy,w,h);
        ctx.strokeStyle="#a4b4a021";ctx.strokeRect(x+dx,y+dy,w,h);
      }
    }
    for(const i of [0,1,2,3,4]){
      const x=540+i*18;
      line(ctx,[[x,40],[x-14,78],[x+5,111],[x+53,145],[x+96,161]],"#91a18d29",1);
    }
    roads.forEach((r,i)=>{
      line(ctx,r,"#161f1f",i===0?14:10);
      line(ctx,r,i===0?"#82938599":"#65746a85",i===0?7:4);
      if(i===0)line(ctx,r,"#b0bfa18e",1,[4,8]);
    });
    line(ctx,[[237,251],[325,246],[402,240],[506,241],[625,233],[711,137],[876,136]],"#192423",10);
    line(ctx,[[237,251],[325,246],[402,240],[506,241],[625,233],[711,137],[876,136]],"#bac7ae9e",4,[2,5]);
    ctx.restore();
    line(ctx,land,"#7c9b8899",2);
    const docks=[
      [[249,217],[204,211],[169,214]],[[245,270],[189,270],[167,293]],
      [[277,326],[237,349],[183,351]],[[326,339],[324,394],[295,420]],
      [[404,393],[384,452],[353,466]],[[474,436],[453,483],[420,513]]
    ];
    docks.forEach(r=>{line(ctx,r,"#111e1f",13);line(ctx,r,"#73877a",6);line(ctx,r,"#96a49a80",1,[3,5]);});
    poly(ctx,[[364,255],[397,243],[439,253],[458,278],[425,290],[379,282]],"#586855");
    line(ctx,[[408,277],[385,311],[350,329],[324,363]],"#d3ab739c",2,[4,5]);
    line(ctx,[[318,177],[352,213],[374,256],[342,279],[315,320]],"#d3ab737c",2,[4,5]);
    for(let x=0;x<width;x+=55)line(ctx,[[x,0],[x,height]],"#a7c9b011",1);
    for(let y=0;y<height;y+=55)line(ctx,[[0,y],[width,y]],"#a7c9b011",1);
    ctx.font='600 23px "PingFang SC","Microsoft YaHei",sans-serif';
    ctx.fillStyle="#afc7b2ad";ctx.fillText("格雷湾",72,310);
    ctx.font='15px "PingFang SC","Microsoft YaHei",sans-serif';
    ctx.fillStyle="#a6c1b6c2";ctx.fillText("旧水闸",289,391);ctx.fillText("北侧轨道",458,224);
    ctx.fillStyle="#b7c4a9c9";ctx.fillText("东坡",520,321);ctx.fillText("主街",733,192);
    ctx.fillText("码头仓库",743,375);
    ctx.font="12px ui-monospace, monospace";ctx.fillStyle="#d0dcc3a3";ctx.fillText("GRAY BAY",74,333);
    line(ctx,[[73,102],[73,53]],"#c9d9c1",1.2);poly(ctx,[[73,53],[68,64],[78,64]],"#c9d9c1");
    ctx.fillText("N",69,43);
    line(ctx,[[24,24],[856,24],[856,526],[24,526],[24,24]],"#adc1a748",1);
    ctx.font='14px "PingFang SC","Microsoft YaHei",sans-serif';
    ctx.fillStyle="#c6d5bcad";ctx.fillText("主街：洗衣店与港务楼",45,473);
    ctx.fillText("北侧废轨：旧渡轮站检修门",45,496);
    ctx.fillText("堤路尽头：公司接收库",45,519);
    if(position){
      const selected=places.find(p=>p.id===position);
      if(selected){
        const halo=ctx.createRadialGradient(selected.x,selected.y,5,selected.x,selected.y,57);
        halo.addColorStop(0,"#eeb67445");halo.addColorStop(1,"#eeb67400");
        ctx.fillStyle=halo;ctx.fillRect(selected.x-57,selected.y-57,114,114);
      }
    }
    if(print){
      ctx.textAlign="center";ctx.textBaseline="middle";
      ctx.font='600 19px "PingFang SC","Microsoft YaHei",sans-serif';
      for(const place of places){
        const label=place.number+"  "+place.label;
        const w=ctx.measureText(label).width+22;
        ctx.fillStyle="#142322";ctx.fillRect(place.x-w/2,place.y-16,w,32);
        ctx.strokeStyle="#adbfaa";ctx.strokeRect(place.x-w/2,place.y-16,w,32);
        ctx.fillStyle="#f2ecd8";ctx.fillText(label,place.x,place.y+1);
      }
      ctx.textAlign="left";
    }
  }
  async function download(){
    await document.fonts.ready;
    const out=document.createElement("canvas");out.width=1760;out.height=1220;
    const ctx=out.getContext("2d");ctx.scale(2,2);
    ctx.fillStyle="#111919";ctx.fillRect(0,0,880,610);
    ctx.fillStyle="#efe6cf";ctx.font='bold 27px "PingFang SC","Microsoft YaHei",sans-serif';ctx.fillText("格雷港 · 停播之前",25,39);
    ctx.textAlign="right";ctx.font='14px "PingFang SC","Microsoft YaHei",sans-serif';ctx.fillStyle="#acc6b8";ctx.fillText("1997 年 10 月 / 玩家示意地图",854,38);
    ctx.translate(0,60);paint(ctx,null,true);
    out.toBlob(blob=>{
      if(!blob)return;
      const url=URL.createObjectURL(blob);
      const link=document.createElement("a");link.href=url;link.download="Grayhaven_格雷港_玩家地图.png";
      document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    },"image/png");
  }
  return {places,paint,download,width,height};
})();
