function generateScene() {
    // Floor
    var planeGeometry = new THREE.PlaneGeometry(5000, 5000, 32);
    var planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x111111,
        side: THREE.DoubleSide
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);

    var hemLight = new THREE.HemisphereLight(0xfffff0, 0x101020, 1.25);
    hemLight.position.set(0.75, 1, 0.25);
    scene.add(hemLight);

    var buildingGeometry = new THREE.BoxGeometry(1, 1, 1);
    buildingGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
    buildingGeometry.faces.splice(6, 2);
    buildingGeometry.faceVertexUvs[0].splice(6, 2);
    buildingGeometry.faceVertexUvs[0][5][2].set(0, 0);
    buildingGeometry.faceVertexUvs[0][4][2].set(0, 0);

    var buildingMesh = new THREE.Mesh(buildingGeometry);
    var cityGeometry = new THREE.Geometry();
    var numOfBuildings = 1000;

        for (var i=0; i < numOfBuildings; i++) {
            buildingMesh.position.x = Math.floor(Math.random() * 200 - 100) * 20;
            buildingMesh.position.z = Math.floor(Math.random() * 200 - 100) * 20;

            buildingMesh.scale.x = Math.random() * Math.random() * Math.random() * 30 + 50;
            buildingMesh.scale.y = Math.random() * 175 + 125;
            buildingMesh.scale.z = buildingMesh.scale.x;

            buildingMesh.updateMatrix();
            cityGeometry.merge(buildingMesh.geometry, buildingMesh.matrix);
        }

    buildingMesh.position.x = 0;
    buildingMesh.position.z = 0;

    buildingMesh.scale.x = 55;
    buildingMesh.scale.y = 150;
    buildingMesh.scale.z = 55;

    buildingMesh.updateMatrix();
    cityGeometry.merge(buildingMesh.geometry, buildingMesh.matrix);

    var texture = new THREE.Texture(genCityTexture());
    texture.anisotropy = renderer.getMaxAnisotropy();
    texture.needsUpdate = true;

    var material = new THREE.MeshLambertMaterial({
        map: texture,
        vertexColors: THREE.VertexColors
    });

    var cityMesh = new THREE.Mesh(cityGeometry, material);
    scene.add(cityMesh);

    addLight(0.995, 0.5, 0.9, 0, 225, 0);

}

function genCityTexture() {
    var canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 64;

    var context = canvas.getContext("2d");
    context.fillStyle = '#000000';
    context.fillRect(0, 0, 32, 64);

    for (var y = 4; y < canvas.height; y += 2) {
        for (var x = 2; x < canvas.width; x += 2) {
            context.fillStyle = "#fc5234";

            randVal = Math.random();
            randVal2 = Math.random();

            if (randVal < 0.3) randVal = 0;
            if (randVal2 < 0.3) randVal2 = 0;

            context.fillRect(x, y, randVal, randVal2);
        }
    }

    var bigCanvas = document.createElement('canvas');
    bigCanvas.width = 512;
    bigCanvas.height = 1024;
    context = bigCanvas.getContext('2d');

    // disable smoothing to avoid blurry effect when scaling
    context.imageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;

    // copy small canvas into big canvas
    context.drawImage(canvas, 0, 0, bigCanvas.width, bigCanvas.height);

    return bigCanvas;
}

function addLight(h, s, l, x, y, z) {
    var textureLoader = new THREE.TextureLoader();
    var textureFlare0 = textureLoader.load('../textures/lensflare0.png');
    var textureFlare3 = textureLoader.load('../textures/lensflare3.png');

    var light = new THREE.PointLight(0xffffff, 1.5, 2000);
    light.color.setHSL(h, s, l);
    light.position.set(x, y, z);
    scene.add(light);

    var lensflare = new THREE.Lensflare();
    lensflare.addElement(new THREE.LensflareElement(textureFlare0, 100, 0, light.color));
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 60, 0.6));
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 70, 0.7));
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 120, 0.9));
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 70, 1));
    light.add(lensflare);
}