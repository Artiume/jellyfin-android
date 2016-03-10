define(["historyManager","focusManager","browser","layoutManager","inputManager","paper-dialog","scale-up-animation","fade-out-animation","fade-in-animation","css!./paperdialoghelper.css"],function(t,e,o,i,n){function a(e,i,a){function l(){var t=d.originalUrl==window.location.href;(t||!e.opened)&&window.removeEventListener("popstate",l),t&&(d.closedByBack=!0,e.close())}function s(t){"back"==t.detail.command&&(n.off(e,s),d.closedByBack=!0,e.close(),t.preventDefault())}function c(){if(f&&document.body.classList.remove("noScroll"),window.removeEventListener("popstate",l),n.off(e,s),!d.closedByBack&&r(e)){var t=history.state||{};t.dialogId==i&&history.back()}u.focus(),"true"==e.getAttribute("data-removeonclose")&&e.parentNode.removeChild(e),setTimeout(function(){a({element:e,closedByBack:d.closedByBack})},1)}var d=this;d.originalUrl=window.location.href;var u=document.activeElement,f=!1;e.addEventListener("iron-overlay-closed",c),e.open(),o.chrome||e.classList.contains("fixedSize")||setTimeout(function(){e.refit()},100),"true"!=e.getAttribute("data-lockscroll")||document.body.classList.contains("noScroll")||(document.body.classList.add("noScroll"),f=!0),r(e)?(t.pushState({dialogId:i},"Dialog",i),window.addEventListener("popstate",l)):n.on(e,s)}function r(t){return"true"==t.getAttribute("data-history")}function l(t){return new Promise(function(e){new a(t,"dlg"+(new Date).getTime(),e)})}function s(t){t.opened&&(r(t)?history.back():t.close())}function c(t){e.autoFocus(t.target)}function d(t){return null!=t.lockScroll?t.lockScroll:"fullscreen"==t.size?!0:o.mobile}function u(e){e=e||{};var n=document.createElement("paper-dialog");n.setAttribute("with-backdrop","with-backdrop"),n.setAttribute("role","alertdialog"),d(e)&&n.setAttribute("data-lockscroll","true"),e.enableHistory!==!1&&t.enableNativeHistory()&&n.setAttribute("data-history","true"),e.modal!==!1&&n.setAttribute("modal","modal"),n.setAttribute("noAutoFocus","noAutoFocus");var a=o.animate&&!o.mobile?"scale-up-animation":"fade-in-animation";n.entryAnimation=e.entryAnimation||a,n.exitAnimation="fade-out-animation";var r=e.entryAnimationDuration||(e.size?240:300);return n.animationConfig={entry:{name:n.entryAnimation,node:n,timing:{duration:r,easing:"ease-out"}},exit:{name:n.exitAnimation,node:n,timing:{duration:e.exitAnimationDuration||400,easing:"ease-in"}}},o.animate||(n.animationConfig=null,n.entryAnimation=null,n.exitAnimation=null),n.classList.add("paperDialog"),n.classList.add("scrollY"),(i.tv||i.mobile)&&n.classList.add("hiddenScroll"),e.removeOnClose&&n.setAttribute("data-removeonclose","true"),e.size&&(n.classList.add("fixedSize"),n.classList.add(e.size)),e.autoFocus!==!1&&n.addEventListener("iron-overlay-opened",c),n}function f(t,e){var o=$(window).height();if(o>=540){var i=$(e).offset();i.top+=e.offsetHeight/2,i.left+=e.offsetWidth/2,i.top-=24,i.left-=24,i.top-=$(t).height()/2,i.left-=$(t).width()/2,i.top-=$(window).scrollTop(),i.left-=$(window).scrollLeft(),i.top=Math.min(i.top,o-300),i.left=Math.min(i.left,$(window).width()-300),i.top=Math.max(i.top,0),i.left=Math.max(i.left,0),t.style.position="fixed",t.style.left=i.left+"px",t.style.top=i.top+"px"}}return{open:l,close:s,createDialog:u,positionTo:f}});