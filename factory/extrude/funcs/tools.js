function createExtruded(name, blade, scene) {
	var path =[];
	var paths=[];

	var matrix;
	var scap, ecap;

	var extrudeScalex = BPathPoints(0);
  	var extrudeScaley = BPathPoints(1);
  	if(scaleLock) {
  		var extrudeScaley = BPathPoints(0);
  	}
	var extrudeRotate = BPathPoints(2).map(function(a){return a*Math.PI/180;});
	var extrudeTilt = BPathPoints(3).map(function(a){return a*Math.PI/180;});
	var extrudeTwist = BPathPoints(4).map(function(a){return a*Math.PI/180;});
	
	var extrudeMovex = BPathPoints(5);
	var extrudeMovey = BPathPoints(6);
	if(moveLock) {
		var extrudeMovey = BPathPoints(5);
	}
	
	var extrudePath = [];  //linear path through (0, 0, 0) parallel to z axis
	for(var i=0; i<extrudeTilt.length; i++) {
		extrudePath[i] = new BABYLON.Vector3(0, 0, i*extrudeLength/(extrudeTilt.length - 1) - extrudeLength/2);			
	}			
	
	for( var b=0; b<blade.length; b++) {
			path[b] = extrudePath.map(function (v) {
			v.x = blade[b].x;
			v.y = blade[b].y;
			return v;
		});
		
		for(var i=0; i<path[b].length; i++) {
			path[b][i].x *=extrudeScalex[i];
			path[b][i].y *=extrudeScaley[i];
			matrix = BABYLON.Matrix.RotationYawPitchRoll(extrudeTwist[i], extrudeTilt[i], extrudeRotate[i]);
			path[b][i] = BABYLON.Vector3.TransformCoordinates(path[b][i], matrix);
			path[b][i].x += extrudeMovex[i];
			path[b][i].y += extrudeMovey[i];
		}
		

		scap = new BABYLON.Vector3(0, 0, - extrudeLength/2);
		matrix = BABYLON.Matrix.RotationYawPitchRoll(extrudeTwist[0], extrudeTilt[0], extrudeRotate[0]);
		scap = BABYLON.Vector3.TransformCoordinates(scap, matrix);
		scap.x += extrudeMovex[0];
		scap.y += extrudeMovey[0];
		
		ecap = new BABYLON.Vector3(0, 0, extrudeLength/2);
		matrix = BABYLON.Matrix.RotationYawPitchRoll(extrudeTwist[extrudeTwist.length - 1], extrudeTilt[extrudeTilt.length - 1], extrudeRotate[extrudeRotate.length - 1]);
		ecap = BABYLON.Vector3.TransformCoordinates(ecap, matrix);
		ecap.x += extrudeMovex[extrudeMovex.length - 1];
		ecap.y += extrudeMovey[extrudeMovey.length - 1];
		
		path[b].unshift(scap);
		path[b].push(ecap);	
		
		paths.push(path[b]);
		
	}
	
	var extruded = new BABYLON.Mesh.CreateRibbon(name, paths, true, false, 0, scene, false, BABYLON.Mesh.DOUBLESIDE);
	
	return extruded;
	
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

function BPathPoints(currentControl) {
	var Npoints = Math.floor(extrudeLength/20);
	var currentNode=controlNodes[currentControl];
	var segNpoints =[];
	var maxSegLen = 0;
	var maxSeg = 0;
	var segLen;
	var Ntotal= 0;
	var i=0;
	while(currentNode.name.substr(0,2) !== "ex") {
		segLen = currentNode.next.x - currentNode.x;
		maxSegLen = Math.max(maxSeg, segLen);
		if(maxSegLen == segLen) {
			maxSeg = i;
		}
		segNpoints[i] = Math.floor(Npoints*segLen/extrudeLength);
		Ntotal += segNpoints[i];
		i++;
		currentNode = currentNode.next;
	}
	if(Ntotal != Npoints) {
		segNpoints[maxSeg] +=Npoints - Ntotal;
	}
	var seg_points;
	var path_points =[];
	currentNode=controlNodes[currentControl];
	i=0;
	var scaled_points;
	while(currentNode.next !== null) {	
		seg_points = getControlPoints(currentNode, segNpoints[i]);			
		scaled_points = seg_points.map(function(sp) {
  							return VS[currentControl][1] + (sp.y -gap)*(VS[currentControl][0] - VS[currentControl][1])/H;
						});						
		path_points = path_points.concat(scaled_points);			
		i++;
		currentNode = currentNode.next;
	}
	return path_points;
}
