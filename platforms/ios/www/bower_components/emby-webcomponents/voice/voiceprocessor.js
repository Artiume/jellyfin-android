define(["./voicecommands.js","./grammarprocessor.js","require"],function(r,e,n){function o(){return m?Promise.resolve(m):new Promise(function(r){var e="grammar";n(["text!./grammar/"+e+".json"],function(e){m=JSON.parse(e),r(m)})})}function t(n){return n?o().then(function(o){var t=e(o,n);return t&&t.command?r(t).then(function(r){return Promise.resolve("show"===r.item.actionid&&"group"===r.item.sourceid?{error:"group",item:r.item,groupName:r.name,fn:r.fn}:{item:r.item,fn:r.fn})},function(){return Promise.reject({error:"unrecognized-command",text:n})}):Promise.reject({error:"unrecognized-command",text:n})}):Promise.reject({error:"empty"})}var m;return{processTranscript:t,getCommandGroups:o}});