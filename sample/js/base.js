(function($tartup){
	
	/** 
	 * The 3 Important variables to declare
	 */
	var Add = $tartup.site.Add,
		DOC_Ready = $tartup.site.OnDocReady,
		PAGE_Ready = $tartup.site.OnPageReady;
	
	
	/*** Add Method ***/
	
	// This function will be accessible by calling:
	// $tartup.site.SomeFunction();
	Add("SomeFunction",function(user){
	   log("Hello " + user + "!");
	});
	
	
	// This object will be accessible:
	// $tartup.site.SomeObject;
	Add("SomeObject",{
	   sayHello: function(user){
		  user = user || "nobody";
	      log("Hello " + user + "!");
	   },
	   sayGoodbye: function(user){
		  user = user || "nobody";
	      log("Goodbye " + user + "!");
	   }
	});
	
	/*** DOC_Ready Method ***/
	
	// Executing an anonymous function
	// No reference is created, it is an anonymous function
	DOC_Ready(function(){
	   log("DOM is Ready on anonymous function!");
	});
 

	// This function will also be accessible by calling:
	// $tartup.site.isDOMReady();
	DOC_Ready("isDOMReady",function(){
	   log("DOM is Ready on function!!!");
	});
 
	
	// Executing an object
	// This object will also be accessible:
	// $tartup.site.ReadyObject;
	DOC_Ready("ReadyObject",{
	   // init function will triggered automatically
	   // if it is not present, there is no execution done, but the object will still be created
	   init: function() { 
	      this.sayDomReady();
	   },
	   sayDomReady: function() {
	      log("DOM is Ready on object!!!");
	   }
	});
 
	
	/*** PAGE_Ready ***/
	
	// Executing an anonymous function
	// No reference is created, it is an anonymous function
	PAGE_Ready(function(){
	   log("Anonymous Page Ready!");
		
		// call custom object namespace
		$tartup.site.myNamespace.sayHello("Mr. User");
	});
	
	
	// This function will also be accessible by calling:
	// $tartup.site.helloThere();
	PAGE_Ready("helloThere",function(){
	   log("Hello There Page Ready!!!");
	});
	
	// Executing an object
	// This object will also be accessible:
	// $tartup.site.PageReadyObject;
	PAGE_Ready("PageReadyObject",{
	   // init function will triggered automatically
	   // if it is not present, there is no execution done, but the object will still be created
	   init: function() { 
	      this.sayPageIsReady();
	   },
	   sayPageIsReady: function() {
	      log("Page is Ready!!!");
	   }
	});
	
	/*** Custom Object Namespace ***/
	
	// This function will be accessible by calling:
	// $tartup.site.myNamespace.hello();
	Add("myNamespace.sayHello",function(user){
	   user = user || "nobody";
	   log("hello! " + user);
	});

	// This object will be accessible:
	// $tartup.site.myNamespace;
	Add("myNamespace", {
	   goodBye: function() {
	      log("goodbye son!");
	   },
	   farewell: function() {
	      log("farewell son!");	
	   }
	});
	
	function log(str) {
		if (window.console && console.log) {
			console.log(str);
		} else {
			alert(str);
		}
	}
	
}($tartup));
