define([],function(){function e(e){var o=e.headers||{};"json"==e.dataType&&(o.accept="application/json");var r={headers:o,method:e.type,credentials:"same-origin"},a=e.contentType;e.data&&("string"==typeof e.data?r.body=e.data:(r.body=t(e.data),a=a||"application/x-www-form-urlencoded; charset=UTF-8")),a&&(o["Content-Type"]=a);var i=e.url;if(e.query){var c=t(e.query);c&&(i+="?"+c)}return e.timeout?n(i,r,e.timeout):fetch(i,r)}function n(e,n,t){return new Promise(function(o,r){var a=setTimeout(r,t);n=n||{},n.credentials="same-origin",fetch(e,n).then(function(e){clearTimeout(a),o(e)},function(){clearTimeout(a),r()})})}function t(e){var n=[];for(var t in e){var o=e[t];null!==o&&void 0!==o&&""!==o&&n.push(encodeURIComponent(t)+"="+encodeURIComponent(o))}return n.join("&")}function o(n){if(!n)throw new Error("Request cannot be null");return n.headers=n.headers||{},e(n).then(function(e){return e.status<400?"json"==n.dataType||"application/json"==n.headers.accept?e.json():e:Promise.reject(e)},function(e){throw e})}return{getFetchPromise:e,ajax:o}});