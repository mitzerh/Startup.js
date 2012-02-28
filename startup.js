/**
 * $tartup.js - v1.2
 * https://github.com/mitzerh/Startup.js
 * MIT License
 */
(function(){
   
   var CONST = {
      reserved: "Add|OnPageReady|OnDocReady"
   };
	
   function Startup() {
      var self = this;
      
      // page ready execution
      this.pageReady = function() {
         var stack = self._PRStack || false;
         if (!helper.isArray(stack)) { return false; }
         var fn = groupStack(stack);
         fn(); // execute
         delete self._PRStack; // delete temp stack
         CONST.PRExec = true; // executed
      };
		
      this.site = new Site(this);
      this.utils = new Util(this);
      
      // Add utils
      this.addUtil = function(constructor,context) {
         self.utils.Add(constructor,context);
      };
   }
   
   Startup.prototype = {
      newInstance: function() {
         return (new Startup());
      }
   };
   
   function AddConstructor(parent,constructor,context) {
      constructor = helper.trimStr(constructor);
      
      function isReserved(val) {
         val = val || "";
         var ret = (val.length > 0) ? (CONST.reserved.indexOf(val)>-1) ? true : false : false;
         if (ret) { log("[AddConstructor] Error: Reserved word '"+val+"'"); }
         return ret;
      }

      // create the new new constructor object
      if (constructor.indexOf(".")>-1) {
         // remove initial dot 
         constructor = (constructor.charAt(0)===".") ? constructor.slice(1,constructor.length) : constructor;
         var temp = constructor.split("."), len = temp.length, valid = true;
         for (var x = 0; x < len; x++) {
            var item = temp[x];
            if (x===0 && isReserved(item)) { return false; }
            if (!parent[item]) {
               if (x!==len-1) {
                  parent[item] = {};
               } else if (typeof context!=="function") {
                  parent[item] = {};
               } else {
                  parent[item] = context;
               }
            }
            parent = parent[item];
         }
      } else if (constructor.length>0 && !parent[constructor]) {
         if (isReserved(constructor)) { return false; }
         if (typeof context!=="function") {
            parent[constructor] = {};
            parent = parent[constructor];
         } else {
            parent[constructor] = context;
            parent = parent[constructor];
         }
      } else if (parent[constructor]) {
         log("[AddConstructor] Warning: Constructor already exists (constructor:" + constructor + "). Ignoring another instantiation.");
         return false;
      } else {
         if (isReserved(constructor)) { return false; }
         parent = parent[constructor];
      }
      
      if (typeof context==="object" && !helper.isArray(context)) {
         for (var i in context) {
            if (parent[i]) { log("[AddConstructor] Warning: Overwriting '"+i+"' "+typeof parent[i]+". (constructor:"+constructor+" )"); }
            parent[i] = context[i];
         }
      }
      return parent;
   }
   
   
   /**
    * SITE
    * Site Object namespace starts here
    */
   function Site(root) {
      var self = this;
      this.Add = function (constructor,context) { return AddConstructor(self,constructor,context); };
      this.OnPageReady = (function(){ var fn = new OnPageReady(self,root); return fn.callback; }()); 
      this.OnDocReady = (function(){ var fn = new OnDocReady(self,root); return fn.callback; }());
   }

   
   /**
    * UTILITIES
    * Global scoped utilities
    */
   function Util(root) {
      var self = this;
      this.Add = function (constructor,context) { return AddConstructor(self,constructor,context); };
   }
   
   function OnPageReady(self,root) {
      this.callback = function () {
         var args = arguments, 
            constructor = (args.length===1) ? "" : args[0],
            context = (args.length===1) ? args[0] : args[1],
            hasConstructor = (constructor.length > 0) ? true : false,
            trigger = (hasConstructor) ? self.Add(constructor,context) : context,
            cloned = root.pageReady || function(){};
            
         if (CONST.PRExec) { // if init execution already finished
            setExec(trigger);
         } else {
            if (!root._PRStack) { root._PRStack = []; }
            root._PRStack.push({ n:(!hasConstructor) ? "GEN" : constructor, t:trigger });
         }
      };
   }
   
   function OnDocReady(self,root) {
      this.callback = function () {
         var args = arguments, 
            constructor = (args.length===1) ? "" : args[0],
            context = (args.length===1) ? args[0] : args[1],
            hasConstructor = (constructor.length > 0) ? true : false,
            trigger = (hasConstructor) ? self.Add(constructor,context) : context;
            
         if (CONST.DRExec) { // if init execution already finished
            setExec(trigger);
         } else {
            if (!root._DRStack) { root._DRStack = []; }
            root._DRStack.push({ n:(!hasConstructor) ? "GEN" : constructor, t:trigger});

            if (!CONST.docReadyTriggered) { // set trigger only once
               CONST.docReadyTriggered = true;
               DomReady.ready(function(){
                  var stack = root._DRStack || false;
                  if (!helper.isArray(stack)) { return false; }
                  var fn = groupStack(stack);
                  fn(); // execute
                  delete root._DRStack; // delete temp stack
                  CONST.DRExec = true; // executed
               });
            }
         }
      };
   }
	
   // Execution core
   function setExec(t,cloned) {
      cloned = (typeof cloned==="function") ? cloned : false;
      var fn = function() {};
      var cloneFn = function() { if (cloned) { cloned(); } };
      
      if (typeof t==="function") {
         fn = function() { cloneFn(); t(); };
      } else if (t && typeof t.init==="function") {
         fn = function() { cloneFn(); t.init(); };
      }
      // if there is a clone function, means it's coming from pre-execution 
      // and it has to be returned; else trigger the function
      if (cloned) { return fn; } else { fn(); }
   }
	
   // Stacking up executions; executes "general" non-constructor defined functions first
   // TODO: prioritization
   function groupStack(stack) {
      var i = 0, len = stack.length, arr = [], fn = function() {}; // empty
      var setFn = function(t) {
         var cloned = fn;
         fn = setExec(t,cloned);
      };
	   
      while (i <= len) {
         var item = stack[i];
         if (item && item.n==="GEN") {
            arr.push(item);
            stack.splice(i,1);
            len = stack.length;
         } else { i++; }
      }
      
      arr = arr.concat(stack);
      len = arr.length;
      for (var x = 0; x < len; x++) { setFn(arr[x].t); }
      return fn; 
   }
	
   var helper = {
      isArray: function(val) {
         val = val || false;
         return Object.prototype.toString.call(val) === "[object Array]";
      },
      trimStr: function(str) {
         return (!str) ? "" : str.toString().replace(/^\s+/,"").replace(/\s+$/,"");
      }
   };
	
   function log(str) {
      if (window.console && console.log) { console.log(str); }
   }
   
   window._$tartup = window.$tartup = (function(){
      return (new Startup());
   }());

}());

// http://code.google.com/p/domready/
(function(){function e(){if(!d&&(d=!0,c)){for(var a=0;a<c.length;a++)c[a].call(window,[]);c=[]}}function j(a){var g=window.onload;window.onload=typeof window.onload!="function"?a:function(){g&&g();a()}}function h(){if(!i){i=!0;document.addEventListener&&!f.opera&&document.addEventListener("DOMContentLoaded",e,!1);f.msie&&window==top&&function(){if(!d){try{document.documentElement.doScroll("left")}catch(a){setTimeout(arguments.callee,0);return}e()}}();f.opera&&document.addEventListener("DOMContentLoaded", function(){if(!d){for(var a=0;a<document.styleSheets.length;a++)if(document.styleSheets[a].disabled){setTimeout(arguments.callee,0);return}e()}},!1);if(f.safari){var a;(function(){if(!d)if(document.readyState!="loaded"&&document.readyState!="complete")setTimeout(arguments.callee,0);else{if(a===void 0){for(var b=document.getElementsByTagName("link"),c=0;c<b.length;c++)b[c].getAttribute("rel")=="stylesheet"&&a++;b=document.getElementsByTagName("style");a+=b.length}document.styleSheets.length!=a?setTimeout(arguments.callee, 0):e()}})()}j(e)}}var k=window.DomReady={},b=navigator.userAgent.toLowerCase(),f={version:(b.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[])[1],safari:/webkit/.test(b),opera:/opera/.test(b),msie:/msie/.test(b)&&!/opera/.test(b),mozilla:/mozilla/.test(b)&&!/(compatible|webkit)/.test(b)},i=!1,d=!1,c=[];k.ready=function(a){h();d?a.call(window,[]):c.push(function(){return a.call(window,[])})};h()})();

/*** END - INSTANCE CONSTRUCTOR ***/
