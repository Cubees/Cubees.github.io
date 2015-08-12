function bookWidth() {
	if(window.innerWidth>799) {
		document.getElementById("menuholder").innerHTML=fullMenu();				
	}
	else {
		compactMenu();		
	}
	setPage();
}

function pageMenu() {
	var menuhtml="<div class='menuTitle'>Pages</div>";
	for(i=0; i<library.length; i++) {
		if(library[i].main) {		
			if(library[i].sub==null) {
				menuhtml+="<div id='page"+i+"' class='page' onclick='openPage(this.id)'>"+library[i].text+"</div>";
			}
			else if(library[i].open) {				
				menuhtml+="<div id='page"+i+"' class='page' onclick='setIndex(this.id,false)'>&#9663; "+library[i].text+"</div>";			
				for(j=0; j<library[i].sub.length; j++) {
					menuhtml+="<div id='page"+i+","+j+"' class='subpage' onclick='openPage(this.id)'>"+library[i].sub[j].text+"</div>";					
				}
			}
			else {
				menuhtml+="<div id='page"+i+"' class='page' onclick='setIndex(this.id,true)'>&#9657; "+library[i].text+"</div>";
			}
		}
	}
	return menuhtml;
}

function setIndex(id,set) {	
	var n=parseInt(id.substr(4));
	var book=library[n];
	book.open=set;
	if(window.innerWidth<800) {
		compactMenu();
		if(book.main) {
			openPageMenu()
		}
		else {
			//openExtraMenu()
		}
	}
	else {		
		document.getElementById("menuholder").innerHTML=fullMenu();
	}
	
}

function fullMenu() {
	var menuhtml="<div class='menu'>";
	menuhtml+=pageMenu();
	menuhtml+="</div>";	
	return menuhtml;
}

function compactMenu() {
	var menuhtml="<div class='menu'>";
	menuhtml+="<div class='shortTitle' onclick='openPageMenu()'>Pages</div>";
	var blankmenu="<div class='blankTitle'>&nbsp;</div>";
	menuhtml+=blankmenu;
	menuhtml+="</div>";
	document.getElementById("menuholder").innerHTML=menuhtml;	
}

function openPageMenu() {
	document.getElementById("menuholder").innerHTML="<div class='menu'>"+pageMenu()+"</div>";
}


function openPage(id) {
	if(window.innerWidth<800) {
		compactMenu();
	}
	var n=parseInt(id.substr(4));
	var re=/,/;
	var i=id.search(re);
	if(i==-1) {			
		var page=library[n];
	}
	else {
		var m=id.substring(i+1);
		m=parseInt(m);
		var page=library[n].sub[m];
	}
	if(page.loaded) {
		if(!page.main) {
			var re = /prevLabel\" for=\"prev\">.*<\/label>/;
			var ns ='prevLabel" for="prev">'+currentPage.text+'</label>';				
			page.html=page.html.replace(re,ns);			
			page.prev=currentPage;
		}	
		currentPage=page;
		setPage();
	}
	else {
		loadPage(page,currentPage,true);
	}
}