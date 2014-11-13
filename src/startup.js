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

    (function(domready){

        var CONST = {
            prefix: "[$tartup]",
            types: ["page", "window", "document", "noexec"] // type default: page
        };

            // booleans
        var DOM_READY = false,
            WINDOW_READY = false,
            PAGE_READY = false,
            // execution stack
            PAGE_EXEC_STACK = [],
            WIN_EXEC_STACK = [],
            DOC_EXEC_STACK = [];
        

        var Startup = function(config) {

            config = config || {};

            // version
            this.version = "${version}";

                // instance stack
            var DEFINE_STACK = {},
                // default type
                DEFAULT_TYPE = (config.defaultType && isType(config.defaultType)) ? config.defaultType : CONST.types[0];

            var Proto = this;

            /**
             * create a new separate instance
             */
            Proto.newInstance = function(config) {
                var instance = new Startup(config);
                // remove from instanced startups
                delete instance.newInstance;
                delete instance.pageReady;

                return instance;
            };

            /**
             * inline execution
             */
            Proto.pageReady = function() {
                PAGE_READY = true;
                executeStack(PAGE_EXEC_STACK);
            };

            /**
             * get defined module
             */
            Proto.get = function(name) {
                return (DEFINE_STACK[name]) ? DEFINE_STACK[name].context : null;
            };

            /**
             * run an already defined module
             */
            Proto.call = function(name) {
                if (DEFINE_STACK[name]) {
                    executeStack([DEFINE_STACK[name]]);
                }
            };

            /**
             * module definition
             */
            Proto.module = function() {
                var args = processArgs(arguments);

                // if there are no arguments, ignore
                if (!args) { return false; }

                var name = args.name, // module name
                    conf = (args.conf && isObject(args.conf)) ? args.conf : {}, // config
                    context = args.context; // module context

                // always set a type
                conf.type = (conf.type && isType(conf.type)) ? conf.type : DEFAULT_TYPE;

                // do not define multiple modules
                if (DEFINE_STACK[name]) {
                    log("module '"+name+"' already exists. Ignoring:");
                    log(context);
                    return false;
                }

                // store non-anonymous modules
                if (name !== "_anonymous") {
                    DEFINE_STACK[name] = {
                        conf: conf,
                        context: context
                    };
                }

                // normalize module properties
                var stack = {
                    name: name,
                    conf: conf,
                    context: context
                };

                // push to stack
                switch (conf.type) {

                    case "document":
                        if (DOM_READY) { // if type is ready, execute at once
                            executeStack([stack]);
                        } else {
                            DOC_EXEC_STACK.push(stack);
                        }
                        break;

                    case "window":
                        if (WINDOW_READY) {
                            executeStack([stack]);
                        } else {
                            WIN_EXEC_STACK.push(stack);
                        }
                        break;

                    case "noexec":
                        // do not execute
                        break;

                    default:
                        if (PAGE_READY) {
                            executeStack([stack]);
                        } else {
                            PAGE_EXEC_STACK.push(stack);
                        }
                }

            };
            
        };

        // execute doc.ready stack
        var executeDocStack = function() {
            DOM_READY = true;
            if (!PAGE_READY) {
                PAGE_READY = true;
                executeStack(PAGE_EXEC_STACK);
            }
            executeStack(DOC_EXEC_STACK);
        };

        // execute window.onload stack
        var executeWinStack = function() {
            WINDOW_READY = true;
            executeStack(WIN_EXEC_STACK);
        };

        // doc.ready
        if (window.jQuery) {
            jQuery(document).ready(function(){
                executeDocStack();
            });
        } else  {
            domready(function(){
                executeDocStack();
            });
        }

        //win.onload
        if (window.jQuery) {
            jQuery(window).load(function(){
                executeWinStack();
            });
        } else {
            if(window.addEventListener) {
                window.addEventListener("load", function() {
                    executeWinStack();
                });
            } else if (window.attachEvent) {
                button.attachEvent("onload", function() {
                    executeWinStack();
                });
            }
        }

        // stack execution
        function executeStack(STACK) {
            while (STACK.length > 0) {
                var instance = STACK.shift(),
                    context = instance.context;

                if (typeof context === "function") {
                    context();
                } else if (isObject(context) && typeof context.init === "function") {
                    context.init();
                }
            }
        }

        // arguments processor
        function processArgs(args) {
            var name = trimStr(args[0]),
                conf = null,
                context = null;

            if (args.length === 0) {
                log("Insufficient parameters.. Ignored:");
                log(args[0].toString());
                return false;
            }

            if (name.length === 0) {
                name = "_anonymous";
            }

            if (args.length > 2) {
                conf = (isType(args[1])) ? { type: args[1] } : args[1];
                context = args[2];
            } else if (args.length === 1) {
                context = args[0];
            } else {
                context = args[1];
            }

            return {
                name: name,
                conf: conf,
                context: context
            };
        }

        // validate type
        function isType(val) {
            var ret = false;
            if (typeof val === "string") {
                for (var i = 0; i < CONST.types.length; i++) {
                    if (CONST.types[i] === val) {
                        ret = true;
                        break;
                    }
                }
            }
            return ret;
        }

        function log() {
            var args = arguments;
            if (typeof args[0] === "string") {
                args[0] = [CONST.prefix, args[0]].join(" ");
            }

            if (window.console) {
                try {
                    return console.log.apply(console, args);
                } catch(err) {
                    console.log(args);
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

        return (new Startup);

    }(
        (function(){
            //inclue:${domready}
            return domready;
        }())
        
    ))

));
