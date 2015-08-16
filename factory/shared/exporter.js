function writeExport(mesh) {
	var serializedMesh = BABYLON.SceneSerializer.SerializeMesh(mesh);
		
	var strMesh = JSON.stringify(serializedMesh);
	newwindow=window.open("","mesh");
	newwindow.document.write(strMesh);
	newwindow.document.close();
}

var objectUrl;

function doDownload(filename, mesh, dBox) {
	if(objectUrl) {
		window.URL.revokeObjectURL(objectUrl);
	}
	
	var serializedMesh = BABYLON.SceneSerializer.SerializeMesh(mesh);
		
	var strMesh = JSON.stringify(serializedMesh);
	
    dBox.style.visibility='hidden';        
	if (filename.length === 0){
		dBox.style.visibility='visible';
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
	
}
