startupAMD = (function(window){

    var _IS_DOM_READY = false,
        DEFINE = "define",
        RESERVED_WORDS = [DEFINE];

    var App = function() {

        this.__vars = {};
        var vars = this.__vars;

        vars.__factories = {};
        vars._dom_check_init = false;

    };

    App.prototype.config = function(config) {

        var self = this,
            vars = this.__vars;

        vars.__config = config || {};

    };

    App.prototype.define = function() {

        var args = arguments,
            id = false,
            deps = false,
            factory = false;

        if (typeof args[0] === "string") {
            id = args[0];
        }

        if (typeof args[1] === "function") {
            deps = [];
            factory = args[1];
        }

        if (isArray(args[1])) {

            deps = [];

            if (args[2] && typeof args[2] === "function") {
                factory = args[2];
            }

        }

        if (!isValidId(id)) {
            logError("[startup.amd] invalid id: '" + id + "'.");
            return false;
        }

        if (!factory) {
            logError("[startup.amd] invalid factory");
        }

        var self = this,
            vars = self.__vars,
            factories = vars.__factories;

        deps = (!isArray(deps)) ? [] : deps;

        factories[id] = {
            deps: deps,
            factory: factory
        };

        if (!vars._dom_check_init) {
            
            vars._dom_check_init = true;

            domready(function(){
                _IS_DOM_READY = true;
                self.execute();
            });

        }

    };

    App.prototype.load = function(deps, factory) {

        var self = this,
            vars = self.__vars,
            factories = vars.__factories,
            config = vars.__config;

        deps = deps || [];

        if (typeof factory !== "function") {
            logError("[startup.amd] invalid factory");
            return false;
        }

        for (var x = 0; x < deps.length; x++) {
            if (factories[deps[x]]) {
                deps.splice(x, 1);
            }
        }

        var loadDependency = function() {

            loadScript(deps[0], function(){
                deps.shift();
                if (deps.length > 0) {
                    loadDependency();
                } else {
                    factory();
                }
            })

        };

        var loadScript = function(dep, callback) {

            var src = (config.basePath || "") + "/" + dep + ".js",
                script = document.createElement("script");

            script.async = true;
            script.src = src;
            (document.getElementsByTagName("head") || document.getElementsByTagName("body"))[0].appendChild(script);

            var poll = function() {

                if (factories[dep]) {
                    callback(dep);
                } else {
                    setTimeout(function(){
                        poll();
                    }, 50);
                }

            };

            poll();

        };

        if (deps.length > 0) {
            loadDependency();
        } else {
            factory();
        }

    };

    App.prototype.execute = function() {

        var self = this,
            vars = self.__vars,
            factories = vars.__factories;

        var trigger = function(factory) {

            factory.factory(function(id){
                return (factories[id].factory());
            });

        };

        for (var id in factories) {

            // check dependencies
            if (validateDependencies(self, factories, id)) {

                trigger(factories[id]);

            }

        }

    };

    var validateDependencies = function(self, factories, id) {

        var valid = true,
            info = factories[id],
            deps = info.deps;

        for (var i = 0; i < deps.length; i++) {

            var depId = deps[i];

            if (depId !== DEFINE && !factories[depId]) {
                logError("["+id+"] Dependency missing: '"+depId+"'");
                valid = false;
                break;
            }

        }

        return valid;

    };

    var isValidId = function(id) {
        var ret = (typeof id === "string" && (id.replace(/\s+/gi, "")).length > 0) ? true : false;
        if (ret && isReserved(id)) {
            ret = false;
        }
        return ret;
    };

    var isReserved = function(id) {

        var ret = false;

        for (var x = 0; x < RESERVED_WORDS.length; x++) {
            if (RESERVED_WORDS[x] === id) {
                ret = true;
                break;
            }
        }

        return ret;

    };

    var isArray = function(obj) {
        return (Object.prototype.toString.call(obj) === "[object Array]" ) ? true : false;
    };

    // logger
    var log = function() {
        if (window.console) {
            try {
                return console.log.apply(console, arguments);
            } catch(err) {
                console.log(arguments);
            }
        }
    };

    var logError = function(str) {
        throw new Error(str);
    };

    // https://github.com/addyosmani/jquery.parts/blob/master/jquery.documentReady.js
    var domready = (function(){

        // Define a local copy of $
        var $ = function( callback ) {
                registerOrRunCallback( callback );
                bindReady();
            },
            // Use the correct document accordingly with window argument (sandbox)
            document = window.document,
            readyBound = false,
            callbackQueue = [],
            registerOrRunCallback = function( callback ) {
                if ( typeof callback === "function" ) {
                    callbackQueue.push(callback);
                }
            },
            DOMReadyCallback = function() {
                while( callbackQueue.length ) {
                    (callbackQueue.shift())();
                }
                registerOrRunCallback = function( callback ) {
                    callback();
                };
            },

            // The ready event handler
            DOMContentLoaded = function() {
                if ( document.addEventListener ) {
                        document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
                } else {
                        // we're here because readyState !== "loading" in oldIE
                        // which is good enough for us to call the dom ready!
                        document.detachEvent( "onreadystatechange", DOMContentLoaded );
                }
                DOMReady();
            },

            // Handle when the DOM is ready
            DOMReady = function() {
                // Make sure that the DOM is not already loaded
                if ( !$.isReady ) {
                    // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                    if ( !document.body ) {
                        return setTimeout( DOMReady, 1 );
                    }
                    // Remember that the DOM is ready
                    $.isReady = true;
                    // If there are functions bound, to execute
                    DOMReadyCallback();
                    // Execute all of them
                }
            }, // /ready()

            bindReady = function() {
                var toplevel = false;

                if ( readyBound ) {
                    return;
                }
                readyBound = true;

                // Catch cases where $ is called after the
                // browser event has already occurred.
                if ( document.readyState !== "loading" ) {
                    DOMReady();
                }

                // Mozilla, Opera and webkit nightlies currently support this event
                if ( document.addEventListener ) {
                    // Use the handy event callback
                    document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
                    // A fallback to window.onload, that will always work
                    window.addEventListener( "load", DOMContentLoaded, false );
                    // If IE event model is used
                } else if ( document.attachEvent ) {
                    // ensure firing before onload,
                    // maybe late but safe also for iframes
                    document.attachEvent( "onreadystatechange", DOMContentLoaded );
                    // A fallback to window.onload, that will always work
                    window.attachEvent( "onload", DOMContentLoaded );
                    // If IE and not a frame
                    // continually check to see if the document is ready
                    try {
                        toplevel = window.frameElement == null;
                    } catch (e) {}
                    if ( document.documentElement.doScroll && toplevel ) {
                        doScrollCheck();
                    }
                }
            },

            // The DOM ready check for Internet Explorer
            doScrollCheck = function() {
                if ( $.isReady ) {
                    return;
                }
                try {
                    // If IE is used, use the trick by Diego Perini
                    // http://javascript.nwbox.com/IEContentLoaded/
                    document.documentElement.doScroll("left");
                } catch ( error ) {
                    setTimeout( doScrollCheck, 1 );
                    return;
                }
                // and execute any waiting functions
                DOMReady();
            };

        // Is the DOM ready to be used? Set to true once it occurs.
        $.isReady = false;

        // Expose $ to the global object
        return $;

    }());

    return {

        create: function() {

            return (new App());
        }

    };

}(window));