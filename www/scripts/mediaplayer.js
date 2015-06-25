﻿(function(document,setTimeout,clearTimeout,screen,$,setInterval,window){function mediaPlayer(){var self=this;var currentProgressInterval;var canClientSeek;var currentPlaylistIndex=0;self.currentMediaRenderer=null;self.currentItem=null;self.currentMediaSource=null;self.currentDurationTicks=null;self.startTimeTicksOffset=null;self.playlist=[];self.isLocalPlayer=true;self.isDefaultPlayer=true;self.name='Html5 Player';self.getTargets=function(){var targets=[{name:Globalize.translate('MyDevice'),id:ConnectionManager.deviceId(),playerName:self.name,playableMediaTypes:['Audio','Video'],isLocalPlayer:true,supportedCommands:Dashboard.getSupportedRemoteCommands()}];return targets;};var canPlayAac=document.createElement('audio').canPlayType('audio/aac').replace(/no/,'');self.getVideoQualityOptions=function(videoWidth,videoHeight){var bitrateSetting=AppSettings.maxStreamingBitrate();var maxAllowedWidth=videoWidth||4096;var maxAllowedHeight=videoHeight||2304;var options=[];if(maxAllowedWidth>=1900){options.push({name:'1080p - 30Mbps',maxHeight:1080,bitrate:30000000});options.push({name:'1080p - 25Mbps',maxHeight:1080,bitrate:25000000});options.push({name:'1080p - 20Mbps',maxHeight:1080,bitrate:20000000});options.push({name:'1080p - 15Mbps',maxHeight:1080,bitrate:15000000});options.push({name:'1080p - 10Mbps',maxHeight:1080,bitrate:10000000});options.push({name:'1080p - 8Mbps',maxHeight:1080,bitrate:8000000});options.push({name:'1080p - 6Mbps',maxHeight:1080,bitrate:6000000});options.push({name:'1080p - 5Mbps',maxHeight:1080,bitrate:5000000});}else if(maxAllowedWidth>=1260){options.push({name:'720p - 10Mbps',maxHeight:720,bitrate:10000000});options.push({name:'720p - 8Mbps',maxHeight:720,bitrate:8000000});options.push({name:'720p - 6Mbps',maxHeight:720,bitrate:6000000});options.push({name:'720p - 5Mbps',maxHeight:720,bitrate:5000000});}else if(maxAllowedWidth>=700){options.push({name:'480p - 4Mbps',maxHeight:480,bitrate:4000000});options.push({name:'480p - 3Mbps',maxHeight:480,bitrate:3000000});options.push({name:'480p - 2.5Mbps',maxHeight:480,bitrate:2500000});options.push({name:'480p - 2Mbps',maxHeight:480,bitrate:2000000});options.push({name:'480p - 1.5Mbps',maxHeight:480,bitrate:1500000});}
if(maxAllowedWidth>=1260){options.push({name:'720p - 4Mbps',maxHeight:720,bitrate:4000000});options.push({name:'720p - 3Mbps',maxHeight:720,bitrate:3000000});options.push({name:'720p - 2Mbps',maxHeight:720,bitrate:2000000});options.push({name:'720p - 1.5Mbps',maxHeight:720,bitrate:1500001});options.push({name:'720p - 1Mbps',maxHeight:720,bitrate:1000001});}
options.push({name:'480p - 1.0Mbps',maxHeight:480,bitrate:1000000});options.push({name:'480p - 720kbps',maxHeight:480,bitrate:720000});options.push({name:'480p - 420kbps',maxHeight:480,bitrate:420000});options.push({name:'360p',maxHeight:360,bitrate:400000});options.push({name:'240p',maxHeight:240,bitrate:320000});options.push({name:'144p',maxHeight:144,bitrate:192000});var i,length,option;var selectedIndex=-1;for(i=0,length=options.length;i<length;i++){option=options[i];if(selectedIndex==-1&&option.bitrate<=bitrateSetting){selectedIndex=i;}}
if(selectedIndex==-1){selectedIndex=options.length-1;}
options[selectedIndex].selected=true;return options;};self.getDeviceProfile=function(maxHeight){if(!maxHeight){maxHeight=self.getVideoQualityOptions().filter(function(q){return q.selected;})[0].maxHeight;}
var bitrateSetting=AppSettings.maxStreamingBitrate();var canPlayWebm=self.canPlayWebm();var profile={};profile.MaxStreamingBitrate=bitrateSetting;profile.MaxStaticBitrate=40000000;profile.MusicStreamingTranscodingBitrate=Math.min(bitrateSetting,192000);profile.DirectPlayProfiles=[];profile.DirectPlayProfiles.push({Container:'mp4,m4v',Type:'Video',VideoCodec:'h264',AudioCodec:'aac,mp3'});if($.browser.chrome){profile.DirectPlayProfiles.push({Container:'mkv',Type:'Video',VideoCodec:'h264',AudioCodec:'aac,mp3'});}
profile.DirectPlayProfiles.push({Container:'mp3',Type:'Audio'});if(canPlayAac){profile.DirectPlayProfiles.push({Container:'aac',Type:'Audio'});}
var directPlayAudioContainers=AppInfo.directPlayAudioContainers;if(directPlayAudioContainers&&directPlayAudioContainers.length){profile.DirectPlayProfiles.push({Container:directPlayAudioContainers.join(','),Type:'Audio'});}
if(canPlayWebm){profile.DirectPlayProfiles.push({Container:'webm',Type:'Video'});profile.DirectPlayProfiles.push({Container:'webm,webma',Type:'Audio'});}
profile.TranscodingProfiles=[];if(self.canPlayHls()){profile.TranscodingProfiles.push({Container:'ts',Type:'Video',AudioCodec:'aac',VideoCodec:'h264',Context:'Streaming',Protocol:'hls'});if(canPlayAac&&$.browser.safari){profile.TranscodingProfiles.push({Container:'ts',Type:'Audio',AudioCodec:'aac',Context:'Streaming',Protocol:'hls'});}}
if(canPlayWebm){profile.TranscodingProfiles.push({Container:'webm',Type:'Video',AudioCodec:'vorbis',VideoCodec:'vpx',Context:'Streaming',Protocol:'http'});}
profile.TranscodingProfiles.push({Container:'mp4',Type:'Video',AudioCodec:'aac',VideoCodec:'h264',Context:'Streaming',Protocol:'http'});profile.TranscodingProfiles.push({Container:'mp4',Type:'Video',AudioCodec:'aac',VideoCodec:'h264',Context:'Static',Protocol:'http'});if(canPlayAac&&$.browser.safari){profile.TranscodingProfiles.push({Container:'aac',Type:'Audio',AudioCodec:'aac',Context:'Streaming',Protocol:'http'});profile.TranscodingProfiles.push({Container:'aac',Type:'Audio',AudioCodec:'aac',Context:'Static',Protocol:'http'});}else{profile.TranscodingProfiles.push({Container:'mp3',Type:'Audio',AudioCodec:'mp3',Context:'Streaming',Protocol:'http'});profile.TranscodingProfiles.push({Container:'mp3',Type:'Audio',AudioCodec:'mp3',Context:'Static',Protocol:'http'});}
profile.ContainerProfiles=[];var audioConditions=[];var maxAudioChannels=$.browser.msie||$.browser.safari?'2':'6';audioConditions.push({Condition:'LessThanEqual',Property:'AudioChannels',Value:maxAudioChannels});profile.CodecProfiles=[];profile.CodecProfiles.push({Type:'Audio',Conditions:audioConditions});profile.CodecProfiles.push({Type:'VideoAudio',Codec:'mp3',Conditions:[{Condition:'LessThanEqual',Property:'AudioChannels',Value:maxAudioChannels}]});profile.CodecProfiles.push({Type:'VideoAudio',Codec:'aac',Container:'mkv,mov',Conditions:[{Condition:'NotEquals',Property:'AudioProfile',Value:'HE-AAC'},{Condition:'NotEquals',Property:'AudioProfile',Value:'LC'}]});profile.CodecProfiles.push({Type:'VideoAudio',Codec:'aac',Conditions:[{Condition:'LessThanEqual',Property:'AudioChannels',Value:maxAudioChannels}]});profile.CodecProfiles.push({Type:'Video',Codec:'h264',Conditions:[{Condition:'NotEquals',Property:'IsAnamorphic',Value:'true',IsRequired:false},{Condition:'EqualsAny',Property:'VideoProfile',Value:'high|main|baseline|constrained baseline'},{Condition:'LessThanEqual',Property:'VideoLevel',Value:'41'},{Condition:'LessThanEqual',Property:'Height',Value:maxHeight}]});profile.CodecProfiles.push({Type:'Video',Codec:'vpx',Conditions:[{Condition:'NotEquals',Property:'IsAnamorphic',Value:'true',IsRequired:false},{Condition:'LessThanEqual',Property:'Height',Value:maxHeight}]});profile.SubtitleProfiles=[];if(self.supportsTextTracks()){profile.SubtitleProfiles.push({Format:'vtt',Method:'External'});}
profile.ResponseProfiles=[];profile.ResponseProfiles.push({Type:'Video',Container:'m4v',MimeType:'video/mp4'});profile.ResponseProfiles.push({Type:'Video',Container:'mov',MimeType:'video/webm'});return profile;};var supportsTextTracks;self.supportsTextTracks=function(){if(supportsTextTracks==null){supportsTextTracks=document.createElement('video').textTracks!=null;}
return supportsTextTracks;};self.updateCanClientSeek=function(mediaRenderer){var duration=mediaRenderer.duration();canClientSeek=duration&&!isNaN(duration)&&duration!=Number.POSITIVE_INFINITY&&duration!=Number.NEGATIVE_INFINITY;};self.getCurrentSrc=function(mediaRenderer){return mediaRenderer.currentSrc();};self.getCurrentTicks=function(mediaRenderer){var playerTime=Math.floor(10000*(mediaRenderer||self.currentMediaRenderer).currentTime());playerTime+=self.startTimeTicksOffset;return playerTime;};self.playNextAfterEnded=function(){self.nextTrack();};self.startProgressInterval=function(){clearProgressInterval();var intervalTime=ApiClient.isWebSocketOpen()?1200:5000;self.lastProgressReport=0;currentProgressInterval=setInterval(function(){if(self.currentMediaRenderer){if((new Date().getTime()-self.lastProgressReport)>intervalTime){self.lastProgressReport=new Date().getTime();sendProgressUpdate();}}},250);};self.getCurrentMediaExtension=function(currentSrc){currentSrc=currentSrc.split('?')[0];return currentSrc.substring(currentSrc.lastIndexOf('.'));};self.canPlayNativeHls=function(){var media=document.createElement('video');if(media.canPlayType('application/x-mpegURL').replace(/no/,'')||media.canPlayType('application/vnd.apple.mpegURL').replace(/no/,'')){return true;}
return false;};self.canPlayHls=function(){if(self.canPlayNativeHls()){return true;}
return false;};self.changeStream=function(ticks,params){var mediaRenderer=self.currentMediaRenderer;if(canClientSeek&&params==null){mediaRenderer.currentTime(ticks/10000);return;}
params=params||{};var currentSrc=mediaRenderer.currentSrc();var playSessionId=getParameterByName('PlaySessionId',currentSrc);var liveStreamId=getParameterByName('LiveStreamId',currentSrc);if(params.AudioStreamIndex==null&&params.SubtitleStreamIndex==null&&params.Bitrate==null){currentSrc=replaceQueryString(currentSrc,'starttimeticks',ticks||0);changeStreamToUrl(mediaRenderer,playSessionId,currentSrc,ticks);return;}
var deviceProfile=self.getDeviceProfile();var audioStreamIndex=params.AudioStreamIndex==null?(getParameterByName('AudioStreamIndex',currentSrc)||null):params.AudioStreamIndex;if(typeof(audioStreamIndex)=='string'){audioStreamIndex=parseInt(audioStreamIndex);}
var subtitleStreamIndex=params.SubtitleStreamIndex==null?(getParameterByName('SubtitleStreamIndex',currentSrc)||null):params.SubtitleStreamIndex;if(typeof(subtitleStreamIndex)=='string'){subtitleStreamIndex=parseInt(subtitleStreamIndex);}
MediaController.getPlaybackInfo(self.currentItem.Id,deviceProfile,ticks,self.currentMediaSource,audioStreamIndex,subtitleStreamIndex,liveStreamId).done(function(result){if(validatePlaybackInfoResult(result)){self.currentMediaSource=result.MediaSources[0];self.currentSubtitleStreamIndex=subtitleStreamIndex;currentSrc=ApiClient.getUrl(self.currentMediaSource.TranscodingUrl);changeStreamToUrl(mediaRenderer,playSessionId,currentSrc,ticks);}});};function changeStreamToUrl(mediaRenderer,playSessionId,url,newPositionTicks){clearProgressInterval();$(mediaRenderer).off('ended.playbackstopped').off('ended.playnext').one("play",function(){self.updateCanClientSeek(this);$(this).on('ended.playbackstopped',self.onPlaybackStopped).one('ended.playnext',self.playNextAfterEnded);self.startProgressInterval();sendProgressUpdate();});if(self.currentItem.MediaType=="Video"){ApiClient.stopActiveEncodings(playSessionId).done(function(){self.startTimeTicksOffset=newPositionTicks;mediaRenderer.setCurrentSrc(url,self.currentItem,self.currentMediaSource);});self.updateTextStreamUrls(newPositionTicks||0);}else{self.startTimeTicksOffset=newPositionTicks;mediaRenderer.setCurrentSrc(url,self.currentItem,self.currentMediaSource);}}
self.setCurrentTime=function(ticks,positionSlider,currentTimeElement){ticks=Math.floor(ticks);var timeText=Dashboard.getDisplayTime(ticks);if(self.currentDurationTicks){timeText+=" / "+Dashboard.getDisplayTime(self.currentDurationTicks);if(positionSlider){var percent=ticks/self.currentDurationTicks;percent*=100;positionSlider.val(percent).slider('enable').slider('refresh');}}else{if(positionSlider){positionSlider.slider('disable').slider('refresh');}}
if(currentTimeElement){currentTimeElement.html(timeText);}
var state=self.getPlayerStateInternal(self.currentMediaRenderer,self.currentItem,self.currentMediaSource);$(self).trigger('positionchange',[state]);};self.canQueueMediaType=function(mediaType){return self.currentItem&&self.currentItem.MediaType==mediaType;};function translateItemsForPlayback(items){var deferred=$.Deferred();var firstItem=items[0];var promise;if(firstItem.Type=="Playlist"){promise=self.getItemsForPlayback({ParentId:firstItem.Id,});}
else if(firstItem.Type=="MusicArtist"){promise=self.getItemsForPlayback({ArtistIds:firstItem.Id,Filters:"IsNotFolder",Recursive:true,SortBy:"SortName",MediaTypes:"Audio"});}
else if(firstItem.Type=="MusicGenre"){promise=self.getItemsForPlayback({Genres:firstItem.Name,Filters:"IsNotFolder",Recursive:true,SortBy:"SortName",MediaTypes:"Audio"});}
else if(firstItem.IsFolder){promise=self.getItemsForPlayback({ParentId:firstItem.Id,Filters:"IsNotFolder",Recursive:true,SortBy:"SortName",MediaTypes:"Audio,Video"});}
if(promise){promise.done(function(result){deferred.resolveWith(null,[result.Items]);});}else{deferred.resolveWith(null,[items]);}
return deferred.promise();}
self.play=function(options){Dashboard.getCurrentUser().done(function(user){if(options.items){translateItemsForPlayback(options.items).done(function(items){self.playWithIntros(items,options,user);});}else{self.getItemsForPlayback({Ids:options.ids.join(',')}).done(function(result){translateItemsForPlayback(result.Items).done(function(items){self.playWithIntros(items,options,user);});});}});};self.playWithIntros=function(items,options,user){var firstItem=items[0];if(options.startPositionTicks||firstItem.MediaType!=='Video'||!self.canAutoPlayVideo()){self.playInternal(firstItem,options.startPositionTicks,function(){self.setPlaylistState(0,items);});return;}
ApiClient.getJSON(ApiClient.getUrl('Users/'+user.Id+'/Items/'+firstItem.Id+'/Intros')).done(function(intros){items=intros.Items.concat(items);self.playInternal(items[0],options.startPositionTicks,function(){self.setPlaylistState(0,items);});});};function getOptimalMediaSource(mediaType,versions){var optimalVersion=versions.filter(function(v){v.enableDirectPlay=MediaController.supportsDirectPlay(v);return v.enableDirectPlay;})[0];if(!optimalVersion){optimalVersion=versions.filter(function(v){return v.SupportsDirectStream;})[0];}
return optimalVersion||versions.filter(function(s){return s.SupportsTranscoding;})[0];}
self.createStreamInfo=function(type,item,mediaSource,startPosition){var mediaUrl;var contentType;var startTimeTicksOffset=0;var startPositionInSeekParam=startPosition?(startPosition/10000000):0;var seekParam=startPositionInSeekParam?'#t='+startPositionInSeekParam:'';var playMethod='Transcode';if(type=='Video'){contentType='video/'+mediaSource.Container;if(mediaSource.enableDirectPlay){mediaUrl=FileSystemBridge.translateFilePath(mediaSource.Path);playMethod='DirectPlay';}else{if(mediaSource.SupportsDirectStream){mediaUrl=ApiClient.getUrl('Videos/'+item.Id+'/stream.'+mediaSource.Container,{Static:true,mediaSourceId:mediaSource.Id,api_key:ApiClient.accessToken()});mediaUrl+=seekParam;playMethod='DirectStream';}else{startTimeTicksOffset=startPosition||0;mediaUrl=ApiClient.getUrl(mediaSource.TranscodingUrl);if(mediaSource.TranscodingSubProtocol=='hls'){mediaUrl+=seekParam;contentType='application/x-mpegURL';}else{contentType='video/'+mediaSource.TranscodingContainer;}}}}else{contentType='audio/'+mediaSource.Container;if(mediaSource.enableDirectPlay){mediaUrl=FileSystemBridge.translateFilePath(mediaSource.Path);playMethod='DirectPlay';}else{var isDirectStream=mediaSource.SupportsDirectStream;if(isDirectStream){var outputContainer=(mediaSource.Container||'').toLowerCase();mediaUrl=ApiClient.getUrl('Audio/'+item.Id+'/stream.'+outputContainer,{mediaSourceId:mediaSource.Id,deviceId:ApiClient.deviceId(),api_key:ApiClient.accessToken()});mediaUrl+="&static=true"+seekParam;playMethod='DirectStream';}else{contentType='audio/'+mediaSource.TranscodingContainer;mediaUrl=ApiClient.getUrl(mediaSource.TranscodingUrl);}
startTimeTicksOffset=startPosition||0;}}
return{url:mediaUrl,mimeType:contentType,startTimeTicksOffset:startTimeTicksOffset,startPositionInSeekParam:startPositionInSeekParam,playMethod:playMethod};};self.playInternal=function(item,startPosition,callback){if(item==null){throw new Error("item cannot be null");}
if(self.isPlaying()){self.stop();}
if(item.MediaType!=='Audio'&&item.MediaType!=='Video'){throw new Error("Unrecognized media type");}
if(item.IsPlaceHolder){MediaController.showPlaybackInfoErrorMessage('PlaceHolder');return;}
var deviceProfile=self.getDeviceProfile();if(item.MediaType==="Video"){Dashboard.showModalLoadingMsg();}
MediaController.getPlaybackInfo(item.Id,deviceProfile,startPosition).done(function(playbackInfoResult){if(validatePlaybackInfoResult(playbackInfoResult)){var mediaSource=getOptimalMediaSource(item.MediaType,playbackInfoResult.MediaSources);if(mediaSource){if(mediaSource.RequiresOpening){MediaController.getLiveStream(item.Id,playbackInfoResult.PlaySessionId,deviceProfile,startPosition,mediaSource,null,null).done(function(openLiveStreamResult){openLiveStreamResult.MediaSource.enableDirectPlay=MediaController.supportsDirectPlay(openLiveStreamResult.MediaSource);playInternalPostMediaSourceSelection(item,openLiveStreamResult.MediaSource,startPosition,callback);});}else{playInternalPostMediaSourceSelection(item,mediaSource,startPosition,callback);}}else{Dashboard.hideModalLoadingMsg();MediaController.showPlaybackInfoErrorMessage('NoCompatibleStream');}}});};function playInternalPostMediaSourceSelection(item,mediaSource,startPosition,callback){Dashboard.hideModalLoadingMsg();self.currentMediaSource=mediaSource;self.currentItem=item;if(item.MediaType==="Video"){self.playVideo(item,self.currentMediaSource,startPosition);}else if(item.MediaType==="Audio"){playAudio(item,self.currentMediaSource,startPosition);}
if(callback){callback();}}
function validatePlaybackInfoResult(result){if(result.ErrorCode){MediaController.showPlaybackInfoErrorMessage(result.ErrorCode);return false;}
return true;}
self.getPosterUrl=function(item){if($.browser.safari){return null;}
var screenWidth=Math.max(screen.height,screen.width);if(item.BackdropImageTags&&item.BackdropImageTags.length){return ApiClient.getScaledImageUrl(item.Id,{type:"Backdrop",index:0,maxWidth:screenWidth,tag:item.BackdropImageTags[0]});}
else if(item.ParentBackdropItemId&&item.ParentBackdropImageTags&&item.ParentBackdropImageTags.length){return ApiClient.getScaledImageUrl(item.ParentBackdropItemId,{type:'Backdrop',index:0,maxWidth:screenWidth,tag:item.ParentBackdropImageTags[0]});}
return null;};self.displayContent=function(options){Dashboard.onBrowseCommand(options);};self.getItemsForPlayback=function(query){var userId=Dashboard.getCurrentUserId();if(query.Ids&&query.Ids.split(',').length==1){var deferred=DeferredBuilder.Deferred();ApiClient.getItem(userId,query.Ids.split(',')).done(function(item){deferred.resolveWith(null,[{Items:[item],TotalRecordCount:1}]);});return deferred.promise();}
else{query.Limit=query.Limit||100;query.Fields=getItemFields;query.ExcludeLocationTypes="Virtual";return ApiClient.getItems(userId,query);}};self.removeFromPlaylist=function(index){self.playlist.remove(index);};self.currentPlaylistIndex=function(i){if(i==null){return currentPlaylistIndex;}
var newItem=self.playlist[i];self.playInternal(newItem,0,function(){self.setPlaylistState(i);});};self.setPlaylistState=function(i,items){if(!isNaN(i)){currentPlaylistIndex=i;}
if(items){self.playlist=items;}
if(self.updatePlaylistUi){self.updatePlaylistUi();}};self.nextTrack=function(){var newIndex=currentPlaylistIndex+1;var newItem=self.playlist[newIndex];if(newItem){console.log('playing next track');self.playInternal(newItem,0,function(){self.setPlaylistState(newIndex);});}};self.previousTrack=function(){var newIndex=currentPlaylistIndex-1;if(newIndex>=0){var newItem=self.playlist[newIndex];if(newItem){self.playInternal(newItem,0,function(){self.setPlaylistState(newIndex);});}}};self.queueItemsNext=function(items){var insertIndex=1;for(var i=0,length=items.length;i<length;i++){self.playlist.splice(insertIndex,0,items[i]);insertIndex++;}};self.queueItems=function(items){for(var i=0,length=items.length;i<length;i++){self.playlist.push(items[i]);}};self.queue=function(options){if(!self.playlist.length){self.play(options);return;}
Dashboard.getCurrentUser().done(function(user){if(options.items){translateItemsForPlayback(options.items).done(function(items){self.queueItems(items);});}else{self.getItemsForPlayback({Ids:options.ids.join(',')}).done(function(result){translateItemsForPlayback(result.Items).done(function(items){self.queueItems(items);});});}});};self.queueNext=function(options){if(!self.playlist.length){self.play(options);return;}
Dashboard.getCurrentUser().done(function(user){if(options.items){self.queueItemsNext(options.items);}else{self.getItemsForPlayback({Ids:options.ids.join(',')}).done(function(result){options.items=result.Items;self.queueItemsNext(options.items);});}});};self.pause=function(){self.currentMediaRenderer.pause();};self.unpause=function(){self.currentMediaRenderer.unpause();};self.seek=function(position){self.changeStream(position);};self.mute=function(){self.setVolume(0);};self.unMute=function(){self.setVolume(self.getSavedVolume()*100);};self.volume=function(){return self.currentMediaRenderer.volume()*100;};self.toggleMute=function(){if(self.currentMediaRenderer){console.log('MediaPlayer toggling mute');if(self.volume()){self.mute();}else{self.unMute();}}};self.volumeDown=function(){if(self.currentMediaRenderer){self.setVolume(Math.max(self.volume()-2,0));}};self.volumeUp=function(){if(self.currentMediaRenderer){self.setVolume(Math.min(self.volume()+2,100));}};self.setVolume=function(val){if(self.currentMediaRenderer){console.log('MediaPlayer setting volume to '+val);self.currentMediaRenderer.volume(val/100);self.onVolumeChanged(self.currentMediaRenderer);}};self.saveVolume=function(val){if(val){appStorage.setItem("volume",val);}};self.getSavedVolume=function(){return appStorage.getItem("volume")||0.5;};self.shuffle=function(id){var userId=Dashboard.getCurrentUserId();ApiClient.getItem(userId,id).done(function(item){var query={UserId:userId,Fields:getItemFields,Limit:100,Filters:"IsNotFolder",Recursive:true,SortBy:"Random"};if(item.Type=="MusicArtist"){query.MediaTypes="Audio";query.ArtistIds=item.Id;}
else if(item.Type=="MusicGenre"){query.MediaTypes="Audio";query.Genres=item.Name;}
else if(item.IsFolder){query.ParentId=id;}
else{return;}
self.getItemsForPlayback(query).done(function(result){self.play({items:result.Items});});});};self.instantMix=function(id){var userId=Dashboard.getCurrentUserId();ApiClient.getItem(userId,id).done(function(item){var promise;var itemLimit=100;if(item.Type=="MusicArtist"){promise=ApiClient.getInstantMixFromArtist({UserId:Dashboard.getCurrentUserId(),Fields:getItemFields,Limit:itemLimit,Id:id});}
else if(item.Type=="MusicGenre"){promise=ApiClient.getInstantMixFromMusicGenre({UserId:Dashboard.getCurrentUserId(),Fields:getItemFields,Limit:itemLimit,Id:id});}
else if(item.Type=="MusicAlbum"){promise=ApiClient.getInstantMixFromAlbum(id,{UserId:Dashboard.getCurrentUserId(),Fields:getItemFields,Limit:itemLimit});}
else if(item.Type=="Playlist"){promise=ApiClient.getInstantMixFromPlaylist(id,{UserId:Dashboard.getCurrentUserId(),Fields:getItemFields,Limit:itemLimit});}
else if(item.Type=="Audio"){promise=ApiClient.getInstantMixFromSong(id,{UserId:Dashboard.getCurrentUserId(),Fields:getItemFields,Limit:itemLimit});}
else{return;}
promise.done(function(result){self.play({items:result.Items});});});};self.stop=function(){var mediaRenderer=self.currentMediaRenderer;if(mediaRenderer){mediaRenderer.stop();$(mediaRenderer).off("ended.playnext").one("ended",function(){$(this).off();this.destroy();self.currentMediaRenderer=null;self.currentItem=null;self.currentMediaSource=null;}).trigger("ended");}else{self.currentMediaRenderer=null;self.currentItem=null;self.currentMediaSource=null;}
if(self.isFullScreen()){self.exitFullScreen();}
self.resetEnhancements();};self.isPlaying=function(){return self.playlist.length>0;};self.getPlayerState=function(){var deferred=$.Deferred();var result=self.getPlayerStateInternal(self.currentMediaRenderer,self.currentItem,self.currentMediaSource);deferred.resolveWith(null,[result]);return deferred.promise();};self.getPlayerStateInternal=function(mediaRenderer,item,mediaSource){var state={PlayState:{}};if(mediaRenderer){state.PlayState.VolumeLevel=mediaRenderer.volume()*100;state.PlayState.IsMuted=mediaRenderer.volume()==0;state.PlayState.IsPaused=mediaRenderer.paused();state.PlayState.PositionTicks=self.getCurrentTicks(mediaRenderer);var currentSrc=mediaRenderer.currentSrc();if(currentSrc){var audioStreamIndex=getParameterByName('AudioStreamIndex',currentSrc);if(audioStreamIndex){state.PlayState.AudioStreamIndex=parseInt(audioStreamIndex);}
state.PlayState.SubtitleStreamIndex=self.currentSubtitleStreamIndex;state.PlayState.PlayMethod=getParameterByName('static',currentSrc)=='true'?'DirectStream':'Transcode';state.PlayState.LiveStreamId=getParameterByName('LiveStreamId',currentSrc);state.PlayState.PlaySessionId=getParameterByName('PlaySessionId',currentSrc);}}
if(mediaSource){state.PlayState.MediaSourceId=mediaSource.Id;state.NowPlayingItem={RunTimeTicks:mediaSource.RunTimeTicks};state.PlayState.CanSeek=mediaSource.RunTimeTicks&&mediaSource.RunTimeTicks>0;}
if(item){state.NowPlayingItem=self.getNowPlayingItemForReporting(item,mediaSource);}
return state;};self.getNowPlayingItemForReporting=function(item,mediaSource){var nowPlayingItem={};nowPlayingItem.RunTimeTicks=mediaSource.RunTimeTicks;nowPlayingItem.Id=item.Id;nowPlayingItem.MediaType=item.MediaType;nowPlayingItem.Type=item.Type;nowPlayingItem.Name=item.Name;nowPlayingItem.IndexNumber=item.IndexNumber;nowPlayingItem.IndexNumberEnd=item.IndexNumberEnd;nowPlayingItem.ParentIndexNumber=item.ParentIndexNumber;nowPlayingItem.ProductionYear=item.ProductionYear;nowPlayingItem.PremiereDate=item.PremiereDate;nowPlayingItem.SeriesName=item.SeriesName;nowPlayingItem.Album=item.Album;nowPlayingItem.Artists=item.Artists;var imageTags=item.ImageTags||{};if(item.SeriesPrimaryImageTag){nowPlayingItem.PrimaryImageItemId=item.SeriesId;nowPlayingItem.PrimaryImageTag=item.SeriesPrimaryImageTag;}
else if(imageTags.Primary){nowPlayingItem.PrimaryImageItemId=item.Id;nowPlayingItem.PrimaryImageTag=imageTags.Primary;}
else if(item.AlbumPrimaryImageTag){nowPlayingItem.PrimaryImageItemId=item.AlbumId;nowPlayingItem.PrimaryImageTag=item.AlbumPrimaryImageTag;}
else if(item.SeriesPrimaryImageTag){nowPlayingItem.PrimaryImageItemId=item.SeriesId;nowPlayingItem.PrimaryImageTag=item.SeriesPrimaryImageTag;}
if(item.BackdropImageTags&&item.BackdropImageTags.length){nowPlayingItem.BackdropItemId=item.Id;nowPlayingItem.BackdropImageTag=item.BackdropImageTags[0];}
else if(item.ParentBackdropImageTags&&item.ParentBackdropImageTags.length){nowPlayingItem.BackdropItemId=item.ParentBackdropItemId;nowPlayingItem.BackdropImageTag=item.ParentBackdropImageTags[0];}
if(imageTags.Thumb){nowPlayingItem.ThumbItemId=item.Id;nowPlayingItem.ThumbImageTag=imageTags.Thumb;}
if(imageTags.Logo){nowPlayingItem.LogoItemId=item.Id;nowPlayingItem.LogoImageTag=imageTags.Logo;}
else if(item.ParentLogoImageTag){nowPlayingItem.LogoItemId=item.ParentLogoItemId;nowPlayingItem.LogoImageTag=item.ParentLogoImageTag;}
return nowPlayingItem;};self.beginPlayerUpdates=function(){};self.endPlayerUpdates=function(){};self.onPlaybackStart=function(mediaRenderer,item,mediaSource){self.updateCanClientSeek(mediaRenderer);var state=self.getPlayerStateInternal(mediaRenderer,item,mediaSource);$(self).trigger('playbackstart',[state]);self.startProgressInterval();};self.onVolumeChanged=function(mediaRenderer){self.saveVolume(mediaRenderer.volume());var state=self.getPlayerStateInternal(mediaRenderer,self.currentItem,self.currentMediaSource);$(self).trigger('volumechange',[state]);};self.cleanup=function(){};self.onPlaybackStopped=function(){console.log('playback stopped');$('body').removeClass('bodyWithPopupOpen');var mediaRenderer=this;$(mediaRenderer).off('.mediaplayerevent').off('ended.playbackstopped');self.cleanup(mediaRenderer);clearProgressInterval();var item=self.currentItem;var mediaSource=self.currentMediaSource;if(item.MediaType=="Video"){if(self.isFullScreen()){self.exitFullScreen();}
self.resetEnhancements();}
var state=self.getPlayerStateInternal(mediaRenderer,item,mediaSource);$(self).trigger('playbackstop',[state]);};self.onPlaystateChange=function(mediaRenderer){var state=self.getPlayerStateInternal(mediaRenderer,self.currentItem,self.currentMediaSource);$(self).trigger('playstatechange',[state]);};$(window).on("beforeunload",function(){if(self.currentItem&&self.currentMediaRenderer&&currentProgressInterval){self.onPlaybackStopped.call(self.currentMediaRenderer);}});function sendProgressUpdate(){var state=self.getPlayerStateInternal(self.currentMediaRenderer,self.currentItem,self.currentMediaSource);var info={QueueableMediaTypes:state.NowPlayingItem.MediaType,ItemId:state.NowPlayingItem.Id,NowPlayingItem:state.NowPlayingItem};info=$.extend(info,state.PlayState);ApiClient.reportPlaybackProgress(info);}
function clearProgressInterval(){if(currentProgressInterval){clearTimeout(currentProgressInterval);currentProgressInterval=null;}}
self._canPlayWebm=null;self.canPlayWebm=function(){if(self._canPlayWebm==null){self._canPlayWebm=document.createElement('video').canPlayType('video/webm').replace(/no/,'');}
return self._canPlayWebm;};self.canAutoPlayAudio=function(){if(AppInfo.isNativeApp){return true;}
if($.browser.mobile){return false;}
return true;};function getAudioRenderer(){return new AudioRenderer('audio');}
function onTimeUpdate(){var currentTicks=self.getCurrentTicks(this);self.setCurrentTime(currentTicks);}
function playAudio(item,mediaSource,startPositionTicks){requirejs(['audiorenderer'],function(){playAudioInternal(item,mediaSource,startPositionTicks);});}
function playAudioInternal(item,mediaSource,startPositionTicks){var streamInfo=self.createStreamInfo('Audio',item,mediaSource,startPositionTicks);var audioUrl=streamInfo.url;self.startTimeTicksOffset=streamInfo.startTimeTicksOffset;var initialVolume=self.getSavedVolume();var mediaRenderer=getAudioRenderer();mediaRenderer.volume(initialVolume);mediaRenderer.setPoster(self.getPosterUrl(item));mediaRenderer.setCurrentSrc(audioUrl,item,mediaSource);$(mediaRenderer).on("volumechange.mediaplayerevent",function(){console.log('audio element event: volumechange');self.onVolumeChanged(this);}).one("playing.mediaplayerevent",function(){console.log('audio element event: playing');$(this).on("ended.playbackstopped",self.onPlaybackStopped).one('ended.playnext',self.playNextAfterEnded);self.onPlaybackStart(this,item,mediaSource);}).on("pause.mediaplayerevent",function(){console.log('audio element event: pause');self.onPlaystateChange(this);self.setCurrentTime(self.getCurrentTicks());}).on("playing.mediaplayerevent",function(){console.log('audio element event: playing');self.onPlaystateChange(this);self.setCurrentTime(self.getCurrentTicks());}).on("timeupdate.mediaplayerevent",onTimeUpdate);self.currentMediaRenderer=mediaRenderer;self.currentDurationTicks=self.currentMediaSource.RunTimeTicks;}
var getItemFields="MediaSources,Chapters";self.tryPair=function(target){var deferred=$.Deferred();deferred.resolve();return deferred.promise();};}
window.MediaPlayer=new mediaPlayer();Dashboard.ready(function(){window.MediaController.registerPlayer(window.MediaPlayer);window.MediaController.setActivePlayer(window.MediaPlayer,window.MediaPlayer.getTargets()[0]);});})(document,setTimeout,clearTimeout,screen,$,setInterval,window);