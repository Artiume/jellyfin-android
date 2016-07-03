define(["jQuery","registrationservices","paper-checkbox","paper-button","emby-input","paper-item-body","paper-icon-item","paper-icon-button-light"],function(e,t){return function(r,i,n){function o(e,t){if(e&&t){var r=e.ListingProviders.filter(function(e){return e.Id==t})[0];return r?Promise.resolve(r):o()}return ApiClient.getJSON(ApiClient.getUrl("LiveTv/ListingProviders/Default"))}function s(){Dashboard.showLoadingMsg(),ApiClient.getNamedConfiguration("livetv").then(function(e){o(e,i).then(function(t){r.querySelector(".txtPath").value=t.Path||"",r.querySelector(".txtKids").value=(t.KidsCategories||[]).join("|"),r.querySelector(".txtNews").value=(t.NewsCategories||[]).join("|"),r.querySelector(".txtSports").value=(t.SportsCategories||[]).join("|"),r.querySelector(".txtMovies").value=(t.MovieCategories||[]).join("|"),r.querySelector(".chkAllTuners").checked=t.EnableAllTuners,r.querySelector(".chkAllTuners").checked?r.querySelector(".selectTunersSection").classList.add("hide"):r.querySelector(".selectTunersSection").classList.remove("hide"),u(r,t,e.TunerHosts),Dashboard.hideLoadingMsg()})})}function a(e){var t=e.value;return t?t.split("|"):[]}function c(){Dashboard.showLoadingMsg();var t=i;ApiClient.getNamedConfiguration("livetv").then(function(i){var o=i.ListingProviders.filter(function(e){return e.Id==t})[0]||{};o.Type="xmltv",o.Path=r.querySelector(".txtPath").value,o.MovieCategories=a(r.querySelector(".txtMovies")),o.KidsCategories=a(r.querySelector(".txtKids")),o.NewsCategories=a(r.querySelector(".txtNews")),o.SportsCategories=a(r.querySelector(".txtSports")),o.EnableAllTuners=r.querySelector(".chkAllTuners").checked,o.EnabledTuners=o.EnableAllTuners?[]:e(".chkTuner",r).get().filter(function(e){return e.checked}).map(function(e){return e.getAttribute("data-id")}),ApiClient.ajax({type:"POST",url:ApiClient.getUrl("LiveTv/ListingProviders",{ValidateListings:!0}),data:JSON.stringify(o),contentType:"application/json"}).then(function(){Dashboard.hideLoadingMsg(),n.showConfirmation!==!1&&Dashboard.processServerConfigurationUpdateResult(),Events.trigger(h,"submitted")},function(){Dashboard.hideLoadingMsg(),Dashboard.alert({message:Globalize.translate("ErrorAddingListingsToSchedulesDirect")})})})}function l(e){switch(e=e.toLowerCase()){case"m3u":return"M3U Playlist";case"hdhomerun":return"HDHomerun";case"satip":return"DVB";default:return"Unknown"}}function u(e,t,r){for(var i="",n=0,o=r.length;o>n;n++){var s=r[n];i+="<paper-icon-item>";var a=t.EnableAllTuners||[],c=t.EnableAllTuners||-1!=a.indexOf(s.Id),u=c?" checked":"";i+='<paper-checkbox data-id="'+s.Id+'" class="chkTuner" item-icon '+u+"></paper-checkbox>",i+="<paper-item-body two-line>",i+="<div>",i+=s.FriendlyName||l(s.Type),i+="</div>",i+="<div secondary>",i+=s.Url,i+="</div>",i+="</paper-item-body>",i+="</paper-icon-item>"}e.querySelector(".tunerList").innerHTML=i}function d(t){var r=e(t.target).parents(".xmltvForm")[0];require(["directorybrowser"],function(e){var t=new e;t.show({includeFiles:!0,callback:function(e){if(e){var i=r.querySelector(".txtPath");i.value=e,i.focus()}t.close()}})})}var h=this;h.submit=function(){r.querySelector(".btnSubmitListingsContainer").click()},h.init=function(){n=n||{},n.showCancelButton!==!1?r.querySelector(".btnCancel").classList.remove("hide"):r.querySelector(".btnCancel").classList.add("hide"),n.showSubmitButton!==!1?r.querySelector(".btnSubmitListings").classList.remove("hide"):r.querySelector(".btnSubmitListings").classList.add("hide"),r.querySelector(".premiereHelp").innerHTML=Globalize.translate("XmlTvPremiere",24),e("form",r).on("submit",function(){return c(),!1}),r.querySelector("#btnSelectPath").addEventListener("click",d),r.querySelector(".lnkPremiere").addEventListener("click",function(e){t.showPremiereInfo(),e.preventDefault()}),r.querySelector(".chkAllTuners").addEventListener("change",function(e){e.target.checked?r.querySelector(".selectTunersSection").classList.add("hide"):r.querySelector(".selectTunersSection").classList.remove("hide")}),s()}}});