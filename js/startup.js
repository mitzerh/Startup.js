/**
* startup-js v2.0.0 | 2014-11-12
* Startup JS Framework
* by Helcon Mabesa
* MIT license http://opensource.org/licenses/MIT
**/



(function(window, app){

    if ( typeof window.define === "function" && window.define.amd ) {
        // amd
        define("startup", [], function() {
            return app;
        });
    } else {

        window.$tartup = app;

    }

}(window,

    (function(){

        var CONST = {};

        var DOM_READY = false,
            WINDOW_READY = false,
            PAGE_READY = false,

            DEFINE_STACK = {},
            PAGE_EXEC_STACK = [],
            WIN_EXEC_STACK = [],
            DOC_EXEC_STACK = [];
        

        var Startup = function() {

            var args = arguments,
                name = trimStr(args[0]),
                conf = null,
                context = null;

            if (args.length < 2) {
                log("Insufficient parameters. Ignored:");
                log(args[0].toString());
                return false;
            }

            if (name.length === 0) {
                log("Invalid module name. Ignored:");
                log(args[0].toString());
                return false;
            }

            if (args.length > 2) {

                conf = (isObject(args[1])) ? args[1] : null;
                context = args[2];

            } else {

                context = args[1];
            }

            return (new Proto.define(name, conf, context));
            
        };

        var Proto = Startup.prototype;

        Startup.version = "2.0.0";

        Startup.pageReady = function() {
            PAGE_READY = true;
            executeStack(PAGE_EXEC_STACK);
        };

        Proto.define = function(name, conf, context) {

            conf = (isObject(conf)) ? conf : {};

            DEFINE_STACK[name] = {
                conf: conf,
                context: context
            };

            var stack = {
                name: name,
                conf: conf,
                context: context
            };

            switch (conf.type) {

                case "document":
                    DOC_EXEC_STACK.push(stack);
                    break;

                case "window":
                    WIN_EXEC_STACK.push(stack);
                    break;

                default:
                    PAGE_EXEC_STACK.push(stack);
            }

        };

        var executeDocStack = function() {
            if (!PAGE_READY) {
                executeStack(PAGE_EXEC_STACK);
            }
            executeStack(DOC_EXEC_STACK);
        };

        var executeWinStack = function() {
            if (window.jQuery) {
                $(window).load(function(){
                    executeStack(WIN_EXEC_STACK);
                });
            } else {
                if(window.addEventListener) {
                    window.addEventListener("load", function() {
                        executeStack(WIN_EXEC_STACK);
                    });
                } else if (window.attachEvent) {
                    button.attachEvent("onload", function() {
                        executeStack(WIN_EXEC_STACK);
                    });
                }
            }
        };

        // doc.ready
        if (window.jQuery) {
            jQuery(document).ready(function(){
                executeDocStack();
            });
        } else  {
            DomReady.ready(function(){
                executeDocStack();
            });
        }

        //win.onload
        executeWinStack();

        function executeStack(STACK) {
            while (STACK.length > 0) {
                var instance = STACK.shift(),
                    context = instance.context;

                if (typeof context === "function") {
                    instance();
                } else if (isObject(context) && typeof context.init === "function") {
                    instance.init();
                }
            }
        }

        function throwError(str) {
            var foo = (new Error(str));
        }

        // logger
        function log() {
            if (window.console) {
                try {
                    return console.log.apply(console, arguments);
                } catch(err) {
                    console.log(arguments);
                }
            }
        }

        function isArray(val) {
            val = val || false;
            return Object.prototype.toString.call(val) === "[object Array]";
        }

        function isObject(val) {
            return (typeof val === "object" && !isArray(val)) ? true : false;
        }

        function trimStr(str) {
            return (typeof str !== "string") ? "" : (str.toString().replace(/^\s+/,"").replace(/\s+$/,""));
        }

        /** lint:ignore **/

// http://code.google.com/p/domready/
(function(){function e(){if(!d&&(d=!0,c)){for(var a=0;a<c.length;a++)c[a].call(window,[]);c=[]}}function j(a){var g=window.onload;window.onload=typeof window.onload!="function"?a:function(){g&&g();a()}}function h(){if(!i){i=!0;document.addEventListener&&!f.opera&&document.addEventListener("DOMContentLoaded",e,!1);f.msie&&window==top&&function(){if(!d){try{document.documentElement.doScroll("left")}catch(a){setTimeout(arguments.callee,0);return}e()}}();f.opera&&document.addEventListener("DOMContentLoaded", function(){if(!d){for(var a=0;a<document.styleSheets.length;a++)if(document.styleSheets[a].disabled){setTimeout(arguments.callee,0);return}e()}},!1);if(f.safari){var a;(function(){if(!d)if(document.readyState!="loaded"&&document.readyState!="complete")setTimeout(arguments.callee,0);else{if(a===void 0){for(var b=document.getElementsByTagName("link"),c=0;c<b.length;c++)b[c].getAttribute("rel")=="stylesheet"&&a++;b=document.getElementsByTagName("style");a+=b.length}document.styleSheets.length!=a?setTimeout(arguments.callee, 0):e()}})()}j(e)}}var k=window.DomReady={},b=navigator.userAgent.toLowerCase(),f={version:(b.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[])[1],safari:/webkit/.test(b),opera:/opera/.test(b),msie:/msie/.test(b)&&!/opera/.test(b),mozilla:/mozilla/.test(b)&&!/(compatible|webkit)/.test(b)},i=!1,d=!1,c=[];k.ready=function(a){h();d?a.call(window,[]):c.push(function(){return a.call(window,[])})};h()})();

        
        return Startup;

    }())

));
/*** END - INSTANCE CONSTRUCTOR ***/
