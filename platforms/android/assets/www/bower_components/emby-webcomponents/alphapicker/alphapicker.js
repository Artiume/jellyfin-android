define(["focusManager","css!./style.css","paper-icon-button-light","material-icons"],function(e){function t(){var t=this.querySelector("."+o);t?e.focus(t):e.autoFocus(this,!0)}function a(e){return'<button data-value="'+e+'" class="alphaPickerButton">'+e+"</button>"}function n(e,n){e.classList.add("alphaPicker"),e.classList.add("focuscontainer-x");var i,o="";o+='<div class="alphaPickerRow">',"keyboard"==n.mode?o+='<button data-value=" " is="paper-icon-button-light" class="alphaPickerButton autoSize">                <i class="md-icon alphaPickerButtonIcon">&#xE256;</i>            </button>':(i=["#"],o+=i.map(a).join("")),i=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],o+=i.map(a).join(""),"keyboard"==n.mode?(o+='<button data-value="backspace" is="paper-icon-button-light" class="alphaPickerButton autoSize">                <i class="md-icon alphaPickerButtonIcon">&#xE14A;</i>            </button>',o+="</div>",i=["0","1","2","3","4","5","6","7","8","9"],o+='<div class="alphaPickerRow">',o+="<br/>",o+=i.map(a).join(""),o+="</div>"):o+="</div>",e.innerHTML=o,e.classList.add("focusable"),e.focus=t}function i(t){function a(){d=null,h.value(v)}function i(){if(p=null,document.activeElement==f){var e=f.getAttribute("data-value");h.value(e,!0)}}function u(e,t){for(;!e.classList||!e.classList.contains(t);)if(e=e.parentNode,!e)return null;return e}function c(e){var t=u(e.target,"alphaPickerButton");if(t){var a=t.getAttribute("data-value");m.dispatchEvent(new CustomEvent("alphavalueclicked",{detail:{value:a}}))}}function r(e){var t=u(e.target,"alphaPickerButton");if(t){var a=t.getAttribute("data-value");L==a.toUpperCase()?h.value(null,!0):h.value(a,!0)}}function l(e){p&&(clearTimeout(p),p=null);var t=u(e.target,"alphaPickerButton");t&&(f=t,p=setTimeout(i,100))}function s(e){var t=u(e.target,k);if(t){var n=t.getAttribute("data-prefix");n&&n.length&&(v=n[0],d&&clearTimeout(d),d=setTimeout(a,100))}}var v,d,f,p,h=this,m=t.element,b=t.itemsContainer,k=t.itemClass;h.enabled=function(e){e?(b&&b.addEventListener("focus",s,!0),"keyboard"==t.mode&&m.addEventListener("click",c),"click"!==t.valueChangeEvent?m.addEventListener("focus",l,!0):m.addEventListener("click",r)):(b&&b.removeEventListener("focus",s,!0),m.removeEventListener("click",c),m.removeEventListener("focus",l,!0),m.removeEventListener("click",r))},h.on=function(e,t){m.addEventListener(e,t)},h.off=function(e,t){m.removeEventListener(e,t)},h.destroy=function(){h.enabled(!1),m.classList.remove("focuscontainer-x")},h.visible=function(e){m.style.visibility=e?"visible":"hidden"};var L;h.value=function(e,a){var n,i;return void 0!==e&&(null!=e?(e=e.toUpperCase(),L=e,"keyboard"!=t.mode&&(i=m.querySelector("."+o),n=m.querySelector(".alphaPickerButton[data-value='"+e+"']"),n&&n!=i&&n.classList.add(o),i&&i!=n&&i.classList.remove(o))):(L=e,i=m.querySelector("."+o),i&&i.classList.remove(o))),a&&m.dispatchEvent(new CustomEvent("alphavaluechanged",{detail:{value:e}})),L},h.values=function(){for(var e=m.querySelectorAll(".alphaPickerButton"),t=[],a=0,n=e.length;n>a;a++)t.push(e[a].getAttribute("data-value"));return t},h.focus=function(){e.autoFocus(m,!0)},n(m,t),h.enabled(!0),h.visible(!0)}var o="alphaPickerButton-selected";return i});