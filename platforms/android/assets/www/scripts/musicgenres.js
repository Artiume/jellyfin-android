define([],function(){return function(e,r,t){function n(){var e=i(),t=c[e];return t||(t=c[e]={query:{SortBy:"SortName",SortOrder:"Ascending",IncludeItemTypes:"Audio,MusicAlbum",Recursive:!0,Fields:"DateCreated,SyncInfo,ItemCounts",StartIndex:0},view:LibraryBrowser.getSavedView(e)||LibraryBrowser.getDefaultItemsView("Thumb","Thumb")},t.query.ParentId=r.topParentId,LibraryBrowser.loadSavedQueryValues(e,t.query)),t}function o(){return n().query}function i(){return LibraryBrowser.getSavedQueryKey("genres")}function a(){Dashboard.showLoadingMsg();var e=o();return ApiClient.getGenres(Dashboard.getCurrentUserId(),e)}function s(e,r){var t=o();r.then(function(r){var n="",o=y.getCurrentViewStyle();"Thumb"==o?n=LibraryBrowser.getPosterViewHtml({items:r.Items,shape:"backdrop",preferThumb:!0,context:"music",showItemCounts:!0,centerText:!0,lazy:!0,overlayMoreButton:!0}):"ThumbCard"==o?n=LibraryBrowser.getPosterViewHtml({items:r.Items,shape:"backdrop",preferThumb:!0,context:"music",showItemCounts:!0,cardLayout:!0,showTitle:!0,lazy:!0}):"PosterCard"==o?n=LibraryBrowser.getPosterViewHtml({items:r.Items,shape:"portrait",context:"music",showItemCounts:!0,lazy:!0,cardLayout:!0,showTitle:!0}):"Poster"==o&&(n=LibraryBrowser.getPosterViewHtml({items:r.Items,shape:"portrait",context:"music",centerText:!0,showItemCounts:!0,lazy:!0,overlayMoreButton:!0}));var a=e.querySelector("#items");a.innerHTML=n,ImageLoader.lazyChildren(a),LibraryBrowser.saveQueryValues(i(),t),Dashboard.hideLoadingMsg()})}function u(){y.preRender(),y.renderTab()}var y=this,c={};y.getViewStyles=function(){return"Poster,PosterCard,Thumb,ThumbCard".split(",")},y.getCurrentViewStyle=function(){return n(t).view},y.setCurrentViewStyle=function(e){n(t).view=e,LibraryBrowser.saveViewSetting(i(t),e),u()},y.enableViewSelection=!0;var d;y.preRender=function(){d=a()},y.renderTab=function(){s(t,d)};var l=t.querySelector(".btnSelectView");l.addEventListener("click",function(e){LibraryBrowser.showLayoutMenu(e.target,y.getCurrentViewStyle(),y.getViewStyles())}),l.addEventListener("layoutchange",function(e){y.setCurrentViewStyle(e.detail.viewStyle)})}});