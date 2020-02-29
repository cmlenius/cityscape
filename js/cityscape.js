function generateScene() {
    /*
    // Sky
    var skyGeometry = new THREE.SphereGeometry(50000, 25, 25);
    var material = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load( '../textures/sky.png' ),
    });
    var sky = new THREE.Mesh(skyGeometry, material);
    sky.material.side = THREE.BackSide;
    scene.add(sky);
    */

    // Floor
   /*
    let planeTexture = new THREE.Texture(genPlaneTexture());
    planeTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    planeTexture.needsUpdate = true;
    planeTexture.wrapS = THREE.RepeatWrapping;
    planeTexture.wrapT = THREE.RepeatWrapping;
    */
    
    let planeGeometry = new THREE.PlaneGeometry(GRID_SIZE, GRID_SIZE, 32);
    let planeMaterial = new THREE.MeshBasicMaterial({
        //map: planeTexture,
        color: 0x081508,
        side: THREE.DoubleSide
    });

    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);
    

    // Ambient Light
    let hemLight = new THREE.HemisphereLight(0xfffff0, 0x101020, 2);
    hemLight.position.set(0, 1000, 0);
    scene.add(hemLight);

    genBuildings();
    //addLight(0.995, 0.5, 0.9, -1024, 200, -1024);
}

function genBuildings() {
    let STREET_LENGTH = 8,
        NUM_OF_MESHES = 8,
        STREET_BASE_WIDTH = 0;

    let ids = new Array(NUM_OF_MESHES);
    for(let i=0; i<SECTIONS; i++){
        ids[i] = new Array(NUM_OF_MESHES);

        for(let j=0; j<SECTIONS; j++){
            ids[i][j] = Math.floor(Math.random()*NUM_OF_MESHES);
        }
    }

    let buildingGeometry = new THREE.BoxGeometry(1, 1, 1);
    buildingGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
    buildingGeometry.faces.splice(6, 2);
    buildingGeometry.faceVertexUvs[0].splice(6, 2);
    buildingGeometry.faceVertexUvs[0][5][2].set(0, 0);
    buildingGeometry.faceVertexUvs[0][4][2].set(0, 0);

    let buildingMeshes = [],
        cityGeometries  = [],
        materials = [];

    for(let i=0; i<NUM_OF_MESHES; i++) {
        buildingMeshes[i] = new THREE.Mesh(buildingGeometry);
        cityGeometries[i] = new THREE.Geometry;
        materials[i] = new THREE.MeshLambertMaterial({
            map: genCityTexture(),
            vertexColors: THREE.VertexColors
        });
    }

    for(let i=0; i<SECTIONS; i++){
        for(let j=0; j<SECTIONS; j++){
            let tmpx = Math.random() * 20 + 60,
                tmpy = Math.random() * 150 + 130,
                tmpz = Math.random() * 20 + 60;

            let idx = ids[i][j];
            buildingMeshes[idx].position.x = SECTION_SIZE*i + SECTION_SIZE/2 - GRID_SIZE/2 + Math.random()*60;
            buildingMeshes[idx].position.z = SECTION_SIZE*j + SECTION_SIZE/2 - GRID_SIZE/2 + Math.random()*60;
            buildingMeshes[idx].scale.x = tmpx;
            buildingMeshes[idx].scale.y = tmpy;
            buildingMeshes[idx].scale.z = tmpz;

            buildingMeshes[idx].updateMatrix();
            cityGeometries[idx].merge(buildingMeshes[idx].geometry, buildingMeshes[idx].matrix);
        }
    }

    for(let i=0; i<NUM_OF_MESHES; i++) {
        let cityMesh = new THREE.Mesh(cityGeometries[i], materials[i]);
        scene.add(cityMesh);
    }
}
