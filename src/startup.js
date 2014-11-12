

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

        Startup.version = "${version}";

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

        //inclue:${domready}
        
        return Startup;

    }())

));
/*** END - INSTANCE CONSTRUCTOR ***/
