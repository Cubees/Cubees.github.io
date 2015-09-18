function Bnode(name,x,y, size, holder) { //x,y coordinates of centre	
	this.name=name;
	this.x=x;
	this.y=y;
	
	this.ctrl1=null;
	this.ctrl2=null;
	
	this.next=null;
	this.prev=null;
	
	this.size = size;
	this.marker=new square(x, y, this, holder);
	this.segmentType="straight";
	
	//methods
	this.Bupdate = Bupdate;
}


function Bcontrol(name,x,y,size,holder) { //x,y coordinates of centre	
	this.name=name;
	this.x=x;
	this.y=y;

	this.size = size;
	this.marker=new circle(x, y, this, holder);
	//this.marker.CType="ctrl";
	
	//methods
	this.Bupdate = Bupdate;
	
}

function Bupdate() {
	this.x = parseInt(this.marker.mk.style.left);
	this.x += this.size/2;
	this.y = parseInt(this.marker.mk.style.top);
	this.y += this.size/2;
}

function square(x, y, node, holder) {	
	var w = node.size;
	this.mk = document.createElement('div');
	this.mk.node = node;
	this.mk.type = "B2D";
	this.mk.style.position="absolute";
	this.mk.style.draggable = "true";
	this.mk.style.width = w +"px";
	this.mk.style.height = w + "px";
	this.mk.style.backgroundColor = "#C0C0C0";
	this.mk.style.top = (y - w/2) +"px";
	this.mk.style.left = (x - w/2) +"px";
	this.mk.addEventListener('mousedown', function(e) {startMkrDrag(e, this)}, false);
	this.mk.addEventListener('mouseup', function(e) {enddbDrag(e)}, false);
	holder.appendChild(this.mk);
}

function circle(x, y, node, holder) {		
	var w = node.size;
	this.mk = document.createElement('div');
	this.mk.node = node;
	this.mk.type = "B2DC";
	this.mk.style.borderRadius = w*0.5 +"px";
	this.mk.style.position="absolute";
	this.mk.style.draggable = "true";
	this.mk.style.visibility = "hidden";
	this.mk.style.width = w +"px";
	this.mk.style.height = w + "px";
	this.mk.style.backgroundColor = "#404040";
	this.mk.style.top = (y - w/2) +"px";
	this.mk.style.left = (x - w/2) +"px";
	this.mk.addEventListener('mousedown', function(e) {startMkrDrag(e, this)}, false);
	this.mk.addEventListener('mouseup', function(e) {enddbDrag(e)}, false);
	holder.appendChild(this.mk);
}


function createPath(startNode, canvas) {
	var currentNode=startNode;
	while(currentNode.next !== null) {		
		if(currentNode.segmentType=="curved") {
			drawCubicBezier(currentNode, canvas.ctx);
		}
		else {
			drawLine(currentNode, canvas.ctx);
		}
		currentNode=currentNode.next;		
	}

}

function initCanvas(canvas, gap, W, H){
	canvas.width = screen.availWidth;
	canvas.ctx.strokeStyle ="#000000";
	canvas.ctx.strokeRect(W*0.1,gap,W*0.8,H);
}

function drawLine(N, ctx) {	
	ctx.beginPath();	
	ctx.strokeStyle ="#FFFFFF";
	N.ctrl1.marker.mk.style.visibility = "hidden";
	N.ctrl2.marker.mk.style.visibility = "hidden";	
	ctx.moveTo(N.x, N.y);
	ctx.lineTo(N.next.x, N.next.y);
	ctx.stroke();
	ctx.closePath();
}

function drawCubicBezier(N, ctx) {
	ctx.beginPath();	
	ctx.strokeStyle ="#FFFFFF";	
	ctx.moveTo(N.x, N.y);
	ctx.lineTo(N.ctrl1.x, N.ctrl1.y);
	ctx.moveTo(N.next.x, N.next.y);
	ctx.lineTo(N.ctrl2.x, N.ctrl2.y);
	ctx.moveTo(N.x, N.y);
	N.ctrl1.marker.mk.style.visibility = "inherit";
	N.ctrl2.marker.mk.style.visibility = "inherit";
	ctx.bezierCurveTo(N.ctrl1.x, N.ctrl1.y, N.ctrl2.x, N.ctrl2.y, N.next.x, N.next.y);
	
	ctx.stroke();
	ctx.closePath();
}

function BParamPath(currentControl) {
	var currentNode=controlNodes[currentControl];
	var pathPoints = [];
	var point; 
	while(currentNode.next !== null) {
		point = getControlPoints(currentNode, num_controlPoints);
		pathPoints.push(point.y);
	}
	// transform
}

function Bproximity(point, currentControl) {	
	var currentNode=controlNodes[currentControl];	
	var path,last;
	var found=false;
	var miny, maxy;
	var i, x;
	while(currentNode.next !== null && !found) {
		path = getControlPoints(currentNode, num_controlPoints);	
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
						found = (Math.min(path[i].x,path[i+1].x) <= point.x && point.x<=Math.max(path[i].x,path[i+1].x));					
					}
					else {						
						x = path[i+1].x+(point.y - path[i+1].y) * (path[i].x - path[i+1].x)/(path[i].y - path[i+1].y);											
						found = Math.abs(x - point.x)<10; 
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

function getControlPoints(node, npoints) {
	var path_points = [];
	var p;
	var t;
	if(node.segmentType == "straight") {
		for(var i=0; i<=npoints; i++) {
			t = i/npoints;
			p = new point();
			p.x = node.x + (node.next.x - node.x)*t;
			p.y = node.y + (node.next.y - node.y)*t;
			path_points.push(p);
			node.next;
		}
	}
	else {
		for(var i=0; i<=npoints; i++) {
			t = i/npoints;
			p = new point();
			p.x = (1-t)*(1-t)*(1-t)*parseInt(node.x) + 3*(1-t)*(1-t)*t*parseInt(node.ctrl1.x) + 3*(1-t)*t*t*parseInt(node.ctrl2.x) + t*t*t*parseInt(node.next.x);
			p.y = (1-t)*(1-t)*(1-t)*parseInt(node.y) + 3*(1-t)*(1-t)*t*parseInt(node.ctrl1.y) + 3*(1-t)*t*t*parseInt(node.ctrl2.y) + t*t*t*parseInt(node.next.y);
			path_points.push(p);
			node.next;
		}
	}
	
	return path_points;
	
	function point() {
		this.x;
		this.y;
	}
}

	
