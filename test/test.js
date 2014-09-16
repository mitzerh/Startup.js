
var FOX = startupAMD.create();

FOX.config({
	basePath: "//www.hmabesa.dev/dev/startup/test"
});


FOX.load(["foo"], function(){
	console.log("FOO'd");
});