define(["shell","dialogHelper","loading","layoutManager","connectionManager","scrollHelper","embyRouter","globalize","paper-checkbox","paper-input","paper-icon-button-light","emby-select","html!./../icons/nav.html","css!./../formdialog"],function(e,t,l,n,r,i,a,o){function s(e,t){for(;!e.classList||!e.classList.contains(t);)if(e=e.parentNode,!e)return null;return e}function d(e){l.show();var t=s(this,"dialog"),n=t.querySelector("#selectPlaylistToAddTo").value,i=r.getApiClient(S);return n?(b=n,v(i,t,n)):c(i,t),e.preventDefault(),!1}function c(e,n){var r=e.getUrl("Playlists",{Name:n.querySelector("#txtNewPlaylistName").value,Ids:n.querySelector(".fldSelectedItemIds").value||"",userId:e.getCurrentUserId()});e.ajax({type:"POST",url:r,dataType:"json"}).then(function(r){l.hide();var i=r.Id;t.close(n),u(e,i)})}function u(e,t){e.getItem(e.getCurrentUserId(),t).then(function(e){a.showItem(e)})}function v(e,n,r){var i=e.getUrl("Playlists/"+r+"/Items",{Ids:n.querySelector(".fldSelectedItemIds").value||"",userId:e.getCurrentUserId()});e.ajax({type:"POST",url:i}).then(function(){l.hide(),t.close(n),require(["toast"],function(e){e(o.translate("sharedcomponents#MessageItemsAdded"))})})}function m(e){e.dispatchEvent(new CustomEvent("change",{}))}function y(e){var t=e.querySelector("#selectPlaylistToAddTo");l.hide(),e.querySelector(".newPlaylistInfo").classList.add("hide");var n={Recursive:!0,IncludeItemTypes:"Playlist",SortBy:"SortName"},i=r.getApiClient(S);i.getItems(i.getCurrentUserId(),n).then(function(e){var n="";n+='<option value="">'+o.translate("sharedcomponents#OptionNew")+"</option>",n+=e.Items.map(function(e){return'<option value="'+e.Id+'">'+e.Name+"</option>"}),t.innerHTML=n,t.value=b||"",m(t),l.hide()})}function p(){var e="";return e+='<div class="dialogContent smoothScrollY">',e+='<div class="dialogContentInner centeredContent">',e+='<form style="margin:auto;">',e+='<div class="fldSelectPlaylist">',e+='<select is="emby-select" id="selectPlaylistToAddTo" label="'+o.translate("sharedcomponents#LabelPlaylist")+'" autofocus></select>',e+="</div>",e+='<div class="newPlaylistInfo">',e+="<div>",e+='<paper-input type="text" id="txtNewPlaylistName" required="required" label="'+o.translate("sharedcomponents#LabelName")+'"></paper-input>',e+="</div>",e+="<br />",e+="</div>",e+="<br />",e+="<div>",e+='<paper-button raised class="btnSubmit block">'+o.translate("sharedcomponents#ButtonOk")+"</paper-button>",e+="</div>",e+='<input type="hidden" class="fldSelectedItemIds" />',e+="</form>",e+="</div>",e+="</div>"}function f(e,t){if(e.querySelector("#selectPlaylistToAddTo").addEventListener("change",function(){this.value?(e.querySelector(".newPlaylistInfo").classList.add("hide"),e.querySelector("#txtNewPlaylistName").removeAttribute("required")):(e.querySelector(".newPlaylistInfo").classList.remove("hide"),e.querySelector("#txtNewPlaylistName").setAttribute("required","required"))}),y(e),e.querySelector(".btnSubmit").addEventListener("click",function(){var t=document.createElement("input");t.setAttribute("type","submit"),t.style.display="none";var l=e.querySelector("form");l.appendChild(t),t.click(),setTimeout(function(){l.removeChild(t)},500)}),e.querySelector("form").addEventListener("submit",d),e.querySelector(".fldSelectedItemIds",e).value=t.join(","),t.length)e.querySelector(".fldSelectPlaylist").classList.remove("hide"),y(e);else{e.querySelector(".fldSelectPlaylist").classList.add("hide");var l=e.querySelector("#selectPlaylistToAddTo");l.innerHTML="",l.value="",m(l)}}function h(){var e=this;e.show=function(e){var l=e.items||{};S=e.serverId;var r={removeOnClose:!0,scrollY:!1};r.size=n.tv?"fullscreen":"small";var a=t.createDialog(r);a.classList.add("formDialog");var s="",d=o.translate("sharedcomponents#AddToPlaylist");return s+='<div class="dialogHeader" style="margin:0 0 2em;">',s+='<button is="paper-icon-button-light" class="btnCancel" tabindex="-1"><iron-icon icon="nav:arrow-back"></iron-icon></button>',s+='<div class="dialogHeaderTitle">',s+=d,s+="</div>",s+="</div>",s+=p(),a.innerHTML=s,document.body.appendChild(a),f(a,l),a.querySelector(".btnCancel").addEventListener("click",function(){t.close(a)}),n.tv&&i.centerFocus.on(a.querySelector(".dialogContent"),!1),new Promise(function(e){a.addEventListener("close",e),t.open(a)})}}var S,b="";return h});