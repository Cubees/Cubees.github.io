introhtml = "<div class='title'>";
introhtml += "<br>Introduction";
introhtml +="</div>";
introhtml += "<div>";
introhtml += "<br>The Lathe Tool is used to produce turned shapes.";
introhtml += "<p>These shapes can be downloaded to import into"; 
introhtml += "<br>"; 
introhtml += "<ul><li>the Stretch and Squash Workshop as one of the Cubees;</li>";
introhtml += "<li>your own Babylonjs project.</li></ul></p>";
introhtml += "<p>The lathe is simply set by dragging markers and the turned shape appears automatically.</p>";
introhtml += "<img src='images/spintop.jpg' width='50%'> "; 
introhtml +="</div>";
introhtml += "<div>";
introhtml += "<br><input id='next' type='button' class='next' value='Next'><label id='nextLabel' for='next'>Using the Lathe</label>";
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
		
	lathe={
		page:"lathe.html",
		loaded:false,
		html:"",
		next:null,
		prev:null,
		text:"Using the Lathe",
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
	}	
];



//NEXT
Intro.next=lathe;
lathe.next=menu;
menu.next=file;


//PREV
lathe.prev=Intro;
menu.prev=lathe;
file.prev=menu;



