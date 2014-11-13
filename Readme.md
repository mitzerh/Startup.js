Startup.js
==========
A simple and lightweight framework script for modular development. Aims to standardize and organize development patterns, and avoid namespace clutter.

#version 2.x.x!#

What's new:

- complete overhaul
- instance constructor
- structured approach to defining methods as modules
- $tartup.call() to trigger existing modules
- $tartup.get() to get already defined modules
- $tartup.pageReady() not required anymore (will fallback to document.ready)!

Including Startup
------------------
The Startup file can be included wherever you'd like it to be in your markup.
Although following best practices, it should be in your `<head>` or at the bottom
before your closing `</body>` tag.


Your control code
-----------------
Declaring variables is not needed anymore!

###Discontinued:
    (function(){
        
        /**
         * The 3 Important variables to declare
         */
        var Add = $tartup.site.Add,
            DOC_Ready = $tartup.site.OnDocReady,
            PAGE_Ready = $tartup.site.OnPageReady;
        
    }());
    
**_Use it how you like your shots.. straight up!_** (below)


Setting up your modules
-----------------------
It's very easy to set up:

    $tartup.module([name:string], [type:string], [context:function|object]);

**name** (optional)

- module name
- must be unique -- dupes will be ignored (a console.log will you know)
- if not defined (anonymous modules), it will not be stored and cannot be accessed with `.call()` or `.get()`

**type** (optional)

- options:

    - _page_ - (default) triggered on .pageReady()
    - _document_ - triggered on document.ready event
    - _window_ - triggered on window.onload event
    - noexec - explicitly tell Startup to not execute the function/object
    
- If inline `.pageReady()` is not declared, it will fallback as to _document_ type

**context**

- _function_ - function gets triggered
    
- _object_

    - only objects with `.init()` gets triggered
    - objects without it will only get stored


Triggerring Scripts inline
--------------------------
Sometimes, you'd like to execute scripts inline before the document is ready. You will need to put this at the very bottom before your closing `</body>` tag.

    <body>
        . . .
        
        $tartup.pageReady();
    </body>
    </html>


Examples
--------

**Module declaration**
    
    // function
    $tartup.module("foo", function(){
        console.log("foo:function");
    });
    
    // object
    $tartup.module("bear", {
        init: function() {
            console.log("bear:object");
        }
    });
    
    // on document.ready
    $tartup.module("foobear", "document", function(){
        console.log("foo.bear @ document.ready");
    });
    
    // on window.onload
    $tartup.module("foo.bear", "window", {
        init: function() {
            console.log("foo.bear @ window.onload");
        },
        roar: function() {
            alert("ROAR!");
        }
    });
    
    // type "noexec" - doesn't get executed on module declaration
    $tartup.module("foo_noexec", "noexec", function() {
        console.log("noexec option");
    });

**Anonymous module declaration**
    
    // these modules will not be stored
    
    $tartup.module(function() {
        console.log("anonymous:function");
    });

    $tartup.module({
        init: function() {
            console.log("anonymous:object")
        }
    });


**Call Module**
    
    // .init() gets triggered
    $tartup.call("foo.bear");
    
    // "noexec" type declaration will get ignored, it will still get executed
    $tartup.call("foo_noexec"); // --> will still trigger the function
    
**Get Module**
    
    // .init() doesn't get triggered
    var foobear = $tartup.call("foo.bear");
    foobear.roar();
    
###Creating new instances###

If you need to define multiple instances of Startup, the `.newInstance()` function will return a new unique instance

    // create an instance
    var MyInstance = new $tartup.newInstance();
    
    MyInstance.module("foo", function(){
        console.log("my foo instance");
    });
    
    var AnotherInstance = new $tartup.newInstance();
    
    AnotherInstance.module("foo", function(){
        console.log("another foo instance");
    });
    
    // default startup instance
    $tartup.module("foo.bear", function(){
        console.log("foo bear");
    });
    
    // you cannot .get() or .call() from other instances
    MyInstance.get("foo.bear"); // --> returns null
    
    MyInstance.call("foo"); // --> returns "my foo instance"
    AnotherInstance.call("foo"); // --> returns "another foo instance"


Credit
------

[DomReady v0.3.0](https://github.com/ded/domready/blob/v0.3.0/ready.js) by Dustin Diaz (needed old IE support!)

