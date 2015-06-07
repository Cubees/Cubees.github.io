Studio = function (engine) {
	this.engine=engine;
	this.scene = new BABYLON.Scene(engine);
}

function node(name,x,y,z,scene) { //x,y coordinates of centre
	this.name=name;
	this.x=x;
	this.y=y;
	this.z=z;
	
	this.ctrl1=null;
	this.ctrl2=null;
	
	this.next=null;
	this.prev=null;
	
	this.marker=BABYLON.Mesh.CreatePlane("plane"+this.name,4,scene,true,BABYLON.Mesh.FRONTSIDE)
	var lightGreyMat = new BABYLON.StandardMaterial("lightGrey", scene);
	lightGreyMat.emissiveColor = new BABYLON.Color3(0.75,0.75,0.75);
	this.marker.material = lightGreyMat;
	this.marker.position.x = this.x;
	this.marker.position.y = this.y;
	this.marker.position.z = this.z;

	this.segment=null;
	this.segmentType="curved";
}

function control(name,x,y,z,scene) { //x,y coordinates of centre
	this.name=name;
	this.x=x;
	this.y=y;
	this.z=z;
	
	this.marker=BABYLON.Mesh.CreateSphere("sphere"+this.name,4, 5,scene)
	var darkGreyMat = new BABYLON.StandardMaterial("darkGrey", scene);
	darkGreyMat.emissiveColor = new BABYLON.Color3(0.25,0.25,0.25);
	this.marker.material = darkGreyMat;
	this.marker.position.x = this.x;
	this.marker.position.y = this.y;
	this.marker.position.z = this.z;
	
	this.marker.CType="ctrl";
	
}