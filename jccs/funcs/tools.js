function moveT(vec) {
	this.backMarker.position.x=vec.x;
	this.backMarker.position.y=vec.y;
	
	this.leftMarker.position.y=vec.y;
	this.leftMarker.position.z=vec.z;
	
	this.frontMarker.position.x=vec.x;
	this.frontMarker.position.y=vec.y;
	
	this.rightMarker.position.y=vec.y;
	this.rightMarker.position.z=vec.z;
	
	this.groundMarker.position.x=vec.x;
	this.groundMarker.position.z=vec.z;
}

//Calculation of the number of steps (1 per key down) that can be taken without hitting another mesh in JCubbes

function stepsLeftRight(JCubees, currentMeshes) {
	var blockers={}; //x positions of cubees not in selection for each Z for each Y
	var movers={}; //x positions of cubees in selection for each Z for each Y
	for(var mesh in JCubees) {
		var Y=JCubees[mesh].Jcubee.position.y;
		var Z=JCubees[mesh].Jcubee.position.z;
		
		if(!(Y in blockers)) {
			blockers[Y] = {};
		}
		
		if(!(Z in blockers[Y])) {
			blockers[Y][Z] = [30 - 11*60, 30 + 10*60]; // x barrier by left hand grid on the outside, x barrier by right hand grid on outside;
		}
		
		if(mesh in currentMeshes) {			
			if(!(Y in movers)) {
				movers[Y] = {};
			}
		
			if(!(Z in movers[Y])) {
				movers[Y][Z] = [];
			}
			movers[Y][Z].push(JCubees[mesh].Jcubee.position.x);			
		}
		else {			
			blockers[Y][Z].push(JCubees[mesh].Jcubee.position.x);
		}
	}

	var maxStepsRight=20;
	var maxStepsLeft=20;
	for(var Y in movers) {	
		for(var Z in movers[Y]) {			 
			blockers[Y][Z].sort(function(a,b) {return parseInt(a)-parseInt(b)});
			for(var m=0;m<movers[Y][Z].length;m++) {
				var onTheRight=[];
				var onTheLeft = [];
				var i = blockers[Y][Z].length;
				while(blockers[Y][Z][--i]>movers[Y][Z][m]) {
					onTheRight.unshift(blockers[Y][Z][i]);
				}
				var i=-1;
				while(blockers[Y][Z][++i]<movers[Y][Z][m]) {
					onTheLeft.unshift(blockers[Y][Z][i]);
				}
				maxStepsRight = Math.min(maxStepsRight,(onTheRight[0] - movers[Y][Z][m] - 60)/60);
				maxStepsLeft = Math.min(maxStepsLeft,(movers[Y][Z][m] - onTheLeft[0] - 60)/60);
			}
		}
	}
	return {right:maxStepsRight, left:maxStepsLeft}; 
}

function stepsUpDown(JCubees, currentMeshes) {
	var blockers={}; //y positions of cubees not in selection for each X for each Z
	var movers={}; //y positions of cubees  in selection for each X for each Z
	for(var mesh in JCubees) {
		var Z=JCubees[mesh].Jcubee.position.z;
		var X=JCubees[mesh].Jcubee.position.x;
		
		if(!(Z in blockers)) {
			blockers[Z] = {};
		}
		
		if(!(X in blockers[Z])) {
			blockers[Z][X] = [-30, 30 + 13*60]; // y barrier by bottom grid on the outside, y barrier by top grid on outside;
		}
		
		if(mesh in currentMeshes) {			
			if(!(Z in movers)) {
				movers[Z] = {};
			}
		
			if(!(X in movers[Z])) {
				movers[Z][X] = [];
			}
			movers[Z][X].push(JCubees[mesh].Jcubee.position.y);			
		}
		else {			
			blockers[Z][X].push(JCubees[mesh].Jcubee.position.y);
		}
	}

	var maxStepsUp=20;
	var maxStepsDown=20;
	for(var Z in movers) {	
		for(var X in movers[Z]) {			 
			blockers[Z][X].sort(function(a,b) {return parseInt(a)-parseInt(b)});		
			for(var m=0;m<movers[Z][X].length;m++) {
				var onTheUp=[];
				var onTheDown = [];
				var i = blockers[Z][X].length;
				while(blockers[Z][X][--i]>movers[Z][X][m]) {
					onTheUp.unshift(blockers[Z][X][i]);
				}
				var i=-1;
				while(blockers[Z][X][++i]<movers[Z][X][m]) {
					onTheDown.unshift(blockers[Z][X][i]);
				}
				maxStepsUp = Math.min(maxStepsUp,(onTheUp[0] - movers[Z][X][m] - 60)/60);
				maxStepsDown = Math.min(maxStepsDown,(movers[Z][X][m] - onTheDown[0] - 60)/60);
			}
		}
	}
	return {up:maxStepsUp, down:maxStepsDown}; 
}

function stepsForwardBack(JCubees, currentMeshes) {
	var blockers={}; //z positions of cubees not in selection for each Y for each X
	var movers={}; //z positions of cubees in selection for each Y for each X
	for(var mesh in JCubees) {
		var X=JCubees[mesh].Jcubee.position.x;
		var Y=JCubees[mesh].Jcubee.position.y;
		
		if(!(X in blockers)) {
			blockers[X] = {};
		}
		
		if(!(Y in blockers[X])) {
			blockers[X][Y] = [30 - 60*11, 30 + 10*60]; // y barrier by bottom grid on the outside, y barrier by top grid on outside;
		}
		
		if(mesh in currentMeshes) {			
			if(!(X in movers)) {
				movers[X] = {};
			}
		
			if(!(Y in movers[X])) {
				movers[X][Y] = [];
			}
			movers[X][Y].push(JCubees[mesh].Jcubee.position.z);			
		}
		else {			
			blockers[X][Y].push(JCubees[mesh].Jcubee.position.z);
		}
	}

	var maxStepsForward=20;
	var maxStepsBack=20;
	for(var X in movers) {	
		for(var Y in movers[X]) {			 
			blockers[X][Y].sort(function(a,b) {return parseInt(a)-parseInt(b)});		
			for(var m=0;m<movers[X][Y].length;m++) {
				var onTheForward=[];
				var onTheBack = [];
				var i = blockers[X][Y].length;
				while(blockers[X][Y][--i]>movers[X][Y][m]) {
					onTheForward.unshift(blockers[X][Y][i]);
				}
				var i=-1;
				while(blockers[X][Y][++i]<movers[X][Y][m]) {
					onTheBack.unshift(blockers[X][Y][i]);
				}
				maxStepsForward = Math.min(maxStepsForward,(onTheForward[0] - movers[X][Y][m] - 60)/60);
				maxStepsBack = Math.min(maxStepsBack,(movers[X][Y][m] - onTheBack[0] - 60)/60);
			}
		}
	}
	return {forward:maxStepsForward, back:maxStepsBack}; 
}

function getModelRef(ref) {
	var i = ref.indexOf('¬') - 1;
	return ref.substr(1,i);
}

function getNameRef(ref) {
	var i = ref.indexOf('¬') +1;
	return ref.substr(i);
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