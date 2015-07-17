function meshesFromJSON(meshesNames, scene, data) {
                var parsedData = JSON.parse(data);
                var loadedMaterialsIds = [];
                var hierarchyIds = [];
                for (var index = 0; index < parsedData.meshes.length; index++) {
                    var parsedMesh = parsedData.meshes[index];
                    if (!meshesNames || isDescendantOf(parsedMesh, meshesNames, hierarchyIds)) {
                        if (meshesNames instanceof Array) {
                            // Remove found mesh name from list.
                            delete meshesNames[meshesNames.indexOf(parsedMesh.name)];
                        }
                        //Geometry?
                        if (parsedMesh.geometryId) {
                            //does the file contain geometries?
                            if (parsedData.geometries) {
                                //find the correct geometry and add it to the scene
                                var found = false;
                                ["boxes", "spheres", "cylinders", "toruses", "grounds", "planes", "torusKnots", "vertexData"].forEach(function (geometryType) {
                                    if (found || !parsedData.geometries[geometryType] || !(parsedData.geometries[geometryType] instanceof Array)) {
                                        return;
                                    }
                                    else {
                                        parsedData.geometries[geometryType].forEach(function (parsedGeometryData) {
                                            if (parsedGeometryData.id == parsedMesh.geometryId) {
                                                switch (geometryType) {
                                                    case "boxes":
                                                        parseBox(parsedGeometryData, scene);
                                                        break;
                                                    case "spheres":
                                                        parseSphere(parsedGeometryData, scene);
                                                        break;
                                                    case "cylinders":
                                                        parseCylinder(parsedGeometryData, scene);
                                                        break;
                                                    case "toruses":
                                                        parseTorus(parsedGeometryData, scene);
                                                        break;
                                                    case "grounds":
                                                        parseGround(parsedGeometryData, scene);
                                                        break;
                                                    case "planes":
                                                        parsePlane(parsedGeometryData, scene);
                                                        break;
                                                    case "torusKnots":
                                                        parseTorusKnot(parsedGeometryData, scene);
                                                        break;
                                                    case "vertexData":
                                                        parseVertexData(parsedGeometryData, scene, rootUrl);
                                                        break;
                                                }
                                                found = true;
                                            }
                                        });
                                    }
                                });
                                if (!found) {
                                    BABYLON.Tools.Warn("Geometry not found for mesh " + parsedMesh.id);
                                }
                            }
                        }
                        // Material ?
                        if (parsedMesh.materialId) {
                            var materialFound = (loadedMaterialsIds.indexOf(parsedMesh.materialId) !== -1);
                            if (!materialFound && parsedData.multiMaterials) {
                                for (var multimatIndex = 0; multimatIndex < parsedData.multiMaterials.length; multimatIndex++) {
                                    var parsedMultiMaterial = parsedData.multiMaterials[multimatIndex];
                                    if (parsedMultiMaterial.id == parsedMesh.materialId) {
                                        for (var matIndex = 0; matIndex < parsedMultiMaterial.materials.length; matIndex++) {
                                            var subMatId = parsedMultiMaterial.materials[matIndex];
                                            loadedMaterialsIds.push(subMatId);
                                            parseMaterialById(subMatId, parsedData, scene, rootUrl);
                                        }
                                        loadedMaterialsIds.push(parsedMultiMaterial.id);
                                        parseMultiMaterial(parsedMultiMaterial, scene);
                                        materialFound = true;
                                        break;
                                    }
                                }
                            }
                            if (!materialFound) {
                                loadedMaterialsIds.push(parsedMesh.materialId);
                                if (!parseMaterialById(parsedMesh.materialId, parsedData, scene, rootUrl)) {
                                    BABYLON.Tools.Warn("Material not found for mesh " + parsedMesh.id);
                                }
                            }
                        }
                        // Skeleton ?
                        if (parsedMesh.skeletonId > -1 && scene.skeletons) {
                            var skeletonAlreadyLoaded = (loadedSkeletonsIds.indexOf(parsedMesh.skeletonId) > -1);
                            if (!skeletonAlreadyLoaded) {
                                for (var skeletonIndex = 0; skeletonIndex < parsedData.skeletons.length; skeletonIndex++) {
                                    var parsedSkeleton = parsedData.skeletons[skeletonIndex];
                                    if (parsedSkeleton.id === parsedMesh.skeletonId) {
                                        skeletons.push(parseSkeleton(parsedSkeleton, scene));
                                        loadedSkeletonsIds.push(parsedSkeleton.id);
                                    }
                                }
                            }
                        }
                        var mesh = parseMesh(parsedMesh, scene, rootUrl);
                        meshes.push(mesh);
                    }
                }
                // Connecting parents
                for (index = 0; index < scene.meshes.length; index++) {
                    var currentMesh = scene.meshes[index];
                    if (currentMesh._waitingParentId) {
                        currentMesh.parent = scene.getLastEntryByID(currentMesh._waitingParentId);
                        currentMesh._waitingParentId = undefined;
                    }
                }
                // freeze world matrix application
                for (index = 0; index < scene.meshes.length; index++) {
                    var currentMesh = scene.meshes[index];
                    if (currentMesh._waitingFreezeWorldMatrix) {
                        currentMesh.freezeWorldMatrix();
                        currentMesh._waitingFreezeWorldMatrix = undefined;
                    }
                }
                // Particles
                if (parsedData.particleSystems) {
                    for (index = 0; index < parsedData.particleSystems.length; index++) {
                        var parsedParticleSystem = parsedData.particleSystems[index];
                        if (hierarchyIds.indexOf(parsedParticleSystem.emitterId) !== -1) {
                            particleSystems.push(parseParticleSystem(parsedParticleSystem, scene, rootUrl));
                        }
                    }
                }
                return true;
            },
            load: function (scene, data, rootUrl) {
                var parsedData = JSON.parse(data);
                // Scene
                scene.useDelayedTextureLoading = parsedData.useDelayedTextureLoading && !BABYLON.SceneLoader.ForceFullSceneLoadingForIncremental;
                scene.autoClear = parsedData.autoClear;
                scene.clearColor = BABYLON.Color3.FromArray(parsedData.clearColor);
                scene.ambientColor = BABYLON.Color3.FromArray(parsedData.ambientColor);
                scene.gravity = BABYLON.Vector3.FromArray(parsedData.gravity);
                // Fog
                if (parsedData.fogMode && parsedData.fogMode !== 0) {
                    scene.fogMode = parsedData.fogMode;
                    scene.fogColor = BABYLON.Color3.FromArray(parsedData.fogColor);
                    scene.fogStart = parsedData.fogStart;
                    scene.fogEnd = parsedData.fogEnd;
                    scene.fogDensity = parsedData.fogDensity;
                }
                // Lights
                for (var index = 0; index < parsedData.lights.length; index++) {
                    var parsedLight = parsedData.lights[index];
                    parseLight(parsedLight, scene);
                }
                // Materials
                if (parsedData.materials) {
                    for (index = 0; index < parsedData.materials.length; index++) {
                        var parsedMaterial = parsedData.materials[index];
                        parseMaterial(parsedMaterial, scene, rootUrl);
                    }
                }
                if (parsedData.multiMaterials) {
                    for (index = 0; index < parsedData.multiMaterials.length; index++) {
                        var parsedMultiMaterial = parsedData.multiMaterials[index];
                        parseMultiMaterial(parsedMultiMaterial, scene);
                    }
                }
                // Skeletons
                if (parsedData.skeletons) {
                    for (index = 0; index < parsedData.skeletons.length; index++) {
                        var parsedSkeleton = parsedData.skeletons[index];
                        parseSkeleton(parsedSkeleton, scene);
                    }
                }
                // Geometries
                var geometries = parsedData.geometries;
                if (geometries) {
                    // Boxes
                    var boxes = geometries.boxes;
                    if (boxes) {
                        for (index = 0; index < boxes.length; index++) {
                            var parsedBox = boxes[index];
                            parseBox(parsedBox, scene);
                        }
                    }
                    // Spheres
                    var spheres = geometries.spheres;
                    if (spheres) {
                        for (index = 0; index < spheres.length; index++) {
                            var parsedSphere = spheres[index];
                            parseSphere(parsedSphere, scene);
                        }
                    }
                    // Cylinders
                    var cylinders = geometries.cylinders;
                    if (cylinders) {
                        for (index = 0; index < cylinders.length; index++) {
                            var parsedCylinder = cylinders[index];
                            parseCylinder(parsedCylinder, scene);
                        }
                    }
                    // Toruses
                    var toruses = geometries.toruses;
                    if (toruses) {
                        for (index = 0; index < toruses.length; index++) {
                            var parsedTorus = toruses[index];
                            parseTorus(parsedTorus, scene);
                        }
                    }
                    // Grounds
                    var grounds = geometries.grounds;
                    if (grounds) {
                        for (index = 0; index < grounds.length; index++) {
                            var parsedGround = grounds[index];
                            parseGround(parsedGround, scene);
                        }
                    }
                    // Planes
                    var planes = geometries.planes;
                    if (planes) {
                        for (index = 0; index < planes.length; index++) {
                            var parsedPlane = planes[index];
                            parsePlane(parsedPlane, scene);
                        }
                    }
                    // TorusKnots
                    var torusKnots = geometries.torusKnots;
                    if (torusKnots) {
                        for (index = 0; index < torusKnots.length; index++) {
                            var parsedTorusKnot = torusKnots[index];
                            parseTorusKnot(parsedTorusKnot, scene);
                        }
                    }
                    // VertexData
                    var vertexData = geometries.vertexData;
                    if (vertexData) {
                        for (index = 0; index < vertexData.length; index++) {
                            var parsedVertexData = vertexData[index];
                            parseVertexData(parsedVertexData, scene, rootUrl);
                        }
                    }
                }
                // Meshes
                for (index = 0; index < parsedData.meshes.length; index++) {
                    var parsedMesh = parsedData.meshes[index];
                    parseMesh(parsedMesh, scene, rootUrl);
                }
                // Cameras
                for (index = 0; index < parsedData.cameras.length; index++) {
                    var parsedCamera = parsedData.cameras[index];
                    parseCamera(parsedCamera, scene);
                }
                if (parsedData.activeCameraID) {
                    scene.setActiveCameraByID(parsedData.activeCameraID);
                }
                // Browsing all the graph to connect the dots
                for (index = 0; index < scene.cameras.length; index++) {
                    var camera = scene.cameras[index];
                    if (camera._waitingParentId) {
                        camera.parent = scene.getLastEntryByID(camera._waitingParentId);
                        camera._waitingParentId = undefined;
                    }
                }
                for (index = 0; index < scene.lights.length; index++) {
                    var light = scene.lights[index];
                    if (light._waitingParentId) {
                        light.parent = scene.getLastEntryByID(light._waitingParentId);
                        light._waitingParentId = undefined;
                    }
                }
                // Sounds
                if (parsedData.sounds) {
                    for (index = 0; index < parsedData.sounds.length; index++) {
                        var parsedSound = parsedData.sounds[index];
                        if (BABYLON.Engine.audioEngine.canUseWebAudio) {
                            parseSound(parsedSound, scene, rootUrl);
                        }
                        else {
                            var emptySound = new BABYLON.Sound(parsedSound.name, null, scene);
                        }
                    }
                }
                // Connect parents & children and parse actions
                for (index = 0; index < scene.meshes.length; index++) {
                    var mesh = scene.meshes[index];
                    if (mesh._waitingParentId) {
                        mesh.parent = scene.getLastEntryByID(mesh._waitingParentId);
                        mesh._waitingParentId = undefined;
                    }
                    if (mesh._waitingActions) {
                        parseActions(mesh._waitingActions, mesh, scene);
                        mesh._waitingActions = undefined;
                    }
                }
                // freeze world matrix application
                for (index = 0; index < scene.meshes.length; index++) {
                    var currentMesh = scene.meshes[index];
                    if (currentMesh._waitingFreezeWorldMatrix) {
                        currentMesh.freezeWorldMatrix();
                        currentMesh._waitingFreezeWorldMatrix = undefined;
                    }
                }
                // Particles Systems
                if (parsedData.particleSystems) {
                    for (index = 0; index < parsedData.particleSystems.length; index++) {
                        var parsedParticleSystem = parsedData.particleSystems[index];
                        parseParticleSystem(parsedParticleSystem, scene, rootUrl);
                    }
                }
                // Lens flares
                if (parsedData.lensFlareSystems) {
                    for (index = 0; index < parsedData.lensFlareSystems.length; index++) {
                        var parsedLensFlareSystem = parsedData.lensFlareSystems[index];
                        parseLensFlareSystem(parsedLensFlareSystem, scene, rootUrl);
                    }
                }
                // Shadows
                if (parsedData.shadowGenerators) {
                    for (index = 0; index < parsedData.shadowGenerators.length; index++) {
                        var parsedShadowGenerator = parsedData.shadowGenerators[index];
                        parseShadowGenerator(parsedShadowGenerator, scene);
                    }
                }
                // Actions (scene)
                if (parsedData.actions) {
                    parseActions(parsedData.actions, null, scene);
                }
                // Finish
                return true;
            }
        });
    }