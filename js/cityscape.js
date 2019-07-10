function generateScene() {

    // Sky
    /*
		var geometry = new THREE.CubeGeometry( 5000, 5000, 5000 );
    var cubeMaterials = [
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( "../textures/sky.png" ), side: THREE.DoubleSide }), //front side
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( '../textures/sky.png' ), side: THREE.DoubleSide }), //back side
        new THREE.MeshBasicMaterial({ color: "#170098", side: THREE.DoubleSide }), //up side
        new THREE.MeshBasicMaterial({ color: "#ba3018", side: THREE.DoubleSide }), //down side
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( '../textures/sky.png' ), side: THREE.DoubleSide }), //right side
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( '../textures/sky.png' ), side: THREE.DoubleSide }) //left side
    ];
    var cubeMaterial = new THREE.MeshFaceMaterial( cubeMaterials );
    var cube = new THREE.Mesh( geometry, cubeMaterial );
    scene.add( cube );
    */

    var skyGeometry = new THREE.SphereGeometry(7000, 25, 25);
    var material = new THREE.MeshPhongMaterial({ 
        map: new THREE.TextureLoader().load( '../textures/sky.png' ),
    });
    var sky = new THREE.Mesh(skyGeometry, material);
    sky.material.side = THREE.BackSide;
    scene.add(sky);
    
    // Floor
    let planeTexture = new THREE.Texture(genPlaneTexture());
    planeTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    planeTexture.needsUpdate = true;
    planeTexture.wrapS = THREE.RepeatWrapping;
    planeTexture.wrapT = THREE.RepeatWrapping;

    let planeGeometry = new THREE.PlaneGeometry(GRID_SIZE, GRID_SIZE, 32);
    let planeMaterial = new THREE.MeshBasicMaterial({
        map: planeTexture,
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
        NUM_OF_MESHES = 8;

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
            let tmpx = Math.random() * 30 + 50,
                tmpy = Math.random() * 100 + 150,
                tmpz = Math.random() * 30 + 50;

            let idx = ids[i][j];
            buildingMeshes[idx].position.x = SECTION_SIZE*i + SECTION_SIZE/2 - GRID_SIZE/2;
            buildingMeshes[idx].position.z = SECTION_SIZE*j + SECTION_SIZE/2 - GRID_SIZE/2;
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
