﻿(function(){function loadSuggestions(page){var options={SortBy:"IsFavoriteOrLiked,Random",IncludeItemTypes:"Movie,Series,MusicArtist",Limit:20,Recursive:true,ImageTypeLimit:0,EnableImages:false};ApiClient.getItems(Dashboard.getCurrentUserId(),options).done(function(result){var html=result.Items.map(function(i){var href=LibraryBrowser.getHref(i);var itemHtml='<p><a href="'+href+'">';itemHtml+=i.Name;itemHtml+='</a></p>';return itemHtml;}).join('');page.querySelector('.searchSuggestions').innerHTML=html;});}
pageIdOn('pageshow',"searchPage",function(){var page=this;loadSuggestions(page);Search.showSearchPanel();});})();