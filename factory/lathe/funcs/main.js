function main() {
	/*-------------MAIN VARIABLES ---------------*/
	var num_of_nodes = 2;
	var node_index = 0;
	var num_of_steps = 25;
	var num_of_turns = 25;
	
	/*-------------MENU ELEMENTS---------------*/	
	//Get Menu Elements 
	var segment=document.getElementById("segment");
	var pAdd=document.getElementById("p_add");
	var pStraight=document.getElementById("p_straight");
	var pCurved=document.getElementById("p_curved");
	
	var pNode=document.getElementById("node");
	var pCorner=document.getElementById("p_corner");
	var pSmooth=document.getElementById("p_smooth");
	var pJoined=document.getElementById("p_joined");
		
	//Set readable styles for Elements
	pStraight.style.color="#888888";
	pCurved.style.color="#888888";
	
	pCorner.style.color="#888888";
	pSmooth.style.color="#000000";
	pJoined.style.color="#000000";

	

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
		
	var startNode = new node("fxdstr",0,50,0,latheStudio.scene);
	var endNode = new node("fxdend",0,-50,0,latheStudio.scene);
		
	var firstControl = new control("firstctrl",10,40,0,latheStudio.scene);
	var lastControl = new control("lastctrl",10,-40,0,latheStudio.scene);
		
	startNode.ctrl1=firstControl;
	startNode.ctrl2=lastControl;
	startNode.next=endNode;
		
	endNode.prev=startNode;
		
	var latheTool=createLathe(startNode,endNode,latheStudio.scene,num_of_steps);

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
	}

	var onPointerDown = function (evt) {
		if (evt.button !== 0) {
			return;
		} 
			
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
	}

	var onPointerUp = function (evt) {			
		if (startingPoint) {
			startingPoint = null;
			return;
		}
			
		upPoint = getBackboardPosition(evt);
		foundNode = proximity(upPoint,startNode, endNode, latheBlade)
		if(foundNode !== endNode) {
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
	}

	var onPointerMove = function (evt) {
		if (!startingPoint) {
			return;
		}
		var current = getBackboardPosition(evt);
		if (!current) {
			return;
		}
		var diff = current.subtract(startingPoint);	
		if(currentMesh === startNode.marker || currentMesh === endNode.marker) {
			diff.x=0;
		}			
		currentMesh.position.addInPlace(diff);
			
		latheTool=createLathe(startNode,endNode,latheStudio.scene,num_of_steps);
	
		latheBlade = BABYLON.Mesh.CreateLines(null, latheTool.blade, null, null, latheBlade);
		
		for(var i=0; i<latheTool.controls.length;i++) {
			controlLines[i]=BABYLON.Mesh.CreateLines(null,latheTool.controls[i],null,null, controlLines[i]);
		}
		
		turned = updateTurned(turned, latheTool.blade, num_of_turns);

		startingPoint = current;

	}

	latheCanvas.addEventListener("mousedown", onPointerDown, false);
	latheCanvas.addEventListener("mouseup", onPointerUp, false);
	latheCanvas.addEventListener("mousemove", onPointerMove, false);

	latheStudio.scene.onDispose = function () {
		latheCanvas.removeEventListener("mousedown", onPointerDown);
		latheCanvas.removeEventListener("mouseup", onPointerUp);
		latheCanvas.removeEventListener("mousemove", onPointerMove);
	}

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
	var turned=createTurned("turned", latheTool.blade, num_of_turns, productStudio.scene, true, BABYLON.Mesh.FRONTSIDE);
	
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
	
		latheTool=createLathe(startNode,endNode,latheStudio.scene,num_of_steps);	
				
		latheBlade = BABYLON.Mesh.CreateLines("vcc", latheTool.blade, latheStudio.scene, true);
				
		for(var i=0; i<latheTool.controls.length;i++) {
				controlLines[i]=BABYLON.Mesh.CreateLines("cl"+node_index+i,latheTool.controls[i],latheStudio.scene,true);
		}
		
		turned.dispose();
		turned=createTurned("turned", latheTool.blade, num_of_turns, productStudio.scene, true, BABYLON.Mesh.FRONTSIDE);
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
	
		latheTool=createLathe(startNode,endNode,latheStudio.scene,num_of_steps);	
				
		latheBlade = BABYLON.Mesh.CreateLines("vcc", latheTool.blade, latheStudio.scene, true);
				
		for(var i=0; i<latheTool.controls.length;i++) {
				controlLines[i]=BABYLON.Mesh.CreateLines("cl"+node_index+i,latheTool.controls[i],latheStudio.scene,true);
		}
		
		turned.dispose();
		turned=createTurned("turned", latheTool.blade, num_of_turns, productStudio.scene, true, BABYLON.Mesh.FRONTSIDE);

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
		latheBlade.dispose()
		for(var i=0; i<controlLines.length;i++) {
			controlLines[i].dispose();
		}
	
		latheTool=createLathe(startNode,endNode,latheStudio.scene,num_of_steps);	
				
		latheBlade = BABYLON.Mesh.CreateLines("vcc", latheTool.blade, latheStudio.scene, true);
				
		for(var i=0; i<latheTool.controls.length;i++) {
				controlLines[i]=BABYLON.Mesh.CreateLines("cl"+node_index+i,latheTool.controls[i],latheStudio.scene,true);
		}
		
		turned.dispose();
		turned=createTurned("turned", latheTool.blade, num_of_turns, productStudio.scene, true, BABYLON.Mesh.FRONTSIDE);

	}
}	
