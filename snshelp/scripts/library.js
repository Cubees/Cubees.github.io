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
		text:"Construction Introduction?",
		main:true,
		links:null
	}
];

SceneLibrary=[
	AddColumns={
		page:"AddColumns.html",
		loaded:false,
		html:"",
		next:null,
		prev:null,
		text:"Adding in Columns",
		main:true,
		links:null
	}
];

ViewingLibrary=[
	TakeAwayMethod3={
		page:"TakeAwayMethod3.html",
		loaded:false,
		html:"",
		next:null,
		prev:null,
		text:"Method 3",
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
		
	View={
		sub:ViewingLibrary,
		text:'Viewing Area',
		main:true,
		open:false
	}	
];



//NEXT
Intro.next=Cintro;

//PREV
Cintro.prev=Intro;

//LINKS



