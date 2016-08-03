define(["libraryBrowser","cardBuilder","scrollStyles","emby-itemscontainer"],function(e,t){function r(){return browserInfo.mobile&&AppInfo.enableAppLayouts}function i(){return r()?"overflowBackdrop":"backdrop"}function a(){return r()?"overflowPortrait":"portrait"}function o(){return r()?"overflowSquare":"square"}function n(){return[{name:"HeaderFavoriteMovies",types:"Movie",id:"favoriteMovies",shape:a(),showTitle:!1,overlayPlayButton:!0},{name:"HeaderFavoriteShows",types:"Series",id:"favoriteShows",shape:a(),showTitle:!1,overlayPlayButton:!0},{name:"HeaderFavoriteEpisodes",types:"Episode",id:"favoriteEpisode",shape:i(),preferThumb:!1,showTitle:!0,showParentTitle:!0,overlayPlayButton:!0},{name:"HeaderFavoriteGames",types:"Game",id:"favoriteGames",shape:o(),preferThumb:!1,showTitle:!0},{name:"HeaderFavoriteArtists",types:"MusicArtist",id:"favoriteArtists",shape:o(),preferThumb:!1,showTitle:!0,overlayText:!1,showParentTitle:!0,centerText:!0,overlayPlayButton:!0},{name:"HeaderFavoriteAlbums",types:"MusicAlbum",id:"favoriteAlbums",shape:o(),preferThumb:!1,showTitle:!0,overlayText:!1,showParentTitle:!0,centerText:!0,overlayPlayButton:!0},{name:"HeaderFavoriteSongs",types:"Audio",id:"favoriteSongs",shape:o(),preferThumb:!1,showTitle:!0,overlayText:!1,showParentTitle:!0,centerText:!0,overlayMoreButton:!0,action:"instantmix"}]}function s(e,i,a,o,n){var s=window.innerWidth,l={SortBy:"SortName",SortOrder:"Ascending",Filters:"IsFavorite",Recursive:!0,Fields:"PrimaryImageAspectRatio,BasicSyncInfo",CollapseBoxSetItems:!1,ExcludeLocationTypes:"Virtual",EnableTotalRecordCount:!1};a&&(l.ParentId=a),n||(l.Limit=s>=1920?10:s>=1440?8:6,r()&&(l.Limit=20));var d;return"MusicArtist"==o.types?d=ApiClient.getArtists(i,l):(l.IncludeItemTypes=o.types,d=ApiClient.getItems(i,l)),d.then(function(i){var a="";if(i.Items.length){if(a+="<div>",a+='<h1 style="display:inline-block; vertical-align:middle;" class="listHeader">'+Globalize.translate(o.name)+"</h1>",l.Limit&&i.Items.length>=l.Limit){var n="secondaryitems.html?type="+o.types+"&filters=IsFavorite&titlekey="+o.name;a+='<a class="clearLink" href="'+n+'" style="margin-left:2em;"><button is="emby-button" type="button" class="raised more mini">'+Globalize.translate("ButtonMore")+"</button></a>"}a+="</div>",a+=r()?'<div is="emby-itemscontainer" class="itemsContainer hiddenScrollX">':'<div is="emby-itemscontainer" class="itemsContainer vertical-wrap">',a+=t.getCardsHtml(i.Items,{preferThumb:o.preferThumb,shape:o.shape,centerText:o.centerText,overlayText:o.overlayText!==!1,showTitle:o.showTitle,showParentTitle:o.showParentTitle,scalable:!0,overlayPlayButton:o.overlayPlayButton,overlayMoreButton:o.overlayMoreButton,action:o.action}),a+="</div>"}e.innerHTML=a,ImageLoader.lazyChildren(e)})}function l(e,t,r,i){Dashboard.showLoadingMsg();var a=n(),o=getParameterByName("sectionid");o&&(a=a.filter(function(e){return e.id==o})),i&&(a=a.filter(function(e){return-1!=i.indexOf(e.id)}));var l,d,u=e.querySelector(".favoriteSections");if(!u.innerHTML){var c="";for(l=0,d=a.length;d>l;l++)c+='<div class="homePageSection section'+a[l].id+'"></div>';u.innerHTML=c}var m=[];for(l=0,d=a.length;d>l;l++){var v=a[l];u=e.querySelector(".section"+v.id),m.push(s(u,t,r,v,1==a.length))}Promise.all(m).then(function(){Dashboard.hideLoadingMsg()})}return{render:l}});