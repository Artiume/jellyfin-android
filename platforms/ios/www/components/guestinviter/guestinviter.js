define(["dialogHelper","jQuery","emby-input","emby-button","emby-collapse","paper-checkbox","paper-icon-button-light"],function(e,t){function n(e,t){var n="";n+='<div class="paperCheckboxList">',n+=t.Items.map(function(e){var t="",n=!0,a=n?' checked="checked"':"";return t+='<paper-checkbox class="chkShareFolder" data-folderid="'+e.Id+'" type="checkbox"'+a+">"+e.Name+"</paper-checkbox>"}).join(""),n+="</div>",e.querySelector(".librarySharingList").innerHTML=n}function a(n){Dashboard.showLoadingMsg(),ApiClient.getJSON(ApiClient.getUrl("Channels",{})).then(function(){var a=t(".chkShareFolder",n).get().filter(function(e){return e.checked}).map(function(e){return e.getAttribute("data-folderid")});ApiClient.ajax({type:"POST",url:ApiClient.getUrl("Connect/Invite"),dataType:"json",data:{ConnectUsername:n.querySelector("#txtConnectUsername").value,EnabledLibraries:a.join(","),SendingUserId:Dashboard.getCurrentUserId(),EnableLiveTv:!1}}).then(function(t){n.submitted=!0,e.close(n),Dashboard.hideLoadingMsg(),i(n,t)},function(e){Dashboard.hideLoadingMsg(),e.status?404==e.status?require(["alert"],function(e){e({text:Globalize.translate("GuestUserNotFound")})}):r():require(["alert"],function(e){e({text:Globalize.translate("DefaultErrorMessage")})})})})}function r(){var e=Globalize.translate("ErrorAddingGuestAccount1",'<a href="https://emby.media/connect" target="_blank">https://emby.media/connect</a>');e+="<br/><br/>"+Globalize.translate("ErrorAddingGuestAccount2","apps@emby.media");var t=Globalize.translate("ErrorAddingGuestAccount1","https://emby.media/connect");t+="\n\n"+Globalize.translate("ErrorAddingGuestAccount2","apps@emby.media"),require(["alert"],function(n){n({text:t,html:e})})}function i(e,t){if(t.IsNewUserInvitation||t.IsPending){var n=t.IsNewUserInvitation?Globalize.translate("MessageInvitationSentToNewUser",t.GuestDisplayName):Globalize.translate("MessageInvitationSentToUser",t.GuestDisplayName);require(["alert"],function(e){e({text:n,title:Globalize.translate("HeaderInvitationSent")})})}}return{show:function(){return new Promise(function(t,r){var i=new XMLHttpRequest;i.open("GET","components/guestinviter/guestinviter.template.html",!0),i.onload=function(){var i=this.response,o=e.createDialog({removeOnClose:!0,size:"small"});o.classList.add("ui-body-a"),o.classList.add("background-theme-a"),o.classList.add("formDialog");var s="";s+=Globalize.translateDocument(i),o.innerHTML=s,document.body.appendChild(o),e.open(o),o.addEventListener("close",function(){o.submitted?t():r()}),o.querySelector(".btnCancel").addEventListener("click",function(){e.close(o)}),o.querySelector("form").addEventListener("submit",function(e){return a(o),e.preventDefault(),!1}),ApiClient.getJSON(ApiClient.getUrl("Library/MediaFolders",{IsHidden:!1})).then(function(e){n(o,e)})},i.send()})}}});