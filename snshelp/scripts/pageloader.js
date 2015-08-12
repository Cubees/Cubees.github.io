function loadPage(book,current,openpage) {	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "pages/"+book.page);
	xhr.onreadystatechange=function() {
		if (xhr.readyState==4) {
	   		book.html=xhr.responseText;
	   		book.loaded=true;
	   		if(!book.main) {	   			
	   			var re = /prevLabel\" for=\"prev\">.*<\/label>/;
				var ns ='prevLabel" for="prev">'+current.text+'</label>';			
				book.html=book.html.replace(re,ns);			
				book.prev=current;
				}
			if(openpage) {	
				current=book;
				currentPage=book;
	   			setPage();
	   		}
	   		if(current.next) {
	   			document.getElementById("next").style.visibility="visible";
	   			document.getElementById("nextLabel").style.visibility="visible";
	   			document.getElementById("next").addEventListener('click', nextPage, false);
	   		}
	   		if(current.prev) {
	   			document.getElementById("prev").style.visibility="visible";
	   			document.getElementById("prevLabel").style.visibility="visible";
	   			document.getElementById("prev").addEventListener('click', prevPage, false);
	   		}
	 	}
	};
	xhr.send(null);
}
