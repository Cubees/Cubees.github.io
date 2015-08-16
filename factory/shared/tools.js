function createTool(startNode,endNode,scene,num_of_steps) {
	var controlLines=[];
	var segments=[];
	var currentNode=startNode;
	var atStart=true;
	while(currentNode !== endNode || atStart) {	
		atStart=false;	
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
			segments.push(currentNode.segment);
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
	var atStart=true	
	var path,last;
	var found=false;
	var miny, maxy;
	var i, x;
	while((currentNode !== endNode && !found) || atStart) {
		atStart = false;
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
	
	return null;	
}

function getPosition(e) {
    e = e || window.event;
    var cursor = {x:0, y:0};
    if (e.pageX || e.pageY) {
        cursor.x = e.pageX;
        cursor.y = e.pageY;
    } 
    else {
        var de = document.documentElement;
        var b = document.body;
        cursor.x = e.clientX + 
            (de.scrollLeft || b.scrollLeft) - (de.clientLeft || 0);
        cursor.y = e.clientY + 
            (de.scrollTop || b.scrollTop) - (de.clientTop || 0);
    }
    return cursor;
}
