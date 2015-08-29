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