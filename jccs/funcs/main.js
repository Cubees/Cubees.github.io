function main() {

	/*-------------MAIN VARIABLES ---------------*/	
	
	// Event variables
    var groundPoint;
	var currentMeshes={};
    var currentMesh = null;
    
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
	var sub_num = 0;
	var JCubees={};
	var jcCanvas;
	var jcEngine;
	var jccsStudio, jcssStudio;
	var jcModelList={}, jcModels={};
	var sceneModelList={}, sceneModels={};
	var doAddToScene = false;

	
	
	/***********************************CONSTRUCTION DIALOGUE CODES***********************************/
	
	/*-------------CONSTRUCTION MENU ELEMENTS---------------	*/
	//Get Menu Elements 
	var menu = document.getElementById("menu");
	var menulist = document.getElementById("menulist");
	
	var add_to_scene = document.getElementById("addToScene");
	var model = document.getElementById("model");
	
	var leftarrow = document.getElementById("leftarrow");
	var rightarrow = document.getElementById("rightarrow");
	var uparrow = document.getElementById("uparrow");
	var downarrow = document.getElementById("downarrow");
	var forwardarrow = document.getElementById("forwardarrow");
	var backarrow = document.getElementById("backarrow");
	
	// File Menu and Sub-Menus
	var file_ = document.getElementById("file");
	var subfilemenu = document.getElementById("subfilemenu");
	var store = document.getElementById("store");
	var store_as = document.getElementById("store_as");
	var fetch = document.getElementById("fetch");
	
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
	var colour = document.getElementById("colour");
	colour.colarray=[0,0,255];
	
	var colours = document.getElementById("colours");
	setColours(colours);
	
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
	store.addEventListener('click', doStore, false);
	store_as.addEventListener('click', openStoreAs, false);
	fetch.addEventListener('click', openFetch, false);
	
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
	colour.addEventListener("click", function() {setMeshColour(this)}, false );
	
	rotateX.addEventListener("click", Xrotate, false);
	rotateY.addEventListener("click", Yrotate, false);
	rotateZ.addEventListener("click", Zrotate, false);
	
	//Set readable styles for Selection
	selection.style.color="#888888";
	
	//add to scene event
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
				col.addEventListener("mouseover", function() {this.style.opacity = 1}, false );
				col.addEventListener("mouseout", function() {this.style.opacity = 0.5}, false );
				col.addEventListener("click", function() {setMeshColour(this)}, false );
				colours.appendChild(col);
			}
		}
		model.innerHTML = "Model -- *"+currentName;
		JCisStored = false;
	}
	
	//set textures in selection menu
	function setTextures() {
		var textures = [
				"Metal",
				"Wood",
				"Rust",
				"Wheel"
		]
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
		model.innerHTML = "Model -- *"+currentName;
		JCisStored = false;
	}
	
	//menu choices actions

	//File functions
	function showFileMenu() {
		hideSubMenus();
		subfilemenu.style.visibility="visible";
		file_.style.borderBottom = "none";
	}
	
	function doStore() {	
		if(currentName == getRef(currentRef)) {
			openStoreAs();
		}
		else {
			model.innerHTML = "Model -- "+currentName;
			JCisStored = true;
		}
	}
	
	function openStoreAs() {		
		storeDB.style.visibility = 'visible';
	}
	
	function openFetch() {
		fillFetch();
		fetchDB.style.visibility = 'visible';
		
	}
	
	function fillFetch() {
		var fetch_array =[];
		for(var name in jcModelList) {
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
	}
	
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
	}
	
	function Xrotate() {
//		var serializedScene = BABYLON.SceneSerializer.Serialize(jccsStudio.scene);
//		var strScene = JSON.stringify(serializedScene);
//		console.log(strScene);
		for(var mesh in currentMeshes) {
			currentMeshes[mesh].rotate(BABYLON.Axis.X, -Math.PI/2, BABYLON.Space.WORLD);		
		}
		model.innerHTML = "Model -- *"+currentName;
		JCisStored = false;
	}

	function Yrotate() {
		for(var mesh in currentMeshes) {
			currentMeshes[mesh].rotate(BABYLON.Axis.Y, -Math.PI/2, BABYLON.Space.WORLD);						
		}
		model.innerHTML = "Model -- *"+currentName;
		JCisStored = false;
	}
	
	function Zrotate() {
		for(var mesh in currentMeshes) {
			currentMeshes[mesh].rotate(BABYLON.Axis.Z, -Math.PI/2, BABYLON.Space.WORLD);						
		}
		model.innerHTML = "Model -- *"+currentName;
		JCisStored = false;
	}
	
	//Add to Scene functions	
	function addtoscene() {
		doAddToScene=false;
		if(!JCisStored) {
		 	doAddToScene=true;
		 	openStoreAs();
		 }
		 else {
		 	sceneSwitch();
		 }
		 hideSubMenus();
		 menu.style.visibility = 'hidden';
		 scene_menu.style.visibility = 'visible';
	}
	
	function sceneSwitch() {
		sceneModels[currentRef+"IParent"] = BABYLON.Mesh.CreateBox(currentRef+"IParent", 5.0, jccsStudio.scene);
		sceneModels[currentRef+"IParent"].visibility = 0;
		for(var ref in JCubees) {
			sceneModels[currentRef+"I"] = JCubees[ref].Jcubee.createInstance(currentRef+"I");
			sceneModels[currentRef+"I"].material.alpha = 1;
			sceneModels[currentRef+"I"].parent = sceneModels[currentRef+"IParent"];
			sceneModels[currentRef+"IParent"].scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
			JCubees[ref].disable();
		}
		frontPlane.setEnabled(false);
		backPlane.setEnabled(false);
		leftSidePlane.setEnabled(false);
		rightSidePlane.setEnabled(false);
		ground.material.wireframe = false;
			
		for(var Iref in sceneModels) {
			sceneModels[Iref].setEnabled(true);
		}
		
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
		var elmMat = new BABYLON.StandardMaterial("elmMat", jccsStudio.scene);
		elmMat.emissiveColor = new BABYLON.Color3(elm.colarray[0]/255,elm.colarray[1]/255,elm.colarray[2]/255);
		for(var mesh in currentMeshes) {						
			currentMeshes[mesh].material = elmMat;
		}
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
		if(name in jcModelList && !newModel) {
			confirmName = name;
			confirmFunc = setModelList;
			confirmAction = 'store';
			confirmDesc.innerHTML = 'The model <span style="font-style:italic"> '+confirmName+'</span> already exists.<BR>Do you want to continue to '+confirmAction+' this function?'
			openConfirmDBox();
		}
		else {
			setModelList(name);
		}
	}
	
	function setModelList(name) {
		newModel = false;		
		storeDB.style.visibility = 'hidden';
		var nref;
		var newRef = (getSubRef(currentRef)+1)+getRef(currentRef);
		var newSelected = {};

		jcModelList[name] = newRef;
		jcModels[newRef] = {};
		var newJCubees = jcModels[newRef];
		for(var ref in JCubees) {
			nref = (getSubRef(ref)+1)+getRef(ref);
			newJCubees[nref]=new JcubeeBlank(nref);
			newJCubees[nref].Jcubee=JCubees[ref].Jcubee.clone(nref);
			newJCubees[nref].addMarkers(jccsStudio.scene);
			if(ref in currentMeshes) {
				currentMeshes[nref] = newJCubees[nref].Jcubee;
				delete currentMeshes[ref];
			}
			JCubees[ref].disable();
		}

		JCubees = newJCubees;
		
		currentName = name;
		currentRef = newRef;
		model.innerHTML = "Model -- "+currentName;
		
		storeIn.value = currentName;
		JCisStored = true;
		if(doAddToScene) {
			sceneSwitch();
		}
	}
	
	function doFetch() {
		var name = fetchname.innerHTML;
		var newref = jcModelList[name];
		for(var ref in JCubees) {
			JCubees[ref].disable();
		}
alert('stop');		
		JCubees = jcModels[newref];
		for(var ref in JCubees) {
			JCubees[ref].enable();
		} 
	}
	
	/*********************************************SCENE DIALOGUE CODE****************************************/
	
	/*-------------SCENE MENU ELEMENTS---------------	*/
	//Get Menu Elements 
	var scene_menu = document.getElementById("scene_menu");
	scene_menu.style.visibility = 'hidden';
	var scene_menulist = document.getElementById("scene_menulist");
	
	var scene_constructSite = document.getElementById("scene_constructSite");
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
	var scene_save = document.getElementById("scene_save");
	var scene_save_as = document.getElementById("scene_save");
	
		// Selection Menu and Sub-Menus
	var scene_selection = document.getElementById("scene_selection");
	var scene_subselectionmenu = document.getElementById("scene_subselectionmenu");
	var scene_clear = document.getElementById("scene_clear");
	var scene_all = document.getElementById("scene_all");

	var scene_rotateX = document.getElementById("scene_rotateX");
	var scene_rotateY = document.getElementById("scene_rotateY");
	var scene_rotateZ = document.getElementById("scene_rotateZ");
	
	//*******sub menu list ************
	var scene_subMenuList = [scene_subfilemenu, scene_subselectionmenu];
	
	/*----------SCENE MENU EVENTS--------------------------------*/

	//move events
/* to do	scene_leftarrow.addEventListener("mousedown", scene_leftMove, false);
	scene_rightarrow.addEventListener("mousedown", scene_rightMove, false);
	scene_uparrow.addEventListener("mousedown", scene_upMove, false);
	scene_downarrow.addEventListener("mousedown", scene_downMove, false);
	scene_forwardarrow.addEventListener("mousedown", scene_forwardMove, false);
	scene_backarrow.addEventListener("mousedown", scene_backMove, false); */
	
	//file events
	scene_file_.addEventListener('click', scene_showFileMenu, false);
	//to do scene_save.addEventListener('click', scene_doSave, false);
	//to do scene_save_as.addEventListener('click', scene_openSaveAs, false);
	
	//Selection events
	scene_selection.addEventListener("click", scene_showSelectionMenu, false);
	scene_clear.addEventListener("click", scene_clearSelection, false);
	scene_all.addEventListener("click", scene_selectAll, false);
	
/* to do	scene_rotateX.addEventListener("click", scene_Xrotate, false);
	scene_rotateY.addEventListener("click", scene_Yrotate, false);
	scene_rotateZ.addEventListener("click", scene_Zrotate, false); */
	
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
	
	function scene_selectAll() {
		for(var mesh in JCubees) {						
			if(!(mesh in currentMeshes)) {						
				JCubees[mesh].Jcubee.material.alpha = 1;
				JCubees[mesh].showMarkers();
				currentMeshes[mesh] = JCubees[mesh].Jcubee;
			}
		}
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
	var currentRef = 'model'+(num_of_models++);
	var currentName = currentRef;
	var subRef = 1000;
	var currentRef = subRef+currentRef;
	var JCisStored = false;
	jcModelList[currentName] = currentRef;
	jcModels[currentRef] = {};
	JCubees = jcModels[currentRef];
	
	model.innerHTML = "Model -- *"+currentName;
	storeIn.value = currentName;
	
	
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
	
	//jccsStudio.scene.activeCameras.push(jccsStudio.camera);
	
	jccsStudio.frontLight = new BABYLON.PointLight("omni", new BABYLON.Vector3(-3000, 6000, 2000), jccsStudio.scene);
	jccsStudio.backLight = new BABYLON.PointLight("omni", new BABYLON.Vector3(3000, -6000, 2000), jccsStudio.scene);
	jccsStudio.bottomLight = new BABYLON.PointLight("omni", new BABYLON.Vector3(-3000, 6000, -2000), jccsStudio.scene);
	jccsStudio.frontLight.intensity = 0.2;
	jccsStudio.backLight.intensity = 0.2;
	jccsStudio.bottomLight.intensity = 0.2;
	
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

	
	//Create Ground
	var ground=BABYLON.Mesh.CreateGround("ground",1200, 1200, 20, jccsStudio.scene,  false, BABYLON.Mesh.DOUBLESIDE);	
	ground.material = greenGridMat;
	ground.material.wireframe=true;
	ground.position.y = 0;
	ground.position.z=1;

	//Create Planes for each side	
	var backPlane=BABYLON.Mesh.CreateGround("backPlane",1200, 1200, 20, jccsStudio.scene);	
	backPlane.material = yellowGridMat;
	backPlane.material.wireframe=true;
	backPlane.rotation.x = Math.PI/2;
	backPlane.position.x=0;
	backPlane.position.y=600;
	backPlane.position.z=600;
	backPlane.isPickable = false;	
	
	var leftSidePlane=BABYLON.Mesh.CreateGround("leftSidePlane",1200, 1200, 20, jccsStudio.scene);	
	leftSidePlane.material = blueGridMat;
	leftSidePlane.material.wireframe=true;
	leftSidePlane.rotation.z = Math.PI/2;
	leftSidePlane.position.x=-600;
	leftSidePlane.position.y=600;
	leftSidePlane.position.z=0;
	leftSidePlane.isPickable = false;
	
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

	
	//Make Cubees
	function makeBox() {
		var name = "1000box"+(num_of_boxes++);
		var boxMat = new BABYLON.StandardMaterial("blue", jccsStudio.scene);
		boxMat.emissiveColor = new BABYLON.Color3(colour.colarray[0]/255,colour.colarray[1]/255,colour.colarray[2]/255);
		JCubees[name]= new JcubeeBox(name, 30, 30 + 13*60, 30, boxMat, jccsStudio.scene);		
		JCubees[name].addMarkers(jccsStudio.scene);
		hideSubMenus();
		resetBorders();		
		selection.style.color="#000000";		
		selectNew(JCubees[name].Jcubee);
		model.innerHTML = "Model -- *"+currentName;
		JCisStored = false;
	}
	
	function makeCylinder() {
		var name = "10000cylinder"+(num_of_boxes++);
		var boxMat = new BABYLON.StandardMaterial("blue", jccsStudio.scene);
		boxMat.emissiveColor = new BABYLON.Color3(colour.colarray[0]/255,colour.colarray[1]/255,colour.colarray[2]/255);
		JCubees[name]= new JcubeeCylinder(name, 30, 30 + 13*60, 30, boxMat, jccsStudio.scene);
		JCubees[name].addMarkers(jccsStudio.scene);
		hideSubMenus();
		resetBorders();		
		selection.style.color="#000000";		
		selectNew(JCubees[name].Jcubee);
		model.innerHTML = "Model -- *"+currentName;
		JCisStored = false;
	}
	
	function makeSphere() {
		var name = "1000sphere"+(num_of_boxes++);
		var boxMat = new BABYLON.StandardMaterial("blue", jccsStudio.scene);
		boxMat.emissiveColor = new BABYLON.Color3(colour.colarray[0]/255,colour.colarray[1]/255,colour.colarray[2]/255);
		JCubees[name]= new JcubeeSphere(name, 30, 30 + 13*60, 30, boxMat, jccsStudio.scene);
		JCubees[name].addMarkers(jccsStudio.scene);
		hideSubMenus();
		resetBorders();		
		selection.style.color="#000000";		
		selectNew(JCubees[name].Jcubee);
		model.innerHTML = "Model -- *"+currentName;
		JCisStored = false;
	}

	function makeRoof() {
		var name = "1000roof"+(num_of_boxes++);
		var boxMat = new BABYLON.StandardMaterial("blue", jccsStudio.scene);
		boxMat.emissiveColor = new BABYLON.Color3(colour.colarray[0]/255,colour.colarray[1]/255,colour.colarray[2]/255);
		JCubees[name]= new JcubeeRoof(name, 30, 30 + 13*60, 30, boxMat, jccsStudio.scene);
		JCubees[name].addMarkers(jccsStudio.scene);
		hideSubMenus();
		resetBorders();		
		selection.style.color="#000000";		
		selectNew(JCubees[name].Jcubee);
		model.innerHTML = "Model -- *"+currentName;
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
            currentMesh = pickInfo.pickedMesh;
			var name = currentMesh.name;			
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
			
			selection.style.color="#000000";
			
            groundPoint = getGroundPosition(evt);

            if (groundPoint) { // we need to disconnect jccsStudio.camera from jcCanvas
                setTimeout(function () {
                    jccsStudio.camera.detachControl(jcCanvas);
                }, 0);
            }
        }
   };

    var onPointerUp = function () {	
		hideSubMenus();
		
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

	
		if(evt.keyCode == 16) {
			if(!shiftDown) {
				shiftDown=true;
			}
		}
	
		if(evt.keyCode==39) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			rightMove();
			return;
		}
		
		if(evt.keyCode==37) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			leftMove();
			return;
		}
		
		if(evt.keyCode==40) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			downMove();
			return;
		}
		
		if(evt.keyCode==38) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			upMove();			
			return;
		}
		
		if(evt.keyCode==190) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			forwardMove();			
			return;
		}
		
		if(evt.keyCode==188) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			backMove();			
			return;
		}
	}
	
	var onKeyUp = function () {
        if (detached) {
			detached = false;
            jccsStudio.camera.attachControl(jcCanvas, true);
            return;
        }
		shiftDown = false;
    }
	
	function rightMove() {
		if(stepsLeftRight(JCubees, currentMeshes).right>0) {
			var diff = moveRight;
			for(var name in currentMeshes) {
				currentMeshes[name].position.addInPlace(diff);
				JCubees[name].moveT(currentMeshes[name].position);
			}
		}
		model.innerHTML = "Model -- *"+currentName;
		JCisStored = false;
	}
	
	function leftMove() {
		if(stepsLeftRight(JCubees, currentMeshes).left>0) {
			var diff = moveLeft;
			for(var name in currentMeshes) {
				currentMeshes[name].position.addInPlace(diff);
				JCubees[name].moveT(currentMeshes[name].position);
			}
		}
		model.innerHTML = "Model -- *"+currentName;
		JCisStored = false;
	}
	
	function upMove() {
		if(stepsUpDown(JCubees, currentMeshes).up>0) {
			var diff = moveUp;
			for(var name in currentMeshes) {
				currentMeshes[name].position.addInPlace(diff);
				JCubees[name].moveT(currentMeshes[name].position);
			}
		}
		model.innerHTML = "Model -- *"+currentName;
		JCisStored = false;
	}
	
	function downMove() {
		if(stepsUpDown(JCubees, currentMeshes).down>0) {
			var diff = moveDown;
			for(var name in currentMeshes) {
				currentMeshes[name].position.addInPlace(diff);
				JCubees[name].moveT(currentMeshes[name].position);
			}
		}
		model.innerHTML = "Model -- *"+currentName;
		JCisStored = false;	
	}
	
	function forwardMove() {
		if(stepsForwardBack(JCubees, currentMeshes).forward>0) {
			var diff = moveForward;
			for(var name in currentMeshes) {
				currentMeshes[name].position.addInPlace(diff);
				JCubees[name].moveT(currentMeshes[name].position);
			}
		}
		model.innerHTML = "Model -- *"+currentName;
		JCisStored = false;
	}
	
	function backMove() {
		if(stepsForwardBack(JCubees, currentMeshes).back>0) {
			var diff = moveBackward;
			for(var name in currentMeshes) {
				currentMeshes[name].position.addInPlace(diff);
				JCubees[name].moveT(currentMeshes[name].position);
			}
		}
		model.innerHTML = "Model -- *"+currentName;
		JCisStored = false;
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

