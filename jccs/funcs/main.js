function main() {

	/*-------------MAIN VARIABLES ---------------*/	
	//Saved or not saved icons
	var storeIcon = "&#10022;";
	var saveIcon = "&#10039;";
	var exportIcon = "&#10047;";
	var storeBlank = "&nbsp;&nbsp;";
	var saveBlank = "&nbsp;&nbsp;";
	var exportBlank = "&nbsp;&nbsp;";
	
	// Event variables
    var groundPoint;
	var currentMeshes={};
	var currentParents={};
    //var currentMesh = null;
    
    var newModel=true;
	//var currentMaterial;
	//var currentMaterials={};
	var detached = false;
	var shiftDown=false;
	var moveRight = new BABYLON.Vector3(60, 0, 0);  // +ve x axis direction
	var moveLeft = new BABYLON.Vector3(-60, 0, 0); // -ve x axis direction
	var moveUp = new BABYLON.Vector3(0, 60, 0); // +ve y axis direction
	var moveDown = new BABYLON.Vector3(0, -60, 0); // -ve y axis direction
	var moveForward = new BABYLON.Vector3(0, 0, 60); // +ve z axis direction
	var moveBackward = new BABYLON.Vector3(0, 0, -60); // -ve z axis direction
	
	var confirmName;
	var confirmFunc;
	
	var cursorPos;
	var downMouse = false;
	var dlgbox;
		
	var num_of_boxes = 0;
	var num_of_models = 0;
	var num_in_scene = 0;
	var jcCanvas;
	var jcEngine;
	var JCubees = {};
	var jccsStudio, jcssStudio;
	var jcModels={};
	var sceneParents={}, sceneModels={};
	var doAddToScene = false;
	var inScene=false;
	var viewcamera = false;
	var viewangle=5*Math.PI/180;
	var forwardOK=true;
	var backwardOK=true;
	
	var collide = {left:false, right:false, up:false, down:false, front:false, back:false};	
	var collideCamera = {left:false, right:false, up:false, down:false, front:false, back:false, lookup:false, lookdown:false};
	var cameraSpeed = 1;
	
		
	
	/***********************************CONSTRUCTION DIALOGUE CODES***********************************/
	
	/*-------------CONSTRUCTION MENU ELEMENTS---------------	*/
	//Get Menu Elements 
	var Header = document.getElementById("Header");
	var menu = document.getElementById("menu");
	var menulist = document.getElementById("menulist");
	
	var switch_to_scene = document.getElementById("switchToScene");
	var add_to_scene = document.getElementById("addToScene");
	var solid = document.getElementById("solid");
	var model = document.getElementById("model");
	
	var leftarrow = document.getElementById("leftarrow");
	var rightarrow = document.getElementById("rightarrow");
	var uparrow = document.getElementById("uparrow");
	var downarrow = document.getElementById("downarrow");
	var forwardarrow = document.getElementById("forwardarrow");
	var backarrow = document.getElementById("backarrow");
	
	// File Menu and Sub-Menus
	var file_ = document.getElementById("file");
	var newmodel = document.getElementById("newmodel");
	var subfilemenu = document.getElementById("subfilemenu");
	var store = document.getElementById("store");
	var store_as = document.getElementById("store_as");
	var fetch = document.getElementById("fetch");
	var save = document.getElementById("save");
	var save_as = document.getElementById("save_as");
	var openFile  = document.getElementById("open"); 
	
	// Cubee Menu and Sub-Menus
	var cubee = document.getElementById("cubee");
	var subcubeemenu = document.getElementById("subcubeemenu");
	
	var box = document.getElementById("box");
	var cyl = document.getElementById("cyl");
	var sph = document.getElementById("sph");
	var rof = document.getElementById("rof");
	
	// Selection Menu and Sub-Menus
	var selection = document.getElementById("selection");
	var subselectionmenu = document.getElementById("subselectionmenu");
	var clear = document.getElementById("clear");
	var all = document.getElementById("all");
	var copy = document.getElementById("copy");
	var delete_ = document.getElementById("delete_");
	var colour = document.getElementById("colour");
	colour.colarray=[0,0,255];
	
	var colours = document.getElementById("colours");
	
	var texturepics = document.getElementById("texturepics");
	setTextures();
	
	var rotateX = document.getElementById("rotateX");
	var rotateY = document.getElementById("rotateY");
	var rotateZ = document.getElementById("rotateZ");
	
	//*******sub menu list ************
	var subMenuList = [subfilemenu, subcubeemenu, subselectionmenu];
		
	
	/*--------CONSTRUCTION DIALOGUE BOX ELEMENTS------------------*/
	
	var ddb = document.getElementsByClassName("dragDialogueBox");
	var closediv = document.getElementsByClassName("closediv");
	var headerDiv = document.getElementsByClassName("heading");
	var cancelDiv = document.getElementsByClassName("DBCancel"); 
	var inpt = document.getElementsByClassName("inpt");
	
	var storeDB = document.getElementById("storeDB"); 
	var storeIn = document.getElementById("storeIn");
	var storeBut = document.getElementById("storeBut");
	
	var fetchDB = document.getElementById("fetchDB"); 
	var fetchList = document.getElementById("fetchList");
	var fetchBut = document.getElementById("fetchBut");
	
	var confirmDB = document.getElementById("confirmDB"); 
	var confirmBut = document.getElementById("confirmBut");	
	
	/*----------CONSTRUCTION MENU EVENTS--------------------------------*/

	//move events
	leftarrow.addEventListener("mousedown", leftMove, false);
	rightarrow.addEventListener("mousedown", rightMove, false);
	uparrow.addEventListener("mousedown", upMove, false);
	downarrow.addEventListener("mousedown", downMove, false);
	forwardarrow.addEventListener("mousedown", forwardMove, false);
	backarrow.addEventListener("mousedown", backMove, false);
	
	//file events
	file_.addEventListener('click', showFileMenu, false);
	newmodel.addEventListener('click', doNew, false);
	store.addEventListener('click', doStore, false);
	store_as.addEventListener('click', openStoreAs, false);
	fetch.addEventListener('click', openFetch, false);
	
	if(typeof(Storage) !== "undefined") {
		save.addEventListener('click', doSave, false);
		//save_as.addEventListener('click', doSaveAs, false);
		//openFile.addEventListener('click', doOpen, false);
	}
	
	//cubee events
	cubee.addEventListener("click", showCubeeMenu, false);
	box.addEventListener("click", makeBox, false);
	cyl.addEventListener("click", makeCylinder, false);
	sph.addEventListener("click", makeSphere, false);
	rof.addEventListener("click", makeRoof, false);
	
	//Selection events
	selection.addEventListener("click", showSelectionMenu, false);
	clear.addEventListener("click", clearSelection, false);
	all.addEventListener("click", selectAll, false);
	copy.addEventListener("click", doCopy, false);
	delete_.addEventListener("click", doDelete, false);
	colour.addEventListener("click", function() {setMeshColour(this)}, false );
	
	rotateX.addEventListener("click", Xrotate, false);
	rotateY.addEventListener("click", Yrotate, false);
	rotateZ.addEventListener("click", Zrotate, false);
	
	//Set readable styles for Selection
	selection.style.color="#888888";
	
	//To scene event
	switch_to_scene.addEventListener("click", construct_to_scene, false);
	add_to_scene.addEventListener("click", addtoscene, false);
	
	
	
	/*-----------CONSTRUCTION DIALOGUE BOX EVENTS--------------------*/
	
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
    
    //Confirm Dialogue Box
    confirmBut.addEventListener('click', doConfirm, false);
    
    //Store As in App
    storeBut.addEventListener('click', doStoreAs, false);

	//Fetch fromApp
	fetchBut.addEventListener('click', doFetch, false);
		
	/*-------------CONSTRUCTION MENU FUNCTIONS ---------------*/
	//set colours in selection menu
	function setColours(colours) {
		var colarray = [ 
						[[255,0,0],[255,192,0],[255,255,0]],
						[[192,255,0],[0,255,0],[0,255,192]],
						[[0,0,255],[255,0,255],[192,0,255]],
						[[255,255,255],[127,127,127],[0,0,0]]
		];
		
		for(row=0;row<4;row++) {
			for(clmn=0;clmn<3;clmn++) {
				col = document.createElement('div');
				col.colarray = colarray[row][clmn];
				col.style.backgroundColor = "rgb("+colarray[row][clmn][0] +","+colarray[row][clmn][1]+","+colarray[row][clmn][2]+")";
				col.style.opacity = 0.5;
				col.className="chart";
				col.material = new BABYLON.StandardMaterial("mat"+clmn+row, jccsStudio.scene);
				col.material.emissiveColor = new BABYLON.Color3(col.colarray[0]/255,col.colarray[1]/255,col.colarray[2]/255);
				col.addEventListener("mouseover", function() {this.style.opacity = 1}, false );
				col.addEventListener("mouseout", function() {this.style.opacity = 0.5}, false );
				col.addEventListener("click", function() {setMeshColour(this)}, false );
				colours.appendChild(col);
			}
		}
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}
	
	//set textures in selection menu
	function setTextures() {
		var textures = [
				"Metal",
				"Wood",
				"Rust",
				"Wheel"
		];
		for(var t=0;t<textures.length;t++) {
			var txtr = document.createElement('div');
			txtr.imgName = "images/xt"+textures[t]+".png";
			txtr.style.backgroundImage ="url('"+txtr.imgName+"')";
			txtr.alt = textures[t];
			txtr.title = textures[t];
			txtr.className = "textureimage";
			txtr.addEventListener("click", function() {setMeshTexture(this)}, false );
			texturepics.appendChild(txtr);
		}
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}
	
	//menu choices actions

	//File functions
	function showFileMenu() {
		hideSubMenus();
		subfilemenu.style.visibility="visible";
		file_.style.borderBottom = "none";
	}
	
	function doNew() {
		if(!JCisStored) 
		{
			confirmName = name;
			confirmFunc = newJCubees;
			confirmDesc.innerHTML = 'The current model <span style="font-style:italic"> '+confirmName+'</span> has not been stored.<BR>Do you want to continue and delete the current model?'
			openConfirmDBox();
		}
		else {
			newJCubees();
		}
	}
	
	function newJCubees() {
		hideSubMenus();
		currentModelName = 'model'+(num_of_models++);
		JCisStored = false;
		for(var mesh in JCubees) {
			JCubees[mesh].destroy();
			delete JCubees[mesh];
		}
		JCubees = {};
		currentMeshes = {};
	
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;
		storeIn.value = currentModelName;
		
		selection.innerHTML="Selection";
		selection.style.color=="rgb(136, 136, 136)"
	}
	
	function doStore() {	
		if(newModel) {
			newModel = false;
			openStoreAs();
		}
		else {
			model.innerHTML = "Model -- "+currentModelName;
			JCisStored = true;
			doStoreModel(currentModelName);
		}
	}
	
	function openStoreAs() {		
		storeDB.style.visibility = 'visible';
	}
	
	function openFetch() {
		if(!JCisStored) 
		{
			confirmName = name;
			confirmFunc = fillFetch;
			confirmDesc.innerHTML = 'The current model <span style="font-style:italic"> '+confirmName+'</span> has not been stored.<BR>Do you want to continue and overwrite the current model?'
			openConfirmDBox();
		}
		else {
			fillFetch();
		}
	}
	
	function fillFetch() {
		var fetch_array =[];
		for(var name in jcModels) {
			fetch_array.push(name);
		}		
		fetch_array.sort();
		var flen=fetch_array.length;
		var cols = Math.ceil(flen/10);
		var rows = 10;
		var len;
		var fetch_row, fetch_col;
		var i=0;
		for(var c=0; c<cols; c++){
			fetch_col = document.createElement("div");
			fetch_col.style.left=c*100+"px";
			fetchList.appendChild(fetch_col);
			fetch_ul = document.createElement("ul");
			fetch_col.appendChild(fetch_ul);
			len = flen - c*10;
			if(len<10) {
				rows=len;
			}
			for(var r=0; r<rows; r++) {
				fetch_li = document.createElement("li");
				fetch_li.innerHTML=fetch_array[i++];
				fetch_li.addEventListener('click', function() {fetchname.innerHTML = this.innerHTML}, false);
				fetch_ul.appendChild(fetch_li);
			}
		}
		fetchDB.style.visibility = 'visible';
	}
	
	function doSave() {
		var alpha = {};
		var meshes_to_save = [];
		
		for(var ref in JCubees) {
			alpha[ref] = JCubees[ref].Jcubee.material.alpha;
			JCubees[ref].Jcubee.material.alpha = 1;
			meshes_to_save.push(JCubees[ref].Jcubee);
		}
		
		var serializedMesh = BABYLON.SceneSerializer.SerializeMesh(meshes_to_save);
		
		var strMesh = JSON.stringify(serializedMesh);
		console.log(strMesh);
		
		for(var ref in JCubees) {
			JCubees[ref].Jcubee.material.alpha = alpha[ref];
		}
		
		
	}
/*	
	function doSave() {
		var alpha;
		var strMesh;
		var serializedMesh;
		var meshes_to_save = {
						"materials": [],
						"geometries":	{	"boxes":[],
											"spheres":[],
											"cylinders":[],
											"toruses":[],
											"grounds":[],
											"planes":[],
											"torusKnots":[],
											"vertexData":[]
						},
						"meshes": []
		    };
		for(var ref in JCubees) {
			alpha = JCubees[ref].Jcubee.material.alpha;
			JCubees[ref].Jcubee.material.alpha = 1;
			serializedMesh = BABYLON.SceneSerializer.SerializeMesh(JCubees[ref].Jcubee);
			JCubees[ref].Jcubee.material.alpha = alpha;			
			meshes_to_save["materials"].push(serializedMesh["materials"][0]);
			meshes_to_save["geometries"]["vertexData"].push(serializedMesh["geometries"]["vertexData"][0]);
			meshes_to_save["meshes"].push(serializedMesh["meshes"][0]);

		}
		var strMesh = JSON.stringify(meshes_to_save);
		console.log(strMesh);
		
	}
*/	
	//Cubee functions
	function showCubeeMenu() {
		hideSubMenus();
		subcubeemenu.style.visibility="visible";
		cubee.style.borderBottom = "none";
	}
	
	//Selection functions
	function showSelectionMenu() {
		if(selection.style.color=="rgb(136, 136, 136)") {
			return
		}
		if(selection.innerHTML == "Selection") {
			hideSubMenus();
			subselectionmenu.style.visibility="visible";
			selection.style.borderBottom = "none";
		}
		else {			
			selectAll();
			selection.innerHTML="Selection";
		}
	}
	
	function clearSelection() {
		for(var mesh in JCubees) {						
			JCubees[mesh].Jcubee.material.alpha = 1;
			JCubees[mesh].hideMarkers();
		}			
		currentMeshes = {};
		//currentMaterials = {};
		hideSubMenus();
		//selection.style.color="rgb(136, 136, 136)"
		selection.innerHTML = "Select All";
	}
	
	function selectAll() {
		for(var mesh in JCubees) {						
			if(!(mesh in currentMeshes)) {						
				JCubees[mesh].Jcubee.material.alpha = 1;
				JCubees[mesh].showMarkers();
				currentMeshes[mesh] = JCubees[mesh].Jcubee;
			}
		}
		selection.innerHTML = "Selection";
		selection.style.color="#000000";
	}
	
	function doCopy() {
		var newRef;
		var tempMeshes=[];
		var name;
		for(var ref in currentMeshes) {
			newRef = "L"+currentModelName+"¬"+getType(ref)+(num_of_boxes++);			
			JCubees[newRef] = new JcubeeBlank(newRef);
			JCubees[newRef].Jcubee = JCubees[ref].Jcubee.clone(newRef);
			JCubees[newRef].Jcubee.position.y += 6*60;			
			JCubees[newRef].Jcubee.material = JCubees[ref].Jcubee.material.clone();			
			JCubees[newRef].Jcubee.material.alpha = 1;			
			JCubees[newRef].addMarkers(jccsStudio.scene);		
			JCubees[ref].Jcubee.material.alpha= 0.5;
			JCubees[ref].hideMarkers();
			delete currentMeshes[ref];
			tempMeshes.push(JCubees[newRef].Jcubee);			
		}
		currentMeshes={};
		for(var i=0;i<tempMeshes.length;i++) {
			name = tempMeshes[i].name;		
			currentMeshes[name] = tempMeshes[i];
		};
		hideSubMenus();
	};
	
	function doDelete() {
		confirmFunc = doDeletion;
		confirmDesc.innerHTML = 'Do you want to continue to and delete the current selection?';
		openConfirmDBox();
	}
	
	function doDeletion() {
		for(var ref in currentMeshes) {
			JCubees[ref].destroy();
			delete JCubees[ref];
			delete currentMeshes[ref];
		}
		clearSelection();
	}
	
	
	
	function Xrotate() {
		for(var mesh in currentMeshes) {
			currentMeshes[mesh].rotate(BABYLON.Axis.X, -Math.PI/2, BABYLON.Space.WORLD);		
		}
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}

	function Yrotate() {
		for(var mesh in currentMeshes) {
			currentMeshes[mesh].rotate(BABYLON.Axis.Y, -Math.PI/2, BABYLON.Space.WORLD);						
		}
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}
	
	function Zrotate() {
		for(var mesh in currentMeshes) {
			currentMeshes[mesh].rotate(BABYLON.Axis.Z, -Math.PI/2, BABYLON.Space.WORLD);						
		}
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}
	
	//Add to Scene functions	
	function addtoscene() {
		 sceneSwitch(currentModelName);
		 hideSubMenus();
		 menu.style.visibility = 'hidden';
		 scene_menu.style.visibility = 'visible';
		 Header.innerHTML ='Scene';
	}
	
	function sceneSwitch(name) {
		for(var model in sceneParents) {
			sceneParents[model].model.setEnabled(true);
			for(var i=0; i<sceneParents[model].modelChildren.length;i++) {
				sceneParents[model].modelChildren[i].enable();
			}
		}
		
		collide = {left:false, right:false, up:false, down:false, front:false, back:false};
		
		var parentName = "Iparent"+name+num_in_scene;
		var modelName = "I"+name+num_in_scene;
		sceneParents[parentName] ={};
		sceneParents[parentName].name = parentName;
		sceneParents[parentName].model = BABYLON.Mesh.CreateBox(parentName, 60.0, jccsStudio.scene);
		sceneParents[parentName].model.visibility = 0;
		selectNewModel(sceneParents[parentName]);
		sceneParents[parentName].modelChildren = [];	
	
		for(var ref in JCubees) {			
			sceneModels[modelName+ref] = new JcubeeBlank(modelName+ref);
			sceneModels[modelName+ref].Jcubee = JCubees[ref].Jcubee.clone(modelName+ref);
			sceneModels[modelName+ref].Jcubee.material = JCubees[ref].Jcubee.material.clone();
			sceneModels[modelName+ref].Jcubee.material.alpha = 1;			
			sceneModels[modelName+ref].Jcubee.parent = sceneParents[parentName].model;
			sceneModels[modelName+ref].parent = sceneParents[parentName];
			sceneModels[modelName+ref].addMarkers(jccsStudio.scene,0.5);
			sceneParents[parentName].modelChildren.push(sceneModels[modelName+ref]);				
			JCubees[ref].disable();
		}
		
		sceneParents[parentName].model.position.y = 9.5*60;
		sceneParents[parentName].model.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
		sceneParents[parentName].model.computeWorldMatrix(true);
		
		for(var i=0; i<sceneParents[parentName].modelChildren.length;i++) {
			sceneParents[parentName].modelChildren[i].Jcubee.computeWorldMatrix(true);
			sceneParents[parentName].modelChildren[i].moveT(sceneParents[parentName].modelChildren[i].Jcubee.getAbsolutePosition());		
		}
		
		sceneParents[parentName].modelBoundary = childrenBoundary(sceneParents[parentName], jccsStudio.scene );
		sceneParents[parentName].modelBoundary.parent = sceneParents[parentName].model;
		
		num_in_scene++;			
			
		inScene=true;
	}
	
	//General Menu functions
	function resetBorders() {		
		var elm=menulist.firstChild;		
		elm=findNextDIV(elm);
		while (elm) {			
			elm.style.borderBottom ="1px solid black";
			elm=findNextDIV(elm);
		}
	}
	
	function hideSubMenus() {
		for(var i=0; i<subMenuList.length;i++) {
			subMenuList[i].style.visibility="hidden";
		}		
		resetBorders();
	}
	
	function findNextDIV(elm) {
	do {
		elm = elm.nextSibling;
	} while (elm && elm.nodeName !="DIV");
	return elm;
	}

	function setMeshColour(elm) {
		for(var mesh in currentMeshes) {						
			currentMeshes[mesh].material = elm.material;
		}
		colour.material=elm.material;
		colour.colarray=elm.colarray;
		colour.style.backgroundColor="rgb("+elm.colarray[0] +","+elm.colarray[1]+","+elm.colarray[2]+")";
	}
	
	function setMeshTexture(elm) {
		var elmTxtrMat = new BABYLON.StandardMaterial("elmTxtrMat", jccsStudio.scene);
		elmTxtrMat.emissiveTexture = new BABYLON.Texture(elm.imgName, jccsStudio.scene);
		for(var mesh in currentMeshes) {						
			currentMeshes[mesh].material = elmTxtrMat;
		}
	}
	
	//Return to scene
	function construct_to_scene() {
		for(var model in sceneParents) {
			sceneParents[model].model.setEnabled(true);
			for(var i=0; i<sceneParents[model].modelChildren.length;i++) {
				sceneParents[model].modelChildren[i].enable();
			}
		}
		for(var ref in JCubees) {
			JCubees[ref].disable()
		}
		hideSubMenus();
		menu.style.visibility = 'hidden';
		scene_menu.style.visibility = 'visible';
		Header.innerHTML = 'scene';
		inScene = true;
	}
	
	
	/*-------------CONSTRUCTION DIALOGUE BOX FUNCTIONS--------*/

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
	
	//Confirm actions
	function openConfirmDBox(name) {
		confirmDB.style.visibility = 'visible';
	}
	
	function doConfirm() {
		confirmDB.style.visibility = 'hidden';
		confirmFunc(confirmName);
	}
	
	
	//Store in app
	function doStoreAs() {
		var name = storeIn.value;	
		if(name in jcModels && !newModel) {
			confirmName = name;
			confirmFunc = doStoreModel;
			confirmDesc.innerHTML = 'The model <span style="font-style:italic"> '+confirmName+'</span> already exists.<BR>Do you want to continue to and overwrite the existing model?';
			openConfirmDBox();
		}
		else {
			doStoreModel(name);
		}
	}
	
	function doStoreModel(name) {
		var newRef;				
		storeDB.style.visibility = 'hidden';
		if(name in jcModels) {
			for(var ref in jcModels[name]) {
				delete jcModels[name][ref];
			}
		}
		jcModels[name] = {};
		for (var ref in JCubees) {			
			newRef = "S"+getModelRef(ref)+"¬"+getNameRef(ref);
			jcModels[name][newRef] = new JcubeeBlank(newRef);
			jcModels[name][newRef].Jcubee = JCubees[ref].Jcubee.clone(newRef);
			jcModels[name][newRef].addMarkers(jccsStudio.scene);		
			jcModels[name][newRef].disable();
		}

		
		currentModelName = name;
		model.innerHTML = "Model -- "+currentModelName+storeBlank+saveIcon+exportIcon;
		
		storeIn.value = currentModelName;
		JCisStored = true;		
	}
	
	function doFetch() {
		if(inScene) {
			doFetchToScene();
		}
		else {
			doFetchToConstruct()
		}
	}
	
	function doFetchToConstruct() {
		var name = fetchname.innerHTML;
		for( var ref in JCubees) {
			if(ref in currentMeshes) {
				delete currentMeshes[ref];
			}
			JCubees[ref].disable();
			delete JCubees[ref].Jcubee;
			delete JCubees[ref];
		}
		JCubees ={};
		currentMeshes ={};
		for (var ref in jcModels[name]) {
			newRef = "L"+getModelRef(ref)+"¬"+getNameRef(ref);		
			JCubees[newRef] = new JcubeeBlank(newRef);		
			JCubees[newRef].Jcubee = jcModels[name][ref].Jcubee.clone(newRef);
			JCubees[newRef].addMarkers(jccsStudio.scene);
			JCubees[newRef].enable();
		}
		
		selectAll();
		
		currentModelName = name;
		model.innerHTML = "Model -- "+currentModelName;
		JCisStored = true;
		fetchDB.style.visibility = 'hidden';
	}
	
		function doFetchToScene() {
		var name = fetchname.innerHTML;
		for(var model in sceneParents) {
			sceneParents[model].model.setEnabled(true);
			for(var i=0; i<sceneParents[model].length;i++) {
				sceneParents[model][i].enable();
			}
		}
		
		collide = {left:false, right:false, up:false, down:false, front:false, back:false};
		
		var parentName = "Iparent"+name+num_in_scene;
		var modelName = "I"+name+num_in_scene;
		sceneParents[parentName] ={};
		sceneParents[parentName].name = parentName;
		sceneParents[parentName].model = BABYLON.Mesh.CreateBox(parentName, 60.0, jccsStudio.scene);
		sceneParents[parentName].model.visibility = 0;
		selectNewModel(sceneParents[parentName]);
		sceneParents[parentName].modelChildren = [];	
	
		for(var ref in JCubees) {			
			sceneModels[modelName+ref] = new JcubeeBlank(modelName+ref);
			sceneModels[modelName+ref].Jcubee = JCubees[ref].Jcubee.clone(modelName+ref);
			sceneModels[modelName+ref].Jcubee.material = JCubees[ref].Jcubee.material.clone();
			sceneModels[modelName+ref].Jcubee.material.alpha = 1;			
			sceneModels[modelName+ref].Jcubee.parent = sceneParents[parentName].model;
			sceneModels[modelName+ref].parent = sceneParents[parentName];
			sceneModels[modelName+ref].addMarkers(jccsStudio.scene,0.5);
			sceneParents[parentName].modelChildren.push(sceneModels[modelName+ref]);				
			JCubees[ref].disable();
		}
		
		sceneParents[parentName].model.position.y = 9.5*60;
		sceneParents[parentName].model.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
		sceneParents[parentName].model.computeWorldMatrix(true);
		
		for(var i=0; i<sceneParents[parentName].modelChildren.length;i++) {
			sceneParents[parentName].modelChildren[i].Jcubee.computeWorldMatrix(true);
			sceneParents[parentName].modelChildren[i].moveT(sceneParents[parentName].modelChildren[i].Jcubee.getAbsolutePosition());		
		}
		
		sceneParents[parentName].modelBoundary = childrenBoundary(sceneParents[parentName], jccsStudio.scene );
		sceneParents[parentName].modelBoundary.parent = sceneParents[parentName].model;
		
		num_in_scene++;			
			
		fetchDB.style.visibility = 'hidden';
	}
	
	/*********************************************SCENE DIALOGUE CODE****************************************/
	
	/*-------------SCENE MENU ELEMENTS---------------	*/
	//Get Menu Elements 
	var scene_menu = document.getElementById("scene_menu");
	scene_menu.style.visibility = 'hidden';
	var scene_menulist = document.getElementById("scene_menulist");
	
	var scene_constructSite = document.getElementById("scene_constructSite");
	var scene_camera = document.getElementById("scene_camera");
	
	var scene_scene = document.getElementById("scene_scene");
	
	var scene_leftarrow = document.getElementById("scene_leftarrow");
	var scene_rightarrow = document.getElementById("scene_rightarrow");
	var scene_uparrow = document.getElementById("scene_uparrow");
	var scene_downarrow = document.getElementById("scene_downarrow");
	var scene_forwardarrow = document.getElementById("scene_forwardarrow");
	var scene_backarrow = document.getElementById("scene_backarrow");
	
	// File Menu and Sub-Menus
	var scene_file_ = document.getElementById("scene_file");
	var scene_subfilemenu = document.getElementById("scene_subfilemenu");
	var scene_fetch = document.getElementById("scene_fetch");
	var scene_save = document.getElementById("scene_save");
	var scene_save_as = document.getElementById("scene_save_as");
	var scene_openFile = document.getElementById("scene_open");
	
		// Selection Menu and Sub-Menus
	var scene_selection = document.getElementById("scene_selection");
	var scene_subselectionmenu = document.getElementById("scene_subselectionmenu");
	var scene_clear = document.getElementById("scene_clear");
	var scene_all = document.getElementById("scene_all");
	var scene_copy = document.getElementById("scene_copy");
	var scene_delete = document.getElementById("scene_delete");

	var scene_rotateX = document.getElementById("scene_rotateX");
	var scene_rotateY = document.getElementById("scene_rotateY");
	var scene_rotateZ = document.getElementById("scene_rotateZ");
	
	//*******sub menu list ************
	var scene_subMenuList = [scene_subfilemenu, scene_subselectionmenu];
	
		/*  -------LOCAL STORAGE CHECK----------------*/
	if(typeof(Storage) === "undefined") {
		save.parentNode.removeChild(save);
		save_as.parentNode.removeChild(save_as);
		openFile.parentNode.removeChild(openFile);
		scene_save.parentNode.removeChild(scene_save);
		scene_save_as.parentNode.removeChild(scene_save_as);
		scene_openFile.parentNode.removeChild(scene_openFile);
		saveIcon="";
		saveBlank="";
	}
	
	/*----------SCENE MENU EVENTS--------------------------------*/

	//move events
	scene_leftarrow.addEventListener("mousedown", function() {modelMove(collide.left, moveLeft)}, false);
	scene_rightarrow.addEventListener("mousedown", function() {modelMove(collide.right, moveRight)}, false);
	scene_uparrow.addEventListener("mousedown", function() {modelMove(collide.up, moveUp)}, false);
	scene_downarrow.addEventListener("mousedown", function() {modelMove(collide.down, moveDown)}, false);
	scene_forwardarrow.addEventListener("mousedown", function() {modelMove(collide.front, moveForward)}, false);
	scene_backarrow.addEventListener("mousedown", function() {modelMove(collide.back, moveBackward)}, false);
	
	//file events
	scene_file_.addEventListener('click', scene_showFileMenu, false);
	scene_fetch.addEventListener('click', fillFetch, false);
	//to do scene_save.addEventListener('click', scene_doSave, false);
	//to do scene_save_as.addEventListener('click', scene_openSaveAs, false);
	
	//return to construction site event
	scene_constructSite.addEventListener('click', scene_to_construct, false);
	
	//camera switch event
	scene_camera.addEventListener('click', switch_camera, false);
	
	//Selection events
	scene_selection.addEventListener("click", scene_showSelectionMenu, false);
	scene_clear.addEventListener("click", scene_clearSelection, false);
	scene_all.addEventListener("click", scene_selectAll, false);
	scene_copy.addEventListener("click", scene_doCopy, false);
	scene_delete.addEventListener("click", scene_doDelete, false);
	
	scene_rotateX.addEventListener("click", scene_Xrotate, false);
	scene_rotateY.addEventListener("click", scene_Yrotate, false);
	scene_rotateZ.addEventListener("click", scene_Zrotate, false); 
	
	/*-------------SCENE MENU FUNCTIONS ---------------*/
	
	//File functions
	function scene_showFileMenu() {
		scene_hideSubMenus();
		scene_subfilemenu.style.visibility="visible";
		scene_file_.style.borderBottom = "none";
	}
	
	//Selection functions
	function scene_showSelectionMenu() {
		if(scene_selection.style.color=="rgb(136, 136, 136)") {
			return
		}
		if(scene_selection.innerHTML == "Selection") {
			scene_hideSubMenus();
			scene_subselectionmenu.style.visibility="visible";
			scene_selection.style.borderBottom = "none";
		}
		else {			
			scene_selectAll();
			scene_selection.innerHTML="Selection";
		}
	}
	
	function scene_clearSelection() {
		for(var model in sceneParents) {						
			for(var i=0; i<sceneParents[model].modelChildren.length;i++) {
				sceneParents[model].modelChildren[i].Jcubee.material.alpha = 1;
				sceneParents[model].modelChildren[i].hideMarkers();
			}
		}			
		currentParents = {};
		scene_hideSubMenus();
		scene_selection.innerHTML = "Select All";
	}
	
	function scene_selectAll() {
		for(var model in sceneParents) {						
			if(!(model in currentParents)) {
				for(var i=0; i<sceneParents[model].modelChildren.length;i++) {
					sceneParents[model].modelChildren[i].Jcubee.material.alpha = 1;
					sceneParents[model].modelChildren[i].showMarkers();
				}						
				currentParents[model] = sceneParents[model];
			}
		}
	}
	
	//switch camera functions
	function switch_camera() {
		scene_hideSubMenus();
		scene_menu.style.visibility = 'hidden';
		Header.style.visibility = 'hidden';
		for(var model in sceneParents) {
			for(var i=0; i<sceneParents[model].modelChildren.length;i++) {
				sceneParents[model].modelChildren[i].disableMarkers();
				sceneParents[model].modelChildren[i].Jcubee.material.alpha = 1;
			}		
		}
		frontPlane.setEnabled(false);
		backPlane.setEnabled(false);
		leftSidePlane.setEnabled(false);
		rightSidePlane.setEnabled(false);
		ground.material.wireframe = false;
		skybox.isVisible=true;
		jccsStudio.followCamera.target = target;
		jccsStudio.scene.activeCameras[0] = jccsStudio.followCamera;
		jccsStudio.followCamera.position = viewer.back.getAbsolutePosition();	
		jccsStudio.followCamera.setTarget(target.getAbsolutePosition());
		viewcamera = true;
	}
	
	function  build_camera() {
		scene_menu.style.visibility = 'visible';
		Header.style.visibility = 'visible';
		for(var model in sceneParents) {
			for(var i=0; i<sceneParents[model].modelChildren.length;i++) {
				sceneParents[model].modelChildren[i].enable();
				if (!(model in currentParents)) {
					sceneParents[model].modelChildren[i].Jcubee.material.alpha = 0.4;
				}
			}
					
		}
		frontPlane.setEnabled(true);
		backPlane.setEnabled(true);
		leftSidePlane.setEnabled(true);
		rightSidePlane.setEnabled(true);
		ground.material.wireframe = true;
		skybox.isVisible=false;
		jccsStudio.scene.activeCameras[0] = jccsStudio.camera;
		viewcamera = false;
	}
	
		function scene_doCopy() {
		var newRef;
		var currentMesh;
		var tempMeshes=[];
		var modelName;
		
		for(var model in currentParents) {
			var parentName = "Iparentcopy"+(num_in_scene++);
			sceneParents[parentName] ={};
			sceneParents[parentName].name = parentName;
			sceneParents[parentName].model = currentParents[model].model.clone(parentName, "", true);
			sceneParents[parentName].model.position.y += 6*60;
			sceneParents[parentName].model.visibility = 0;
			sceneParents[parentName].modelChildren = [];
			tempMeshes.push(sceneParents[parentName]);	
			
			
			for(var i=0; i<currentParents[model].modelChildren.length;i++) {
				currentMesh = currentParents[model].modelChildren[i].Jcubee;
				modelName = "L"+getNameRef(currentMesh.name)+"¬"+getType(currentMesh.name)+(num_of_boxes++);
				sceneModels[modelName] = new JcubeeBlank(modelName);
				sceneModels[modelName].Jcubee = currentMesh.clone(modelName);				
				//sceneModels[modelName].Jcubee.position.y +=6*60;
				sceneModels[modelName].Jcubee.material = currentMesh.material.clone();
				sceneModels[modelName].Jcubee.material.alpha = 1;
				currentMesh.material.alpha = 0.5;			
				sceneModels[modelName].Jcubee.parent = sceneParents[parentName].model;
				sceneModels[modelName].parent = sceneParents[parentName];
				sceneModels[modelName].addMarkers(jccsStudio.scene,0.5);
				sceneParents[parentName].modelChildren.push(sceneModels[modelName]);
				currentParents[model].modelChildren[i].hideMarkers();				
			}
			
			sceneParents[parentName].model.computeWorldMatrix(true);
		
			for(var i=0; i<sceneParents[parentName].modelChildren.length;i++) {
				sceneParents[parentName].modelChildren[i].Jcubee.computeWorldMatrix(true);
				sceneParents[parentName].modelChildren[i].moveT(sceneParents[parentName].modelChildren[i].Jcubee.getAbsolutePosition());		
			}
		
			sceneParents[parentName].modelBoundary = childrenBoundary(sceneParents[parentName], jccsStudio.scene );
			sceneParents[parentName].modelBoundary.parent = sceneParents[parentName].model;
			
			delete currentParents[model];
		}	
		
		currentParents ={};
		for(var i=0;i<tempMeshes.length;i++) {		
			name = tempMeshes[i].name;		
			currentParents[name] = tempMeshes[i];
		};
		scene_hideSubMenus();
		
		collide = {left:false, right:false, up:false, down:false, front:false, back:false};
	}
	
	function scene_doDelete() {
		confirmFunc = scene_doDeletion;
		confirmDesc.innerHTML = 'Do you want to continue to and delete the current selection?';
		openConfirmDBox();
	}
	
	function scene_doDeletion() {
		var child;
		for(var model in currentParents) {
			while(currentParents[model].modelChildren.length>0) {
				child = currentParents[model].modelChildren.pop();
				child.destroy();
				delete child;
			}
			currentParents[model].model.dispose();
			delete sceneParents[model];
			delete currentParents[model];
		}
		scene_clearSelection();
	}
	
	//rotation functions
	function scene_Xrotate() {
		for(var model in currentParents) {
			currentParents[model].model.rotate(BABYLON.Axis.X, -Math.PI/2, BABYLON.Space.WORLD);	
			for(var i=0; i<currentParents[model].modelChildren.length;i++) {
				currentParents[model].modelChildren[i].moveT(currentParents[model].modelChildren[i].Jcubee.getAbsolutePosition());
			}			
		}
	}
	
	function scene_Yrotate() {
		for(var model in currentParents) {
			currentParents[model].model.rotate(BABYLON.Axis.Y, -Math.PI/2, BABYLON.Space.WORLD);
			for(var i=0; i<currentParents[model].length;i++) {
				currentParents[model].modelChildren[i].moveT(currentParents[model].modelChildren[i].Jcubee.getAbsolutePosition());
			}		
		}
	}
	
	function scene_Zrotate() {
		for(var model in currentParents) {
			currentParents[model].model.rotate(BABYLON.Axis.Z, -Math.PI/2, BABYLON.Space.WORLD);
			for(var i=0; i<currentParents[model].modelChildren.length;i++) {
				currentParents[model].modelChildren[i].moveT(currentParents[model].modelChildren[i].Jcubee.getAbsolutePosition());
			}		
		}
	}
	
	//Return to construction site
	function scene_to_construct() {
		for(var model in sceneParents) {
			sceneParents[model].model.setEnabled(false);
			for(var i=0; i<sceneParents[model].modelChildren.length; i++) {
				sceneParents[model].modelChildren[i].disable();
			}
		}
		for(var ref in JCubees) {
			JCubees[ref].enable()
		}
		scene_hideSubMenus();
		menu.style.visibility = 'visible';
		scene_menu.style.visibility = 'hidden';
		Header.innerHTML = 'Construction Site';
		inScene = false;
	}
	
	//General Menu functions
	function scene_resetBorders() {		
		var elm=scene_menulist.firstChild;		
		elm=findNextDIV(elm);
		while (elm) {			
			elm.style.borderBottom ="1px solid black";
			elm=findNextDIV(elm);
		}
	}
	
	function scene_hideSubMenus() {
		for(var i=0; i<scene_subMenuList.length;i++) {
			scene_subMenuList[i].style.visibility="hidden";
		}		
		scene_resetBorders();
	}
	
	
	/***********************************************MODEL CODES************************************/
	
	/*-------------START LIST OF MODELS---------------*/
	var currentModelName = 'model'+(num_of_models++);
	var JCisStored = false;
	JCubees = {};
	
	model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;
	storeIn.value = currentModelName;
	
	
	/*-------------CONSTRUCTION STUDIO ---------------*/	
	// Set the construction studio
	jcCanvas = document.getElementById("jcCanvas");

	jcEngine = new BABYLON.Engine(jcCanvas, true);

	jccsStudio = new Studio(jcEngine);
	
	jccsStudio.scene.clearColor = new BABYLON.Color3(0.75, 0.75, 0.75);
	
	jccsStudio.camera = new BABYLON.ArcRotateCamera("Camera", 0, 50, 300, new BABYLON.Vector3(0, 300, 0), jccsStudio.scene);
	jccsStudio.camera.setPosition(new BABYLON.Vector3(0, 200, -1400));	
	jccsStudio.camera.lowerBetaLimit = 0.1;
	jccsStudio.camera.upperBetaLimit = (Math.PI / 2) * 0.9;
	jccsStudio.camera.attachControl(jcCanvas, true);
	
	jccsStudio.followCamera = new BABYLON.TargetCamera("followCamera", new BABYLON.Vector3(0, 60, 0), jccsStudio.scene);	
	jccsStudio.followCamera.attachControl(jcCanvas, true);
	
	jccsStudio.scene.activeCameras.push(jccsStudio.camera);
	
	jccsStudio.frontLight = new BABYLON.PointLight("omni", new BABYLON.Vector3(-3000, 6000, 2000), jccsStudio.scene);
	jccsStudio.backLight = new BABYLON.PointLight("omni", new BABYLON.Vector3(3000, -6000, 2000), jccsStudio.scene);
	jccsStudio.bottomLight = new BABYLON.PointLight("omni", new BABYLON.Vector3(-3000, 6000, -2000), jccsStudio.scene);
	jccsStudio.frontLight.intensity = 0.2;
	jccsStudio.backLight.intensity = 0.2;
	jccsStudio.bottomLight.intensity = 0.2;
	
	setColours(colours);
	
	//Materials
	var greenGridMat = new BABYLON.StandardMaterial("greenGrid", jccsStudio.scene);
	greenGridMat.emissiveColor = new BABYLON.Color3(0,1,0);
	
	var whiteGridMat = new BABYLON.StandardMaterial("whiteGrid", jccsStudio.scene);
	whiteGridMat.emissiveColor = new BABYLON.Color3(1,1,1);
	
	var blueGridMat = new BABYLON.StandardMaterial("blueGrid", jccsStudio.scene);
	blueGridMat.emissiveColor = new BABYLON.Color3(0.2,0.2,1);
	
	var redGridMat = new BABYLON.StandardMaterial("red", jccsStudio.scene);
	redGridMat.emissiveColor = new BABYLON.Color3(1,0.2,0.2);
	
	var yellowGridMat = new BABYLON.StandardMaterial("blueGrid", jccsStudio.scene);
	yellowGridMat.emissiveColor = new BABYLON.Color3(1,1,0);
	
	var brownGridMat = new BABYLON.StandardMaterial("red", jccsStudio.scene);
	brownGridMat.emissiveColor = new BABYLON.Color3(0.4,0.2,0);
	
	var blueMat = new BABYLON.StandardMaterial("blue", jccsStudio.scene);
	blueMat.emissiveColor = new BABYLON.Color3(0,0,1);
	
	var redMat = new BABYLON.StandardMaterial("red", jccsStudio.scene);
	redMat.emissiveColor = new BABYLON.Color3(1,0,0);
	
	var blackMat = new BABYLON.StandardMaterial("black", jccsStudio.scene);
	blackMat.emissiveColor = new BABYLON.Color3(0,0,0);
	
	colour.material = blueMat;
	
	//Follow Camera holder and Target
	
	var holder = new CreateCuboid('holder', 6, 60, 6, jccsStudio.scene);
	//holder.material = blackMat;
	//holder.material.alpha = 0.3;
	holder.isVisible = false;
	
	var viewer = {};
	viewer.front = new CreateCuboid('viewerfront', 6, 1, 6, jccsStudio.scene);
	viewer.front.position.z = 30;
	viewer.front.parent = holder;
	//viewer.front.material = redMat;
	viewer.front.isVisible = false;
	viewer.back = new CreateCuboid('viewerback', 6, 1, 6, jccsStudio.scene);
	viewer.back.parent = holder;
	viewer.back.position.z = -30;
	viewer.back.isVisible = false;;
	viewer.left = new CreateCuboid('viewerleft', 1, 60, 6, jccsStudio.scene);
	viewer.left.position.x = -3;
	viewer.left.parent = holder;
	viewer.left.isVisible = false;
	viewer.right = new CreateCuboid('viewerright', 1, 60, 6, jccsStudio.scene);
	viewer.right.position.x = 3;
	viewer.right.parent = holder;
	viewer.right.isVisible = false;;
	viewer.top = new CreateCuboid('viewertop', 6, 60, 1, jccsStudio.scene);
	viewer.top.position.y = 3;
	viewer.top.parent = holder;
	viewer.top.isVisible = false;;
	viewer.bottom = new CreateCuboid('viewerbottom', 6, 60, 1, jccsStudio.scene);
	viewer.bottom.position.y = -3;
	viewer.bottom.parent = holder;
	viewer.bottom.isVisible = false;
	
	var crosshairdown = BABYLON.Mesh.CreateLines('crosshairdown', [new BABYLON.Vector3(0,1,0), new BABYLON.Vector3(0,-1,0)], jccsStudio.scene);
	crosshairdown.material = blackMat;
	crosshairdown.position.z = 30;
	crosshairdown.parent = holder;
	
	var crosshairacross = BABYLON.Mesh.CreateLines('crosshairacross', [new BABYLON.Vector3(1,0,0), new BABYLON.Vector3(-1,0,0)], jccsStudio.scene);
	crosshairacross.material = blackMat;
	crosshairacross.position.z = 30;
	crosshairacross.parent = holder;
	
	var target = BABYLON.Mesh.CreateBox('target', 1, jccsStudio.scene);
	target.position = new BABYLON.Vector3(0, 0, 13*60);
	//target.material = blackMat;
	target.isVisible = false;
	target.parent = holder;
	
	holder.position = new BABYLON.Vector3(15,52, -585);
	holder.rotation.x = 5*Math.PI/180;
	jccsStudio.followCamera.position = viewer.back.getAbsolutePosition();	
	jccsStudio.followCamera.setTarget(target.getAbsolutePosition());
	
	//Create Ground
	var ground=BABYLON.Mesh.CreateGround("ground",1200, 1200, 20, jccsStudio.scene,  false, BABYLON.Mesh.DOUBLESIDE);	
	ground.material = greenGridMat;
	ground.material.wireframe=true;
	ground.position.y = 0;
	
	//Create Ceiling
	var ceiling=BABYLON.Mesh.CreateGround("ceiling",1200, 1200, 1, jccsStudio.scene);	
	ceiling.position.y = 720;
	ceiling.isVisible = false;
	ceiling.isPickable = false;

	//Create Planes for each side	
	var backPlane=BABYLON.Mesh.CreateGround("backPlane",1200, 1200, 20, jccsStudio.scene);	
	backPlane.material = yellowGridMat;
	backPlane.material.wireframe=true;
	backPlane.rotation.x = Math.PI/2;
	backPlane.position.x=0;
	backPlane.position.y=600;
	backPlane.position.z=600;
	backPlane.isPickable = false;
	
	var backPlaneBlock=BABYLON.Mesh.CreateGround("backPlaneBlock",1200, 1200, 20, jccsStudio.scene);	
	backPlaneBlock.rotation.x = Math.PI/2;
	backPlaneBlock.position.x=0;
	backPlaneBlock.position.y=600;
	backPlaneBlock.position.z=570;
	backPlaneBlock.isPickable = false;
	backPlaneBlock.isVisible = false;	
	
	var leftSidePlane=BABYLON.Mesh.CreateGround("leftSidePlane",1200, 1200, 20, jccsStudio.scene);	
	leftSidePlane.material = blueGridMat;
	leftSidePlane.material.wireframe=true;
	leftSidePlane.rotation.z = Math.PI/2;
	leftSidePlane.position.x=-600;
	leftSidePlane.position.y=600;
	leftSidePlane.position.z=0;
	leftSidePlane.isPickable = false;
	
	var leftSideBlock=BABYLON.Mesh.CreateGround("leftSideBlock",1200, 1200, 20, jccsStudio.scene);	
	leftSideBlock.rotation.z = Math.PI/2;
	leftSideBlock.position.x=-570;
	leftSideBlock.position.y=600;
	leftSideBlock.position.z=0;
	leftSideBlock.isPickable = false;
	leftSideBlock.isVisible = false;
	
	var frontPlane=BABYLON.Mesh.CreateGround("frontPlane",1200, 1200, 20, jccsStudio.scene);	
	frontPlane.material = brownGridMat;
	frontPlane.material.wireframe=true;
	frontPlane.rotation.x = Math.PI/2;
	frontPlane.position.x=0;
	frontPlane.position.y=600;
	frontPlane.position.z=-600;
	frontPlane.isPickable = false;
	frontPlane.visibility = 0;

	var rightSidePlane=BABYLON.Mesh.CreateGround("rightSidePlane",1200, 1200, 20, jccsStudio.scene);	
	rightSidePlane.material = redGridMat;
	rightSidePlane.material.wireframe=true;
	rightSidePlane.rotation.z = Math.PI/2;
	rightSidePlane.position.x=600;
	rightSidePlane.position.y=600;
	rightSidePlane.position.z=0;	
	rightSidePlane.isPickable = false;
	
	var skybox = BABYLON.Mesh.CreateBox("skyBox", 2000.0, jccsStudio.scene);
	skybox.isVisible=false;
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", jccsStudio.scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../images/skybox/skybox", jccsStudio.scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skybox.material = skyboxMaterial;

	
	//Make Cubees  L prefix for Live Cubee
	function makeBox() {
		var name = "L"+currentModelName+"¬box"+(num_of_boxes++);
		//var boxMat = new BABYLON.StandardMaterial("blue", jccsStudio.scene);
		//boxMat.emissiveColor = new BABYLON.Color3(colour.colarray[0]/255,colour.colarray[1]/255,colour.colarray[2]/255);
		JCubees[name]= new JcubeeBox(name, 30, 30 + 12*60, 30, colour.material, jccsStudio.scene);		
		JCubees[name].addMarkers(jccsStudio.scene);
		hideSubMenus();
		resetBorders();		
		selection.style.color="#000000";		
		selectNew(JCubees[name].Jcubee);
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;		
	}
	
	function makeCylinder() {
		var name = "L"+currentModelName+"¬cyl"+(num_of_boxes++);
		//var boxMat = new BABYLON.StandardMaterial("blue", jccsStudio.scene);
		//boxMat.emissiveColor = new BABYLON.Color3(colour.colarray[0]/255,colour.colarray[1]/255,colour.colarray[2]/255);
		JCubees[name]= new JcubeeCylinder(name, 30, 30 + 12*60, 30, colour.material, jccsStudio.scene);
		JCubees[name].addMarkers(jccsStudio.scene);
		hideSubMenus();
		resetBorders();		
		selection.style.color="#000000";		
		selectNew(JCubees[name].Jcubee);
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}
	
	function makeSphere() {
		var name = "L"+currentModelName+"¬sph"+(num_of_boxes++);
		//var boxMat = new BABYLON.StandardMaterial("blue", jccsStudio.scene);
		//boxMat.emissiveColor = new BABYLON.Color3(colour.colarray[0]/255,colour.colarray[1]/255,colour.colarray[2]/255);
		JCubees[name]= new JcubeeSphere(name, 30, 30 + 12*60, 30, colour.material, jccsStudio.scene);
		JCubees[name].addMarkers(jccsStudio.scene);
		hideSubMenus();
		resetBorders();		
		selection.style.color="#000000";		
		selectNew(JCubees[name].Jcubee);
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}

	function makeRoof() {
		var name = "L"+currentModelName+"¬rof"+(num_of_boxes++);
		//var boxMat = new BABYLON.StandardMaterial("blue", jccsStudio.scene);
		//boxMat.emissiveColor = new BABYLON.Color3(colour.colarray[0]/255,colour.colarray[1]/255,colour.colarray[2]/255);
		JCubees[name]= new JcubeeRoof(name, 30, 30 + 12*60, 30, colour.material, jccsStudio.scene);
		JCubees[name].addMarkers(jccsStudio.scene);
		hideSubMenus();
		resetBorders();		
		selection.style.color="#000000";		
		selectNew(JCubees[name].Jcubee);
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}
	
	//select new cubee
	function selectNew(cubee) {
		currentMeshes = {};
		//currentMaterials = {};
		currentMeshes[cubee.name] = cubee;
		for(var mesh in JCubees) {						
			if(!(mesh in currentMeshes)) {						
				JCubees[mesh].Jcubee.material.alpha = 0.5;
				JCubees[mesh].hideMarkers();
			}
		}
	}
	
	function selectNewModel(scene_model) {
		currentParents = {};		
		currentParents[scene_model.name] = scene_model;
		for(var model in sceneParents) {		
			if(!(model in currentParents))	{					
				for(var i=0; i<sceneParents[model].modelChildren.length;i++) {
					sceneParents[model].modelChildren[i].Jcubee.material.alpha = 0.5;
					sceneParents[model].modelChildren[i].hideMarkers();					
				}
			}
		}
	}
		
	// Register a render loop to repeatedly render the scene
	jcEngine.runRenderLoop(function () {			
		jccsStudio.scene.render();
	}); 
	
	// Watch for browser/canvas resize events
	window.addEventListener("resize", function () {
		jcEngine.resize();
	});
	
	// Events

    var getGroundPosition = function () {
        // Use a predicate to get position on the ground
        var pickinfo = jccsStudio.scene.pick(jccsStudio.scene.pointerX, jccsStudio.scene.pointerY, function (mesh) { return mesh == ground; });
        if (pickinfo.hit) {
            return pickinfo.pickedPoint;
        }

        return null;
    };

    var onPointerDown = function (evt) {		
        if (evt.button !== 0) {
            return;
        };

        // check if we are under a pickable mesh			
        var pickInfo = jccsStudio.scene.pick(jccsStudio.scene.pointerX, jccsStudio.scene.pointerY);	
		if (pickInfo.hit && pickInfo.pickedMesh !==ground) {	
            var currentMesh = pickInfo.pickedMesh;
			var name = currentMesh.name;			
			if(name.charAt(0)=="I") {
				var currentParent = sceneModels[name].parent;
				name = currentParent.name;
				updateCurrentModels()
			}
			else {
				updateCurrentMeshes();
			}												
			
            groundPoint = getGroundPosition(evt);

            if (groundPoint) { // we need to disconnect jccsStudio.camera from jcCanvas
                setTimeout(function () {
                    jccsStudio.camera.detachControl(jcCanvas);
                }, 0);
            }
        }
        
         function updateCurrentMeshes() {
			if(shiftDown) {
				if(name in currentMeshes) {
					currentMeshes[name].material.alpha = 0.5;
					JCubees[name].hideMarkers();
					delete currentMeshes[name];
				}
				else {
					currentMeshes[name] = currentMesh;
					currentMesh.material.alpha = 1;	
					JCubees[name].showMarkers();					
				}
			}
			else {			
				for(var mesh in JCubees) {						
					JCubees[mesh].Jcubee.material.alpha = 1;
					JCubees[mesh].hideMarkers();
				}			
				currentMeshes = {};
				//currentMaterials = {}; 
				currentMeshes[name] = currentMesh;
				JCubees[name].showMarkers();
				for(var mesh in JCubees) {						
					if(!(mesh in currentMeshes)) {						
						JCubees[mesh].Jcubee.material.alpha = 0.5;
					}
				}
			}
			if(selection.innerHTML == "Select All") {
				selection.innerHTML = "Selection";
			}
			selection.style.color="#000000";
		}

		function updateCurrentModels() {
			if(shiftDown) {				
				if(name in currentParents) {
					delete currentParents[name];
				}
				else {
					currentParents[name] = currentParent;
					for(var i=0; i<currentParent.modelChildren.length;i++) {
						currentParent.modelChildren[i].Jcubee.material.alpha = 1;
						currentParent.modelChildren[i].showMarkers();
					}						
				}
			}
			else {			
				for(var model in sceneParents) {						
					for(var i=0; i<sceneParents[model].modelChildren.length;i++) {
						sceneParents[model].modelChildren[i].Jcubee.material.alpha = 1;
						sceneParents[model].modelChildren[i].showMarkers();
					}
				}			
				currentParents = {}; 
				currentParents[name] = currentParent;
				for(var model in sceneParents) {						
					if(!(model in currentParents)) {						
						for(var i=0; i<sceneParents[model].modelChildren.length;i++) {
							sceneParents[model].modelChildren[i].Jcubee.material.alpha = 0.5;
							sceneParents[model].modelChildren[i].hideMarkers();
						}
					}
				}
			}
			if(scene_selection.innerHTML == "Select All") {
				scene_selection.innerHTML = "Selection";
			}
			scene_selection.style.color="#000000";
		} 
   };

    var onPointerUp = function () {	
		hideSubMenus();
		scene_hideSubMenus();
		
        if (groundPoint) {
            jccsStudio.camera.attachControl(jcCanvas, true);
            groundPoint = null;
            return;
        }
		
		if(currentMeshes === {}) {
			selection.innerHTML = "Select All";
			selection.style.color="#000000";
		}
		
		if(JCubees === {} ) {
			selection.innerHTML = "Selection";
			selection.style.color="rgb(136, 136, 136)"
		}
		
		if(currentParents === {}) {
			scene_selection.innerHTML = "Select All";
			scene_selection.style.color="#000000";
		}
		
		if(sceneParents === {} ) {
			scene_selection.innerHTML = "Selection";
			scene_selection.style.color="rgb(136, 136, 136)"
		}
		
    };
      
	
	var onPointerMove = function() {
		jccsStudio.camera.alpha +=2*Math.PI;
		jccsStudio.camera.alpha %=2*Math.PI;			
		if(1.9<jccsStudio.camera.alpha && jccsStudio.camera.alpha<4.4) {
			leftSidePlane.visibility = 0;
		}
		else {
			leftSidePlane.visibility = 1;
		}
		if(0.25<jccsStudio.camera.alpha && jccsStudio.camera.alpha<3.1) {
			backPlane.visibility = 0;
		}
		else {
			backPlane.visibility = 1;
		} 
		if((0<jccsStudio.camera.alpha && jccsStudio.camera.alpha<1.4)  || (4.9<jccsStudio.camera.alpha && jccsStudio.camera.alpha<6.5)) {
			rightSidePlane.visibility = 0;
		}
		else {
			rightSidePlane.visibility = 1;
		}	
		if(3.4<jccsStudio.camera.alpha && jccsStudio.camera.alpha<5.9) {
			frontPlane.visibility = 0;
		}
		else {
			frontPlane.visibility = 1;
		}
	};
	
	var onKeyDown = function(evt) {
//console.log(evt.keyCode);

		if(evt.keyCode == 27  && viewcamera) {
			build_camera();
			return;
		};
		
	
		if(evt.keyCode == 16) {
			if(!shiftDown) {
				shiftDown=true;
			}
			return;
		};
		
		if(evt.keyCode == 107  && viewcamera) {
			if(cameraSpeed<5) {
				cameraSpeed +=0.25;
			}
			return;
		};
		
		if(evt.keyCode == 109  && viewcamera) {
			if(cameraSpeed>1) {
				cameraSpeed -=0.25;
			}
			return;
		};
		
		if(evt.keyCode == 101 && viewcamera) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			cameraMove(collideCamera.front, 1*cameraSpeed, BABYLON.Axis.Z, BABYLON.Space.LOCAL, true);
			return;		
		}
		
		if(evt.keyCode == 96 && viewcamera) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}			
			cameraMove(collideCamera.back, -1*cameraSpeed, BABYLON.Axis.Z, BABYLON.Space.LOCAL, true);
			return;	
		}
		
		if(evt.keyCode == 100 && viewcamera) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			cameraMove(collideCamera.left, -0.005*cameraSpeed, BABYLON.Axis.Y, BABYLON.Space.WORLD, false);	
			return;		
		}
		
		if(evt.keyCode == 102 && viewcamera) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			cameraMove(collideCamera.right, 0.005*cameraSpeed, BABYLON.Axis.Y, BABYLON.Space.WORLD, false);
			return;			
		}
		
		
		if(evt.keyCode == 98 && viewcamera) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			cameraMove(collideCamera.down, -1*cameraSpeed, BABYLON.Axis.Y, BABYLON.Space.WORLD, true);
			return;			
		}
		
		if(evt.keyCode == 104 && viewcamera) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			cameraMove(collideCamera.up, 1*cameraSpeed, BABYLON.Axis.Y, BABYLON.Space.WORLD, true);	
			return;	
		}
		
		if((evt.keyCode == 97 || evt.keyCode == 99) && viewcamera) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
console.log("A",viewangle*180/Math.PI);				
			if(viewangle> 6 * Math.PI/180 ) {
				cameraMove(collideCamera.lookup, 0.005*cameraSpeed, BABYLON.Axis.X, BABYLON.Space.LOCAL, false);
				viewangle -=0.005*cameraSpeed;
			}
			return;						
		}
		
		if((evt.keyCode == 103 || evt.keyCode == 105) && viewcamera) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
console.log("B",viewangle*180/Math.PI);			
			if(viewangle< 50 * Math.PI/180 ) {			
				cameraMove(collideCamera.lookdown, -0.005*cameraSpeed, BABYLON.Axis.X, BABYLON.Space.LOCAL, false);
				viewangle +=0.005*cameraSpeed;	
			}
			return;		
		}
	
		if(evt.keyCode==39 && !viewcamera) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			if(inScene) {
				modelMove(collide.right, moveRight);
			}
			else {
				rightMove();
			}
			return;
		};
		
		if(evt.keyCode==37 && !viewcamera) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			if(inScene) {
				modelMove(collide.left, moveLeft);
			}
			else {
				leftMove();
			}
			return;
		}
		
		if(evt.keyCode==40 && !viewcamera) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			if(inScene) {				
				modelMove(collide.down, moveDown);
			}
			else {
				downMove();
			}
			return;
		}
		
		if(evt.keyCode==38 && !viewcamera) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			if(inScene) {
				modelMove(collide.up, moveUp);
			}
			else {
				upMove();
			}			
			return;
		}
		
		if(evt.keyCode==190 && !viewcamera) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			if(inScene) {
				modelMove(collide.front, moveForward);
			}
			else {
				forwardMove();
			}			
			return;
		}
		
		if(evt.keyCode==188 && !viewcamera) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			if(inScene) {
				modelMove(collide.back, moveBackward);
			}
			else {
				backMove();
			}			
			return;
		}
	};
	
	var onKeyUp = function () {
        if (detached) {
			detached = false;
            jccsStudio.camera.attachControl(jcCanvas, true);
            return;
        }
		shiftDown = false;
   };
	
	function rightMove() {
		if(stepsLeftRight(JCubees, currentMeshes).right>0  || !solid.checked) {
			var diff = moveRight;
			for(var name in currentMeshes) {			
				currentMeshes[name].position.addInPlace(diff);			
				JCubees[name].moveT(currentMeshes[name].position);
			}
		}
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}
	
	function leftMove() {
		if(stepsLeftRight(JCubees, currentMeshes).left>0  || !solid.checked) {
			var diff = moveLeft;
			for(var name in currentMeshes) {
				currentMeshes[name].position.addInPlace(diff);
				JCubees[name].moveT(currentMeshes[name].position);
			}
		}
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}
	
	function upMove() {
		if(stepsUpDown(JCubees, currentMeshes).up>0  || !solid.checked) {
			var diff = moveUp;
			for(var name in currentMeshes) {
				currentMeshes[name].position.addInPlace(diff);
				JCubees[name].moveT(currentMeshes[name].position);
			}
		}
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}
	
	function downMove() {
		if(stepsUpDown(JCubees, currentMeshes).down>0  || !solid.checked) {
			var diff = moveDown;
			for(var name in currentMeshes) {
				currentMeshes[name].position.addInPlace(diff);
				JCubees[name].moveT(currentMeshes[name].getAbsolutePosition());
			}
		}
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;	
	}
	
	function forwardMove() {
		if(stepsForwardBack(JCubees, currentMeshes).forward>0  || !solid.checked) {
			var diff = moveForward;
			for(var name in currentMeshes) {
				currentMeshes[name].position.addInPlace(diff);
				JCubees[name].moveT(currentMeshes[name].position);
			}
		}
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}
	
	function backMove() {
		if(stepsForwardBack(JCubees, currentMeshes).back>0  || !solid.checked) {
			var diff = moveBackward;
			for(var name in currentMeshes) {
				currentMeshes[name].position.addInPlace(diff);
				JCubees[name].moveT(currentMeshes[name].position);
			}
		}
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}
	
	function modelMove(blocked, diff) {
		if(!blocked  || !scene_solid.checked) {
			diff = diff.scale(0.5);
			for(var name in currentParents) {			
				currentParents[name].model.position.addInPlace(diff);
				collide = collision(currentParents[name], sceneParents);
				var edgeCollide = collideEdges(currentParents[name]);
				for(var dir in collide)	{
					collide[dir] = collide[dir] || edgeCollide[dir];
				}		
				for(var i=0; i<currentParents[name].modelChildren.length;i++) {
					currentParents[name].modelChildren[i].moveT(currentParents[name].modelChildren[i].Jcubee.getAbsolutePosition());
				}
			}
		}
	}
	
	
	function collideEdges(model) {
		var collide = {left:false, right:false, up:false, down:false, front:false, back:false};		
		for(var i=0; i<model.modelChildren.length; i++) {
			model.modelChildren[i].Jcubee.computeWorldMatrix(true);
			ground.computeWorldMatrix(true);
			ceiling.computeWorldMatrix(true);
			leftSideBlock.computeWorldMatrix(true);
			rightSidePlane.computeWorldMatrix(true);
			frontPlane.computeWorldMatrix(true);
			backPlaneBlock.computeWorldMatrix(true);
			collide.down = collide.down || model.modelChildren[i].Jcubee.intersectsMesh(ground, true);
			collide.up = collide.up || model.modelChildren[i].Jcubee.intersectsMesh(ceiling, true);
			collide.left = collide.left || model.modelChildren[i].Jcubee.intersectsMesh(leftSideBlock, true);
			collide.right = collide.right || model.modelChildren[i].Jcubee.intersectsMesh(rightSidePlane, true);
			collide.back = collide.back || model.modelChildren[i].Jcubee.intersectsMesh(frontPlane, true);
			collide.front = collide.front || model.modelChildren[i].Jcubee.intersectsMesh(backPlaneBlock, true);
		}
		return collide;
	}
	
	function cameraMove(blocked, diff, axis, space, translate) {
		if(!blocked) {
			if(translate) {
				if(axis === BABYLON.Axis.Z) {
					holder.locallyTranslate(axis.scale(diff));
				}
				else {
					holder.translate(axis,diff,space);
				}
			}
			else {
				holder.rotate(axis,diff,space);				
			}
			jccsStudio.followCamera.position = viewer.back.getAbsolutePosition();	
			jccsStudio.followCamera.setTarget(target.getAbsolutePosition());
			collideCamera = collisionCamera(holder, sceneParents, viewer);
			var edgeCollide = collideEdgesCamera(viewer);
			for(var dir in collide)	{
				collideCamera[dir] = collideCamera[dir] || edgeCollide[dir];
			}		
		}
	}
	
	function collideEdgesCamera(viewer) {
		var collide = {left:false, right:false, up:false, down:false, front:false, back:false, lookup:false, lookdown:false};		
		viewer.front.computeWorldMatrix(true);
		viewer.back.computeWorldMatrix(true);
		viewer.top.computeWorldMatrix(true);
		viewer.bottom.computeWorldMatrix(true);
		ground.computeWorldMatrix(true);
		ceiling.computeWorldMatrix(true);
		leftSidePlane.computeWorldMatrix(true);
		rightSidePlane.computeWorldMatrix(true);
		frontPlane.computeWorldMatrix(true);
		backPlane.computeWorldMatrix(true);
		
		collide.front = viewer.front.intersectsMesh(backPlane, true);
		collide.front = collide.front || viewer.front.intersectsMesh(frontPlane, true);
		collide.front = collide.front || viewer.front.intersectsMesh(ceiling, true);
		collide.front = collide.front || viewer.front.intersectsMesh(ground, true);
		collide.front = collide.front || viewer.front.intersectsMesh(leftSidePlane, true);
		collide.front = collide.front || viewer.front.intersectsMesh(rightSidePlane, true);
		
		collide.back = viewer.back.intersectsMesh(backPlane, true);
		collide.back = collide.back || viewer.back.intersectsMesh(frontPlane, true);
		collide.back = collide.back || viewer.back.intersectsMesh(ceiling, true);
		collide.back = collide.back || viewer.back.intersectsMesh(ground, true);
		collide.back = collide.back || viewer.back.intersectsMesh(leftSidePlane, true);
		collide.back = collide.back || viewer.back.intersectsMesh(rightSidePlane, true);
		
		collide.up = viewer.top.intersectsMesh(ceiling, true);
		
		collide.down = viewer.bottom.intersectsMesh(ground, true);

		return collide;
	}	
	
    jcCanvas.addEventListener("mousedown", onPointerDown, false);
    jcCanvas.addEventListener("mouseup", onPointerUp, false);
	jcCanvas.addEventListener("mousemove", onPointerMove, false);
	window.addEventListener("keydown", onKeyDown, false);
	window.addEventListener("keyup", onKeyUp, false);
	

    jccsStudio.scene.onDispose = function () {
        jcCanvas.removeEventListener("mousedown", onPointerDown);
        jcCanvas.removeEventListener("mouseup", onPointerUp);
		window.removeEventListener("keydown", onKeyDown, false);
		window.removeEventListener("keyup", onKeyUp, false);
    }

}

