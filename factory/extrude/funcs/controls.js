/*-------------CONTROL STUDIO VARIABLES---------------*/
function setControls(W, H, gap) {
	var num_of_nodes = 3;
	var node_index = 0;
	var num_of_steps = 25;
	var num_of_turns = 25;

/*-------------MENU ELEMENTS---------------*/	
	//Get Menu Elements 
	var Bsq = document.getElementById("Bsq");
	
	var BAdd=document.getElementById("B_add");
	var BDelete=document.getElementById("B_delete");
	var BStraight=document.getElementById("B_straight");
	var BCurved=document.getElementById("B_curved");
	var BZoom=document.getElementById("B_zoom");
	
	var Bscalex = document.getElementById("B_scalex");
	var Bscaley = document.getElementById("B_scaley");
	var Brotate = document.getElementById("B_rotate");
	var Btilt = document.getElementById("B_tilt");
	var Btwist = document.getElementById("B_twist");
	var Bmovex = document.getElementById("B_movex");
	var Bmovey = document.getElementById("B_moveY");
	var Bpzoom = document.getElementById("B_pzoom");
	
	var Bvar = [Bscalex, Bscaley, Brotate, Btilt, Btwist, Bmovex, Bmovey];
	
	zoomMarker = document.getElementById("zoomMarker");
	zoomMarker.style.left = (120 - size/2) + "px";
	zoomMarker.style.top = (100 - size/2) + "px";
	zoomMarker.style.width = size + "px";
	zoomMarker.style.height = size + "px";
	zoomMarker.type = "ZM";
	
	zoomCentre = document.getElementById("zoomCentre");
	
	//Set readable styles for Elements
	BStraight.style.color="#888888";
	BCurved.style.color="#000000";
	BDelete.style.color="#888888";
	BZoom.style.color="#000000";
	
	Bscalex.style.color="#888888";
	Bscaley.style.color="#000000";
	Brotate.style.color="#000000";
	Btilt.style.color="#000000";
	Btwist.style.color="#000000";
	Bmovex.style.color="#000000";
	Bmovey.style.color="#000000";
	Bpzoom.style.color="#000000";
	
/*---------------MENU EVENTS-------------------------------*/
 
	BAdd.addEventListener("click", BonAdd, false);
	BDelete.addEventListener("click", BonDelete, false);
	BStraight.addEventListener("click", BonStraight, false);
	BCurved.addEventListener("click", BonCurved, false);
	BZoom.addEventListener("click", BonZoom, false);
	
	
	Bscalex.addEventListener("click", function() {setControlType(0, Bvar, BHold);}, false);
	Bscaley.addEventListener("click", function() {setControlType(1, Bvar, BHold);}, false);
	Brotate.addEventListener("click", function() {setControlType(2, Bvar, BHold);}, false);
	Btilt.addEventListener("click", function() {setControlType(3, Bvar, BHold);}, false);
	Btwist.addEventListener("click", function() {setControlType(4, Bvar, BHold);}, false);
	Bmovex.addEventListener("click", function() {setControlType(5, Bvar, BHold);}, false);
	Bmovey.addEventListener("click", function() {setControlType(6, Bvar, BHold);}, false);
	Bpzoom.addEventListener("click", BonZoom, false);
	
	zoomCentre.addEventListener('mousedown', function() { zoomMarker.style.left = (120 - size/2) + "px";
														  zoomMarker.style.top = (100 - size/2) + "px";
														  }, false);
	
	zoomMarker.addEventListener('mousedown', function(e) {startZoomDrag(e, this)}, false);
	zoomMarker.addEventListener('mouseup', function(e) {enddbDrag(e)}, false);
	
/*---------------MENU ACTIONS-------------------------------*/	

	function BonAdd () {
		Bsq.style.visibility="hidden"; 
		controlSeg.style.visibility="hidden"		
		var xa, xb, ya, yb;
		num_controlNodes[currentControl]++;
		BDelete.style.color = "#000000";
		var newNode=new Bnode("Bnode"+(++Bnode_index), mousePos.x, mousePos.y, size, BHold[currentControl]);
		xa=BfoundNode.x;
		ya=BfoundNode.y;
		xb=BfoundNode.next.x;
		yb=BfoundNode.next.y;
		newNode.next = BfoundNode.next;
		BfoundNode.next.prev = newNode;
		BfoundNode.next = newNode;
		newNode.prev = BfoundNode;
		var dx = (xb - xa)/8;
		var dy = (yb - ya)/8;
		newNode.ctrl1 = new Bcontrol("Bctrl1"+Bnode_index,newNode.x + dx,newNode.y + dy,size, BHold[currentControl]);
		newNode.ctrl2 = BfoundNode.ctrl2;
		BfoundNode.ctrl2 = new Bcontrol("Bctrl2"+Bnode_index,newNode.x - dx,newNode.y - dy,size, BHold[currentControl]);
		initCanvas(controlCanvas, gap, W, H);
		createPath(controlNodes[currentControl], controlCanvas);		
	}
	
	function BonDelete () {
		if(BDelete.style.color=="rgb(136, 136, 136)") {
			return
		}	
		Bsq.style.visibility="hidden"; 
		controlSeg.style.visibility="hidden"		
		var xa, xb, ya, yb;
		var startNode=controlNodes[currentControl];
		num_controlNodes[currentControl]--;
		if(num_controlNodes[currentControl] == 2) {
			BDelete.style.color = "#888888";
		}
		if(BfoundNode ==startNode) {
			BfoundNode=BfoundNode.next;
		}
		BfoundNode.marker.mk.parentNode.removeChild(BfoundNode.marker.mk);
		delete BfoundNode.marker;
		BfoundNode.ctrl1.marker.mk.parentNode.removeChild(BfoundNode.ctrl1.marker.mk);
		delete BfoundNode.ctrl1.marker;
		delete BfoundNode.ctrl1;
		BfoundNode.prev.ctrl2.marker.mk.parentNode.removeChild(BfoundNode.prev.ctrl2.marker.mk);
		delete BfoundNode.prev.ctrl2.marker;
		delete BfoundNode.prev.ctrl2;
		BfoundNode.prev.ctrl2 = BfoundNode.ctrl2;
		BfoundNode.next.prev = BfoundNode.prev;
		BfoundNode.prev.next = BfoundNode.next;
		delete BfoundNode;
		initCanvas(controlCanvas, gap, W, H);
		createPath(controlNodes[currentControl], controlCanvas);
	}	
	
	
	function BonStraight () {		
		if(BStraight.style.color=="rgb(136, 136, 136)") {
			return
		}		
		Bsq.style.visibility="hidden"; 
		controlSeg.style.visibility="hidden"	
		BStraight.style.color="#888888";
		BCurved.style.color="#000000";
		BfoundNode.segmentType = "straight";
		initCanvas(controlCanvas, gap, W, H);
		createPath(controlNodes[currentControl], controlCanvas);
	}
	
	function BonCurved () {		
		if(BCurved.style.color=="rgb(136, 136, 136)") {
			return
		}		
		Bsq.style.visibility="hidden"; 
		controlSeg.style.visibility="hidden"	
		BCurved.style.color="#888888";
		BStraight.style.color="#000000";
		BfoundNode.segmentType = "curved";
		initCanvas(controlCanvas, gap, W, H);
		createPath(controlNodes[currentControl], controlCanvas);
	}
	
	function BonZoom () {
		zoomDB.style.visibility = "visible";
	}
	
	
/*-------------CONTROL STUDIO ---------------*/
	
	var controlCanvas = document.getElementById("controlCanvas");
	controlCanvas.ctx = controlCanvas.getContext("2d");
	
	controlCanvas.width = screen.availWidth;
	controlCanvas.height = controlCanvas.width;
	controlCanvas.style.top ="0px";
	controlCanvas.style.left ="0px";
	controlCanvas.style.backgroundColor = "#808080";
	
	CHT = Math.floor(window.innerHeight*0.67);
	document.getElementById("canvasHolder").style.top = CHT +"px";	
	
	controlCanvas.addEventListener('mouseup', function(e) {onCanvasUp(e)}, false);
	controlCanvas.addEventListener('mousedown', function() {Bsq.style.visibility="hidden"; controlSeg.style.visibility="hidden"}, false);
	
	var controlLength = document.getElementById("controlLength");
	var controlHeight = document.getElementById("controlHeight");
	var controlMax = document.getElementById("controlMax");
	var controlMid = document.getElementById("controlMid");
	var controlMin = document.getElementById("controlMin");
	var controlVar = document.getElementById("controlVar");
	
	var Cwidth = 13;
	
	//controlHeight.style.height = size + "px";
	
	controlLength.style.width = (Cwidth*5) +"px";
	controlHeight.style.width = (Cwidth*5) +"px";
	controlMax.style.width = Cwidth*1.2 +"px";
	controlMid.style.width = Cwidth*1.2 +"px";
	controlMin.style.width = Cwidth*1.2 +"px";	
	controlVar.style.width = Cwidth*8 +"px";
	
	controlLength.style.top =(gap - 2*size) +"px";
	controlHeight.style.top =(gap - size/2) +"px";
	controlMax.style.top = (gap - size/2) +"px";
	controlMid.style.top = (H/2 + gap - size/2) +"px";
	controlMin.style.top = (H + gap - size/2) +"px";
	
	controlLength.style.left =(W*0.9 - parseInt(controlLength.style.width)/2) +"px";
	controlHeight.style.left =(W*0.1 - Cwidth*8) +"px";
	controlMax.style.left = (W*0.1 - Cwidth*2) +"px";
	controlMid.style.left = (W*0.1 - Cwidth*2) +"px";
	controlMin.style.left = (W*0.1 - Cwidth*2) +"px";
	controlVar.style.left = (W*0.5 - Cwidth*4) +"px"; 
	
	controlLength.innerHTML = W*0.9 +" units";
	controlVar.innerHTML = "Scale X";

	scxH = document.getElementById("sizexHolder");
	scyH = document.getElementById("sizeyHolder");
	rotH = document.getElementById("rotateHolder");
	tltH= document.getElementById("tiltHolder");
	twtH = document.getElementById("twistHolder");
	mvxH = document.getElementById("movexHolder");
	mvyH = document.getElementById("moveyHolder");
	
	var BHold = [scxH, scyH, rotH, tltH, twtH, mvxH, mvyH];
	
	for(var i=0; i<BHold.length; i++) {
		BHold[i].addEventListener('mouseup', function(e) {onCanvasUp(e)}, false);
		BHold[i].addEventListener('mousedown', function() {Bsq.style.visibility="hidden"; controlSeg.style.visibility="hidden"}, false);
	}

	var paramSeg = document.getElementById("paramSeg");
	paramSeg.style.left = (W*0.9 + size*4.5)+"px";
	
	var params =[];
	
	var vert = [0, 0, 0.5, 0.5, 0.5, 0.5, 0.5]
	
	for(var i=0; i<7; i++) {	
		params[i] = new Bnode("sx"+i+1, W*0.1, gap + vert[i]*H, size, BHold[i]);
	
		params[i].ctrl1 = new Bcontrol("csx"+i+1, W*0.1 + 30, gap + vert[i]*H + 30, size, BHold[i]);
		params[i].ctrl2 = new Bcontrol("csx"+i+2, W*0.9 - 30, gap + vert[i]*H + 30, size, BHold[i]);
	
		params[i].next = new Bnode("ex"+i+2, W*0.9, gap + vert[i]*H, size, BHold[i]);
	
		params[i].next.prev = params[i];
	}
	
	scxH.style.visibility = "visible";

	nowNode = params[0].next;
	
	extrudeLength = W*0.8;
	
	zoomScaleX = 10;
	zoomScaleY = 10;
	VSMin = 0;
	VSMax = 1;
	
	//controlSeg_title.innerHTML = "&nbsp;&nbsp;Scale X";
	controlSeg_title.innerHTML = "&nbsp;&nbsp;Position Y";
	
	controlMax.innerHTML = VSMax;
	controlMid.innerHTML = (VSMax + VSMin)/2;
	controlMin.innerHTML = VSMin;
	controlHeight.innerHTML = VSMax +" units";
	
	dlgbox = params[0].next.marker.mk;
	dlgbox.style.border = "solid 1px black";
	
	initCanvas(controlCanvas, gap, W, H);
	createPath(params[0], controlCanvas);
	
	return params;

}

function doControlUpdates(startNode) {
	var currentNode = startNode;
	while(currentNode.next !== null) {
		currentNode = currentNode.next;
	}
	var cw = parseInt(controlLength.style.width)/2
	controlLength.style.left =(currentNode.x - cw) +"px";
	var inL = Math.floor(currentNode.x*10)/10;
	controlLength.innerHTML = inL +" units";
	controlHeight.style.top =(nowNode.y - size/2) +"px";
	var inH = VSMax + (nowNode.y -gap)*(VSMin - VSMax)/H;
	inH = Math.floor(inH *100)/100;
	if(VSMax == 180) {
		controlHeight.innerHTML = inH + " degs";
	}
	else {
		controlHeight.innerHTML = inH + " units";
	}
	
}

function doSetAllLengths() {
	for (var i=0; i<7; i++) {
		var currentNode = controlNodes[i];
		while(currentNode.next !== null) {
			currentNode = currentNode.next;
		}
		currentNode.x = W*0.1 + extrudeLength;
		currentNode.marker.mk.style.left = (currentNode.x - size/2) + "px";
		doControlUpdates(controlNodes[currentControl]);
	}
}

function onCanvasUp (e) {	
	mousePos = getPosition(e); 
	mousePos.y -= CHT;
	downMouse = false; 
	BfoundNode = Bproximity(mousePos, currentControl);		
	if(BfoundNode) {		
		Bsq.style.top =(mousePos.y - size/2) +"px";
		Bsq.style.left =(mousePos.x - size/2) +"px";
		Bsq.style.visibility = "visible";
		controlSeg.style.visibility = "visible";
	}
}

function setControlType(N, Bvar, BHold) {
	Bvar[currentControl].style.color = "#000000";
	BHold[currentControl].style.visibility = "hidden";
	currentControl = N;
	Bvar[currentControl].style.color = "#888888";
	BHold[currentControl].style.visibility = "visible";
	var currentNode = controlNodes[currentControl];
	while(currentNode.next !== null) {
		currentNode = currentNode.next;
	}
	nowNode = currentNode;
	
	switch(N) {
		case 0: //Scale X
			zoomScaleX = 10;
			zoomScaleY = 40;
			VSMin = 0;
			VSMax = 1;
			Vunit = "units";
			controlSeg_title.innerHTML = "&nbsp;&nbsp;Scale X";
			Vvar = "Scale X";
		break	
		case 1: //Scale Y
			zoomScaleX = 10;
			zoomScaleY = 40;
			VSMin = 0;
			VSMax = 1;
			Vunit = "units";
			controlSeg_title.innerHTML = "&nbsp;&nbsp;Scale Y";
			Vvar = "Scale Y";
		break	
		case 2: //Rotate Z
			zoomScaleX = 10;
			zoomScaleY = 36;
			VSMin = -180;
			VSMax = 180;
			Vunit = "degs";
			controlSeg_title.innerHTML = "&nbsp;&nbsp;Rotate Z";
			Vvar = "Rotate";
		break	
		case 3: //Rotate X
			zoomScale = 10;
			zoomScale = 36;
			VSMin = -180;
			VSMax = 180;
			Vunit = "degs";
			controlSeg_title.innerHTML = "&nbsp;&nbsp;Rotate X";
			Vvar = "Tilt";
		break		
		case 4: //Rotate y
			zoomScaleX = 10;
			zoomScaleY = 36;
			VSMin = -180;
			VSMax = 180;
			Vunit = "degs";
			controlSeg_title.innerHTML = "&nbsp;&nbsp;Rotate Y";
			Vvar = "Twist";
		break			
		case 5: //Position X
			zoomScaleX = 10;
			zoomScaleY = 10;
			VSMin = -200;
			VSMax = 200;
			Vunit = "units";
			controlSeg_title.innerHTML = "&nbsp;&nbsp;Position X";
			Vvar = "Move X";
		break			
		case 6: //Position Y
			zoomScaleX = 10;
			zoomScaleY = 10;
			VSMin = -200;
			VSMax = 200;
			Vunit = "units";
			controlSeg_title.innerHTML = "&nbsp;&nbsp;Position Y";
			Vvar = "Move Y";
		break	
	}
	
	controlMax.innerHTML = VSMax;
	controlMid.innerHTML = (VSMax + VSMin)/2;
	controlMin.innerHTML = VSMin;
	controlHeight.innerHTML = VSMax + Vunit;
	
	controlVar.innerHTML = Vvar;
	
	dlgbox = currentNode.marker.mk;
	dlgbox.style.border = "solid 1px black";
	
	zoomMarker.style.left = (120 - size/2) + "px";
	zoomMarker.style.top = (100 - size/2) + "px";
	
	initCanvas(controlCanvas, gap, W, H);
	createPath(controlNodes[currentControl], controlCanvas);
	doControlUpdates(controlNodes[currentControl]);	
}
