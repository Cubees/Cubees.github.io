introhtml = "<div class='title'>";
introhtml += "<br>Introduction";
introhtml +="</div>";
introhtml += "<div>";
introhtml += "<br>The Extrusion Tool is used to produce extruded shapes.";
introhtml += "<p>These shapes can be downloaded to import into"; 
introhtml += "<br>"; 
introhtml += "<ul><li>the Stretch and Squash Workshop as one of the Cubees;</li>";
introhtml += "<li>your own Babylonjs project.</li></ul></p>";
introhtml += "<p>The extrusion is set by dragging markers and the extruded shape appears automatically.</p>";
introhtml += "<img src='images/extrusion.jpg' width='50%'> "; 
introhtml +="</div>";
introhtml += "<div>";
introhtml += "<br><input id='next' type='button' class='next' value='Next'><label id='nextLabel' for='next'>Using Extrude</label>";
introhtml += "</div>";

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
		
	extrude={
		page:"extrude.html",
		loaded:false,
		html:"",
		next:null,
		prev:null,
		text:"Using Extrude",
		links:null,
		main:true,
		sub:null,
	},
	
	menu={
		page:"menu.html",
		loaded:false,
		html:"",
		next:null,
		prev:null,
		text:"Menu",
		links:null,
		main:true,
		sub:null,
	},
	
	file={
		page:"file.html",
		loaded:false,
		html:"",
		next:null,
		prev:null,
		text:"Exporting",
		links:null,
		main:true,
		sub:null,
	},
	
	example={
		page:"example.html",
		loaded:false,
		html:"",
		next:null,
		prev:null,
		text:"Example",
		links:null,
		main:true,
		sub:null,
	}	
];



//NEXT
Intro.next=extrude;
extrude.next=menu;
menu.next=file;
file.next=example


//PREV
extrude.prev=Intro;
menu.prev=extrude;
file.prev=menu;
example.prev=file;



