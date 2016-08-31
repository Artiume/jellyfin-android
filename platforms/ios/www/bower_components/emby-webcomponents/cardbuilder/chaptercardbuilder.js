define(["datetime","imageLoader","connectionManager","itemShortcuts","layoutManager"],function(a,e,t,r,i){function d(a,e,r){var i="card scalableCard itemAction chapterCard",d=((a.MediaSources||[])[0]||{}).MediaStreams||[],n=d.filter(function(a){return"Video"==a.Type})[0]||{},s=r.backdropShape||"backdrop";n.Width&&n.Height&&n.Width/n.Height<=1.34&&(s=r.squareShape||"square"),i+=" "+s+"Card",(r.block||r.rows)&&(i+=" block");for(var c="",l=0,v=t.getApiClient(a.ServerId),m=0,u=e.length;u>m;m++){r.rows&&0==l&&(c+='<div class="cardColumn">');var p=e[m];c+=o(a,v,p,m,r,i,s),l++,r.rows&&l>=r.rows&&(l=0,c+="</div>")}return c}function n(a,e,t,r,i){return e.ImageTag?i.getScaledImageUrl(a.Id,{maxWidth:r,tag:e.ImageTag,type:"Chapter",index:t}):null}function o(e,t,r,d,o,s,c){var l=n(e,r,d,o.width||400,t),v="cardImageContainer chapterCardImageContainer";o.coverImage&&(v+=" coveredImage");var m=' data-action="play" data-isfolder="'+e.IsFolder+'" data-id="'+e.Id+'" data-serverid="'+e.ServerId+'" data-type="'+e.Type+'" data-mediatype="'+e.MediaType+'" data-positionticks="'+r.StartPositionTicks+'"',u=l?'<div class="'+v+' lazy" data-src="'+l+'">':'<div class="'+v+'">';l||(u+='<i class="md-icon cardImageIcon">local_movies</i>');var p="";p+='<div class="cardText">'+r.Name+"</div>",p+='<div class="cardText">'+a.getDisplayRunningTime(r.StartPositionTicks)+"</div>";var g="cardBox";i.tv&&(g+=" cardBox-focustransform");var C='<button type="button" class="'+s+'"'+m+'> <div class="'+g+'"><div class="cardScalable"><div class="cardPadder-'+c+'"></div><div class="cardContent">'+u+'</div><div class="innerCardFooter">'+p+"</div></div></div></div></button>";return C}function s(a,t,i){if(i.parentContainer){if(!document.body.contains(i.parentContainer))return;if(!t.length)return void i.parentContainer.classList.add("hide");i.parentContainer.classList.remove("hide")}var n=d(a,t,i);i.itemsContainer.innerHTML=n,e.lazyChildren(i.itemsContainer),r.off(i.itemsContainer),r.on(i.itemsContainer)}return{buildChapterCards:s}});