Startup.js
==========
A simple and lightweight framework script for modular development. Aims to standardize and organize development patterns and avoid namespace clutter.

#version 2.x.x!#

What's new:

- complete overhaul
- structured approach to defining methods as modules
- $tartup.call() to trigger existing modules
- $tartup.get() to get already defined modules
- $tartup.pageReady() not required!

Including Startup
------------------
The Startup file can be included wherever you'd like it to be.
Whether in your markup. Following best practices, it should be in your
`<head>` or at the bottom before your closing `</body>` tag.


Your control code
-----------------
Simplified variable is not needed anymore!

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

    $tartup([name:string], [type:string], [context:function|object]);

**name** (optional)

- module name
- must be unique -- dupes will be ignored
- if not defined, it will not be stored and cannot be accessed with `.call()` or `.get()`

**type** (optional)

- options:

    - _page_ - (default) triggered on .pageReady()
    - _document_ - triggered on DOM ready event
    - _window_ - triggered on window.onload event
    
- If inline `.pageReady()` is not defined, it will be fired as _document_ type

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

**Anonymous**

    $tartup(function() {
        console.log("anonymous:function");
    });

    $tartup({
        init: function() {
            console.log("anonymous:object")
        }
    });

**Typical**

    $tartup("foo", function(){
        console.log("foo:function");
    });
    
    $tartup("bear", {
        init: function() {
            console.log("bear:object");
        }
    });
    
    $tartup("foobear", "document", function(){
        console.log("foo.bear @ dom.ready");
    });
    
    $tartup("foo.bear", "window", {
        init: function() {
            console.log("foo.bear @ window.onload");
        },
        roar: function() {
            alert("ROAR!");
        }
    });

**Call Module**
    
    // .init() gets triggered
    $tartup.call("foo.bear");
    
**Get Module**
    
    // .init() doesn't get triggered
    var foobear = $tartup.call("foo.bear");
    foobear.roar();

Credit
------

[DomReady v0.3.0](https://github.com/ded/domready/blob/v0.3.0/ready.js) by Dustin Diaz (needed old IE support!)

