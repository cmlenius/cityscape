function generateScene() {
    // Floor
    var planeGeometry = new THREE.PlaneGeometry( 5000, 5000, 32 );
    var planeMaterial = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.DoubleSide});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);

    var buildingGeometry = new THREE.BoxGeometry(1,1,1);
    buildingGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0.0,0.5,0.0));
    buildingGeometry.faces.splice(6,2);
    buildingGeometry.faceVertexUvs[0].splice(6,2);
    buildingGeometry.faceVertexUvs[0][5][2].set(0,0);
    buildingGeometry.faceVertexUvs[0][4][2].set(0,0);

    var buildingMesh = new THREE.Mesh(buildingGeometry);
    var cityGeometry = new THREE.Geometry();
    var numOfBuildings = 500;
/*
    for (var i=0; i < numOfBuildings; i++) {
        buildingMesh.position.x = Math.floor(Math.random() * 200 - 100) * 20;
        buildingMesh.position.z = Math.floor(Math.random() * 200 - 100) * 20;

        buildingMesh.scale.x = Math.random() * Math.random() * Math.random() * 30 + 50;
        buildingMesh.scale.y = Math.random() * 175 + 125;
        buildingMesh.scale.z = buildingMesh.scale.x;

        buildingMesh.updateMatrix();
        cityGeometry.merge(buildingMesh.geometry, buildingMesh.matrix);
    }
*/
    // var material = new THREE.MeshLambertMaterial({map: texture, vertexColors: THREE.VertexColors});


    buildingMesh.position.x = 0;
    buildingMesh.position.y = 0;
    buildingMesh.position.z = 0;

    buildingMesh.scale.x = 55;
    buildingMesh.scale.y = 150;
    buildingMesh.scale.z = 55;

    buildingMesh.updateMatrix();
    cityGeometry.merge(buildingMesh.geometry, buildingMesh.matrix);

    var cityMesh = new THREE.Mesh(cityGeometry);
    scene.add(cityMesh);

    //addLight( 0.995, 0.5, 0.9, 100, 100, 100);

}

function addLight( h, s, l, x, y, z ) {
    var textureLoader = new THREE.TextureLoader();
    var textureFlare0 = textureLoader.load('../textures/lensflare0.png');
    var textureFlare3 = textureLoader.load('../textures/lensflare3.png');

    var light = new THREE.PointLight( 0xffffff, 1.5, 2000 );
    light.color.setHSL(h,s,l);
    light.position.set(x,y,z);
    scene.add( light );

    var lensflare = new THREE.Lensflare();
    lensflare.addElement( new THREE.LensflareElement( textureFlare0, 100, 0, light.color ) );
    lensflare.addElement( new THREE.LensflareElement( textureFlare3, 60, 0.6 ) );
    lensflare.addElement( new THREE.LensflareElement( textureFlare3, 70, 0.7 ) );
    lensflare.addElement( new THREE.LensflareElement( textureFlare3, 120, 0.9 ) );
    lensflare.addElement( new THREE.LensflareElement( textureFlare3, 70, 1 ) );
    light.add( lensflare );
}