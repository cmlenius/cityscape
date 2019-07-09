// Constants
const GRID_SIZE = 2048;

function generateScene() {

    // Floor
    let planeTexture = new THREE.Texture(genPlaneTexture(GRID_SIZE));
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

    let hemLight = new THREE.HemisphereLight(0xfffff0, 0x101020, 1.25);
    hemLight.position.set(0.75, 1, 0.25);
    scene.add(hemLight);

    //genBuildings();
    //addLight(0.995, 0.5, 0.9, -1024, 200, -1024);
}
 
function genBuildings() {
    let buildingGeometry = new THREE.BoxGeometry(1, 1, 1);
    buildingGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
    buildingGeometry.faces.splice(6, 2);
    buildingGeometry.faceVertexUvs[0].splice(6, 2);
    buildingGeometry.faceVertexUvs[0][5][2].set(0, 0);
    buildingGeometry.faceVertexUvs[0][4][2].set(0, 0);
    let buildingMesh = new THREE.Mesh(buildingGeometry);
    let cityGeometry = new THREE.Geometry();
    let buildingsPerSection = 12;

    buildingMesh.scale.x = 120;
    buildingMesh.scale.y = 300;
    buildingMesh.scale.z = 80;
    buildingMesh.position.x = 0;
    buildingMesh.position.z = 0;
    buildingMesh.updateMatrix();
    cityGeometry.merge(buildingMesh.geometry, buildingMesh.matrix);


    let texture = new THREE.Texture(genCityTexture());
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.needsUpdate = true;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    let material = new THREE.MeshLambertMaterial({
        map: texture,
        vertexColors: THREE.VertexColors
    });

    let cityMesh = new THREE.Mesh(cityGeometry, material);
    scene.add(cityMesh);
}
