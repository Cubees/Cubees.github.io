function main() {
	/*-------------SET CONTROLS ---------------*/
	controlNodes = setControls(W, H, gap);
	doSetAllLengths(W*0.9);
	
	BABYLON.Vector3.prototype.scaleInPlace = function (scale) {
		if(typeof scale === 'number') {
			this.x *= scale;
			this.y *= scale;
			this.z *= scale;
		}
		else {
			this.x *= scale.x;
			this.y *= scale.y;
			this.z *= scale.z;
		}
		return this;
	};
	
	/*-------------MAIN VARIABLES ---------------*/
	var num_of_nodes = 3;
	var node_index = 0;
	var num_of_steps = 25;
	var num_of_turns = 25;

	var setzoomEX = -200;
	var setzoomPR = -900;

	
	/*-------------MENU ELEMENTS---------------*/	
	//Get Menu Elements 
	var segment=document.getElementById("segment");
	var pAdd=document.getElementById("p_add");
	var pDelete=document.getElementById("p_delete");
	var pStraight=document.getElementById("p_straight");
	var pCurved=document.getElementById("p_curved");
	
	var pNode=document.getElementById("node");
	var pCorner=document.getElementById("p_corner");
	var pSmooth=document.getElementById("p_smooth");
	var pJoined=document.getElementById("p_joined");
	
	var export_=document.getElementById("export");
	var download=document.getElementById("download");
	var menu=document.getElementById("menu");
	
	var the_menu=document.getElementById("the_menu");
	var help=document.getElementById("help");
	var cubeesize=document.getElementById("cubeesize");
	var minisize=document.getElementById("minisize");
	var microsize=document.getElementById("microsize");
	var freesize=document.getElementById("freesize");
	var boxLtitle=document.getElementById("boxLtitle");
	var boxL=document.getElementById("boxL");
	var boxWtitle=document.getElementById("boxWtitle");
	var boxW=document.getElementById("boxW");
	var boxHtitle=document.getElementById("boxHtitle");
	var boxH=document.getElementById("boxH");
	var zoomin=document.getElementById("zoomin");
	var zoomout=document.getElementById("zoomout");
	var nozoom=document.getElementById("nozoom");
	var close=document.getElementById("close");
	
	var ddb = document.getElementsByClassName("dragDialogueBox");
	var closediv = document.getElementsByClassName("closediv");
	var headerDiv = document.getElementsByClassName("heading");
	var cancelDiv = document.getElementsByClassName("DBCancel"); 
	var inpt = document.getElementsByClassName("inpt");
	
	var storeDB = document.getElementById("storeDB"); 
	var storeIn = document.getElementById("storeIn");
	var storeBut = document.getElementById("storeBut");
	
	var coords = document.getElementById("coords");
	var inX = document.getElementById("inputX");
	var inY = document.getElementById("inputY");
	
	inX.addEventListener("change", function() {updateX(this.value)}, false);
	inY.addEventListener("change", function() {updateY(this.value)}, false);
	
	function updateX(val) {
		currentMesh.position.x = parseFloat(val);
		updateExtruded();
	}
	
	function updateY(val) {
		currentMesh.position.y = parseFloat(val);
		updateExtruded();
	}
	
	function updateExtruded() {
		extrudeTool=createTool(startNode,startNode,extrudeStudio.scene,num_of_steps);
		extrudeBlade = BABYLON.Mesh.CreateLines(null, extrudeTool.blade, null, null, extrudeBlade);
		for(var i=0; i<extrudeTool.controls.length;i++) {
			controlLines[i]=BABYLON.Mesh.CreateLines(null,extrudeTool.controls[i],null,null, controlLines[i]);
		}
		extruded.dispose();
		extruded=createExtruded("BWXEextruded", extrudeTool.blade, productStudio.scene, BABYLON.Mesh.DOUBLESIDE);
		bound.dispose();
		bound = container(extruded, productStudio.scene, grid );
	}
	
	controlSeg_title = document.getElementById("controlSeg_title");
		
	//Set readable styles for Elements
	pStraight.style.color="#888888";
	pCurved.style.color="#888888";
	
	pCorner.style.color="#888888";
	pSmooth.style.color="#000000";
	pJoined.style.color="#000000";
	
	cubeesize.style.color="#888888";
	minisize.style.color="#000000";
	microsize.style.color="#000000";
	freesize.style.color="#000000";
	
	zoomin.style.color="#888888";
	zoomout.style.color="#000000";
	nozoom.style.color="#888888";

	/*-------------EXTRUDE STUDIO ---------------*/	
	// Set the extrude studio
	var extrudeCanvas = document.getElementById("extrudeCanvas");

	var extrudeEngine = new BABYLON.Engine(extrudeCanvas, true);

	var extrudeStudio = new Studio(extrudeEngine);
	extrudeStudio.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), extrudeStudio.scene);
	extrudeStudio.camera.setPosition(new BABYLON.Vector3(0, 0, -200));
	extrudeStudio.light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0, 0, 0), extrudeStudio.scene);
	extrudeStudio.scene.clearColor = new BABYLON.Color3(0, 0, 0);
	
	//Create extrude Elements
	
	var backboard=BABYLON.Mesh.CreatePlane("backboard",1000,extrudeStudio.scene,false,BABYLON.Mesh.FRONTSIDE);	
	var greyMat = new BABYLON.StandardMaterial("grey", extrudeStudio.scene);
	greyMat.emissiveColor = new BABYLON.Color3(0.5,0.5,0.5);
	backboard.material = greyMat;
	backboard.position.y = 0;
	backboard.position.z=1;	
		
	var startNode = new node("strnode",0,50,0,extrudeStudio.scene);
	var rightNode = new node("rtnode",50,-50,0,extrudeStudio.scene);
	var leftNode = new node("lftnode",-50,-50,0,extrudeStudio.scene);
		
	var st1Control = new control("st1ctrl",10,50,0,extrudeStudio.scene);
	var st2Control = new control("st2ctrl",60,-40,0,extrudeStudio.scene);
	
	var rt1Control = new control("rt1ctrl",40,-60,0,extrudeStudio.scene);
	var rt2Control = new control("rt2ctrl",-40,-60,0,extrudeStudio.scene);
	
	var lt1Control = new control("lt1ctrl",-60,-40,0,extrudeStudio.scene);
	var lt2Control = new control("lt2ctrl",-10,50,0,extrudeStudio.scene);
		
	startNode.ctrl1=st1Control;
	startNode.ctrl2=st2Control;
	
	rightNode.ctrl1=rt1Control;
	rightNode.ctrl2=rt2Control;
	
	leftNode.ctrl1=lt1Control;
	leftNode.ctrl2=lt2Control;
	
	startNode.next=rightNode;
	startNode.prev=leftNode;
		
	rightNode.next=leftNode;
	rightNode.prev=startNode;
	
	leftNode.next=startNode;
	leftNode.prev=rightNode;
		
	extrudeTool=createTool(startNode,startNode,extrudeStudio.scene,num_of_steps);

	var extrudeBlade = BABYLON.Mesh.CreateLines("vcc", extrudeTool.blade, extrudeStudio.scene, true);
	
	var controlLines=[];
	for(var i=0; i<extrudeTool.controls.length;i++) {
		controlLines[i]=BABYLON.Mesh.CreateLines("cl"+node_index+i,extrudeTool.controls[i],extrudeStudio.scene,true);
	}
	
	//disc to show centre of cross section
	disc = BABYLON.Mesh.CreateDisc("disc", 2, 30, extrudeStudio.scene);
	disc.material = new BABYLON.StandardMaterial("cw", extrudeStudio.scene);
	disc.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
		
	//square to mark point on segment of Bezier
	var square_M = BABYLON.Mesh.CreateLines("square_M", [
		new BABYLON.Vector3(-2, 2, 10),
		new BABYLON.Vector3(2, 2, 10),
		new BABYLON.Vector3(2, -2, 10),
		new BABYLON.Vector3(-2, -2, 10),
		new BABYLON.Vector3(-2, 2, 10)
	], extrudeStudio.scene);

	// Studio Events
	var startingPoint;
	var currentMesh;
	var upPoint;
	var foundNode;
	
	var lightGreyMat = new BABYLON.StandardMaterial("lightGrey", extrudeStudio.scene);
	lightGreyMat.emissiveColor = new BABYLON.Color3(0.75,0.75,0.75);
	
	var whiteMat = new BABYLON.StandardMaterial("white", extrudeStudio.scene);
	whiteMat.emissiveColor = new BABYLON.Color3(0.95,0.95,0.95);

	var getBackboardPosition = function () {
		// Use a predicate to get position on the ground
		var pickinfo = extrudeStudio.scene.pick(extrudeStudio.scene.pointerX, extrudeStudio.scene.pointerY, function (mesh) { return mesh == backboard; });
       
		if (pickinfo.hit) {
			pickinfo.pickedPoint.z=0;
			return pickinfo.pickedPoint;
		}

		return null;
	};

	var onPointerDown = function (evt) {
		if (evt.button !== 0) {
			return;
		} 
			
		// check if we are under a mesh
		var pickInfo = extrudeStudio.scene.pick(extrudeStudio.scene.pointerX, extrudeStudio.scene.pointerY, function (mesh) { return mesh !== backboard; });
		if (pickInfo.hit) {		
			if(currentMesh && currentMesh.CType != "ctrl") {
				currentMesh.material = lightGreyMat;
			}
			currentMesh = pickInfo.pickedMesh;
			if(currentMesh.CType != "ctrl" ) {
				currentMesh.material = whiteMat;
			}
			coords.style.visibility = "visible";
			inX.value = Math.floor(currentMesh.position.x*100)/100;
			inY.value = Math.floor(currentMesh.position.y*100)/100;
			startingPoint = getBackboardPosition(evt);	
		}
		else {
			coords.style.visibility = "hidden";
		}
	};

	var onPointerUp = function (evt) {			
		if (startingPoint) {
			startingPoint = null;
			return;
		};
			
		upPoint = getBackboardPosition(evt);
		foundNode = proximity(upPoint,startNode, startNode)
		if(foundNode) {
			square_M.position.x=upPoint.x;
			square_M.position.y=upPoint.y;
			square_M.position.z=-10;
			
			pStraight.style.color="#888888";
			pCurved.style.color="#888888";	
			if(num_of_nodes>2) {
				if(foundNode.segmentType == "curved") {
					pStraight.style.color="#000000";
				}
				else {
					pCurved.style.color="#000000";
				}
			}
			segment.style.visibility="visible";
		}
		else {
			square_M.position.z=10;
			
			segment.style.visibility="hidden";
		}
	};

	var onPointerMove = function (evt) {
		if (!startingPoint) {
			return;
		}
		var current = getBackboardPosition(evt);
		if (!current) {
			return;
		}
		var diff = current.subtract(startingPoint);	
			
		currentMesh.position.addInPlace(diff);
			
		extrudeTool=createTool(startNode,startNode,extrudeStudio.scene,num_of_steps);
	
		extrudeBlade = BABYLON.Mesh.CreateLines(null, extrudeTool.blade, null, null, extrudeBlade);
		
		for(var i=0; i<extrudeTool.controls.length;i++) {
			controlLines[i]=BABYLON.Mesh.CreateLines(null,extrudeTool.controls[i],null,null, controlLines[i]);
		}
		
		extruded.dispose();
		extruded=createExtruded("BWXEextruded", extrudeTool.blade, productStudio.scene, BABYLON.Mesh.DOUBLESIDE);
		bound.dispose();
		bound = container(extruded, productStudio.scene, grid );

		startingPoint = current;
		
		inX.value = Math.floor(currentMesh.position.x*100)/100;
		inY.value = Math.floor(currentMesh.position.y*100)/100;

	};

	extrudeCanvas.addEventListener("mousedown", onPointerDown, false);
	extrudeCanvas.addEventListener("mouseup", onPointerUp, false);
	extrudeCanvas.addEventListener("mousemove", onPointerMove, false);

	extrudeStudio.scene.onDispose = function () {
		extrudeCanvas.removeEventListener("mousedown", onPointerDown);
		extrudeCanvas.removeEventListener("mouseup", onPointerUp);
		extrudeCanvas.removeEventListener("mousemove", onPointerMove);
	};

	 // Register a render loop to repeatedly render the scene
	extrudeEngine.runRenderLoop(function () {
		extrudeStudio.scene.render();
	}); 
	
	// Watch for browser/canvas resize events
	window.addEventListener("resize", function () {
		extrudeEngine.resize();
		CHT = Math.floor(window.innerHeight*0.67);
		document.getElementById("canvasHolder").style.top = CHT +"px";
	});
	
	/*-------------PRODUCT STUDIO ---------------*/	
	// Set the product studio
	var productCanvas = document.getElementById("productCanvas");

	var productEngine = new BABYLON.Engine(productCanvas, true);

	productStudio = new Studio(productEngine);
	productStudio.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), productStudio.scene);
	productStudio.camera.setPosition(new BABYLON.Vector3(150, 50, -900));
	productStudio.camera.attachControl(productCanvas, true);	
	productStudio.frontLight = new BABYLON.PointLight("omni", new BABYLON.Vector3(0, 150, -600), productStudio.scene);
	productStudio.backLight = new BABYLON.PointLight("omni", new BABYLON.Vector3(50, 150, 600), productStudio.scene);
	productStudio.bottomLight = new BABYLON.PointLight("omni", new BABYLON.Vector3(-50, -150, 0), productStudio.scene);
	productStudio.frontLight.intensity = 0.7;
	productStudio.backLight.intensity = 0.6;
	productStudio.bottomLight.intensity = 0.5;
	productStudio.scene.clearColor = new BABYLON.Color3(0.75, 0.75, 0.75);
	
	// Create product
	extruded=createExtruded("BWXEextruded", extrudeTool.blade, productStudio.scene);
	bound = container(extruded, productStudio.scene, grid );
	
	// material
	var darkMat = new BABYLON.StandardMaterial("dark", productStudio.scene);
    darkMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    darkMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    darkMat.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);
	
	//extruded.material=darkMat;
		
	// Register a render loop to repeatedly render the scene
	productEngine.runRenderLoop(function () {
		productStudio.scene.render();
	}); 
	
	// Watch for browser/canvas resize events
	window.addEventListener("resize", function () {
		productEngine.resize();
	});
	
		/*-------------MENU ELEMENTS EVENTS---------------*/	
	
	//Menu Events
	pAdd.addEventListener('click', onAdd, false);

	function onAdd () {
		segment.style.visibility="hidden";		
		var xa, xb, ya, yb;
		square_M.position.z=10;
		num_of_nodes++;
		var newNode=new node("node"+(++node_index), upPoint.x, upPoint.y, 0, extrudeStudio.scene);
		xa=foundNode.marker.position.x;
		ya=foundNode.marker.position.y;
		xb=foundNode.next.marker.position.x;
		yb=foundNode.next.marker.position.y;
		newNode.next = foundNode.next;
		foundNode.next.prev = newNode;
		foundNode.next = newNode;
		newNode.prev = foundNode;
		var dx = (xb - xa)/8;
		var dy = (yb - ya)/8;
		newNode.ctrl1 = new control("ctrl1"+node_index,newNode.x + dx,newNode.y + dy,0,extrudeStudio.scene);
		newNode.ctrl2 = foundNode.ctrl2;
		foundNode.ctrl2 = new control("ctrl2"+node_index,newNode.x - dx,newNode.y - dy,0,extrudeStudio.scene);		
		extrudeBlade.dispose()
		for(var i=0; i<controlLines.length;i++) {
			controlLines[i].dispose();
		}
	
		extrudeTool=createTool(startNode,startNode,extrudeStudio.scene,num_of_steps);	
				
		extrudeBlade = BABYLON.Mesh.CreateLines("vcc", extrudeTool.blade, extrudeStudio.scene, true);
				
		for(var i=0; i<extrudeTool.controls.length;i++) {
				controlLines[i]=BABYLON.Mesh.CreateLines("cl"+node_index+i,extrudeTool.controls[i],extrudeStudio.scene,true);
		}
		
		extruded.dispose();
		extruded=createExtruded("BWXEextruded", extrudeTool.blade, productStudio.scene, BABYLON.Mesh.DOUBLESIDE);
		
		bound.dispose();
		bound = container(extruded, productStudio.scene, grid );
	
	}
	
	pDelete.addEventListener('click', onDelete, false);
	
	function onDelete () {
		if(pDelete.style.color=="rgb(136, 136, 136)") {
			return
		}
		for(var i=0; i<controlLines.length;i++) {
			controlLines[i].dispose();
		}	
		segment.style.visibility="hidden";		
		var xa, xb, ya, yb;
		square_M.position.z=10;
		num_of_nodes--;
		if(num_of_nodes == 2) {
			pDelete.style.color = "#888888";
		}
		if(foundNode ==startNode) {
			foundNode=foundNode.next;
		}
		foundNode.marker.dispose();
		foundNode.ctrl1.marker.dispose();
		delete foundNode.ctrl1;
		foundNode.prev.ctrl2.marker.dispose();
		foundNode.prev.ctrl2 = foundNode.ctrl2;
		foundNode.next.prev = foundNode.prev;
		foundNode.prev.next = foundNode.next;
		delete foundNode;		
		extrudeBlade.dispose();
		
		
	
		extrudeTool=createTool(startNode,startNode,extrudeStudio.scene,num_of_steps);	
				
		extrudeBlade = BABYLON.Mesh.CreateLines("vcc", extrudeTool.blade, extrudeStudio.scene, true);
				
		for(var i=0; i<extrudeTool.controls.length;i++) {
				controlLines[i]=BABYLON.Mesh.CreateLines("cl"+node_index+i,extrudeTool.controls[i],extrudeStudio.scene,true);
		}
		
		extruded.dispose();
		extruded=createExtruded("BWXEextruded", extrudeTool.blade, productStudio.scene, BABYLON.Mesh.DOUBLESIDE);
		
		bound.dispose();
		bound = container(extruded, productStudio.scene, grid );
	
	}	

	pStraight.addEventListener("click", onStraight, false);
	
	function onStraight () {		
		if(pStraight.style.color=="rgb(136, 136, 136)") {
			return
		}		
		//segment.style.visibility="hidden";
		square_M.position.z=10;		
		pStraight.style.color="#888888";
		pCurved.style.color="#000000";
		foundNode.segmentType = "straight";
		extrudeBlade.dispose()
		for(var i=0; i<controlLines.length;i++) {
			controlLines[i].dispose();
		}
	
		extrudeTool=createTool(startNode,startNode,extrudeStudio.scene,num_of_steps);	
				
		extrudeBlade = BABYLON.Mesh.CreateLines("vcc", extrudeTool.blade, extrudeStudio.scene, true);
				
		for(var i=0; i<extrudeTool.controls.length;i++) {
				controlLines[i]=BABYLON.Mesh.CreateLines("cl"+node_index+i,extrudeTool.controls[i],extrudeStudio.scene,true);
		}
		
		extruded.dispose();
		extruded=createExtruded("BWXEextruded", extrudeTool.blade, productStudio.scene, BABYLON.Mesh.DOUBLESIDE);
		
		bound.dispose();
		bound = container(extruded, productStudio.scene, grid );
	}
	
	pCurved.addEventListener("click", onCurved, false);
	
	function onCurved () {		
		if(pCurved.style.color=="rgb(136, 136, 136)") {
			return
		}		
		segment.style.visibility="hidden";
		square_M.position.z=10;		
		pStraight.style.color="#000000";
		pCurved.style.color="#888888";
		foundNode.segmentType = "curved";
		extrudeBlade.dispose();
		for(var i=0; i<controlLines.length;i++) {
			controlLines[i].dispose();
		}
	
		extrudeTool=createTool(startNode,startNode,extrudeStudio.scene,num_of_steps);	
				
		extrudeBlade = BABYLON.Mesh.CreateLines("vcc", extrudeTool.blade, extrudeStudio.scene, true);
				
		for(var i=0; i<extrudeTool.controls.length;i++) {
				controlLines[i]=BABYLON.Mesh.CreateLines("cl"+node_index+i,extrudeTool.controls[i],extrudeStudio.scene,true);
		}
		
		extruded.dispose();
		extruded=createExtruded("BWXEextruded", extrudeTool.blade, productStudio.scene, BABYLON.Mesh.DOUBLESIDE);
		
		bound.dispose();
		bound = container(extruded, productStudio.scene, grid );
	}
	
	export_.addEventListener("click", doExport, false);
	
	function doExport() {
		writeExport(extruded);
	}
	
	download.addEventListener("click", function() {storeDB.style.visibility='visible';}, false);
	
	menu.addEventListener("click", function() {the_menu.style.visibility="visible"}, false);
	
	close.addEventListener("click", function() {the_menu.style.visibility="hidden"}, false);
	
	cubeesize.addEventListener("click", doCubeeSize, false);
		
	function doCubeeSize() {
		if(cubeesize.style.color=="rgb(136, 136, 136)") {
			return
		}
		cubeesize.style.color="#888888";
		minisize.style.color="#000000";
		microsize.style.color="#000000";
		freesize.style.color="#000000";
		grid = 60;
		bound.dispose();
		bound = container(extruded, productStudio.scene, grid );
	}
	
	minisize.addEventListener("click", doMiniSize, false);
		
	function doMiniSize() {
		if(minisize.style.color=="rgb(136, 136, 136)") {
			return
		}
		cubeesize.style.color="#000000";
		minisize.style.color="#888888";
		microsize.style.color="#000000";
		freesize.style.color="#000000";
		grid = 15;
		bound.dispose();
		bound = container(extruded, productStudio.scene, grid );
	}
	
	microsize.addEventListener("click", doMicroSize, false);
		
	function doMicroSize() {
		if(microsize.style.color=="rgb(136, 136, 136)") {
			return
		}
		cubeesize.style.color="#000000";
		minisize.style.color="#000000";
		microsize.style.color="#888888";
		freesize.style.color="#000000";
		grid = 1;
		bound.dispose();
		bound = container(extruded, productStudio.scene, grid );
	}
	
	freesize.addEventListener("click", doFreeSize, false);
		
	function doFreeSize() {
		if(freesize.style.color=="rgb(136, 136, 136)") {
			return
		}
		cubeesize.style.color="#000000";
		minisize.style.color="#000000";
		microsize.style.color="#000000";
		freesize.style.color="#888888";
		grid = 0;
		bound.dispose();
		bound = container(extruded, productStudio.scene, grid );
		bound.showBoundingBox = false;
	}
	
	zoomin.addEventListener('click', doZoomin, false) 
	
	function doZoomin() {
		if(zoomin.style.color=="rgb(136, 136, 136)") {
			return
		}
		setzoomEX +=50;
		setzoomPR +=50;
		zoomout.style.color ="#000000";
		extrudeStudio.camera.setPosition(new BABYLON.Vector3(0, 0, setzoomEX));
		productStudio.camera.setPosition(new BABYLON.Vector3(0, 0, setzoomPR));
		if(setzoomEX ==-200) {
			zoomin.style.color ="#888888";
			nozoom.style.color ="#888888";
		}
	}
	
	zoomout.addEventListener('click', doZoomout, false);
	
	function doZoomout() {
		if(zoomout.style.color=="rgb(136, 136, 136)") {
			return;
		}
		setzoomEX -=50;
		setzoomPR -=50;
		zoomin.style.color ="#000000";
		nozoom.style.color ="#000000";
		extrudeStudio.camera.setPosition(new BABYLON.Vector3(0, 0, setzoomEX));
		productStudio.camera.setPosition(new BABYLON.Vector3(0, 0, setzoomPR));
		if(setzoomEX ==-600) {
			zoomout.style.color ="#888888";
		}
	}

	nozoom.addEventListener('click', doNoZoom, false) 
	
	function doNoZoom() {
		if(nozoom.style.color=="rgb(136, 136, 136)") {
			return
		}
		setzoomEX =-200;
		setzoomPR = -900;
		extrudeStudio.camera.setPosition(new BABYLON.Vector3(0, 0, setzoomEX));
		productStudio.camera.setPosition(new BABYLON.Vector3(0, 0, setzoomPR));
		zoomout.style.color ="#000000";
		zoomin.style.color ="#888888";
		nozoom.style.color ="#000000";
	}
	
	help.addEventListener('click', doHelp, false);
	
	function doHelp() {
		window.open("../../extrudehelp/home.html");
	}
	
	/*-----------DRAG DIALOGUE BOX EVENTS--------------------*/
	
	
	for(var i=0;i<ddb.length;i++){
        ddb[i].style.top = "150px";
        ddb[i].style.left = "500px";        
   };
	
	for(var i=0;i<headerDiv.length;i++){
        headerDiv[i].addEventListener('mousedown', function(e) {startdbDrag(e, this)}, false);
        headerDiv[i].addEventListener('mouseup', function(e) {enddbDrag(e)}, false);
   };
   
   
	//Close dialogue box
	for(var i=0;i<closediv.length;i++){
        closediv[i].addEventListener('click', function() {doClose(this)}, false);
   };
    
    //Cancel dialogue box
    for(var i=0;i<cancelDiv.length;i++){
        cancelDiv[i].addEventListener('click', function() {doClose(this)}, false);
    };
    
    //input dialogue box
    for(var i=0;i<inpt.length;i++){   	
        inpt[i].addEventListener('keydown', function(evt) {inpKeyDown(evt)}, false);
    };    
 
    
    //Download
   storeBut.addEventListener('click', startDownload, false);
       
    
    /*-------------DIALOGUE BOX FUNCTIONS--------*/

	function doClose(box) {
		box.parentNode.parentNode.parentNode.style.visibility = 'hidden';
	}
	
	
	function inpKeyDown(evt) {		
		evt.stopPropagation();
	};
	
	function startDownload() {
		doDownload(storeIn.value,extruded, storeDB);
	}
	
}	