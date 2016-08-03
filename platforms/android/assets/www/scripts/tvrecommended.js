define(["libraryBrowser","components/categorysyncbuttons","cardBuilder","scrollStyles","emby-itemscontainer"],function(e,t,a){return function(r,n){function s(){Dashboard.showLoadingMsg(),c(),i()}function i(){var e={Limit:24,Fields:"PrimaryImageAspectRatio,SeriesInfo,DateCreated,BasicSyncInfo",UserId:Dashboard.getCurrentUserId(),ImageTypeLimit:1,EnableImageTypes:"Primary,Backdrop,Thumb"};e.ParentId=LibraryMenu.getTopParentId(),ApiClient.getNextUpEpisodes(e).then(function(e){e.Items.length?r.querySelector(".noNextUpItems").classList.add("hide"):r.querySelector(".noNextUpItems").classList.remove("hide");var t=r.querySelector("#nextUpItems");a.buildCards(e.Items,{itemsContainer:t,preferThumb:!0,shape:"backdrop",scalable:!0,showTitle:!0,showParentTitle:!0,overlayText:!1,centerText:!0,overlayPlayButton:AppInfo.enableAppLayouts}),Dashboard.hideLoadingMsg()})}function o(){return browserInfo.mobile&&AppInfo.enableAppLayouts}function l(){return o()?"overflowBackdrop":"backdrop"}function c(){var e=LibraryMenu.getTopParentId(),t=6,n={SortBy:"DatePlayed",SortOrder:"Descending",IncludeItemTypes:"Episode",Filters:"IsResumable",Limit:t,Recursive:!0,Fields:"PrimaryImageAspectRatio,SeriesInfo,UserData,BasicSyncInfo",ExcludeLocationTypes:"Virtual",ParentId:e,ImageTypeLimit:1,EnableImageTypes:"Primary,Backdrop,Thumb",EnableTotalRecordCount:!1};ApiClient.getItems(Dashboard.getCurrentUserId(),n).then(function(e){e.Items.length?r.querySelector("#resumableSection").classList.remove("hide"):r.querySelector("#resumableSection").classList.add("hide");var t=r.querySelector("#resumableItems");a.buildCards(e.Items,{itemsContainer:t,preferThumb:!0,shape:l(),scalable:!0,showTitle:!0,showParentTitle:!0,overlayText:!1,centerText:!0,overlayPlayButton:!0})})}function d(e,t,a){var s=[];switch(t){case 0:break;case 1:s.push("scripts/tvlatest");break;case 2:s.push("scripts/tvupcoming");break;case 3:s.push("scripts/tvshows");break;case 4:s.push("scripts/episodes");break;case 5:s.push("scripts/tvgenres");break;case 6:s.push("scripts/tvstudios")}require(s,function(e){var s;0==t&&(s=r.querySelector(".pageTabContent[data-index='"+t+"']"),y.tabContent=s);var i=h[t];i||(s=r.querySelector(".pageTabContent[data-index='"+t+"']"),i=t?new e(r,n,s):y,h[t]=i,i.initTab&&i.initTab()),a(i)})}function u(e,t){d(e,t,function(e){-1==f.indexOf(t)&&e.preRender&&e.preRender()})}function b(e,t){d(e,t,function(e){-1==f.indexOf(t)&&(f.push(t),e.renderTab())})}function p(t,a){a.NowPlayingItem&&"Video"==a.NowPlayingItem.MediaType&&(f=[],I.dispatchEvent(new CustomEvent("tabchange",{detail:{selectedTabIndex:e.selectedTab(I)}})))}function m(e,t){var a=t;"UserDataChanged"===a.MessageType&&a.Data.UserId==Dashboard.getCurrentUserId()&&(f=[])}var y=this;y.initTab=function(){var e=y.tabContent,a=e.querySelector("#resumableItems");o()?(a.classList.add("hiddenScrollX"),a.classList.remove("vertical-wrap")):(a.classList.remove("hiddenScrollX"),a.classList.add("vertical-wrap")),t.init(e)},y.renderTab=function(){s()};var h=[],f=[],I=r.querySelector(".libraryViewNav"),v="tv.html",T=n.topParentId;T&&(v+="?topParentId="+T),o()?r.querySelector("#resumableItems").classList.add("hiddenScrollX"):r.querySelector("#resumableItems").classList.remove("hiddenScrollX"),e.configurePaperLibraryTabs(r,I,r.querySelectorAll(".pageTabContent"),[0,1,2,4,5,6]),I.addEventListener("beforetabchange",function(e){u(r,parseInt(e.detail.selectedTabIndex))}),I.addEventListener("tabchange",function(e){b(r,parseInt(e.detail.selectedTabIndex))}),r.addEventListener("viewbeforeshow",function(){if(!r.getAttribute("data-title")){var e=n.topParentId;e?ApiClient.getItem(Dashboard.getCurrentUserId(),e).then(function(e){r.setAttribute("data-title",e.Name),LibraryMenu.setTitle(e.Name)}):(r.setAttribute("data-title",Globalize.translate("TabShows")),LibraryMenu.setTitle(Globalize.translate("TabShows")))}Events.on(MediaController,"playbackstop",p),Events.on(ApiClient,"websocketmessage",m)}),r.addEventListener("viewbeforehide",function(){Events.off(MediaController,"playbackstop",p),Events.off(ApiClient,"websocketmessage",m)}),r.addEventListener("viewdestroy",function(){h.forEach(function(e){e.destroy&&e.destroy()})})}});