introhtml = "<div class='title'>";
introhtml += "<br>Introduction";
introhtml +="</div>";
introhtml += "<div>";
introhtml += "<br>The Workshop is made up of the Construction and Scene Building Rooms and a Viewing area.";
introhtml += "<p>In the Construction Room put together the Cubees to make a model.</p>"; 
introhtml += "<p>In the Scene Room put together models to make a scene.</p>"; 
introhtml += "<p>When in the Scene Room you can view the scene by a flythrough.</p>";
introhtml += "<p>This Workshop is a basic introduction to building with Just Cubees.</p>";
introhtml += "<p>With Just Cubees you cannot change the size of a Cubee nor make your own Cubees.</p>"; 
introhtml +="</div>";
introhtml += "<div>";
introhtml += "<br><input id='next' type='button' class='next' value='Next'><label id='nextLabel' for='next'>Construction Introduction?</label>";
introhtml += "</div>";

ConstructionLibrary=[
	Cintro={
		page:"Cintro.html",
		loaded:false,
		html:"",
		next:null,
		prev:null,
		text:"Construction Introduction",
		main:true,
		links:null
	},
	
	newCubee={
		page:"newCubee.html",
		loaded:false,
		html:"",
		next:null,
		prev:null,
		text:"New Cubee",
		main:true,
		links:null
	},
	
	file={
		page:"file.html",
		loaded:false,
		html:"",
		next:null,
		prev:null,
		text:"File",
		main:true,
		links:null
	},
	
	selection={
		page:"selection.html",
		loaded:false,
		html:"",
		next:null,
		prev:null,
		text:"Selection",
		main:true,
		links:null
	},
	
	scene={
		page:"scene.html",
		loaded:false,
		html:"",
		next:null,
		prev:null,
		text:"To Scene Room",
		main:true,
		links:null
	},
	
	solidity={
		page:"solidity.html",
		loaded:false,
		html:"",
		next:null,
		prev:null,
		text:"Solidity",
		main:true,
		links:null
	}
];

SceneLibrary=[
	Sintro={
		page:"Sintro.html",
		loaded:false,
		html:"",
		next:null,
		prev:null,
		text:"Introduction",
		main:true,
		links:null
	},
	
	model={
		page:"model.html",
		loaded:false,
		html:"",
		next:null,
		prev:null,
		text:"Models",
		main:true,
		links:null
	},
	
	scenefile={
		page:"scenefile.html",
		loaded:false,
		html:"",
		next:null,
		prev:null,
		text:"File",
		main:true,
		links:null
	},
	
	sceneselection={
		page:"sceneselection.html",
		loaded:false,
		html:"",
		next:null,
		prev:null,
		text:"Selection",
		main:true,
		links:null
	},
	
	scenetoconstruct={
		page:"scenetoconstruct.html",
		loaded:false,
		html:"",
		next:null,
		prev:null,
		text:"Switch to Construction",
		main:true,
		links:null
	},
	
	scenesolidity={
		page:"scenesolidity.html",
		loaded:false,
		html:"",
		next:null,
		prev:null,
		text:"Solidity",
		main:true,
		links:null
	},
	
	sceneview={
		page:"sceneview.html",
		loaded:false,
		html:"",
		next:null,
		prev:null,
		text:"View Camera",
		main:true,
		links:null
	}
];

library= [
	Intro={
		page:"Intro.html",
		loaded:true,
		html:introhtml,
		next:null,
		prev:null,
		text:"Introduction",
		links:null,
		main:true,
		sub:null,
	},
	
	Construct={
		sub:ConstructionLibrary,
		text:'Construction Room',
		main:true,
		open:false
	},

	
	Scene={
		sub:SceneLibrary,
		text:'Scene Building Room',
		main:true,
		open:false
	},
		
	viewing={
		page:"viewing.html",
		loaded:false,
		html:"",
		next:null,
		prev:null,
		text:"Viewing Area",
		links:null,
		main:true,
		sub:null,
	},
	
	todo={
		page:"todo.html",
		loaded:false,
		html:"",
		next:null,
		prev:null,
		text:"To Do",
		links:null,
		main:true,
		sub:null,
	}	
];



//NEXT
Intro.next=Cintro;
Cintro.next=newCubee;
newCubee.next=file;
file.next=selection;
selection.next=scene;
scene.next=solidity;
solidity.next=Sintro;
Sintro.next=model;
model.next=scenefile;
scenefile.next=sceneselection;
sceneselection.next=scenetoconstruct;
scenetoconstruct.next=scenesolidity;
scenesolidity.next=sceneview;
sceneview.next=viewing;

//PREV
Cintro.prev=Intro;
newCubee.prev=Cintro;
file.prev=newCubee;
selection.prev=file;
scene.prev=selection;
solidity.prev=scene;
Sintro.prev=solidity;
model.prev=Sintro;
scenefile.prev=model;
sceneselection.prev=scenefile;
scenetoconstruct.prev=sceneselection;
scenesolidity.prev=scenetoconstruct;
sceneview.prev=scenesolidity;
viewing.prev=sceneview;

//LINKS
newCubee.links=[selection, solidity];
model.links=[sceneselection, scenesolidity];


