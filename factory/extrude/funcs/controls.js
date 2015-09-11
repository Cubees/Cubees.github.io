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
	
	var Bscalex = document.getElementById("B_scalex");
	var Bscaley = document.getElementById("B_scaley");
	var Brotate = document.getElementById("B_rotate");
	var Btilt = document.getElementById("B_tilt");
	var Btwist = document.getElementById("B_twist");
	var Bmovex = document.getElementById("B_movex");
	var Bmovey = document.getElementById("B_moveY");
	var BSlock = document.getElementById("B_Slock");
	var BMlock = document.getElementById("B_Mlock");
	
	var inputBD = document.getElementById("inputDB");
	
	var Bvar = [Bscalex, Bscaley, Brotate, Btilt, Btwist, Bmovex, Bmovey];
	
	//Set readable styles for Elements
	BStraight.style.color="#888888";
	BCurved.style.color="#000000";
	BDelete.style.color="#888888";
	
	Bscalex.style.color="#888888";
	Bscaley.style.color="#000000";
	Brotate.style.color="#000000";
	Btilt.style.color="#000000";
	Btwist.style.color="#000000";
	Bmovex.style.color="#000000";
	Bmovey.style.color="#000000";
	
/*---------------MENU EVENTS-------------------------------*/
 
	BAdd.addEventListener("click", BonAdd, false);
	BDelete.addEventListener("click", BonDelete, false);
	BStraight.addEventListener("click", BonStraight, false);
	BCurved.addEventListener("click", BonCurved, false);
	
	
	Bscalex.addEventListener("click", function() {setControlType(0, Bvar, BHold);}, false);
	Bscaley.addEventListener("click", function() {setControlType(1, Bvar, BHold);}, false);
	Brotate.addEventListener("click", function() {setControlType(2, Bvar, BHold);}, false);
	Btilt.addEventListener("click", function() {setControlType(3, Bvar, BHold);}, false);
	Btwist.addEventListener("click", function() {setControlType(4, Bvar, BHold);}, false);
	Bmovex.addEventListener("click", function() {setControlType(5, Bvar, BHold);}, false);
	Bmovey.addEventListener("click", function() {setControlType(6, Bvar, BHold);}, false);
	BSlock.addEventListener("click", BonSlock, false);
	BMlock.addEventListener("click", BonMlock, false);
	
	document.getElementById("inputParam").addEventListener('focus', reset, false);
	document.getElementById("inputParam").addEventListener('change', updateValues, false);

	
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
		extruded.dispose();
		extruded=createExtruded("BWXEextruded", extrudeTool.blade, productStudio.scene, BABYLON.Mesh.DOUBLESIDE);		
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
		nowNode = BfoundNode.prev;
		nowNode.marker.mk.style.border ="solid 1px #000000";
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
		extruded.dispose();
		extruded=createExtruded("BWXEextruded", extrudeTool.blade, productStudio.scene, BABYLON.Mesh.DOUBLESIDE);
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
		extruded.dispose();
		extruded=createExtruded("BWXEextruded", extrudeTool.blade, productStudio.scene, BABYLON.Mesh.DOUBLESIDE);
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
		extruded.dispose();
		extruded=createExtruded("BWXEextruded", extrudeTool.blade, productStudio.scene, BABYLON.Mesh.DOUBLESIDE);
	}
	
	function BonSlock() {
		scaleLock = !scaleLock;
		if(scaleLock) {
			BSlock.innerHTML = "&nbsp;Unlock Scale";
			if(Bscaley.style.color=="rgb(136, 136, 136)") {
				setControlType(0, Bvar, BHold);
			}
			else {
				Bscaley.style.color = "#888888";
			}
		}
		else {
			BSlock.innerHTML = "&nbsp;Lock Scale";
			Bscaley.style.color = "#000000";
		}
		extruded.dispose();
		extruded=createExtruded("BWXEextruded", extrudeTool.blade, productStudio.scene, BABYLON.Mesh.DOUBLESIDE);
	}
	
	function BonMlock() {
		moveLock = !moveLock;
		if(moveLock) {
			BMlock.innerHTML = "&nbsp;Unlock Move";
			if(Bmovey.style.color=="rgb(136, 136, 136)") {
				setControlType(5, Bvar, BHold);
			}
			else {
				Bmovey.style.color = "#888888";
			}
		}
		else {
			BMlock.innerHTML = "&nbsp;Lock Move";
			Bmovey.style.color = "#000000";
		}
		extruded.dispose();
		extruded=createExtruded("BWXEextruded", extrudeTool.blade, productStudio.scene, BABYLON.Mesh.DOUBLESIDE);
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
	
	controlLength.addEventListener('click', function() {setValue(this)}, false);
	controlHeight.addEventListener('click', function() {setValue(this)}, false);
	controlMax.addEventListener('click', function() {setValue(this)}, false);
	controlMin.addEventListener('click', function() {setValue(this)}, false);
	
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
	
	VSMin = 0;
	VSMax = 1;
	
	controlSeg_title.innerHTML = "&nbsp;&nbsp;Scale X";
	
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
/*	var currentNode = startNode;
	while(currentNode.next !== null) {
		currentNode = currentNode.next;
	} */
	var cw = parseInt(controlLength.style.width)/2
	controlLength.style.left =(nowNode.x - cw) +"px";
	var inL = Math.floor(nowNode.x*10)/10;
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

function doSetAllLengths(newLength) {
	for (var i=0; i<7; i++) {
		var currentNode = controlNodes[i];
		while(currentNode.next !== null) {
			currentNode = currentNode.next;
			currentNode.x *= newLength/extrudeLength;
			currentNode.marker.mk.style.left = (currentNode.x - size/2) + "px";
		}
		currentNode.x = newLength;
		currentNode.marker.mk.style.left = (currentNode.x - size/2) + "px";
		doControlUpdates(controlNodes[currentControl]);
	}
	extrudeLength = newLength;
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
		document.getElementById("B_curved").style.color="#000000";
		document.getElementById("B_straight").style.color="#000000";
		if(BfoundNode.segmentType == "straight") {
			document.getElementById("B_straight").style.color="#888888";
		}
		if(BfoundNode.segmentType == "curved") {
			document.getElementById("B_curved").style.color="#888888";
		}
		controlSeg.style.visibility = "visible";
	}
}

function setControlType(N, Bvar, BHold) {
	document.getElementById("Bsq").style.visibility = "hidden";
	Bvar[currentControl].style.color = "#000000";
	if((currentControl == 1 && scaleLock) || (currentControl == 6 && moveLock)) {
		Bvar[currentControl].style.color = "#888888";
	}
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
			inputDB.style.visibility = 'hidden';
			VSMin = VS[0][0];
			VSMax = VS[0][1];
			Vunit = "units";
			controlSeg_title.innerHTML = "&nbsp;&nbsp;Scale X";
			Vvar = "Scale X";
		break	
		case 1: //Scale Y
			inputDB.style.visibility = 'hidden';
			VSMin = VS[1][0];
			VSMax = VS[1][1];
			Vunit = "units";
			controlSeg_title.innerHTML = "&nbsp;&nbsp;Scale Y";
			Vvar = "Scale Y";
		break	
		case 2: //Rotate Z
			VSMin = VS[2][0];
			VSMax = VS[2][1];
			Vunit = "degs";
			controlSeg_title.innerHTML = "&nbsp;&nbsp;Rotate Z";
			Vvar = "Rotate";
		break	
		case 3: //Rotate X
			VSMin = VS[3][0];
			VSMax = VS[3][1];
			Vunit = "degs";
			controlSeg_title.innerHTML = "&nbsp;&nbsp;Rotate X";
			Vvar = "Tilt";
		break		
		case 4: //Rotate y
			VSMin = VS[4][0];
			VSMax = VS[4][1];
			Vunit = "degs";
			controlSeg_title.innerHTML = "&nbsp;&nbsp;Rotate Y";
			Vvar = "Twist";
		break			
		case 5: //Position X
			VSMin = VS[5][0];
			VSMax = VS[5][1];
			Vunit = "units";
			controlSeg_title.innerHTML = "&nbsp;&nbsp;Position X";
			Vvar = "Move X";
		break			
		case 6: //Position Y
			VSMin = VS[6][0];
			VSMax = VS[6][1];
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
	
	initCanvas(controlCanvas, gap, W, H);
	createPath(controlNodes[currentControl], controlCanvas);
	doControlUpdates(controlNodes[currentControl]);	
}

function setValue(ctrl) {
	currentValueId = ctrl.id;	
	var txt = 'Size';
	var unitxt = 'Units'
	if(2<=currentControl && currentControl<=4) {
		txt = 'Angle';
		unitxt = 'Degrees';
	}
	document.getElementById("inputParamLabel").innerHTML=txt;
	document.getElementById("inputParamUnit").innerHTML=unitxt;
	if(ctrl.id == "controlLength") {
		if(nowNode.name.substr(0,2) == "ex") {
			document.getElementById("inputParamLabel").innerHTML="Length";
		}
		else {
			document.getElementById("inputParamLabel").innerHTML="Distance";
		}
		document.getElementById("inputParamUnit").innerHTML="Units";
	}
	else if(ctrl.id == "controlMax") {
		document.getElementById("inputParamLabel").innerHTML="Max "+txt;
		document.getElementById("inputParamUnit").innerHTML=unitxt;
	}
	else if(ctrl.id == "controlMax") {
		document.getElementById("inputParamLabel").innerHTML="Min "+txt;
		document.getElementById("inputParamUnit").innerHTML=unitxt;
	}
	document.getElementById("inputParam").value = parseFloat(ctrl.innerHTML);
	inputDB.style.visibility = 'visible';
}

function updateValues() {	
	switch(currentValueId) {
		case "controlLength":
			nowNode.x = parseFloat(document.getElementById("inputParam").value);
			if(nowNode.name.substr(0,2) == "ex") {
				doSetAllLengths(nowNode.x);
			}
		break
		case "controlHeight":
			nowNode.y = parseFloat(document.getElementById("inputParam").value);
		break
		case "controlMax":
			controlMax.innerHTML = parseFloat(document.getElementById("inputParam").value);
			VS[currentControl][1] = parseFloat(document.getElementById("inputParam").value);
			VSMax = VS[currentControl][1];
			VSMin = VS[currentControl][0]; 
			controlMid.innerHTML = (VSMax + VSMin)/2;
		break
		case "controlMin":
			controlMin.innerHTML = parseFloat(document.getElementById("inputParam").value);
			VS[currentControl][0] = parseFloat(document.getElementById("inputParam").value);
			VSMax = VS[currentControl][1];
			VSMin = VS[currentControl][0]; 
			controlMid.innerHTML = (VSMax + VSMin)/2;
		break;
	}
	initCanvas(controlCanvas, gap, W, H);
	createPath(controlNodes[currentControl], controlCanvas);
	extruded.dispose();
	extruded=createExtruded("BWXEextruded", extrudeTool.blade, productStudio.scene, BABYLON.Mesh.DOUBLESIDE);	
}

//set caret to end of input number
var reset = function (e) {
    if (e.type === 'focus') {
        this.addEventListener('mouseup', reset, false);
        this.addEventListener('keyup', reset, false);
    }
    else {
        this.removeEventListener('mouseup', reset, false);
        this.removeEventListener('keyup', reset, false);
    }
     
    // Following is what we've changed
    var len = this.value.length;
    this.setSelectionRange(len, len);
};
