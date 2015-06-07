function scene_studio() {
	
	/*-------------SCENE STUDIO ---------------*/	
	// Set the scene studio	
	jcssStudio = new Studio(jcEngine);
	
	jcssStudio.scene.clearColor = new BABYLON.Color3(0.18, 0.35, 0.61);
	
	jcssStudio.camera = new BABYLON.ArcRotateCamera("Camera", 0, 50, 300, new BABYLON.Vector3(0, 300, 0), jcssStudio.scene);
	jcssStudio.camera.setPosition(new BABYLON.Vector3(0, 200, -1400));	
	jcssStudio.camera.lowerBetaLimit = 0.1;
	jcssStudio.camera.upperBetaLimit = (Math.PI / 2) * 0.9;
	jcssStudio.camera.attachControl(jcCanvas, true);
	
	//jcssStudio.scene.activeCameras.push(jcssStudio.camera);
	
	jcssStudio.frontLight = new BABYLON.PointLight("omni", new BABYLON.Vector3(-3000, 6000, 2000), jcssStudio.scene);
	jcssStudio.backLight = new BABYLON.PointLight("omni", new BABYLON.Vector3(3000, -6000, 2000), jcssStudio.scene);
	jcssStudio.bottomLight = new BABYLON.PointLight("omni", new BABYLON.Vector3(-3000, 6000, -2000), jcssStudio.scene);
	jcssStudio.frontLight.intensity = 0.2;
	jcssStudio.backLight.intensity = 0.2;
	jcssStudio.bottomLight.intensity = 0.2;	
	
	//Materials
	var groundMat = new BABYLON.StandardMaterial("greenGrid", jcssStudio.scene);
	groundMat.emissiveColor = new BABYLON.Color3(0.2,1,0.2);

	
	//Create Ground
	var jcssground=BABYLON.Mesh.CreateGround("jcssground",1200, 1200, 20, jcssStudio.scene,  false, BABYLON.Mesh.DOUBLESIDE);	
	jcssground.material = groundMat;
	jcssground.position.z=1;


    //jcCanvas.addEventListener("mousedown", onPointerDown, false);
    //jcCanvas.addEventListener("mouseup", onPointerUp, false);
	//jcCanvas.addEventListener("mousemove", onPointerMove, false);

	

    jcssStudio.scene.onDispose = function () {
        jcCanvas.removeEventListener("mousedown", onPointerDown);
        jcCanvas.removeEventListener("mouseup", onPointerUp);
		window.removeEventListener("keydown", onKeyDown, false);
		window.removeEventListener("keyup", onKeyUp, false);
    }

}

