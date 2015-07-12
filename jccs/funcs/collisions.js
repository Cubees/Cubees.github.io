function childrenBoundary(parent, scene) { 		
	var X, Y, Z;
	var minX = 30 + 20*60, maxX = 30 - 20*60, minY = 30 + 20*60, maxY = 30 - 20*60, minZ  = 30 + 20*60 ,maxZ = 30 - 20*60;
	var LDF, LDB, RDB, RDF, LUF, LUB, RUB, RUF; // left, right, up, down, front and back vertices 
	var LP, RP,UP,DP,FP,BP; //left, right, upper, down(lower), front and back boundary planes 

	var	frontOfLeftFace= [];
	var	frontOfRightFace= [];
	var	frontOfUpFace= [];
	var	frontOfDownFace= [];
	var	frontOfFrontFace= [];
	var	frontOfBackFace= [];
	
	var children = parent.modelChildren;
	

	for(var i=0; i<children.length; i++) {
		X = children[i].Jcubee.position.x;
		Y = children[i].Jcubee.position.y;
		Z = children[i].Jcubee.position.z;			
			
		if(frontOfLeftFace[Y]===undefined){
			frontOfLeftFace[Y]=[];
			frontOfLeftFace[Y][Z] = children[i];
			if(X<minX){
				minX=X;
			}				
		}
		else {
			if(frontOfLeftFace[Y][Z] === undefined) {
				frontOfLeftFace[Y][Z] = children[i];
			}
			if (X<frontOfLeftFace[Y][Z].Jcubee.position.x) {
				frontOfLeftFace[Y][Z] = children[i];					
				if(X<minX) {
					minX=X;						
				}
			}
					
		}
			
		if(frontOfRightFace[Y]===undefined){
			frontOfRightFace[Y]=[];
			frontOfRightFace[Y][Z] = children[i];
			if(X>maxX){
				maxX=X;
			}				
		}
		else {
			if(frontOfRightFace[Y][Z] === undefined) {
				frontOfRightFace[Y][Z] = children[i];
			}
			if (X>frontOfRightFace[Y][Z].Jcubee.position.x) {
				frontOfRightFace[Y][Z] = children[i];				
				if(X>maxX) {
					maxX=X;						
				}
			}			
		}
				
				
		if(frontOfUpFace[X]===undefined){
			frontOfUpFace[X]=[];
			frontOfUpFace[X][Z] = children[i];
			if(Y>maxY) {
				maxY=Y;
			}
		}
		else {
			if(frontOfUpFace[X][Z] === undefined) {
				frontOfUpFace[X][Z] = children[i];
			}
			if (Y>frontOfUpFace[X][Z].Jcubee.position.y) {
				frontOfUpFace[X][Z] = children[i];	
				if(Y>maxY) {
					maxY=Y;
				}
			}		
		}
			
		if(frontOfDownFace[X]===undefined){
			frontOfDownFace[X]=[];
			frontOfDownFace[X][Z] = children[i];
			if(Y<minY) {
				minY=Y;
			}
		}
		else {
			if(frontOfDownFace[X][Z] === undefined) {
				frontOfDownFace[X][Z] = children[i];
			}
			if (Y<frontOfDownFace[X][Z].Jcubee.position.y) {
				frontOfDownFace[X][Z] = children[i];
				if(Y<minY) {
					minY=Y;
				}
			}			
		}
			
		if(frontOfFrontFace[X]===undefined){
			frontOfFrontFace[X]=[];
			frontOfFrontFace[X][Y] = children[i];
			if(Z<minZ) {
				minZ=Z;
			}
		}
		else {
			if(frontOfFrontFace[X][Y] === undefined) {
				frontOfFrontFace[X][Y] = children[i];
			}
			if (Z<frontOfFrontFace[X][Y].Jcubee.position.z) {
				frontOfFrontFace[X][Y] = children[i];	
				if(Z<minZ) {
					minZ=Z;
				}
			}	
		}
			
		if(frontOfBackFace[X]===undefined){
			frontOfBackFace[X]=[];
			frontOfBackFace[X][Y] = children[i];
			if(Z>maxZ) {
				maxZ=Z;
			}
		}
		else {
			if(frontOfBackFace[X][Y] === undefined) {
				frontOfBackFace[X][Y] = children[i];
			}
			if (Z>frontOfBackFace[X][Y].Jcubee.position.z) {
				frontOfBackFace[X][Y] = children[i];	
				if(Z>maxZ) {
					maxZ=Z;
				}
			}		
		}
	}
	
	var Xlen = maxX - minX + 60;
	var Ylen = maxY - minY + 60;
	var Zlen = maxZ - minZ + 60;
	
	var Xmid = (maxX + minX)/2;
	var Ymid = (maxY + minY)/2;
	var Zmid = (maxZ + minZ)/2;
	
	var cuboid = new CreateCuboid(parent.name, Xlen, Zlen, Ylen, scene);
	cuboid.position = new BABYLON.Vector3(Xmid, Ymid, Zmid);
	//var redMat = new BABYLON.StandardMaterial("red0", scene);
	//redMat.emissiveColor = new BABYLON.Color3(1,0,0);
	//cuboid.material = redMat;
	//cuboid.material.alpha = 0.5;
	cuboid.isVisible=false;
	
	return cuboid;
	
}

function collision(model, modelGroup) {
	var collide = {left:false, right:false, up:false, down:false, front:false, back:false};
	var childCollide;
	model.modelBoundary.computeWorldMatrix(true);
	for(var ref in modelGroup) {
		modelGroup[ref].modelBoundary.computeWorldMatrix(true);
		if (model.name != ref && model.modelBoundary.intersectsMesh(modelGroup[ref].modelBoundary, true)) {
			childCollide = childCollision(model, modelGroup[ref]);			
			for(var dir in collide) {
				collide[dir] = collide[dir] || childCollide[dir];
			}
		}
	}	
	return collide;
}

function childCollision(modelA, modelB) { //modelA is one moving
	var collide = {left:false, right:false, up:false, down:false, front:false, back:false};
	var xOffset = new BABYLON.Vector3(15, 0, 0);
	var yOffset = new BABYLON.Vector3(0, 15, 0);
	var zOffset = new BABYLON.Vector3(0, 0, 15);
	var Bposition; 
	var A = 0;
	while(A<modelA.modelChildren.length) {
		B=0;
		while(B<modelB.modelChildren.length) {
			modelA.modelChildren[A].Jcubee.computeWorldMatrix(true);
			modelB.modelChildren[B].Jcubee.computeWorldMatrix(true);
			Bposition = modelB.modelChildren[B].Jcubee.getAbsolutePosition();
			if(modelA.modelChildren[A].Jcubee.intersectsMesh(modelB.modelChildren[B].Jcubee, true)) {
				if(modelA.modelChildren[A].Jcubee.intersectsPoint(Bposition.add(xOffset))) {
					collide.left = true;
				}
				if(modelA.modelChildren[A].Jcubee.intersectsPoint(Bposition.subtract(xOffset))) {
					collide.right = true;
				}
				if(modelA.modelChildren[A].Jcubee.intersectsPoint(Bposition.add(yOffset))) {
					collide.down = true;
				}
				if(modelA.modelChildren[A].Jcubee.intersectsPoint(Bposition.subtract(yOffset))) {
					collide.up = true;
				}
				if(modelA.modelChildren[A].Jcubee.intersectsPoint(Bposition.subtract(zOffset))) {
					collide.front = true;
				}
				if(modelA.modelChildren[A].Jcubee.intersectsPoint(Bposition.add(zOffset))) {
					collide.back = true;
				}
			}		
			B++;
		}
		A++;
	}
	return collide;
}
			
