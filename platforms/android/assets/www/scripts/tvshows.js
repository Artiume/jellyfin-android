define(["events","libraryBrowser","imageLoader","alphaPicker","listView","cardBuilder","emby-itemscontainer"],function(e,t,a,r,n,i){return function(e,o,l){function s(e){var a=d(e),r=h[a];return r||(r=h[a]={query:{SortBy:"SortName",SortOrder:"Ascending",IncludeItemTypes:"Series",Recursive:!0,Fields:"PrimaryImageAspectRatio,SortName,BasicSyncInfo",ImageTypeLimit:1,EnableImageTypes:"Primary,Backdrop,Banner,Thumb",StartIndex:0,Limit:g},view:t.getSavedView(a)||"Poster"},r.query.ParentId=o.topParentId,t.loadSavedQueryValues(a,r.query)),r}function u(e){return s(e).query}function d(e){return e.savedQueryKey||(e.savedQueryKey=t.getSavedQueryKey("series")),e.savedQueryKey}function c(){var e=S.getCurrentViewStyle(),t=l.querySelector(".itemsContainer");"List"==e?(t.classList.add("vertical-list"),t.classList.remove("vertical-wrap")):(t.classList.remove("vertical-list"),t.classList.add("vertical-wrap")),t.innerHTML=""}function m(e){Dashboard.showLoadingMsg();var r=u(e);ApiClient.getItems(Dashboard.getCurrentUserId(),r).then(function(o){function s(){r.StartIndex+=r.Limit,m(l)}function u(){r.StartIndex-=r.Limit,m(l)}window.scrollTo(0,0),y(e);var c,v=LibraryBrowser.getQueryPagingHtml({startIndex:r.StartIndex,limit:r.Limit,totalRecordCount:o.TotalRecordCount,showLimit:!1,updatePageSizeSetting:!1,addLayoutButton:!1,sortButton:!1,filterButton:!1}),g=S.getCurrentViewStyle();c="Thumb"==g?i.getCardsHtml({items:o.Items,shape:"backdrop",preferThumb:!0,context:"tv",lazy:!0,overlayPlayButton:!0}):"ThumbCard"==g?i.getCardsHtml({items:o.Items,shape:"backdrop",preferThumb:!0,context:"tv",lazy:!0,cardLayout:!0,showTitle:!0,showSeriesYear:!0}):"Banner"==g?i.getCardsHtml({items:o.Items,shape:"banner",preferBanner:!0,context:"tv",lazy:!0}):"List"==g?n.getListViewHtml({items:o.Items,context:"tv",sortBy:r.SortBy}):i.getCardsHtml("PosterCard"==g?{items:o.Items,shape:"portrait",context:"tv",showTitle:!0,showYear:!0,lazy:!0,cardLayout:!0}:{items:o.Items,shape:"portrait",context:"tv",centerText:!0,lazy:!0,overlayPlayButton:!0});var h,f,p=l.querySelectorAll(".paging");for(h=0,f=p.length;f>h;h++)p[h].innerHTML=v;for(p=l.querySelectorAll(".btnNextPage"),h=0,f=p.length;f>h;h++)p[h].addEventListener("click",s);for(p=l.querySelectorAll(".btnPreviousPage"),h=0,f=p.length;f>h;h++)p[h].addEventListener("click",u);var b=l.querySelector(".itemsContainer");b.innerHTML=c,a.lazyChildren(b),t.saveQueryValues(d(e),r),Dashboard.hideLoadingMsg()})}function y(e){var t=u(e);S.alphaPicker.value(t.NameStartsWithOrGreater)}function v(e){var a=e.querySelector(".alphaPicker");a.addEventListener("alphavaluechanged",function(t){var a=t.detail.value,r=u(e);r.NameStartsWithOrGreater=a,r.StartIndex=0,m(e)}),S.alphaPicker=new r({element:a,valueChangeEvent:"click"}),e.querySelector(".btnFilter").addEventListener("click",function(){S.showFilterMenu()}),e.querySelector(".btnSort").addEventListener("click",function(a){t.showSortMenu({items:[{name:Globalize.translate("OptionNameSort"),id:"SortName"},{name:Globalize.translate("OptionImdbRating"),id:"CommunityRating,SortName"},{name:Globalize.translate("OptionDateAdded"),id:"DateCreated,SortName"},{name:Globalize.translate("OptionDatePlayed"),id:"DatePlayed,SortName"},{name:Globalize.translate("OptionMetascore"),id:"Metascore,SortName"},{name:Globalize.translate("OptionParentalRating"),id:"OfficialRating,SortName"},{name:Globalize.translate("OptionPlayCount"),id:"PlayCount,SortName"},{name:Globalize.translate("OptionReleaseDate"),id:"PremiereDate,SortName"}],callback:function(){u(e).StartIndex=0,m(e)},query:u(e),button:a.target})});var n=e.querySelector(".btnSelectView");n.addEventListener("click",function(e){t.showLayoutMenu(e.target,S.getCurrentViewStyle(),"Banner,List,Poster,PosterCard,Thumb,ThumbCard".split(","))}),n.addEventListener("layoutchange",function(a){var r=a.detail.viewStyle;s(e).view=r,t.saveViewSetting(d(e),r),u(e).StartIndex=0,c(),m(e)})}var S=this,g=t.getDefaultPageSize(),h={};S.showFilterMenu=function(){require(["components/filterdialog/filterdialog"],function(e){var t=new e({query:u(l),mode:"series"});Events.on(t,"filterchange",function(){u(l).StartIndex=0,m(l)}),t.show()})},S.getCurrentViewStyle=function(){return s(l).view},v(l),c(),S.renderTab=function(){m(l),y(l)},S.destroy=function(){}}});