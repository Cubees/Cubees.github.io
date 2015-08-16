function createLathe(startNode,endNode,scene,num_of_steps) {
	var controlLines=[];
	var segments=[];
	var currentNode=startNode;
	if(currentNode.segmentType=="curved") {
		currentNode.ctrl1.marker.position.z = 0;
		currentNode.ctrl2.marker.position.z = 0;
		currentNode.segment = BABYLON.Curve3.CreateCubicBezier(currentNode.marker.position, currentNode.ctrl1.marker.position, currentNode.ctrl2.marker.position, currentNode.next.marker.position, num_of_steps);
		segments.push(currentNode.segment);
		controlLines.push([currentNode.marker.position,currentNode.ctrl1.marker.position]);
		if(currentNode.next !=null) {
			controlLines.push([currentNode.next.marker.position,currentNode.ctrl2.marker.position]);
		}
	}
	else {		
		currentNode.segment = BABYLON.Curve3.CreateCubicBezier(currentNode.marker.position, currentNode.marker.position, currentNode.next.marker.position, currentNode.next.marker.position, num_of_steps);
		currentNode.ctrl1.marker.position.z = 10;
		currentNode.ctrl2.marker.position.z = 10;
		segments.push(currentNode.segment);
	}
	currentNode=currentNode.next;
	while(currentNode !== endNode) {
		if(currentNode.segmentType=="curved") {
			currentNode.ctrl1.marker.position.z = 0;
			currentNode.ctrl2.marker.position.z = 0;
			currentNode.segment = BABYLON.Curve3.CreateCubicBezier(currentNode.marker.position, currentNode.ctrl1.marker.position, currentNode.ctrl2.marker.position, currentNode.next.marker.position, num_of_steps);
			//Current version of babylon.js need to set continue segments to zero origin
			segments.push(BABYLON.Curve3.CreateCubicBezier(currentNode.marker.position.subtract(currentNode.marker.position), currentNode.ctrl1.marker.position.subtract(currentNode.marker.position), currentNode.ctrl2.marker.position.subtract(currentNode.marker.position), currentNode.next.marker.position.subtract(currentNode.marker.position), num_of_steps));
			controlLines.push([currentNode.marker.position,currentNode.ctrl1.marker.position]);
			if(currentNode.next !=null) {
				controlLines.push([currentNode.next.marker.position,currentNode.ctrl2.marker.position]);
			}
		}
		else {
			currentNode.segment = BABYLON.Curve3.CreateCubicBezier(currentNode.marker.position, currentNode.marker.position, currentNode.next.marker.position, currentNode.next.marker.position, num_of_steps);
			segments.push(BABYLON.Curve3.CreateCubicBezier(currentNode.marker.position.subtract(currentNode.marker.position), currentNode.marker.position.subtract(currentNode.marker.position), currentNode.next.marker.position.subtract(currentNode.marker.position), currentNode.next.marker.position.subtract(currentNode.marker.position), num_of_steps));
			currentNode.ctrl1.marker.position.z = 10;
			currentNode.ctrl2.marker.position.z = 10;
		}
		currentNode=currentNode.next;		
	}

	var chain=segments[0];
	
	for(var i=1; i<segments.length;i++) {
		chain=chain.continue(segments[i]);		
	}
	
	return {blade:chain.getPoints(),controls:controlLines};
}

function proximity(point, startNode, endNode) {
	var currentNode=startNode;	
	var path,last;
	var found=false;
	var miny, maxy;
	var i, x;
	while(currentNode !== endNode && !found) {
		path = currentNode.segment.getPoints();
		miny = path[0].y;
		maxy = miny;
		for(var i=0; i<path.length; i++) {
			if(path[i].y<miny) {miny = path[i].y};
			if(path[i].y>maxy) {maxy = path[i].y};
		}		
		
		if(miny - 1<=point.y && point.y<=maxy + 1) {
			i=0;
			while(i<path.length-1 && !found) {				
				if(Math.min(path[i].y,path[i+1].y) - 1 <= point.y && point.y<=Math.max(path[i].y,path[i+1].y) + 1) {
					if(Math.abs(path[i+1].y - path[i].y)<1) {						
						found = Math.abs(point.x - path[i].x)<1 ||  Math.abs(point.x - path[i+1].x)<1;
					}
					else {
						x = path[i+1].x+(point.y - path[i+1].y) * (path[i].x - path[i+1].x)/(path[i].y - path[i+1].y);						
						found = Math.abs(x - point.x)<1; 
					}
				}
				i++
			}
			
		}
		currentNode = currentNode.next;
	}	
	
	if (found) {
		return currentNode.prev;
	}
	
	return currentNode;	
}

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

function updateTurned(product, path, num_of_turns) {
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
