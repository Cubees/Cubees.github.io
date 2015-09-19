function createTurned(name, path, num_of_turns, scene, updateable, sideOrientation) {
	var paths=[];
	
	for(var i=0;i<num_of_turns;i++) {
		paths[i]=[];
		for(var p=0; p<path.length; p++) {
			paths[i][p] = rotateY(path[p],2*Math.PI*i/num_of_turns);
		}		
	}
	
	var turned = new BABYLON.Mesh.CreateRibbon(name, paths, true, false, 0, scene, updateable, sideOrientation);

	return turned;
}

function updateTurned(product, path, num_of_turns, scene) {
	var paths=[];
	
	for(var i=0;i<num_of_turns;i++) {
		paths[i]=[];
		for(var p=0; p<path.length; p++) {
			paths[i][p] = rotateY(path[p],2*Math.PI*i/num_of_turns);
		}		
	}
	
	product = BABYLON.Mesh.CreateRibbon(null, paths, null, null, null, null, null, null, product);
	
	return product;
	
}

function rotateY(vector,theta) {
	var x = vector.x*Math.cos(theta) + vector.z*Math.sin(theta);
	var z = -vector.x*Math.sin(theta) + vector.z*Math.cos(theta);
	return new BABYLON.Vector3(x, vector.y, z);
}

function getDimensions(path) {
	var minY = path[0].y;
	var maxY = minY;
	var maxX = Math.abs(path[0].x);
	for(var p=1; p<path.length; p++) {
			minY = Math.min(minY, path[p].y);
			maxY = Math.max(maxY, path[p].y);			
			maxX = Math.max(maxX, Math.abs(path[p].x));			
		}
	var height = maxY - minY;
	var width = 2*maxX;
	var length = 2*maxX;
	return {L:length, W:width, H:height};
}

function container(path, scene, grid) {
	var dims = getDimensions(path);
	var L=dims.L;
	var W=dims.W;
	var H=dims.H;	
	if(grid>0) {
		var G=Math.floor(L/grid);
		if(L%grid>0) {
			G +=1;
		}
		L=G*grid;
		G=Math.floor(W/grid);
		if(W%grid>0) {
			G +=1;
		}
		W=G*grid;
		G=Math.floor(H/grid);
		if(H%grid>0) {
			G +=1;
		}
		H=G*grid;
	}
	box = CreateCuboid("box", L, W, H, scene);
	box.material = new BABYLON.StandardMaterial("white", scene);
	box.material.emissiveColor = new BABYLON.Color3(1,1,1);
	box.material.alpha = 0;
	box.showBoundingBox = false;
	if(grid>0) {
		box.showBoundingBox = true;
	}

	switch(grid) {
		case 0:
			boxHtitle.innerHTML="&nbsp;&nbsp;Shape Height";
			boxH.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;" + Math.floor(H*100)/100 + " units";
			boxWtitle.innerHTML="&nbsp;Shape Radius";
			boxW.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;" + Math.floor(W*100)/100 + " units";
		break
		case 1:
			boxHtitle.innerHTML="&nbsp;Container Height";
			boxH.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;" + Math.floor(H/60) + " cubees "+ (H%60) +" micro cubees";
			boxWtitle.innerHTML="&nbsp;Container Width";
			boxW.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;" + Math.floor(W/60) + " cubees "+ (W%60) +" micro cubees";
		break
		case 15:
			boxHtitle.innerHTML="&nbsp;Container Height";
			boxH.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;" + Math.floor(H/60) + " cubees "+ ((H%60)/15) +" mini cubees";
			boxWtitle.innerHTML="&nbsp;Container Width";
			boxW.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;" + Math.floor(W/60) + " cubees "+ ((W%60)/15) +" mini cubees";
		break
		case 60:
			boxHtitle.innerHTML="&nbsp;Container Height";
			boxH.innerHTML= "&nbsp;&nbsp;&nbsp;&nbsp;" + Math.floor(H/60) +" cubees";
			boxWtitle.innerHTML="&nbsp;Container Width";
			boxW.innerHTML= "&nbsp;&nbsp;&nbsp;&nbsp;" + Math.floor(W/60) +" cubees";
		break
	}
	return box;
}