function createExtruded(name, path, num_of_turns, scene, updateable, sideOrientation) {
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

function updateExtruded(product, path, num_of_turns) {
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