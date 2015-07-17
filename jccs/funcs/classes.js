Studio = function (engine) {
	this.engine=engine;
	this.scene = new BABYLON.Scene(engine);
};

function JcubeeBlank(name) {
	this.name = name;
		
	//methods
	this.addMarkers = addMarkers;
	this.disableMarkers = disableMarkers;
	this.moveT = moveT;
	this.showMarkers = showMarkers;
	this.hideMarkers = hideMarkers;
	this.disable = disable;
	this.enable = enable;
	this.destroy = destroy;	
}

function JcubeeBox(name, x, y, z, material, n, scene) {
	this.name = name;
	this.Jcubee = BABYLON.Mesh.CreateBox(name, 60.0, scene, true);	
	this.Jcubee.material = material.clone(material.name+n);
	this.Jcubee.position.x = x;
	this.Jcubee.position.y = y;
	this.Jcubee.position.z = z;	
		
	//methods
	this.addMarkers = addMarkers;
	this.disableMarkers = disableMarkers;
	this.moveT = moveT;
	this.showMarkers = showMarkers;
	this.hideMarkers = hideMarkers;
	this.disable = disable;
	this.enable = enable;
	this.destroy = destroy;		
}

function JcubeeCylinder(name, x, y, z, material, n, scene) {
	this.name = name;
	this.Jcubee = BABYLON.Mesh.CreateCylinder(name, 60, 60, 60, 60, 1, scene, true);
	this.Jcubee.material = material.clone(material.name+n);
	this.Jcubee.position.x = x;
	this.Jcubee.position.y = y;
	this.Jcubee.position.z = z;
		
	//methods
	this.addMarkers = addMarkers;
	this.disableMarkers = disableMarkers;
	this.moveT = moveT;
	this.showMarkers = showMarkers;
	this.hideMarkers = hideMarkers;
	this.disable = disable;
	this.enable = enable;
	this.destroy = destroy;		
}

function JcubeeSphere(name, x, y, z, material, n, scene) {
	this.name = name;
	this.Jcubee = BABYLON.Mesh.CreateSphere(name, 60.0, 60.0, scene, true);
	this.Jcubee.material = material.clone(material.name+n);
	this.Jcubee.position.x = x;
	this.Jcubee.position.y = y;
	this.Jcubee.position.z = z;
		
	//methods
	this.addMarkers = addMarkers;
	this.disableMarkers = disableMarkers;
	this.moveT = moveT;
	this.showMarkers = showMarkers;
	this.hideMarkers = hideMarkers;
	this.disable = disable;
	this.enable = enable;
	this.destroy = destroy;		
}

function JcubeeRoof(name, x, y, z, material, n, scene) {
	this.name = name;
	var shape = [
		new BABYLON.Vector3(30, 30, -30),
		new BABYLON.Vector3(30, -30, -30),
		new BABYLON.Vector3(-30, -30, -30)
	];
	shape.push(shape[0]);
	
	var path = [
	  new BABYLON.Vector3(0,0,0),
	  new BABYLON.Vector3(0, 0, 60)
	];
	
	this.Jcubee = BABYLON.Mesh.ExtrudeShape(name, shape, path, 1, 0, BABYLON.Mesh.CAP_ALL, scene, true, BABYLON.Mesh.DOUBLESIDE);
	this.Jcubee.material = material.clone(material.name+n);
	this.Jcubee.position.x = x;
	this.Jcubee.position.y = y;
	this.Jcubee.position.z = z;
		
	//methods
	this.addMarkers = addMarkers;
	this.disableMarkers = disableMarkers;
	this.moveT = moveT;
	this.showMarkers = showMarkers;
	this.hideMarkers = hideMarkers; 
	this.disable = disable;
	this.enable = enable;
	this.destroy = destroy;		
}

function addMarkers(scene,scale) {
	var _blackMat = new BABYLON.StandardMaterial("black", scene);
	_blackMat.emissiveColor = new BABYLON.Color3(0,0,0);
	
	scale = scale||1;
	
	this.backMarker=BABYLON.Mesh.CreatePlane("backMarker"+name,60*scale, scene);	
	this.backMarker.material = _blackMat;
	this.backMarker.position.x=this.Jcubee.position.x*scale;
	this.backMarker.position.y=this.Jcubee.position.y*scale;
	this.backMarker.position.z=598;
	this.backMarker.isPickable = false;
	
	this.leftMarker=BABYLON.Mesh.CreatePlane("leftMarker"+name,60*scale, scene);	
	this.leftMarker.material = _blackMat;
	this.leftMarker.rotation.y = -Math.PI/2;
	this.leftMarker.position.x=-598;
	this.leftMarker.position.y=this.Jcubee.position.y*scale;
	this.leftMarker.position.z=this.Jcubee.position.z*scale;
	this.leftMarker.isPickable = false;
	
	this.frontMarker=BABYLON.Mesh.CreatePlane("frontMarker"+name,60*scale, scene);	
	this.frontMarker.material = _blackMat;
	this.frontMarker.rotation.y = -Math.PI;
	this.frontMarker.position.x=this.Jcubee.position.x*scale;
	this.frontMarker.position.y=this.Jcubee.position.y*scale;
	this.frontMarker.position.z=-598;
	this.frontMarker.isPickable = false;
	
	this.rightMarker=BABYLON.Mesh.CreatePlane("rightMarker"+name,60*scale, scene);	
	this.rightMarker.material = _blackMat;
	this.rightMarker.rotation.y = Math.PI/2;
	this.rightMarker.position.x=598;
	this.rightMarker.position.y=this.Jcubee.position.y*scale;
	this.rightMarker.position.z=this.Jcubee.position.z*scale;
	this.rightMarker.isPickable = false;
	
	this.groundMarker=BABYLON.Mesh.CreatePlane("groundMarker"+name,60*scale, scene);	
	this.groundMarker.material = _blackMat;
	this.groundMarker.rotation.x = Math.PI/2;
	this.groundMarker.position.x=this.Jcubee.position.x*scale;
	this.groundMarker.position.y=2;
	this.groundMarker.position.z=this.Jcubee.position.z*scale;
	this.groundMarker.isPickable = false;	
}
	
function showMarkers() {
	this.backMarker.material.alpha = 1;
	this.leftMarker.material.alpha = 1;
	this.frontMarker.material.alpha = 1;
	this.rightMarker.material.alpha = 1;
	this.groundMarker.material.alpha = 1;
}
	
function hideMarkers() {
	this.backMarker.material.alpha = 0.4;
	this.leftMarker.material.alpha = 0.4;
	this.frontMarker.material.alpha = 0.4;
	this.rightMarker.material.alpha = 0.4;
	this.groundMarker.material.alpha = 0.4;
}

function disableMarkers() {
	this.backMarker.setEnabled(false);
	this.leftMarker.setEnabled(false);
	this.frontMarker.setEnabled(false);
	this.rightMarker.setEnabled(false);
	this.rightMarker.setEnabled(false);
	this.groundMarker.setEnabled(false);
}

function disable() {
	this.Jcubee.setEnabled(false);
	this.backMarker.setEnabled(false);
	this.leftMarker.setEnabled(false);
	this.frontMarker.setEnabled(false);
	this.rightMarker.setEnabled(false);
	this.groundMarker.setEnabled(false);
}

function enable() {
	this.Jcubee.setEnabled(true);
	this.backMarker.setEnabled(true);
	this.leftMarker.setEnabled(true);
	this.frontMarker.setEnabled(true);
	this.rightMarker.setEnabled(true);
	this.groundMarker.setEnabled(true);
}

function destroy() {
	this.Jcubee.dispose();
	this.backMarker.dispose();
	this.leftMarker.dispose();
	this.frontMarker.dispose();
	this.rightMarker.dispose();
	this.groundMarker.dispose();
}
	



