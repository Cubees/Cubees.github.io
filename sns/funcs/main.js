function main() {

	/*-------------MAIN VARIABLES ---------------*/	
	//Saved or not saved icons
	var storeIcon = "&#10022;";
	var saveIcon = "&#10039;";
	var exportIcon = "&#10047;";
	var Blank = "&nbsp;&nbsp;";
	var storeMarker = storeIcon;
	var saveMarker = saveIcon;
	var exportMarker = exportIcon;
	var scene_exportMarker = exportIcon;
	var objectUrl;
	var dmddown=false;
	
	// Event variables
    var groundPoint;
	var currentMeshes={};
	var currentParents={};
	var currentColour;
    
    var newModel=true;
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
	var num_of_mats = 0;
	var jcCanvas;
	var jcEngine;
	var JCubees = {};
	var jccsStudio, jcssStudio;
	var jcModels={};
	var stored={};
	var saved={};
	var exported={};
	var sceneParents={}, sceneModels={};
	var scene_exported = false;
	var doAddToScene = false;
	var inScene=false;
	var scene_import;
	var viewcamera = false;
	var viewangle=5*Math.PI/180;
	var new_scene = true;
	
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
	var help = document.getElementById("help");
	
	var logo = document.getElementById("logo");
	
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
	//var store = document.getElementById("store");
	var store_as = document.getElementById("store_as");
	var fetch = document.getElementById("fetch");
	//var save = document.getElementById("save");
	var save_as = document.getElementById("save_as");
	var openFile = document.getElementById("open"); 
	var manage = document.getElementById("manage"); 
	var export_ = document.getElementById("export");
	var download=document.getElementById("download"); 
	var import_ = document.getElementById("import"); 
	
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
	var fetchTitle= document.getElementById("fetchTitle");
	
	var fetchDesc= document.getElementById("fetchDesc"); 
	var fetchList = document.getElementById("fetchList");
	var fetchBut = document.getElementById("fetchBut");
	
	var importTitle= document.getElementById("importTitle");
	var importDesc= document.getElementById("importDesc"); 
	var importList = document.getElementById("importList");
	var importBut = document.getElementById("importBut");
	var browseBut = document.getElementById("browseBut");
	
	var saveDB = document.getElementById("saveDB"); 
	var saveIn = document.getElementById("saveIn");
	var saveBut = document.getElementById("saveBut");
	
	var manageDB = document.getElementById("manageDB"); 
	var manageIn = document.getElementById("manageIn");
	var manageBut = document.getElementById("manageBut");
	var manageList = document.getElementById("manageList");
	
	var downloadDB = document.getElementById("downloadDB"); 
	var downloadIn = document.getElementById("downloadIn");
	var downloadBut = document.getElementById("downloadBut");
	
	var confirmDB = document.getElementById("confirmDB");
	var confirmBut = document.getElementById("confirmBut");	
	
	/*----------CONSTRUCTION MENU EVENTS--------------------------------*/
	
	help.addEventListener("click", function() {window.open("../jchelp/home.html")}, false);
	
	logo.addEventListener("click", function() {window.open("http://www.babylonjs.com/")}, false);

	//move events
	leftarrow.addEventListener("mousedown", function() {doMove(moveLeft, leftSidePlane)}, false);
	rightarrow.addEventListener("mousedown", function() {doMove(moveRight, rightSidePlane)}, false);
	uparrow.addEventListener("mousedown", function() {doMove(moveUp, ceiling)}, false);
	downarrow.addEventListener("mousedown", function() {doMove(moveDown, ground)}, false);
	forwardarrow.addEventListener("mousedown", function() {doMove(moveForward, backPlane)}, false);
	backarrow.addEventListener("mousedown", function() {doMove(moveBackward, frontPlane)}, false);
	
	//file events
	file_.addEventListener('click', showFileMenu, false);
	newmodel.addEventListener('click', doNew, false);
	//store.addEventListener('click', doStore, false);
	store_as.addEventListener('click', openStoreAs, false);
	fetch.addEventListener('click', openFetch, false);
	
	if(typeof(Storage) !== "undefined") {
		//save.addEventListener('click', doSave, false);
		save_as.addEventListener('click', openSaveAs, false);
		openFile.addEventListener('click', openOpen, false);
		manage.addEventListener('click', openManage, false);
	}
	
	export_.addEventListener('click', doExport, false);
	download.addEventListener("click", openDownload, false);
	import_.addEventListener('click', openImport, false);
	
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
	window.addEventListener('mouseup', function(e) {enddbDrag(e)}, false);
	
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
    
    //Download
   downloadBut.addEventListener('click', startDownload, false);

	//Fetch fromApp
	fetchBut.addEventListener('click', doFetch, false);
	importBut.addEventListener('click', doImport, false);
	if(typeof(Storage) !== "undefined") {
		saveBut.addEventListener('click', doSaveAs, false);
		manageBut.addEventListener('click', doDeleteSaved, false);
	}
	
	function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

		
	/*-------------CONSTRUCTION MENU FUNCTIONS ---------------*/
	//set colours in selection menu
	function setColours(colours) {
		var colourHolder =[];
		var RGB;
		for(var i=0;i<64;i++){
			var rbg_value=HSVtoRGB(i/63, 1, 1)
			RGB=[rbg_value.r,rbg_value.g,rbg_value.b];
			colourHolder.push(RGB);
		}	
		
		var colarray=[];
		for(var i=0; i<64;i++) {
			if(i%8 == 0) {
				k=i/8;				
				colarray[k]=[];
			}
			colarray[k].push(colourHolder[i]);
		} 
		
		var matholder=[[25,100],[50,100],[75,100],[100,100],[100,75],[100,50],[100,25]];
		
		for(row=0;row<8;row++) {
			for(clmn=0;clmn<8;clmn++) {
				col = document.createElement('div');
				col.id="id"+row+clmn;
				col.colarray = colarray[row][clmn];
				col.style.backgroundColor = "rgb("+colarray[row][clmn][0] +","+colarray[row][clmn][1]+","+colarray[row][clmn][2]+")";
				col.className="chart";
				col.materials=[]
				for(var m=0; m<7;m++) {
					col.materials[i] = new BABYLON.StandardMaterial("mat"+row+clmn+matholder[m][0]+matholder[m][1], jccsStudio.scene);
				}
				col.material=col.materials[3];
				col.material.emissiveColor = new BABYLON.Color3(col.colarray[0]/255,col.colarray[1]/255,col.colarray[2]/255);
				col.addEventListener("click", function() {setMeshColour(this)}, false );
				colours.appendChild(col);
			}
		}
		
		currentColour=document.getElementById("id53");
		colour.style.backgroundColor = currentColour.style.backgroundColor;
		currentColour.style.border="solid 1px #000000";
		
		var slider = document.createElement('div');
		slider.style.width="122px";
		slider.style.border="solid 1px #000000";
		slider.style.height="14px";
		slider.style.display="block";
		slider.style.float="left";
		slider.style.margin="2px 2px 2px 2px";
		slider.style.backgroundColor="#AAAAAA";
		colours.appendChild(slider);
		whiteDiv = document.createElement('div');
		whiteDiv.style.position="absolute";
		whiteDiv.style.left="3px";
		whiteDiv.style.height="10px";
		whiteDiv.style.width="10px";
		whiteDiv.style.backgroundColor="#FFFFFF";
		whiteDiv.style.borderRadius="5px";
		whiteDiv.style.margin="2px 1px 2px 1px";
		slider.appendChild(whiteDiv);
		blackDiv = document.createElement('div');
		blackDiv.style.position="absolute";
		blackDiv.style.right="4px";
		blackDiv.style.height="10px";
		blackDiv.style.width="10px";
		blackDiv.style.backgroundColor="#000000";
		blackDiv.style.borderRadius="5px";
		blackDiv.style.margin="2px 1px 2px 1px";
		slider.appendChild(blackDiv);
		diamond = document.createElement('div');
		diamond.style.position="absolute";
		diamond.style.left="60px";
		diamond.style.width="10px";
		diamond.style.height="10px";
		diamond.style.transform="rotate(45deg)";
		diamond.style.backgroundColor="#555555";
		diamond.style.margin="2px 0px 2px 0px";
		diamond.draggable=true;
		slider.appendChild(diamond);
		diamond.addEventListener('mousedown', dmddragstart, false);
		diamond.addEventListener('mousemove', dmddrag, false);
		diamond.addEventListener('mouseup', dmddragend, false);
		
		var dpx,nowx;
		
		function dmddragstart(e) {
			dpx=parseInt(diamond.style.left);
			nowx=getPosition(e).x;
			dmddown=true;
			
		}
		
		function dmddrag(e) {
			if(!dmddown) {
				return
			}
			var s = v = 1;
			var dx=getPosition(e).x-nowx;
			nowx = getPosition(e).x
			dx = dx/Math.abs(dx);
						
			if(10<dx*16+dpx && dx*16+dpx<110) {
				dpx+=dx*16;	
				if(dpx > 60 ) {
					v= 1 -(dpx - 60)/64;
				}
				else {
					s = (dpx+4)/64;
				}			
				diamond.style.left=dpx+"px";
				changeTone(s, v);
			}
		}
		
		function dmddragend() {
			dmddown=false;
		}
		
		function changeTone(s,v) {
			var colourHolder =[];
			var RGB;
			for(var i=0;i<64;i++){
				var rbg_value=HSVtoRGB(i/63, s, v)
				RGB=[rbg_value.r,rbg_value.g,rbg_value.b];
				colourHolder.push(RGB);
			}	
		
			colarray=[];
			for(var i=0; i<64;i++) {
				if(i%8 == 0) {
					k=i/8;				
					colarray[k]=[];
				}
				colarray[k].push(colourHolder[i]);
			} 
		
			for(row=0;row<8;row++) {
				for(clmn=0;clmn<8;clmn++) {
					col = document.getElementById('id'+row+clmn);
					col.colarray = colarray[row][clmn];
					col.style.backgroundColor = "rgb("+colarray[row][clmn][0] +","+colarray[row][clmn][1]+","+colarray[row][clmn][2]+")";
					col.material.emissiveColor = new BABYLON.Color3(col.colarray[0]/255,col.colarray[1]/255,col.colarray[2]/255);
				}
			}
		}
	}
	
	
	
	//set textures in selection menu
	var T;
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
			T=t;
			if(t<10) {
				T="0"+t;
			}
			txtr.material = new BABYLON.StandardMaterial("Tmt"+T, jccsStudio.scene);
			txtr.material.emissiveTexture = new BABYLON.Texture(txtr.imgName, jccsStudio.scene);
			txtr.addEventListener("click", function() {setMeshTexture(this.material)}, false );
			texturepics.appendChild(txtr);
		}
	}
	
	//menu choices actions

	//File functions
	function showFileMenu() {
		hideSubMenus();
		subfilemenu.style.visibility="visible";
		file_.style.borderBottom = "none";
	}
	
	function doNew() {
		if(!stored[currentModelName]) 
		{
			confirmName = currentModelName;
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
		jcModels[currentModelName] = {};
		stored[currentModelName] = false;
		for(var mesh in JCubees) {
			JCubees[mesh].destroy();
			delete JCubees[mesh];
		}
		JCubees = {};
		currentMeshes = {};
	
		storeMarker = storeIcon; 
		saveMarker = saveIcon; 
		exportMarker = exportIcon;
		model.innerHTML = "Model -- "+currentModelName+storeMarker+saveMarker+exportMarker;
		stored[currentModelName] = false;
		saved[currentModelName] = false;
		exported[currentModelName] = false;
		
		storeIn.value = currentModelName;
		saveIn.value  = currentModelName;
		
		selection.innerHTML="Selection";
		selection.style.color=="rgb(136, 136, 136)"
	}
	
	function doStore() {	
		if(newModel) {
			openStoreAs();
		}
		else {
			storeMarker = Blank;
			model.innerHTML = "Model -- "+currentModelName+storeMarker+saveMarker+exportMarker;;
			stored[currentModelName] = true;
			doStoreModel(currentModelName);
		}
	}
	
	function openStoreAs() {		
		storeDB.style.visibility = 'visible';
	}
	
	function openFetch() {
		fetchTitle.innerHTML = "Fetch";
		fetchDesc.innerHTML = "Fetch from App only";
		fetchBut.value =  "Fetch";	
		fetchBut.addEventListener('click', doFetch, false);	
		if(!stored[currentModelName] && !inScene) 
		{
			confirmName = currentModelName;
			confirmFunc = fillFetch;
			confirmDesc.innerHTML = 'The current model <span style="font-style:italic"> '+confirmName+'</span> has not been stored.<BR>Do you want to continue and overwrite the current model?';
			openConfirmDBox();
		}
		else {
			fillFetch();
		}
	}
	
	function openOpen() {
		fetchTitle.innerHTML = "Open";
		fetchDesc.innerHTML = "Open from Local Storage";
		fetchBut.value =  "Open";
		fetchBut.addEventListener('click', doOpen, false);		
		if(!stored[currentModelName] && !inScene) 
		{
			confirmName = currentModelName;
			confirmFunc = fillOpen;
			confirmDesc.innerHTML = 'The current model <span style="font-style:italic"> '+confirmName+'</span> has not been stored.<BR>Do you want to continue and overwrite the current model?';
			openConfirmDBox();
		}
		else {
			fillOpen();
		}
	}
	
	function fillFetch() {
		var fetch_array =[];
		for(var name in jcModels) {
			fetch_array.push(name);
		}		
		fetch_array.sort();
		dofill(fetch_array);
	}
	
	function fillOpen() {
		var fetch_array =[];
		for (var i=0; i<localStorage.length;  i++ ) {
  			fetch_array.push(localStorage.key(i).substr(5));
		}
		fetch_array.sort();
		dofill(fetch_array);
	}
	
	function dofill(fetch_array) {
		var flen=fetch_array.length;
		var cols = Math.ceil(flen/10);
		var rows = 10;
		var len = flen - (cols-1)*10;
		fetchList.innerHTML ="";
		var fetch_row, fetch_col;
		var i=0;
		for(var c=0; c<cols; c++){
			fetch_col = document.createElement("div");
			fetch_col.style.left=c*100+"px";
			fetchList.appendChild(fetch_col);
			fetch_ul = document.createElement("ul");
			fetch_col.appendChild(fetch_ul);
			if(len<10  && c==cols-1) {
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
		if(newModel) {
			openSaveAs();
		}
		else {
			saveMarker = Blank;
			model.innerHTML = "Model -- "+currentModelName+storeMarker+saveMarker+exportMarker;;
			saved[currentModelName] = true;
			doSaveModel(currentModelName);
		}
	}
	
	function openSaveAs() {		
		saveDB.style.visibility = 'visible';
	}
	
	function doSaveAs() {
		var name = saveIn.value;			
		if(foundInSaved(name)) {
			confirmName = name;
			confirmFunc = doSaveModel;
			confirmDesc.innerHTML = 'The model <span style="font-style:italic"> '+confirmName+'</span> is already stored.<BR>Do you want to continue to and overwrite the stored model?';
			openConfirmDBox();
		}
		else {
			doSaveModel(name);
			newModel = false;
		}
	}
	
	function foundInSaved(name) {
		var found = false;
		name = "CUBEE"+name;
		var i=0;
		while(i<localStorage.length && !found ) {			
			found = (name == localStorage.key(i));
			i++;
		}
		return found;
	};
	
	function doSaveModel(name) {
		var selValue = {};
		var names_to_save = [];
		var types_to_save = [];
		var materials_to_save = [];
		var positions_to_save = [];
		var rotations_to_save = [];
		
		for(var ref in JCubees) {
			selValue[ref] = JCubees[ref].getSelected();
			JCubees[ref].hideSelected();
			names_to_save.push(getNameRef(JCubees[ref].name));
			types_to_save.push(getType(JCubees[ref].name));
			materials_to_save.push(JCubees[ref].Jcubee.material.name.substr(0,5));
			positions_to_save.push([JCubees[ref].Jcubee.position.x, JCubees[ref].Jcubee.position.y, JCubees[ref].Jcubee.position.z]);			
			if(!JCubees[ref].Jcubee.rotationQuaternion) {
				JCubees[ref].Jcubee.rotationQuaternion=new BABYLON.Vector4(0,0,0,0);
			}
			rotations_to_save.push([JCubees[ref].Jcubee.rotationQuaternion.x, JCubees[ref].Jcubee.rotationQuaternion.y, JCubees[ref].Jcubee.rotationQuaternion.z, JCubees[ref].Jcubee.rotationQuaternion.w]);			
		}
		
		var saveMesh = {n:names_to_save,t:types_to_save, m:materials_to_save, p:positions_to_save, r:rotations_to_save};
		var strMesh = JSON.stringify(saveMesh);		
		var key = "CUBEE"+name;;
		
		localStorage.setItem(key, strMesh);
		
		for(var ref in JCubees) {
			if(selValue[ref]) {
				JCubees[ref].showSelected();
			}
		}
		
		currentModelName = name;
		saveMarker = Blank;
		model.innerHTML = "Model -- "+currentModelName+storeMarker+saveMarker+exportMarker;
		
		saveIn.value = currentModelName;
		storeIn.value = currentModelName;
		saved[currentModelName] = true;
		
		saveDB.style.visibility = "hidden";
	}
	
	function openManage() {		
		manageDB.style.visibility = 'visible';
		doManageFill()
	}
	
	function doManageFill() {
		var name;
		var manage_array =[];
		var i=0;	
		while(i<localStorage.length) {		
			name = localStorage.key(i);			
			if(name.substr(0,5)=="CUBEE") {
				manage_array.push(name.substr(5));
			}
			i++;
		}		
		manage_array.sort();	
		var flen=manage_array.length;
		var cols = Math.ceil(flen/10);	
		var rows = 10;
		var len = flen - (cols-1)*10;	
		var manage_row, manage_col;
		var i=0;
		manageList.innerHTML ="";
		for(var c=0; c<cols; c++){
			manage_col = document.createElement("div");
			manage_col.style.left=c*140+"px";
			manageList.appendChild(manage_col);
			manage_ul = document.createElement("ul");
			manage_col.appendChild(manage_ul);
			if(len<10  && c==cols-1) {
				rows=len;
			}
			for(var r=0; r<rows; r++) {
				manage_li = document.createElement("li");
				manage_li.style.width ='150px';
				manage_li.innerHTML='<input type="checkbox" id="chkbx'+i+'" style ="top:'+r*25+'px"><span style = "top:'+(r*25-2)+'px">'+manage_array[i]+'</span >';
				manage_li.name = manage_array[i++];
				manage_ul.appendChild(manage_li);
			}
		}
		manageDB.list = manage_array;		
		manageDB.style.visibility = 'visible';
	}
	
	function doDeleteSaved() {
		var del=false;
		for(var i=0; i<manageDB.list.length; i++) {
			del = del || document.getElementById("chkbx"+i).checked;
		}
		if (!del) {
			return;
		}
		confirmName = name;
		confirmFunc = doDeleteChecked;
		confirmDesc.innerHTML = 'Do you want to continue and delete?';
		openConfirmDBox();
	}
	
	function doDeleteChecked() {
		for(var i=0; i<manageDB.list.length; i++) {
			if(document.getElementById("chkbx"+i).checked) {
				localStorage.removeItem("CUBEE"+manageDB.list[i]);
			}
		}
		doManageFill();
	}
	
	function doExport() {
		var selValue = {};
		var meshes_to_save = [];
		
		for(var ref in JCubees) {
			selValue[ref] = JCubees[ref].getSelected();
			JCubees[ref].hideSelected();
			meshes_to_save.push(JCubees[ref].Jcubee);
		}
		
		var serializedMesh = BABYLON.SceneSerializer.SerializeMesh(meshes_to_save);
		
		var strMesh = JSON.stringify(serializedMesh);
		newwindow=window.open("",currentModelName);
		newwindow.document.write(strMesh);
		newwindow.document.close();
		
		for(var ref in JCubees) {
			if(selValue[ref]) {
				JCubees[ref].showSelected();
			}
		}
		
		exportMarker = Blank;
		model.innerHTML = "Model -- "+currentModelName+storeMarker+saveMarker+exportMarker;
		exported[currentModelName] = true;
	}
	
	function startDownload() {
		if (inScene) {
			doSceneDownload(downloadIn.value);
		}
		else {
			doDownload(downloadIn.value);
		}
	}
	
	function doSceneDownload(filename) {
		var selValue = {};
		var meshes_to_save = [];

		for(var parent in sceneParents) {
			meshes_to_save.push(sceneParents[parent].model);
			for(var i=0; i<sceneParents[parent].modelChildren.length; i++) {
				sceneParents[parent].modelChildren[i].hideSelected;
				selValue[sceneParents[parent].modelChildren[i].name] = sceneParents[parent].modelChildren[i].getSelected();					
			}
			
		}
		
		if(objectUrl) {
			window.URL.revokeObjectURL(objectUrl);
		}
			
		var serializedMesh = BABYLON.SceneSerializer.SerializeMesh(meshes_to_save, false, true);
		
		var strMesh = JSON.stringify(serializedMesh);
		
		downloadDB.style.visibility='hidden';        
		if (filename.length === 0){
			downloadDB.style.visibility='visible';
			window.alert("No name specified");
			return;
		}
		else if (filename.toLowerCase().lastIndexOf(".babylon") !== filename.length - 8 || filename.length < 9){
			filename += ".babylon";
		}
            
  	 	var blob = new Blob ( [ strMesh ], { type : "octet/stream" } );
       
		// turn blob into an object URL; saved as a member, so can be cleaned out later 
		objectUrl = (window.webkitURL || window.URL).createObjectURL(blob);
	      
		var link = window.document.createElement('a');
		link.href = objectUrl;
		link.download = filename;
		var click = document.createEvent("MouseEvents");
		click.initEvent("click", true, false);
		link.dispatchEvent(click); 
		
		for(var parent in sceneParents) {
			for(var i=0; i<sceneParents[parent].modelChildren.length; i++) {
				if(selValue[parent]) {
					sceneParents[parent].modelChildren[i].showSelected();
				}					
			}
			meshes_to_save.push(sceneParents[parent].model);
		}
		
		scene_exported = true;
		scene_scene.innerHTML = "Scene";
	}
	
	function doDownload(filename) {
		var selValue = {};
		var meshes_to_save = [];
		
		for(var ref in JCubees) {
			selValue[ref] = JCubees[ref].getSelected();
			JCubees[ref].hideSelected();
			meshes_to_save.push(JCubees[ref].Jcubee);
		}
		
		if(objectUrl) {
			window.URL.revokeObjectURL(objectUrl);
		}
	
		var serializedMesh = BABYLON.SceneSerializer.SerializeMesh(meshes_to_save);
		
		var strMesh = JSON.stringify(serializedMesh);
	
    	downloadDB.style.visibility='hidden';        
		if (filename.length === 0){
			downloadDB.style.visibility='visible';
			window.alert("No name specified");
			return;
		}
		else if (filename.toLowerCase().lastIndexOf(".babylon") !== filename.length - 8 || filename.length < 9){
			filename += ".babylon";
		}
            
  	 	var blob = new Blob ( [ strMesh ], { type : "octet/stream" } );
       
		// turn blob into an object URL; saved as a member, so can be cleaned out later 
		objectUrl = (window.webkitURL || window.URL).createObjectURL(blob);
	      
		var link = window.document.createElement('a');
		link.href = objectUrl;
		link.download = filename;
		var click = document.createEvent("MouseEvents");
		click.initEvent("click", true, false);
		link.dispatchEvent(click); 
		
		for(var ref in JCubees) {
			if(selValue[ref]) {
				JCubees[ref].showSelected();
			}
		}
		
		exportMarker = Blank;
		model.innerHTML = "Model -- "+currentModelName+storeMarker+saveMarker+exportMarker;
		exported[currentModelName] = true;         
	
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
			JCubees[mesh]. hideSelected();
			JCubees[mesh].hideMarkers();
		}			
		currentMeshes = {};
		hideSubMenus();
		selection.innerHTML = "Select All";
	}
	
	function selectAll() {
		for(var mesh in JCubees) {						
			if(!(mesh in currentMeshes)) {	
				JCubees[mesh]. showSelected();					
				JCubees[mesh].showMarkers();
				currentMeshes[mesh] = JCubees[mesh].Jcubee;
			}
		}
		selection.innerHTML = "Selection";
		selection.style.color="#000000";
	}
	
	function doCopy() {
		var x, y, z;
		var material;
		var newRef;
		var tempMeshes=[];
		var name;
		for(var ref in currentMeshes) {
			newRef = "L"+currentModelName+"¬"+getType(ref)+(num_of_boxes++);				
			JCubees[newRef] = new JcubeeBlank(newRef);
			JCubees[newRef].Jcubee = JCubees[ref].Jcubee.clone(newRef);
			JCubees[newRef].Jcubee.position.y += 6*60;
			JCubees[newRef].showSelected();						
			JCubees[newRef].addMarkers(jccsStudio.scene);
			JCubees[ref].hideSelected();		
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
		storeMarker = storeIcon; 
		saveMarker = saveIcon; 
		exportMarker = exportIcon;
		model.innerHTML = "Model -- "+currentModelName+storeMarker+saveMarker+exportMarker;
		stored[currentModelName] = false;
		saved[currentModelName] = false;
		exported[currentModelName] = false;
	}

	function Yrotate() {
		for(var mesh in currentMeshes) {
			currentMeshes[mesh].rotate(BABYLON.Axis.Y, -Math.PI/2, BABYLON.Space.WORLD);						
		}
		storeMarker = storeIcon; 
		saveMarker = saveIcon; 
		exportMarker = exportIcon;
		model.innerHTML = "Model -- "+currentModelName+storeMarker+saveMarker+exportMarker;
		stored[currentModelName] = false;
		saved[currentModelName] = false;
		exported[currentModelName] = false;
	}
	
	function Zrotate() {
		for(var mesh in currentMeshes) {
			currentMeshes[mesh].rotate(BABYLON.Axis.Z, -Math.PI/2, BABYLON.Space.WORLD);						
		}
		storeMarker = storeIcon; 
		saveMarker = saveIcon; 
		exportMarker = exportIcon;
		model.innerHTML = "Model -- "+currentModelName+storeMarker+saveMarker+exportMarker;
		stored[currentModelName] = false;
		saved[currentModelName] = false;
		exported[currentModelName] = false;
	}
	
	//Add to Scene functions	
	function addtoscene() {
		 sceneSwitch(currentModelName);		 
		 hideSubMenus();
		 menu.style.visibility = 'hidden';
		 scene_menu.style.visibility = 'visible';
		 Header.innerHTML ='Build A Scene Room';
		 new_scene = false;
	}
	
	function sceneSwitch(name) {
		var x, y, z;
		var material;		
		for(var model in sceneParents) {
			sceneParents[model].model.setEnabled(true);
			for(var i=0; i<sceneParents[model].modelChildren.length;i++) {
				sceneParents[model].modelChildren[i].enable();
				sceneParents[model].modelChildren[i].hideSelected();
			}
		}
		
		collide = {left:false, right:false, up:false, down:false, front:false, back:false};
		
		var parentName = "Iparent"+name+"^"+num_in_scene+"*";
		var modelName = "I"+name+"^"+num_in_scene+"*";
		sceneParents[parentName] ={};
		sceneParents[parentName].name = parentName;
		sceneParents[parentName].model = baseMeshes["box"].clone(parentName);
		sceneParents[parentName].model.id = parentName;
		sceneParents[parentName].clone = baseMeshes["box"].clone(parentName+"clone");
		sceneParents[parentName].model.visibility = 0;
		sceneParents[parentName].clone.visibility = 0;
				
		selectNewModel(sceneParents[parentName]);		
		sceneParents[parentName].modelChildren = [];
		
		var newRef;	
	
		for(var ref in JCubees) {	
			sceneModels[modelName+ref] = new JcubeeBlank(modelName+ref);
			sceneModels[modelName+ref].Jcubee = JCubees[ref].Jcubee.clone(modelName+ref);			
			sceneModels[modelName+ref].showSelected();		
			sceneModels[modelName+ref].Jcubee.parent = sceneParents[parentName].model;
			sceneModels[modelName+ref].parent = sceneParents[parentName];
			sceneModels[modelName+ref].addMarkers(jccsStudio.scene,0.5);
			sceneParents[parentName].modelChildren.push(sceneModels[modelName+ref]);				
			JCubees[ref].disable();
		}
		
		sceneParents[parentName].model.position.y = 9.5*60;
		sceneParents[parentName].clone.position.y = 9.5*60;
		sceneParents[parentName].model.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
		sceneParents[parentName].clone.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
		sceneParents[parentName].model.computeWorldMatrix(true);
		sceneParents[parentName].clone.computeWorldMatrix(true);
		
		for(var i=0; i<sceneParents[parentName].modelChildren.length;i++) {
			sceneParents[parentName].modelChildren[i].Jcubee.computeWorldMatrix(true);
			sceneParents[parentName].modelChildren[i].moveT(sceneParents[parentName].modelChildren[i].Jcubee.getAbsolutePosition());		
		}
		
		sceneParents[parentName].modelBoundary = childrenBoundary(sceneParents[parentName], jccsStudio.scene );
		sceneParents[parentName].modelBoundary.parent = sceneParents[parentName].clone;
		
		
		num_in_scene++;			
			
		inScene=true;
		
		scene_exported = false;
		scene_exportMarker = exportIcon;
		scene_scene.innerHTML = "Scene -- "+scene_exportMarker;
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
		currentColour.style.border="solid 1px #FFFFFF";
		currentColour=elm;
		for(var mesh in currentMeshes) {						
			currentMeshes[mesh].material = elm.material;
		}
		colour.material=elm.material;
		colour.colarray=elm.colarray;
		colour.style.backgroundColor="rgb("+elm.colarray[0] +","+elm.colarray[1]+","+elm.colarray[2]+")";
		currentColour.style.border="solid 1px #000000";
	};
	
	function setMeshTexture(material) {
		for(var mesh in currentMeshes) {						
			currentMeshes[mesh].material = material.clone(material.name.substr(0,5)+(num_of_mats));
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
		Header.innerHTML = 'Build A Scene Room';
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
		dmddown=false;			
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
			newModel = false;
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
		storeMarker = Blank;
		model.innerHTML = "Model -- "+currentModelName+storeMarker+saveMarker+exportMarker;
		storeIn.value = currentModelName;
		saveIn.value = currentModelName;
		stored[currentModelName] = true;				
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
		var x, y, z;
		var material;
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
			x= jcModels[name][ref].Jcubee.position.x;
			y= jcModels[name][ref].Jcubee.position.y;
			z= jcModels[name][ref].Jcubee.position.z;
			material = jcModels[name][ref].Jcubee.material;					
			JCubees[newRef] = new JcubeeClone(baseMeshes[getType(ref)], newRef, x, y, z, material);					
			JCubees[newRef].showSelected();			
			JCubees[newRef].addMarkers(jccsStudio.scene);
			JCubees[newRef].enable();			
		}
		
		selectAll();
		
		currentModelName = name;
		storeMarker = Blank;
		saveMarker = saveIcon; 
		exportMarker = exportIcon;
		model.innerHTML = "Model -- "+currentModelName+storeMarker+saveMarker+exportMarker;
		stored[currentModelName] = true;
		fetchDB.style.visibility = 'hidden';		
	}
	
	function doFetchToScene() {
		var x, y, z;
		var material;
		var name = fetchname.innerHTML;
		new_scene = false;
		collide = {left:false, right:false, up:false, down:false, front:false, back:false};
		
		var parentName = "Iparent"+name+"^"+num_in_scene+"*";
		var modelName = "I"+name+"^"+num_in_scene+"*";
		sceneParents[parentName] ={};
		sceneParents[parentName].name = parentName;
		sceneParents[parentName].model = baseMeshes["box"].clone(parentName);
		sceneParents[parentName].model.id = parentName;
		sceneParents[parentName].clone = baseMeshes["box"].clone(parentName+"clone");
		sceneParents[parentName].model.visibility = 0;
		sceneParents[parentName].clone.visibility = 0;
		selectNewModel(sceneParents[parentName]);
		sceneParents[parentName].modelChildren = [];	
	
		for(var ref in jcModels[name]) {
			sceneModels[modelName+ref] = new JcubeeBlank(modelName+ref);
			sceneModels[modelName+ref].Jcubee = JCubees[ref].Jcubee.clone(modelName+ref);					
			sceneModels[modelName+ref] = new JcubeeClone(baseMeshes[getType(ref)], name, x, y, z, material);	
			sceneModels[modelName+ref].showSelected();		
			sceneModels[modelName+ref].Jcubee.parent = sceneParents[parentName].model;
			sceneModels[modelName+ref].parent = sceneParents[parentName];
			sceneModels[modelName+ref].addMarkers(jccsStudio.scene,0.5);
			sceneParents[parentName].modelChildren.push(sceneModels[modelName+ref]);				
		}
		
		sceneParents[parentName].model.position.y = 9.5*60;
		sceneParents[parentName].model.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
		sceneParents[parentName].model.computeWorldMatrix(true);
		sceneParents[parentName].clone.position.y = 9.5*60;
		sceneParents[parentName].clone.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
		sceneParents[parentName].clone.computeWorldMatrix(true);
		
		for(var i=0; i<sceneParents[parentName].modelChildren.length;i++) {
			sceneParents[parentName].modelChildren[i].Jcubee.computeWorldMatrix(true);
			sceneParents[parentName].modelChildren[i].moveT(sceneParents[parentName].modelChildren[i].Jcubee.getAbsolutePosition());		
		}
		
		sceneParents[parentName].modelBoundary = childrenBoundary(sceneParents[parentName], jccsStudio.scene );
		sceneParents[parentName].modelBoundary.parent = sceneParents[parentName].clone;
		
		num_in_scene++;	
		
		scene_exported = false;
		scene_exportMarker = exportIcon;
		scene_scene.innerHTML = "Scene -- "+scene_exportMarker;		
			
		fetchDB.style.visibility = 'hidden';
	}
	
	function doOpen() {
		if(inScene) {
			doOpenToScene();
		}
		else {
			doOpenToConstruct()
		}
	}
	
	function doOpenToConstruct() {
		var name = fetchname.innerHTML;	
		currentModelName = name;
		
		var type;
		var saveName;
		var matName;
			
		for( var ref in JCubees) {
			if(ref in currentMeshes) {
				delete currentMeshes[ref];
			}
			JCubees[ref].destroy();
			delete JCubees[ref];
		}
		JCubees ={};
		currentMeshes ={};		
		var strModels=localStorage.getItem('CUBEE'+name);
		var models = JSON.parse(strModels);

		for(var i=0; i<models.n.length; i++) {
			saveName = models.n[i];
			type = models.t[i];
			matName = models.m[i];			
			name="L"+currentModelName+"¬"+type+(num_of_boxes++);
			material = 	jccsStudio.scene.getMaterialByName(matName);
			JCubees[name] = new JcubeeClone(baseMeshes[type], name, models.p[i][0], models.p[i][1], models.p[i][2], material);
			JCubees[name].Jcubee.rotationQuaternion = new BABYLON.Quaternion(models.r[i][0], models.r[i][1], models.r[i][2], models.r[i][3]);					
			JCubees[name].addMarkers(jccsStudio.scene);
			JCubees[name].moveT(JCubees[name].Jcubee.position);
			
		}
		
		selectAll();
		
		storeMarker = storeMarker; 
		saveMarker = Blank; 
		exportMarker = exportIcon;
		model.innerHTML = "Model -- "+currentModelName+storeMarker+saveMarker+exportMarker;
		stored[currentModelName] = false;
		saved[currentModelName] = true;
		fetchDB.style.visibility = 'hidden';		
	}
	
	function doOpenToScene() {
		var name = fetchname.innerHTML;
		
		collide = {left:false, right:false, up:false, down:false, front:false, back:false};
		
		var type;
		var saveName,modelName;
		var name, matName;
		var material;
		var x, y, z;
					
		var strModels=localStorage.getItem('CUBEE'+name);
		var models = JSON.parse(strModels);
		
		var parentName = "Iparent"+name+"^"+num_in_scene+"*";
		var modelName = "I"+name+"^"+num_in_scene+"*";
		sceneParents[parentName] ={};
		sceneParents[parentName].name = parentName;
		sceneParents[parentName].model = baseMeshes["box"].clone(parentName);
		sceneParents[parentName].model.id = parentName;
		sceneParents[parentName].clone = baseMeshes["box"].clone(parentName+"clone");
		sceneParents[parentName].model.visibility = 0;
		sceneParents[parentName].clone.visibility = 0;
		selectNewModel(sceneParents[parentName]);
		sceneParents[parentName].modelChildren = [];

		for(var i=0; i<models.n.length; i++) {
			saveName = models.n[i];
			type = models.t[i];
			matName = models.m[i];
			name = "L"+saveName+"¬"+type+(num_of_boxes++);
			material = jccsStudio.scene.getMaterialByName(matName);
			x = models.p[i][0];
			y = models.p[i][1];
			z = models.p[i][2];			
			sceneModels[modelName+name] = new JcubeeClone(baseMeshes[type], modelName+name, x, y, z, material);
			sceneModels[modelName+name].Jcubee.rotationQuaternion = new BABYLON.Quaternion(models.r[i][0], models.r[i][1], models.r[i][2], models.r[i][3]);						
			sceneModels[modelName+name].showSelected();						
			sceneModels[modelName+name].Jcubee.parent = sceneParents[parentName].model;
			sceneModels[modelName+name].parent = sceneParents[parentName];
			sceneModels[modelName+name].addMarkers(jccsStudio.scene,0.5);
			sceneParents[parentName].modelChildren.push(sceneModels[modelName+name]);				
		}
		
		sceneParents[parentName].model.position.y = 9.5*60;
		sceneParents[parentName].model.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
		sceneParents[parentName].model.computeWorldMatrix(true);
		sceneParents[parentName].clone.position.y = 9.5*60;
		sceneParents[parentName].clone.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
		sceneParents[parentName].clone.computeWorldMatrix(true);
		
		for(var i=0; i<sceneParents[parentName].modelChildren.length;i++) {
			sceneParents[parentName].modelChildren[i].Jcubee.computeWorldMatrix(true);
			sceneParents[parentName].modelChildren[i].moveT(sceneParents[parentName].modelChildren[i].Jcubee.getAbsolutePosition());		
		}
		
		sceneParents[parentName].modelBoundary = childrenBoundary(sceneParents[parentName], jccsStudio.scene );
		sceneParents[parentName].modelBoundary.parent = sceneParents[parentName].clone;
		
		num_in_scene++;			
			
		fetchDB.style.visibility = 'hidden';
	}
	
	function openFetch() {
		fetchTitle.innerHTML = "Fetch";
		fetchDesc.innerHTML = "Fetch from App only";
		fetchBut.value =  "Fetch";	
		fetchBut.addEventListener('click', doFetch, false);	
		if(!stored[currentModelName] && !inScene) 
		{
			confirmName = currentModelName;
			confirmFunc = fillFetch;
			confirmDesc.innerHTML = 'The current model <span style="font-style:italic"> '+confirmName+'</span> has not been stored.<BR>Do you want to continue and overwrite the current model?';
			openConfirmDBox();
		}
		else {
			fillFetch();
		}
	}
	
	function openDownload() {
		downloadDB.style.visibility='visible';
	}
	
	function openImport() {
		scene_import = false;
		openImporter();
	}
	
	function openImportScene() {
		scene_import = true;
		openImporter();
	}
	
	function openImporter() {	
		importTitle.style.backgroundColor = "#AAAAAA";
		importTitle.innerHTML ="Import";
		if(!stored[currentModelName] && !inScene) {
			confirmName = currentModelName;
			confirmFunc = function() {importDB.style.visibility = 'visible';};
			confirmDesc.innerHTML = 'The current model <span style="font-style:italic"> '+confirmName+'</span> has not been stored.<BR>Do you want to continue and overwrite the current model?';
			openConfirmDBox();
		}
		else {	
			importDB.style.visibility = 'visible';
		}
	}
	
	function doImport() {
		
		var f = browseBut.files[0];
		if (f) 
		{
			var r = new FileReader();
			r.onloadend = function(evt) {parseImport(evt.target.result) };
			r.readAsText(f);
		} 
		else 
		{ 
			alert("Failed to load file"); 
		}				
	};
	
	function parseImport(data) {
		if(inScene && scene_import) {		
			var re = /Iparent/i;
			if(!re.test(data)) {
				importTitle.style.backgroundColor = "#FF0000";
				importTitle.innerHTML ="Import - Not a Scene File";
				return
			}
			importTitle.style.backgroundColor = "#AAAAAA";
			importTitle.innerHTML ="Import";
			doImportSceneToScene(data);
		}
		else if(inScene && !scene_import){ 
			var re = /Iparent/i;
			if(re.test(data)) {
				importTitle.style.backgroundColor = "#FF0000";
				importTitle.innerHTML ="Import - Not a Model File";
				return
			}
			importTitle.style.backgroundColor = "#AAAAAA";
			importTitle.innerHTML ="Import";			
			doImportToScene(data)
		}
		else {
			var re = /Iparent/i;
			if(re.test(data)) {
				importTitle.style.backgroundColor = "#FF0000";
				importTitle.innerHTML ="Import - Not a Model File";
				return
			}
			importTitle.style.backgroundColor = "#AAAAAA";
			importTitle.innerHTML ="Import";			
			doImportToConstruct(data)
		}
	};
	
	function doImportToConstruct(data) {	
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
		
		var re = /\s*/gi;
		data = data.replace(re, '');
		
		BABYLON.SceneLoader.ImportMesh("", "", 'data:'+data, jccsStudio.scene, function (meshes, particleSystems, skeletons) {
				var newRef;
				var modelName= getModelRef(meshes[0].name);
				for (var i=0; i<meshes.length; i++) {							
					newRef = "L"+modelName+"¬"+getType(meshes[i].name)+(num_of_boxes++);	
					meshes[i].name = newRef;								
					JCubees[newRef] = new JcubeeBlank(newRef);		
					JCubees[newRef].Jcubee = meshes[i];
					JCubees[newRef].addMarkers(jccsStudio.scene);
					JCubees[newRef].enable();
				} 
				
				selectAll();		
				currentModelName = modelName;
				storeMarker = storeIcon; 
				saveMarker = saveIcon; 
				exportMarker = exportIcon;
				model.innerHTML = "Model -- "+currentModelName+storeMarker+saveMarker+exportMarker;
				stored[currentModelName] = false;
				saved[currentModelName] = false;
				exported[currentModelName] = false;
				importDB.style.visibility = 'hidden'; 
		});
		
		selectAll();
		
		currentModelName = name;
		storeMarker = Blank;
		saveMarker = saveIcon; 
		exportMarker = exportIcon;
		model.innerHTML = "Model -- "+currentModelName+storeMarker+saveMarker+exportMarker;
		stored[currentModelName] = true;
		fetchDB.style.visibility = 'hidden';
				
	}
	
	function doImportToScene(data) { //imports model to scene		
		for(var parent in sceneParents) {
			for(var i = 0; i<sceneParents[parent].modelChildren.length; i++) {
				sceneParents[parent].modelChildren[i].hideSelected();					
			}
		}
		collide = {left:false, right:false, up:false, down:false, front:false, back:false};
		
		var re = /\s*/gi;
		data = data.replace(re, '');
		
		BABYLON.SceneLoader.ImportMesh("", "", 'data:'+data, jccsStudio.scene, function (meshes, particleSystems, skeletons) {
				var newRef;
				var mName= getModelRef(meshes[0].name);
				var parentName = "Iparent"+mName+"^"+num_in_scene+"*";
				var modelName = "I"+mName+"^"+num_in_scene+"*";
				var meshName, name;
				sceneParents[parentName] ={};
				sceneParents[parentName].name = parentName;
				sceneParents[parentName].model = baseMeshes["box"].clone(parentName);
				sceneParents[parentName].model.id = parentName;
				sceneParents[parentName].clone = baseMeshes["box"].clone(parentName+"clone");
				sceneParents[parentName].model.visibility = 0;
				sceneParents[parentName].clone.visibility = 0;
				selectNewModel(sceneParents[parentName]);
				sceneParents[parentName].modelChildren = [];
				for (var i=0; i<meshes.length; i++) {	
					meshName=getNameRef(meshes[i].name);
					type = getType(meshes[i].name);
					meshName = "L"+meshName+"¬"+type+(num_of_boxes++);
					meshes[i].name = meshName;
					sceneModels[modelName+meshName] = new JcubeeBlank(modelName+meshName);	
					sceneModels[modelName+meshName].Jcubee = meshes[i];	
					sceneModels[modelName+meshName].Jcubee.name = modelName+meshName;				
					sceneModels[modelName+meshName].showSelected();			
					sceneModels[modelName+meshName].Jcubee.parent = sceneParents[parentName].model;
					sceneModels[modelName+meshName].parent = sceneParents[parentName];
					sceneModels[modelName+meshName].addMarkers(jccsStudio.scene,0.5);
					sceneParents[parentName].modelChildren.push(sceneModels[modelName+meshName]);
				}
				
				sceneParents[parentName].model.position.y = 9.5*60;
				sceneParents[parentName].model.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
				sceneParents[parentName].model.computeWorldMatrix(true);
				sceneParents[parentName].clone.position.y = 9.5*60;
				sceneParents[parentName].clone.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
				sceneParents[parentName].clone.computeWorldMatrix(true);
		
				for(var i=0; i<sceneParents[parentName].modelChildren.length;i++) {
					sceneParents[parentName].modelChildren[i].Jcubee.computeWorldMatrix(true);
					sceneParents[parentName].modelChildren[i].moveT(sceneParents[parentName].modelChildren[i].Jcubee.getAbsolutePosition());		
				}
		
				sceneParents[parentName].modelBoundary = childrenBoundary(sceneParents[parentName], jccsStudio.scene );
				sceneParents[parentName].modelBoundary.parent = sceneParents[parentName].clone;
		});
		
		num_in_scene++;	

		scene_exported = false;
		scene_exportMarker = exportIcon;
		scene_scene.innerHTML = "Scene -- "+scene_exportMarker;	
		
			
		importDB.style.visibility = 'hidden'; 
	}
	
	function doImportSceneToScene(data) {
		newScene();
		collide = {left:false, right:false, up:false, down:false, front:false, back:false};
		
		var re = /\s*/gi;
		data = data.replace(re, '');
		
		BABYLON.SceneLoader.ImportMesh("", "", 'data:'+data, jccsStudio.scene, function (meshes, particleSystems, skeletons) {

				var mName, parentName, modelName;
				var meshName, name;
				
				for (var i=0; i<meshes.length; i++) {
					if(meshes[i].name.substr(0,7) == "Iparent")	{											
						mName= getSceneRef(meshes[i].name);					
						parentName = mName+"^"+num_in_scene+"*";						
						sceneParents[parentName] ={};
						sceneParents[parentName].name = parentName;
						sceneParents[parentName].model = meshes[i];
						sceneParents[parentName].clone = baseMeshes["box"].clone(parentName+"clone");
						sceneParents[parentName].clone.position.x = sceneParents[parentName].model.position.x;
						sceneParents[parentName].clone.position.y = sceneParents[parentName].model.position.y;
						sceneParents[parentName].clone.position.z = sceneParents[parentName].model.position.z;
						sceneParents[parentName].model.visibility = 0;
						sceneParents[parentName].clone.visibility = 0;
						sceneParents[parentName].modelChildren = [];
						children = meshes[i].getChildren();	
						meshes[i].name = parentName;
						sceneParents[parentName].model.name = parentName;
						sceneParents[parentName].model.id = parentName;					
						for(var j=0; j<children.length; j++) {					
							meshName=getModelRef(children[j].name);
							type = getType(children[j].name);
							meshName = "I"+meshName+"¬"+type+(num_of_boxes++);						
							children[j].name = meshName;
							sceneModels[meshName] = new JcubeeBlank(meshName);	
							sceneModels[meshName].Jcubee = children[j];	
							sceneModels[meshName].Jcubee.name = meshName;							
							sceneModels[meshName].Jcubee.parent = sceneParents[parentName].model;
							sceneModels[meshName].parent = sceneParents[parentName];
							sceneModels[meshName].addMarkers(jccsStudio.scene,0.5);
							sceneParents[parentName].modelChildren.push(sceneModels[meshName]);
						}
						
						num_in_scene++;
					}	
					
					sceneParents[parentName].model.computeWorldMatrix(true);
					sceneParents[parentName].clone.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
					sceneParents[parentName].clone.computeWorldMatrix(true);
					
					for(var j=0; j<sceneParents[parentName].modelChildren.length;j++) {
						sceneParents[parentName].modelChildren[j].Jcubee.computeWorldMatrix(true);
						sceneParents[parentName].modelChildren[j].moveT(sceneParents[parentName].modelChildren[j].Jcubee.getAbsolutePosition());		
					}
		
					sceneParents[parentName].modelBoundary = childrenBoundary(sceneParents[parentName], jccsStudio.scene );
					sceneParents[parentName].modelBoundary.parent = sceneParents[parentName].clone;
					
					
				}
				
				
		});
		
		
		
			
		importDB.style.visibility = 'hidden'; 
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
	
	var scene_help = document.getElementById("scene_help");
	
	var scene_leftarrow = document.getElementById("scene_leftarrow");
	var scene_rightarrow = document.getElementById("scene_rightarrow");
	var scene_uparrow = document.getElementById("scene_uparrow");
	var scene_downarrow = document.getElementById("scene_downarrow");
	var scene_forwardarrow = document.getElementById("scene_forwardarrow");
	var scene_backarrow = document.getElementById("scene_backarrow");
	
	// File Menu and Sub-Menus
	var scene_new = document.getElementById("scene_new");
	var scene_file_ = document.getElementById("scene_file");
	var scene_subfilemenu = document.getElementById("scene_subfilemenu");
	var scene_fetch = document.getElementById("scene_fetch");
	//var scene_save = document.getElementById("scene_save");
	//var scene_save_as = document.getElementById("scene_save_as");
	var scene_openFile = document.getElementById("scene_open");
	var scene_export = document.getElementById("scene_export");
	var scene_download = document.getElementById("scene_download");
	var scene_import = document.getElementById("scene_import");
	var scene_importScene = document.getElementById("scene_importScene");
	
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
		//scene_save.parentNode.removeChild(scene_save);
		//scene_save_as.parentNode.removeChild(scene_save_as);
		scene_openFile.parentNode.removeChild(scene_openFile);
		saveMarker="";
		Blank="";
	}
	
	/*----------SCENE MENU EVENTS--------------------------------*/
	
	scene_help.addEventListener("click", function() {window.open("../jchelp/jchelphome.html")}, false);

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
	scene_new.addEventListener('click', scene_doNew, false);
	scene_openFile.addEventListener('click', openOpen, false);
	//scene_save.addEventListener('click', scene_doSave, false);
	//scene_save_as.addEventListener('click', scene_openSaveAs, false);
	
	scene_export.addEventListener('click', scene_doExport, false);
	scene_download.addEventListener('click', openDownload, false);
	scene_import.addEventListener('click', openImport, false);
	scene_importScene.addEventListener('click', openImportScene, false);

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
				sceneParents[model].modelChildren[i].hideSelected();
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
					sceneParents[model].modelChildren[i].showSelected();
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
				sceneParents[model].modelChildren[i].hideSelected();
			}		
		}
		frontPlane.setEnabled(false);
		backPlane.setEnabled(false);
		leftSidePlane.setEnabled(false);
		rightSidePlane.setEnabled(false);
		ground.material.wireframe = false;
		skybox.isVisible=true;
		crosshairacross.isVisible = true;
		crosshairdown.isVisible = true;
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
					sceneParents[model].modelChildren[i].hideSelected();
				}
			}
					
		}
		frontPlane.setEnabled(true);
		backPlane.setEnabled(true);
		leftSidePlane.setEnabled(true);
		rightSidePlane.setEnabled(true);
		ground.material.wireframe = true;
		skybox.isVisible=false;
		crosshairacross.isVisible = false;
		crosshairdown.isVisible = false;
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
				modelName = "I"+getNameRef(currentMesh.name)+"¬"+getType(currentMesh.name)+(num_of_boxes++);
				sceneModels[modelName] = new JcubeeBlank(modelName);
				sceneModels[modelName].Jcubee = currentMesh.clone(modelName);				
				//sceneModels[modelName].Jcubee.position.y +=6*60;
				sceneModels[modelName].Jcubee.material = currentMesh.material.clone(currentMesh.material.name.substr(0,5)+(num_of_mats++));
				sceneModels[modelName].showSelected();
				currentParents[model].modelChildren[i].hideSelected();			
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
		
		scene_exported = false;
		scene_exportMarker = exportIcon;
		scene_scene.innerHTML = "Scene -- "+scene_exportMarker;
		
		collide = {left:false, right:false, up:false, down:false, front:false, back:false};
	}
	
	function scene_doDelete() {
		confirmFunc = scene_doDeletion;
		confirmDesc.innerHTML = 'Do you want to continue and delete the current selection?';
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
		
		scene_exported = false;
		scene_exportMarker = exportIcon;
		scene_scene.innerHTML = "Scene -- "+scene_exportMarker;
	}
	
	//rotation functions
	function scene_Xrotate() {
		for(var model in currentParents) {
			currentParents[model].model.rotate(BABYLON.Axis.X, -Math.PI/2, BABYLON.Space.WORLD);	
			for(var i=0; i<currentParents[model].modelChildren.length;i++) {
				currentParents[model].modelChildren[i].moveT(currentParents[model].modelChildren[i].Jcubee.getAbsolutePosition());
			}			
		}
		
		scene_exported = false;
		scene_exportMarker = exportIcon;
		scene_scene.innerHTML = "Scene -- "+scene_exportMarker;
	}
	
	function scene_Yrotate() {
		for(var model in currentParents) {
			currentParents[model].model.rotate(BABYLON.Axis.Y, -Math.PI/2, BABYLON.Space.WORLD);
			for(var i=0; i<currentParents[model].length;i++) {
				currentParents[model].modelChildren[i].moveT(currentParents[model].modelChildren[i].Jcubee.getAbsolutePosition());
			}		
		}
		
		scene_exported = false;
		scene_exportMarker = exportIcon;
		scene_scene.innerHTML = "Scene -- "+scene_exportMarker;
	}
	
	function scene_Zrotate() {
		for(var model in currentParents) {
			currentParents[model].model.rotate(BABYLON.Axis.Z, -Math.PI/2, BABYLON.Space.WORLD);
			for(var i=0; i<currentParents[model].modelChildren.length;i++) {
				currentParents[model].modelChildren[i].moveT(currentParents[model].modelChildren[i].Jcubee.getAbsolutePosition());
			}		
		}
		
		scene_exported = false;
		scene_exportMarker = exportIcon;
		scene_scene.innerHTML = "Scene -- "+scene_exportMarker;
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
			JCubees[ref].enable();
		}
		scene_hideSubMenus();
		menu.style.visibility = 'visible';
		scene_menu.style.visibility = 'hidden';
		Header.innerHTML = 'Construction Room';
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
	
	function scene_doExport() {
		var selValue = {};
		var meshes_to_save = [];

		for(var parent in sceneParents) {
			meshes_to_save.push(sceneParents[parent].model);
			for(var i=0; i<sceneParents[parent].modelChildren.length; i++) {
				sceneParents[parent].modelChildren[i].hideSelected;
				selValue[sceneParents[parent].modelChildren[i].name] = sceneParents[parent].modelChildren[i].getSelected();
				//meshes_to_save.push(sceneParents[parent].modelChildren[i].Jcubee);					
			}
			
		}		
		var serializedMesh = BABYLON.SceneSerializer.SerializeMesh(meshes_to_save, false, true);
		
		var strMesh = JSON.stringify(serializedMesh);
		newwindow=window.open("",currentModelName);
		newwindow.document.write(strMesh);
		newwindow.document.close();
		
		for(var parent in sceneParents) {
			for(var i=0; i<sceneParents[parent].modelChildren.length; i++) {
				if(selValue[parent]) {
					sceneParents[parent].modelChildren[i].showSelected();
				}					
			}
			meshes_to_save.push(sceneParents[parent].model);
		}
		
		scene_exported = true;
		scene_scene.innerHTML = "Scene";
	}
	
	function scene_doNew() {
		if (new_scene) {
			return;
		}
		if(!scene_exported) 
		{
			confirmFunc = newScene;
			confirmDesc.innerHTML = 'The current scene has not been exported.<BR>Do you want to continue and delete the current scene?'
			openConfirmDBox();
		}
		else {
			newScene();
		}
	}
	
	function newScene() {
		num_in_scene = 0;
		new_scene = true;
		scene_hideSubMenus();
		
		var child;
		for(var parent in sceneParents) {
			while(0<sceneParents[parent].modelChildren.length) {
				child = sceneParents[parent].modelChildren.pop();			
				child.destroy();
				delete child;		
			}
			sceneParents[parent].model.dispose();
			delete sceneParents[parent];
		}
		sceneParents = {};
		currentParents = {};
	 
		scene_exported = false;
		scene_exportMarker = exportIcon;
		scene_scene.innerHTML = "Scene -- "+scene_exportMarker;
		
		scene_selection.innerHTML="Selection";
		scene_selection.style.color=="rgb(136, 136, 136)";
	}
	
	/***********************************************MODEL CODES************************************/
	
	/*-------------START LIST OF MODELS---------------*/
	var currentModelName = 'model'+(num_of_models++);
	model.innerHTML = "Model -- "+currentModelName+storeMarker+saveMarker+exportMarker;
	scene_scene.innerHTML = "Scene -- "+scene_exportMarker;
	jcModels[currentModelName] = {};
	stored[currentModelName] = false;
	saved[currentModelName] = false;
	exported[currentModelName] = false;
	JCubees = {};
	
	storeIn.value = currentModelName;
	saveIn.value = currentModelName;
	
	/*-------------CONSTRUCTION STUDIO ---------------*/	
	// Set the construction studio
	jcCanvas = document.getElementById("jcCanvas");

	jcEngine = new BABYLON.Engine(jcCanvas, true);

	jccsStudio = new Studio(jcEngine);
	
	jccsStudio.scene.clearColor = new BABYLON.Color3(0.75, 0.75, 0.75);
	
	jccsStudio.scene.collisionsEnabled = true;
	
	jccsStudio.camera = new BABYLON.ArcRotateCamera("Camera", 0, 50, 300, new BABYLON.Vector3(0, 300, 0), jccsStudio.scene);
	jccsStudio.camera.setPosition(new BABYLON.Vector3(0, 1800, -2800));	
	jccsStudio.camera.lowerBetaLimit = 0.1;
	jccsStudio.camera.upperBetaLimit = (Math.PI / 2) * 0.9;
	jccsStudio.camera.attachControl(jcCanvas, true);
	
	jccsStudio.followCamera = new BABYLON.TargetCamera("followCamera", new BABYLON.Vector3(0, 0, 0), jccsStudio.scene);	
	jccsStudio.followCamera.attachControl(jcCanvas, true);
	
	jccsStudio.scene.activeCameras.push(jccsStudio.camera);
	
	jccsStudio.frontLight = new BABYLON.PointLight("omni", new BABYLON.Vector3(-3000, 6000, 2000), jccsStudio.scene);
	jccsStudio.backLight = new BABYLON.PointLight("omni", new BABYLON.Vector3(3000, -6000, 2000), jccsStudio.scene);
	jccsStudio.bottomLight = new BABYLON.PointLight("omni", new BABYLON.Vector3(-3000, 6000, -2000), jccsStudio.scene);
	jccsStudio.frontLight.intensity = 0.2;
	jccsStudio.backLight.intensity = 0.2;
	jccsStudio.bottomLight.intensity = 0.2;
	
	setColours(colours);
	setTextures();

	colour.material = jccsStudio.scene.getMaterialByName("mat53");
		
	//Materials
	var greenGridMat = new BABYLON.StandardMaterial("greenGrid", jccsStudio.scene);
	greenGridMat.emissiveColor = new BABYLON.Color3(0,1,0);
	
	var whiteGridMat = new BABYLON.StandardMaterial("whiteGrid", jccsStudio.scene);
	whiteGridMat.emissiveColor = new BABYLON.Color3(1,1,1);
	
	var blueGridMat = new BABYLON.StandardMaterial("blueGrid", jccsStudio.scene);
	blueGridMat.emissiveColor = new BABYLON.Color3(0.2,0.2,1);
	
	var redGridMat = new BABYLON.StandardMaterial("redGrid", jccsStudio.scene);
	redGridMat.emissiveColor = new BABYLON.Color3(1,0.2,0.2);
	
	var yellowGridMat = new BABYLON.StandardMaterial("blueGrid", jccsStudio.scene);
	yellowGridMat.emissiveColor = new BABYLON.Color3(1,1,0);
	
	var brownGridMat = new BABYLON.StandardMaterial("brown", jccsStudio.scene);
	brownGridMat.emissiveColor = new BABYLON.Color3(0.4,0.2,0);
	
	var blackMat = new BABYLON.StandardMaterial("black", jccsStudio.scene);
	blackMat.emissiveColor = new BABYLON.Color3(0,0,0);
	
	//Follow Camera holder and Target
	
	var holder = BABYLON.Mesh.CreateBox('holder', 1, jccsStudio.scene);
	holder.material = blackMat;
	holder.material.alpha = 0.2;
	holder.isVisible = false;
	
	var viewer = {};
	viewer.front = BABYLON.Mesh.CreatePlane('viewerfront', 1, jccsStudio.scene);
	viewer.front.position.z = 0.5;
	viewer.front.parent = holder;
	viewer.material = blackMat;
	viewer.material.alpha = 0.5;
	viewer.front.isVisible = false;
	
	viewer.back = BABYLON.Mesh.CreatePlane('viewerback', 1, jccsStudio.scene);
	viewer.back.position.z = -0.5;
	viewer.back.parent = holder;
	viewer.back.isVisible = false;
	
	viewer.left = BABYLON.Mesh.CreatePlane('viewerleft', 1, jccsStudio.scene);
	viewer.left.rotation.y = Math.PI/2;
	viewer.left.position.x = -1;
	viewer.left.parent = holder;
	viewer.left.isVisible = false;
	
	viewer.right = BABYLON.Mesh.CreatePlane('viewerright', 1, jccsStudio.scene);
	viewer.right.rotation.y = Math.PI/2;
	viewer.right.position.x = 1;
	viewer.right.parent = holder;
	viewer.right.isVisible = false;
	
	viewer.top = BABYLON.Mesh.CreatePlane('viewertop', 1, jccsStudio.scene);
	viewer.top.rotation.x = Math.PI/2;
	viewer.top.position.y = 1;
	viewer.top.parent = holder;
	viewer.top.isVisible = false;
	
	viewer.bottom = BABYLON.Mesh.CreatePlane('viewerbottom', 1, jccsStudio.scene);
	viewer.bottom.rotation.x = Math.PI/2;
	viewer.bottom.position.y = -1;
	viewer.bottom.parent = holder;
	viewer.bottom.isVisible = false;
	
	var target = BABYLON.Mesh.CreatePlane('target', 1, jccsStudio.scene);
	//target.material = blackMat;
	//target.material.alpha = 0.5;
	target.isVisible = false;
	target.parent = holder;
	target.position = new BABYLON.Vector3(0, 0, 13*60);
	
	var crosshairdown = BABYLON.Mesh.CreateLines('crosshairdown', [new BABYLON.Vector3(0,0.5,0), new BABYLON.Vector3(0,-0.5,0)], jccsStudio.scene);
	crosshairdown.position.z = 0.45;
	crosshairdown.parent = holder;
	crosshairdown.isVisible = false;
	
	var crosshairacross = BABYLON.Mesh.CreateLines('crosshairacross', [new BABYLON.Vector3(0.5,0,0), new BABYLON.Vector3(-0.5,0,0)], jccsStudio.scene);
	crosshairacross.position.z = 0.45;
	crosshairacross.parent = holder;
	crosshairacross.isVisible = false;
	
	holder.scaling = new BABYLON.Vector3(6,6,60);
	holder.position = new BABYLON.Vector3(15,52, -585);
	holder.rotation.x = 5*Math.PI/180;
	
	jccsStudio.followCamera.position = viewer.back.getAbsolutePosition();	
	jccsStudio.followCamera.setTarget(target.getAbsolutePosition());
	
	//Create Ground
	var ground=BABYLON.Mesh.CreateGround("ground",2400, 2400, 40, jccsStudio.scene,  false, BABYLON.Mesh.DOUBLESIDE);	
	ground.material = greenGridMat;
	ground.material.wireframe=true;
	ground.position.y = 0;
	ground.checkCollisions = true;
	
	var currentBlock = ground;
	
	//Create Ceiling
	var ceiling=BABYLON.Mesh.CreateGround("ceiling",2400, 1200, 1, jccsStudio.scene);	
	ceiling.position.y = 1440;
	ceiling.isVisible = false;
	ceiling.isPickable = false;
	ceiling.checkCollisions = true;

	//Create Planes for each side	
	var backPlane=BABYLON.Mesh.CreateGround("backPlane",2400, 2400, 40, jccsStudio.scene);	
	backPlane.material = yellowGridMat;
	backPlane.material.wireframe=true;
	backPlane.rotation.x = Math.PI/2;
	backPlane.position.x=0;
	backPlane.position.y=1200;
	backPlane.position.z=1200;
	backPlane.isPickable = false;
	backPlane.checkCollisions = false;
	
/*	var backPlaneBlock=BABYLON.Mesh.CreateGround("backPlaneBlock",2400, 2400, 40, jccsStudio.scene);	
	backPlaneBlock.rotation.x = Math.PI/2;
	backPlaneBlock.position.x=0;
	backPlaneBlock.position.y=1200;
	backPlaneBlock.position.z=1170;
	backPlaneBlock.isPickable = false;
	backPlaneBlock.isVisible = false;	*/
	
	var leftSidePlane=BABYLON.Mesh.CreateGround("leftSidePlane",2400, 2400, 40, jccsStudio.scene);	
	leftSidePlane.material = blueGridMat;
	leftSidePlane.material.wireframe=true;
	leftSidePlane.rotation.z = Math.PI/2;
	leftSidePlane.position.x=-1200;
	leftSidePlane.position.y=1200;
	leftSidePlane.position.z=0;
	leftSidePlane.isPickable = false;
	leftSidePlane.checkCollisions = false;
	
/*	var leftSideBlock=BABYLON.Mesh.CreateGround("leftSideBlock",2400, 2400, 40, jccsStudio.scene);	
	leftSideBlock.rotation.z = Math.PI/2;
	leftSideBlock.position.x=-1170;
	leftSideBlock.position.y=1200;
	leftSideBlock.position.z=0;
	leftSideBlock.isPickable = false;
	leftSideBlock.isVisible = false; */
	
	var frontPlane=BABYLON.Mesh.CreateGround("frontPlane",2400, 2400, 40, jccsStudio.scene);	
	frontPlane.material = brownGridMat;
	frontPlane.material.wireframe=true;
	frontPlane.rotation.x = Math.PI/2;
	frontPlane.position.x=0;
	frontPlane.position.y=1200;
	frontPlane.position.z=-1200;
	frontPlane.isPickable = false;
	frontPlane.visibility = 0;
	frontPlane.checkCollisions = false;

	var rightSidePlane=BABYLON.Mesh.CreateGround("rightSidePlane",2400, 2400, 40, jccsStudio.scene);	
	rightSidePlane.material = redGridMat;
	rightSidePlane.material.wireframe=true;
	rightSidePlane.rotation.z = Math.PI/2;
	rightSidePlane.position.x=1200;
	rightSidePlane.position.y=1200;
	rightSidePlane.position.z=0;	
	rightSidePlane.isPickable = false;
	rightSidePlane.checkCollisions = false;
	
	var skybox = BABYLON.Mesh.CreateBox("skyBox", 3000.0, jccsStudio.scene);
	skybox.isVisible=false;
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", jccsStudio.scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../images/skybox/skybox", jccsStudio.scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skybox.material = skyboxMaterial;


	//Base Meshes
	var baseMeshes={};
	
	baseMeshes["box"] = BABYLON.Mesh.CreateBox("box", 60.0, jccsStudio.scene);
	baseMeshes["box"].setEnabled(false);
	baseMeshes["cyl"] = BABYLON.Mesh.CreateCylinder("cyl", 60, 60, 60, 60, 1, jccsStudio.scene);
	baseMeshes["cyl"].setEnabled(false);
	baseMeshes["sph"] = BABYLON.Mesh.CreateSphere("sph", 60.0, 60.0, jccsStudio.scene);
	baseMeshes["sph"].setEnabled(false);
	var roofshape = [
		new BABYLON.Vector3(30, 30, -30),
		new BABYLON.Vector3(30, -30, -30),
		new BABYLON.Vector3(-30, -30, -30)
	];
	roofshape.push(roofshape[0]);
	
	var roofpath = [
	  new BABYLON.Vector3(0,0,0),
	  new BABYLON.Vector3(0, 0, 60)
	];

	baseMeshes["rti"] = BABYLON.Mesh.ExtrudeShape("rti", roofshape, roofpath, 1, 0, BABYLON.Mesh.CAP_ALL, jccsStudio.scene, true, BABYLON.Mesh.DOUBLESIDE);
	baseMeshes["rti"].setEnabled(false);
	
	//Make Cubees  L prefix for Live Cubee
	function makeBox() {		
		var name = "L"+currentModelName+"¬box"+(num_of_boxes++);
		JCubees[name] = new JcubeeClone(baseMeshes["box"], name, 30, 30 + 12*60, 30, colour.material);		
		JCubees[name].addMarkers(jccsStudio.scene);
		hideSubMenus();
		resetBorders();		
		selection.style.color="#000000";		
		selectNew(JCubees[name].Jcubee);
		storeMarker = storeIcon; 
		saveMarker = saveIcon; 
		exportMarker = exportIcon;
		model.innerHTML = "Model -- "+currentModelName+storeMarker+saveMarker+exportMarker;
		stored[currentModelName] = false;
		saved[currentModelName] = false;
		exported[currentModelName] = false;	
	}
	
	function makeCylinder() {
		var name = "L"+currentModelName+"¬cyl"+(num_of_boxes++);
		JCubees[name] = new JcubeeClone(baseMeshes["cyl"], name, 30, 30 + 12*60, 30, colour.material);
		JCubees[name].addMarkers(jccsStudio.scene);
		hideSubMenus();
		resetBorders();		
		selection.style.color="#000000";		
		selectNew(JCubees[name].Jcubee);
		storeMarker = storeIcon; 
		saveMarker = saveIcon; 
		exportMarker = exportIcon;
		model.innerHTML = "Model -- "+currentModelName+storeMarker+saveMarker+exportMarker;
		stored[currentModelName] = false;
		saved[currentModelName] = false;
		exported[currentModelName] = false;
	}
	
	function makeSphere() {
		var name = "L"+currentModelName+"¬sph"+(num_of_boxes++);
		JCubees[name] = new JcubeeClone(baseMeshes["sph"], name, 30, 30 + 12*60, 30, colour.material);
		JCubees[name].addMarkers(jccsStudio.scene);
		hideSubMenus();
		resetBorders();		
		selection.style.color="#000000";		
		selectNew(JCubees[name].Jcubee);
		storeMarker = storeIcon; 
		saveMarker = saveIcon; 
		exportMarker = exportIcon;
		model.innerHTML = "Model -- "+currentModelName+storeMarker+saveMarker+exportMarker;
		stored[currentModelName] = false;
		saved[currentModelName] = false;
		exported[currentModelName] = false;
	}

	function makeRoof() {
		var name = "L"+currentModelName+"¬rti"+(num_of_boxes++);
		JCubees[name] = new JcubeeClone(baseMeshes["rti"], name, 30, 30 + 12*60, 30, colour.material);
		JCubees[name].addMarkers(jccsStudio.scene);
		hideSubMenus();
		resetBorders();		
		selection.style.color="#000000";		
		selectNew(JCubees[name].Jcubee);
		storeMarker = storeIcon; 
		saveMarker = saveIcon; 
		exportMarker = exportIcon;
		model.innerHTML = "Model -- "+currentModelName+storeMarker+saveMarker+exportMarker;
		stored[currentModelName] = false;
		saved[currentModelName] = false;
		exported[currentModelName] = false;
	}
	
	//select new cubee
	function selectNew(cubee) {
		currentMeshes = {};
		//currentMaterials = {};
		currentMeshes[cubee.name] = cubee;
		JCubees[cubee.name].showSelected();
		//currentMeshes[cubee.name].showBoundingBox=true;	
		for(var mesh in JCubees) {						
			if(!(mesh in currentMeshes)) {
				JCubees[mesh].hideSelected();						
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
					sceneParents[model].modelChildren[i]. hideSelected();
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
         	if(viewcamera) {
         		return
         	};
			if(shiftDown) {
				if(name in currentMeshes) {
					JCubees[name].hideSelected();
					//currentMeshes[name].showBoundingBox=false;
					JCubees[name].hideMarkers();
					delete currentMeshes[name];
				}
				else {
					currentMeshes[name] = currentMesh;
					JCubees[name].showSelected();
					//currentMeshes[name].showBoundingBox=true;	
					JCubees[name].showMarkers();					
				}
			}
			else {			
				for(var mesh in JCubees) {						
					JCubees[mesh].showSelected();
					JCubees[mesh].hideMarkers();
				}			
				currentMeshes = {};
				currentMeshes[name] = currentMesh;
				JCubees[name].showMarkers();
				for(var mesh in JCubees) {						
					if(!(mesh in currentMeshes)) {
						JCubees[mesh].hideSelected();						
					}
				}
			}
			if(selection.innerHTML == "Select All") {
				selection.innerHTML = "Selection";
			}
			selection.style.color="#000000";
		}

		function updateCurrentModels() {
			if(viewcamera) {
         		return
         	};
			if(shiftDown) {				
				if(name in currentParents) {
					delete currentParents[name];
				}
				else {
					currentParents[name] = currentParent;
					for(var i=0; i<currentParent.modelChildren.length;i++) {
						currentParent.modelChildren[i].showSelected();
						currentParent.modelChildren[i].showMarkers();
					}						
				}
			}
			else {			
				for(var model in sceneParents) {						
					for(var i=0; i<sceneParents[model].modelChildren.length;i++) {
						sceneParents[model].modelChildren[i].showSelected();
						sceneParents[model].modelChildren[i].showMarkers();
					}
				}			
				currentParents = {}; 
				currentParents[name] = currentParent;
				for(var model in sceneParents) {						
					if(!(model in currentParents)) {						
						for(var i=0; i<sceneParents[model].modelChildren.length;i++) {
							sceneParents[model].modelChildren[i].hideSelected();
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
		
		if((evt.keyCode == 101 || evt.keyCode == 12) && viewcamera) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			cameraMove(collideCamera.front, 1*cameraSpeed/60, BABYLON.Axis.Z, BABYLON.Space.LOCAL, true);
			return;		
		}
		
		if((evt.keyCode == 96 || evt.keyCode == 45) && viewcamera) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}			
			cameraMove(collideCamera.back, -1*cameraSpeed/60, BABYLON.Axis.Z, BABYLON.Space.LOCAL, true);
			return;	
		}
		
		if((evt.keyCode == 100 || evt.keyCode == 37) && viewcamera) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			cameraMove(collideCamera.left, -0.005*cameraSpeed, BABYLON.Axis.Y, BABYLON.Space.WORLD, false);	
			return;		
		}
		
		if((evt.keyCode == 102 || evt.keyCode == 39) && viewcamera) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			cameraMove(collideCamera.right, 0.005*cameraSpeed, BABYLON.Axis.Y, BABYLON.Space.WORLD, false);
			return;			
		}
		
		
		if((evt.keyCode == 98 || evt.keyCode == 40) && viewcamera) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			cameraMove(collideCamera.down, -1*cameraSpeed, BABYLON.Axis.Y, BABYLON.Space.WORLD, true);
			return;			
		}
		
		if((evt.keyCode == 104 || evt.keyCode == 38) && viewcamera) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			cameraMove(collideCamera.up, 1*cameraSpeed, BABYLON.Axis.Y, BABYLON.Space.WORLD, true);	
			return;	
		}
		
		if((evt.keyCode == 97 || evt.keyCode == 99 || evt.keyCode == 35 || evt.keyCode == 34 ) && viewcamera) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}			
			if(viewangle> 6 * Math.PI/180 ) {
				cameraMove(collideCamera.lookup, 0.005*cameraSpeed, BABYLON.Axis.X, BABYLON.Space.LOCAL, false);
				viewangle -=0.005*cameraSpeed;
			}
			return;						
		}
		
		if((evt.keyCode == 103 || evt.keyCode == 105 || evt.keyCode == 36 || evt.keyCode == 33) && viewcamera) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}			
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
				doMove(moveRight, rightSidePlane);
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
				doMove(moveLeft, leftSidePlane);
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
				doMove(moveDown, ground);
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
				doMove(moveUp, ceiling);
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
				doMove(moveForward, backPlane);
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
				doMove(moveBackward, frontPlane);
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
	
	function doMove(diff, block) {
		currentBlock.checkCollisions = false;
		block.checkCollisions = true;
		currentBlock = block;
		for(var name in currentMeshes) {
			if(solid.checked) {
				currentMeshes[name].moveWithCollisions(diff);
				currentMeshes[name].onCollide = function(collidedMesh) {
					//console.log(collidedMesh.name);
					currentMeshes[name].position.addInPlace(diff.scale(-0.5));
				};	
			}
			else {
				currentMeshes[name].position.addInPlace(diff);
			};				
			JCubees[name].moveT(currentMeshes[name].position);
		}
		storeMarker = storeIcon; 
		saveMarker = saveIcon; 
		exportMarker = exportIcon;
		model.innerHTML = "Model -- "+currentModelName+storeMarker+saveMarker+exportMarker;
		stored[currentModelName] = false;
		saved[currentModelName] = false;
		exported[currentModelName] = false;
	}
	
	function modelMove(blocked, diff) {
		if(!blocked  || !scene_solid.checked) {
			diff = diff.scale(0.5);
			for(var name in currentParents) {								
				currentParents[name].model.position.addInPlace(diff);
				currentParents[name].clone.position.addInPlace(diff);				
				//currentParents[name].modelBoundary.position.addInPlace(diff);
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
		scene_exported = false;
		scene_exportMarker = exportIcon;
		scene_scene.innerHTML = "Scene -- "+scene_exportMarker;
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
			for(var dir in collideCamera)	{
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

