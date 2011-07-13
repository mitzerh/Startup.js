(function(){
	// site
	var Add = $tartup.site.Add,
		DOC_Ready = $tartup.site.OnDocReady,
		PAGE_Ready = $tartup.site.OnPageReady;
	
	DOC_Ready("test",function() {
		console.log("test");
	});
	
	DOC_Ready("test2",function(){
		console.log("hello");
	});
	
	DOC_Ready("channel.test3",function(){
		console.log("test3 here");
	});
	
	DOC_Ready("obj1",{
		init: function() {
			console.log("init 1");
		}
	});
	
	DOC_Ready("obj2",{
		init: function() {
			console.log("init 2");
		}
	});
	
	PAGE_Ready("channel.obj2",{
		init: function() {
			console.log("page ready - ch init 2");
		}
	});
	console.log($tartup)
	
}());