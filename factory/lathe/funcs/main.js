function main() {
	/*-------------MAIN VARIABLES ---------------*/
	var num_of_nodes = 2;
	var node_index = 0;
	var num_of_steps = 25;
	var num_of_turns = 25;
	
	var grid = 60;
	var setzoom = -200;
	
	var bound;
	
	var cursorPos;
	var downMouse = false;
	var dlgbox;
	
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
	var boxHtitle=document.getElementById("boxHtitle");
	var boxH=document.getElementById("boxH");
	var boxWtitle=document.getElementById("boxWtitle");
	var boxW=document.getElementById("boxW");
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

	/*-------------LATHE STUDIO ---------------*/	
	// Set the lathe studio
	var latheCanvas = document.getElementById("latheCanvas");

	var latheEngine = new BABYLON.Engine(latheCanvas, true);

	var latheStudio = new Studio(latheEngine);
	latheStudio.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), latheStudio.scene);
	latheStudio.camera.setPosition(new BABYLON.Vector3(0, 0, -200));
	latheStudio.light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0, 0, 0), latheStudio.scene);
	latheStudio.scene.clearColor = new BABYLON.Color3(0, 0, 0);
	
	//Create Lathe Elements
	
	var backboard=BABYLON.Mesh.CreatePlane("backboard",1000,latheStudio.scene,false,BABYLON.Mesh.FRONTSIDE);	
	var greyMat = new BABYLON.StandardMaterial("grey", latheStudio.scene);
	greyMat.emissiveColor = new BABYLON.Color3(0.5,0.5,0.5);
	backboard.material = greyMat;
	backboard.position.y = 0;
	backboard.position.z=1;	
		
	var startNode = new node("fxdstr",0,60,0,latheStudio.scene);
	var endNode = new node("fxdend",0,-60,0,latheStudio.scene);
		
	var firstControl = new control("firstctrl",20,50,0,latheStudio.scene);
	var lastControl = new control("lastctrl",20,-50,0,latheStudio.scene);
		
	startNode.ctrl1=firstControl;
	startNode.ctrl2=lastControl;
	startNode.next=endNode;
		
	endNode.prev=startNode;
		
	var latheTool=createTool(startNode,endNode,latheStudio.scene,num_of_steps);

	var latheBlade = BABYLON.Mesh.CreateLines("vcc", latheTool.blade, latheStudio.scene, true);
	
	var controlLines=[];
	for(var i=0; i<latheTool.controls.length;i++) {
		controlLines[i]=BABYLON.Mesh.CreateLines("cl"+node_index+i,latheTool.controls[i],latheStudio.scene,true);
	}
		
	var yaxis = BABYLON.Mesh.CreateLines("yaxis", [
		new BABYLON.Vector3(0, -100, 0.5),
		new BABYLON.Vector3(0, 100, 0.5)
	], latheStudio.scene);

		
	//square to mark point on segment of Bezier
	var square_M = BABYLON.Mesh.CreateLines("square_M", [
		new BABYLON.Vector3(-2, 2, 10),
		new BABYLON.Vector3(2, 2, 10),
		new BABYLON.Vector3(2, -2, 10),
		new BABYLON.Vector3(-2, -2, 10),
		new BABYLON.Vector3(-2, 2, 10)
	], latheStudio.scene);

	// Studio Events
	var startingPoint;
	var currentMesh;
	var upPoint;
	var foundNode;
	
	var lightGreyMat = new BABYLON.StandardMaterial("lightGrey", latheStudio.scene);
	lightGreyMat.emissiveColor = new BABYLON.Color3(0.75,0.75,0.75);
	
	var whiteMat = new BABYLON.StandardMaterial("white", latheStudio.scene);
	whiteMat.emissiveColor = new BABYLON.Color3(0.95,0.95,0.95);

	var getBackboardPosition = function () {
		// Use a predicate to get position on the ground
		var pickinfo = latheStudio.scene.pick(latheStudio.scene.pointerX, latheStudio.scene.pointerY, function (mesh) { return mesh == backboard; });
       
		if (pickinfo.hit) {
			pickinfo.pickedPoint.z=0;
			return pickinfo.pickedPoint;
		}

		return null;
	};

	var onPointerDown = function (evt) {
		if (evt.button !== 0) {
			return;
		}; 
			
		// check if we are under a mesh
		var pickInfo = latheStudio.scene.pick(latheStudio.scene.pointerX, latheStudio.scene.pointerY, function (mesh) { return mesh !== backboard; });
		if (pickInfo.hit) {		
			if(currentMesh && currentMesh.CType != "ctrl") {
				currentMesh.material = lightGreyMat;
			}
			currentMesh = pickInfo.pickedMesh;
			if(currentMesh !== endNode.marker && currentMesh.CType != "ctrl" ) {
				currentMesh.material = whiteMat;
			}
			startingPoint = getBackboardPosition(evt);	
		}
	};

	var onPointerUp = function (evt) {			
		if (startingPoint) {
			startingPoint = null;
			return;
		};
			
		upPoint = getBackboardPosition(evt);
		foundNode = proximity(upPoint,startNode, endNode)
		if(foundNode) {
			square_M.position.x=upPoint.x;
			square_M.position.y=upPoint.y;
			square_M.position.z=-10;
			
			pStraight.style.color="#888888";
			pCurved.style.color="#888888";
			pDelete.style.color="#888888";	
			if(num_of_nodes>2) {
				pDelete.style.color="#000000";
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
		};
		var current = getBackboardPosition(evt);
		if (!current) {
			return;
		}
		if(currentMesh === endNode.marker) {
			return;
		};
		
		var diff = current.subtract(startingPoint);	
		if(currentMesh === startNode.marker) {
			diff.x=0;
		}			
		currentMesh.position.addInPlace(diff);
			
		latheTool=createTool(startNode,endNode,latheStudio.scene,num_of_steps);
	
		latheBlade = BABYLON.Mesh.CreateLines(null, latheTool.blade, null, null, latheBlade);
		
		for(var i=0; i<latheTool.controls.length;i++) {
			controlLines[i]=BABYLON.Mesh.CreateLines(null,latheTool.controls[i],null,null, controlLines[i]);
		}
		
		turned = updateTurned(turned, latheTool.blade, num_of_turns, productStudio.scene);
		
		bound.dispose();
		bound = container(latheTool.blade, productStudio.scene, grid);

		startingPoint = current;

	};

	latheCanvas.addEventListener("mousedown", onPointerDown, false);
	latheCanvas.addEventListener("mouseup", onPointerUp, false);
	latheCanvas.addEventListener("mousemove", onPointerMove, false);

	latheStudio.scene.onDispose = function () {
		latheCanvas.removeEventListener("mousedown", onPointerDown);
		latheCanvas.removeEventListener("mouseup", onPointerUp);
		latheCanvas.removeEventListener("mousemove", onPointerMove);
	};

	 // Register a render loop to repeatedly render the scene
	latheEngine.runRenderLoop(function () {
		latheStudio.scene.render();
	}); 
	
	// Watch for browser/canvas resize events
	window.addEventListener("resize", function () {
		latheEngine.resize();
	});
	
	/*-------------PRODUCT STUDIO ---------------*/	
	// Set the product studio
	var productCanvas = document.getElementById("productCanvas");

	var productEngine = new BABYLON.Engine(productCanvas, true);

	var productStudio = new Studio(productEngine);
	productStudio.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), productStudio.scene);
	productStudio.camera.setPosition(new BABYLON.Vector3(0, 0, -200));
	productStudio.camera.attachControl(productCanvas, true);	
	productStudio.frontLight = new BABYLON.PointLight("omni", new BABYLON.Vector3(0, 50, -100), productStudio.scene);
	productStudio.backLight = new BABYLON.PointLight("omni", new BABYLON.Vector3(10, 50, 150), productStudio.scene);
	productStudio.bottomLight = new BABYLON.PointLight("omni", new BABYLON.Vector3(-10, -150, 5), productStudio.scene);
	productStudio.frontLight.intensity = 0.7;
	productStudio.backLight.intensity = 0.6;
	productStudio.bottomLight.intensity = 0.5;
	productStudio.scene.clearColor = new BABYLON.Color3(0.75, 0.75, 0.75);
	
	// Create product
	var turned=createTurned("BWXEturned", latheTool.blade, num_of_turns, productStudio.scene, true, BABYLON.Mesh.FRONTSIDE);
	
	bound = container(latheTool.blade, productStudio.scene, grid);
	
	// material
	var darkMat = new BABYLON.StandardMaterial("dark", productStudio.scene);
    darkMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    darkMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    darkMat.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);
	
	turned.material=darkMat;
		
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
		var newNode=new node("node"+(++node_index), upPoint.x, upPoint.y, 0, latheStudio.scene);
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
		newNode.ctrl1 = new control("ctrl1"+node_index,newNode.x + dx,newNode.y + dy,0,latheStudio.scene);
		newNode.ctrl2 = foundNode.ctrl2;
		foundNode.ctrl2 = new control("ctrl2"+node_index,newNode.x - dx,newNode.y - dy,0,latheStudio.scene);		
		latheBlade.dispose()
		for(var i=0; i<controlLines.length;i++) {
			controlLines[i].dispose();
		}
	
		latheTool=createTool(startNode,endNode,latheStudio.scene,num_of_steps);	
				
		latheBlade = BABYLON.Mesh.CreateLines("vcc", latheTool.blade, latheStudio.scene, true);
				
		for(var i=0; i<latheTool.controls.length;i++) {
				controlLines[i]=BABYLON.Mesh.CreateLines("cl"+node_index+i,latheTool.controls[i],latheStudio.scene,true);
		}
		
		turned.dispose();
		
		turned=createTurned("BWXEturned", latheTool.blade, num_of_turns, productStudio.scene, true, BABYLON.Mesh.FRONTSIDE);
		
		bound.dispose();
		bound = container(latheTool.blade, productStudio.scene, grid);
	
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
		latheBlade.dispose();
		
		
	
		latheTool=createTool(startNode,endNode,latheStudio.scene,num_of_steps);	
				
		latheBlade = BABYLON.Mesh.CreateLines("vcc", latheTool.blade, latheStudio.scene, true);
				
		for(var i=0; i<latheTool.controls.length;i++) {
				controlLines[i]=BABYLON.Mesh.CreateLines("cl"+node_index+i,latheTool.controls[i],latheStudio.scene,true);
		}
		
		turned.dispose();
		
		turned=createTurned("BWXEturned", latheTool.blade, num_of_turns, productStudio.scene, true, BABYLON.Mesh.FRONTSIDE);
		
		bound.dispose();
		bound = container(latheTool.blade, productStudio.scene, grid); 
	
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
		latheBlade.dispose()
		for(var i=0; i<controlLines.length;i++) {
			controlLines[i].dispose();
		}
	
		latheTool=createTool(startNode,endNode,latheStudio.scene,num_of_steps);	
				
		latheBlade = BABYLON.Mesh.CreateLines("vcc", latheTool.blade, latheStudio.scene, true);
				
		for(var i=0; i<latheTool.controls.length;i++) {
				controlLines[i]=BABYLON.Mesh.CreateLines("cl"+node_index+i,latheTool.controls[i],latheStudio.scene,true);
		}
		
		turned.dispose();
		turned=createTurned("BWXEturned", latheTool.blade, num_of_turns, productStudio.scene, true, BABYLON.Mesh.FRONTSIDE);
		
		bound.dispose();
		bound = container(latheTool.blade, productStudio.scene, grid);
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
		latheBlade.dispose();
		for(var i=0; i<controlLines.length;i++) {
			controlLines[i].dispose();
		}
	
		latheTool=createTool(startNode,endNode,latheStudio.scene,num_of_steps);	
				
		latheBlade = BABYLON.Mesh.CreateLines("vcc", latheTool.blade, latheStudio.scene, true);
				
		for(var i=0; i<latheTool.controls.length;i++) {
				controlLines[i]=BABYLON.Mesh.CreateLines("cl"+node_index+i,latheTool.controls[i],latheStudio.scene,true);
		}
		
		turned.dispose();
		turned=createTurned("BWXEturned", latheTool.blade, num_of_turns, productStudio.scene, true, BABYLON.Mesh.FRONTSIDE);
		
		bound.dispose();
		bound = container(latheTool.blade, productStudio.scene, grid);
	}
	
	export_.addEventListener("click", doExport, false);
	
	function doExport() {
		writeExport(turned);
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
		bound = container(latheTool.blade, productStudio.scene, grid);
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
		bound = container(latheTool.blade, productStudio.scene, grid);
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
		bound = container(latheTool.blade, productStudio.scene, grid);
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
		bound = container(latheTool.blade, productStudio.scene, grid);
		bound.showBoundingBox = false;
	}
	
	zoomin.addEventListener('click', doZoomin, false) 
	
	function doZoomin() {
		if(zoomin.style.color=="rgb(136, 136, 136)") {
			return
		}
		setzoom +=50;
		zoomout.style.color ="#000000";
		latheStudio.camera.setPosition(new BABYLON.Vector3(0, 0, setzoom));
		productStudio.camera.setPosition(new BABYLON.Vector3(0, 0, setzoom));
		if(setzoom ==-200) {
			zoomin.style.color ="#888888";
			nozoom.style.color ="#888888";
		}
	}
	
	zoomout.addEventListener('click', doZoomout, false);
	
	function doZoomout() {
		if(zoomout.style.color=="rgb(136, 136, 136)") {
			return;
		}
		setzoom -=50;
		zoomin.style.color ="#000000";
		nozoom.style.color ="#000000";
		latheStudio.camera.setPosition(new BABYLON.Vector3(0, 0, setzoom));
		productStudio.camera.setPosition(new BABYLON.Vector3(0, 0, setzoom));
		if(setzoom ==-600) {
			zoomout.style.color ="#888888";
		}
	}

	nozoom.addEventListener('click', doNoZoom, false) 
	
	function doNoZoom() {
		if(zoomout.style.color=="rgb(136, 136, 136)") {
			return
		}
		setzoom =-200;
		latheStudio.camera.setPosition(new BABYLON.Vector3(0, 0, setzoom));
		productStudio.camera.setPosition(new BABYLON.Vector3(0, 0, setzoom));
		zoomout.style.color ="#000000";
		zoomin.style.color ="#888888";
		nozoom.style.color ="#000000";
	}
	
	/*-----------DRAG DIALOGUE BOX EVENTS--------------------*/
	
	//Drag events
	window.addEventListener('mousemove', function(e) {doDrag(e)}, false);
	
	for(var i=0;i<ddb.length;i++){
        ddb[i].style.top = "150px";
        ddb[i].style.left = "500px";
   };
	
	for(var i=0;i<headerDiv.length;i++){
        headerDiv[i].addEventListener('mousedown', function(e) {startdbDrag(e, this)}, false);
        headerDiv[i].addEventListener('mouseup', function(e) {enddbDrag(e)}, false);
    }
	;
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
    
    /*-----------DRAG DIALOGUE BOX EVENTS--------------------*/
   window.addEventListener('mousemove', function(e) {doDrag(e)}, false);
   
	for(var i=0;i<ddb.length;i++){
        ddb[i].style.top = "150px";
        ddb[i].style.left = "500px";
   };
	
	for(var i=0;i<headerDiv.length;i++){
        headerDiv[i].addEventListener('mousedown', function(e) {startdbDrag(e, this)}, false);
        headerDiv[i].addEventListener('mouseup', function(e) {enddbDrag(e)}, false);
    }
	;
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
    
    /*-------------DIALOGUE BOX FUNCTIONS--------*/

	function doClose(box) {
		box.parentNode.parentNode.parentNode.style.visibility = 'hidden';
	}
	
	//Drag Dialogues
	function startdbDrag(e, box) {
		cursorPos = getPosition(e);
		downMouse = true;
		dlgbox = box.parentNode.parentNode;				
	}
	
	function doDrag(e, box) {
		if(!downMouse) {return};

		var cursorNow = getPosition(e);	
		var dx = cursorNow.x - cursorPos.x;
		var dy = cursorNow.y - cursorPos.y;
		cursorPos = cursorNow;
		dlgbox.style.top = (parseInt(dlgbox.style.top) + dy)+"px";
		dlgbox.style.left = (parseInt(dlgbox.style.left) + dx)+"px";
	};
	
	function enddbDrag(e) {
		downMouse = false;				
	};
	
	function inpKeyDown(evt) {		
		evt.stopPropagation();
	};
	
	function startDownload() {
		doDownload(storeIn.value,turned, storeDB);
	}
	
}	