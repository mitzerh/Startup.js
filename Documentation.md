Including $tartup
=================
The Startup file can be included wherever you'd like it to be. 
Whether in your head or within your body tag.


Your control code
-----------------
This is what your control code should always start to look like:

	(function(){
		
		/** 
		 * The 3 Important variables to declare
		 */
		var Add = $tartup.site.Add,
			DOC_Ready = $tartup.site.OnDocReady,
			PAGE_Ready = $tartup.site.OnPageReady;
		
	}());
	

Ways of Setting up your functions/objects
-----------------------------------------

### "Add" Method
Adding is just simply defining a function or an object that could be called later.
You cannot add an anonymous function!

#### Adding a function call

	// This function will be accessible by calling:
	// $tartup.site.SomeFunction();
	Add("SomeFunction",function(user){
	   alert("Hello " + user + "!");
	});	


#### Adding an object
	
	// This object will be accessible:
	// $tartup.site.SomeObject;
	Add("SomeObject",{
	   sayHello: function(user){
		  user = user || "nobody";
	      alert("Hello " + user + "!");
	   },
	   sayGoodbye: function(user){
		  user = user || "nobody";
	      alert("Goodbye " + user + "!");
	   }
	});


### "DOC_Ready" Method
Setting up functions or objects on DOC_Ready will:

* Execute the script on DOM Ready (Thanks to: http://code.google.com/p/domready/) based on certain rules (see below)
* Creates the function/object

Notes on execution:

1. Script execution will be automatic if it is an anonymous function.
2. If you define an object, the only function that will be automatically executed will be the init() function.
3. Anonymous object creation is prohibited!

#### Execute anonymous function

	// No reference is created, it is an anonymous function
	DOC_Ready(function(){
	   alert("DOM is Ready!");
	});
 
	
	// This function will also be accessible by calling:
	// $tartup.site.isDOMReady();
	DOC_Ready("isDOMReady",function(){
	   alert("DOM is Ready!!!");
	});
 
	

#### Execute objects

	// This object will also be accessible:
	// $tartup.site.ReadyObject;
	DOC_Ready("ReadyObject",{
	   // init function will triggered automatically
	   // if it is not present, there is no execution done, but the object will still be created
	   init: function() { 
	      this.sayDomReady();
	   },
	   sayDomReady: function() {
	      alert("DOM is Ready!!!");
	   }
	});


### "PAGE_Ready" Method
PAGE_Ready works similar to the Document Ready Method. 
The only requirement for executing this method is to add the execution function
at the bottom of your page before your closing body tag:

	. . . .
	<script>
	   try { $tartup.pageReady(); } catch(err) {
	      // write your logger here
	   }
	</script>
	</body>

This ensures execution of intended inline scripts.


### You can also create your own object namespaces:

	// This function will be accessible by calling:
	// $tartup.site.myNamespace.hello();
	Add("myNamespace.sayHello",function(user){
	   user = user || "nobody";
	   alert("hello! " + user);
	});


	// This object will be accessible:
	// $tartup.site.myNamespace;
	Add("myNamespace",{
	   goodBye: function() {
	      alert("goodbye son!");
	   },
	   farewell: function() {
	      alert("farewell son!");	
	   }
	});
	

And the similar implementation of custom namespaces applies to the other methods.

Other Features
==============

### Creating multiple instances of $tartup
You can create new instances by using the newInstance() function:

	// create another instance using a different variable
	var AnotherStartup = $tartup.newInstance();


### Adding utility functions directly to the utils object
You can use this shortcut function to add to the utils:

	// add a util
	$tartup.addUtil("someUtil",function(){
		alert("i'm a util!");
	});


