// Constants
const GRID_SIZE = 2048;
const SECTION_SIZE = 512;
const UNIT = 32;

function generateScene() {

    // Floor
    let planeGeometry = new THREE.PlaneGeometry(GRID_SIZE, GRID_SIZE, 32);
    let planeMaterial = new THREE.MeshBasicMaterial({color: 0x111111, side: THREE.DoubleSide});
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);

    let hemLight = new THREE.HemisphereLight(0xfffff0, 0x101020, 1.25);
    hemLight.position.set(0.75, 1, 0.25);
    scene.add(hemLight);

    let subdivision = subDivideCity();
    //genBuildings();
    genStreets(subdivision);

    addLight(0.995, 0.5, 0.9, 0, 225, 0);
}

function subDivideCity() {
    let divisionX = [];
    let divisionZ = [];

    let tmp = Math.random() * 384 + 128;

    let i = GRID_SIZE;
    while (i > tmp) {
        i -= tmp;
        divisionX.push(tmp);
        tmp = Math.random() * 384 + 128;
    }
    if (i > 128) divisionX.push(i);

    i = GRID_SIZE;
    while (i > tmp) {
        i -= tmp;
        divisionZ.push(tmp);
        tmp = Math.random() * 384 + 128;
    }
    if (i > 128) divisionZ.push(i);

    return {
        divisionX: divisionX,
        divisionZ: divisionZ
    };
}

function genStreets(subdivision) {
    let streetGeometry = new THREE.BoxGeometry(1, 1, 1);
    let streetMesh = new THREE.Mesh(streetGeometry);
    let streetsGeometry = new THREE.Geometry();

    let xsum = -GRID_SIZE/2;
    for (let i=0; i<subdivision.divisionX.length; i++) {
        xsum += subdivision.divisionX[i];
        streetMesh.position.x = xsum;
        streetMesh.position.z = 0;
        streetMesh.scale.x = UNIT;
        streetMesh.scale.y = 1;
        streetMesh.scale.z = GRID_SIZE;
        streetMesh.updateMatrix();
        streetsGeometry.merge(streetMesh.geometry, streetMesh.matrix);

    }

    let zsum = -GRID_SIZE/2;
    for (let i=0; i<subdivision.divisionZ.length; i++) {
        zsum += subdivision.divisionZ[i];
        streetMesh.position.x = 0;
        streetMesh.position.z = zsum;
        streetMesh.scale.x = GRID_SIZE;
        streetMesh.scale.y = 1;
        streetMesh.scale.z = UNIT;
        streetMesh.updateMatrix();
        streetsGeometry.merge(streetMesh.geometry, streetMesh.matrix);
    }

    /*
    for (let i = -GRID_SIZE / 2; i < GRID_SIZE / 2; i += SECTION_SIZE) {
        streetMesh.position.x = i;
        streetMesh.position.z = 0;
        streetMesh.scale.x = 64;
        streetMesh.scale.y = 1;
        streetMesh.scale.z = GRID_SIZE;
        streetMesh.updateMatrix();
        streetsGeometry.merge(streetMesh.geometry, streetMesh.matrix);


        streetMesh.position.x = 0;
        streetMesh.position.z = i;
        streetMesh.scale.x = GRID_SIZE;
        streetMesh.scale.y = 1;
        streetMesh.scale.z = 64;
        streetMesh.updateMatrix();
        streetsGeometry.merge(streetMesh.geometry, streetMesh.matrix);

    }
*/
    let streetsMaterial = new THREE.MeshBasicMaterial({color: 0x555555});
    let streetsMesh = new THREE.Mesh(streetsGeometry, streetsMaterial);
    scene.add(streetsMesh);
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


    for (let x = -GRID_SIZE / 2; x < GRID_SIZE / 2; x += SECTION_SIZE) {
        for (let z = -GRID_SIZE / 2; z < GRID_SIZE / 2; z += SECTION_SIZE) {
            for (let i = 0; i < buildingsPerSection; i++) {
                let tmp1 = Math.random() * 16 + 48,
                    tmp2 = Math.random() * 16 + 48;
                buildingMesh.scale.x = tmp1;
                buildingMesh.scale.y = Math.random() * 175 + 125;
                buildingMesh.scale.z = tmp2;
                buildingMesh.position.x = Math.random() * (SECTION_SIZE - 2 * tmp1) + x + tmp1;
                buildingMesh.position.z = Math.random() * (SECTION_SIZE - 2 * tmp2) + z + tmp2;
                buildingMesh.updateMatrix();
                cityGeometry.merge(buildingMesh.geometry, buildingMesh.matrix);
            }
        }
    }

    /*
        buildingMesh.position.x = Math.random() * (512 - 128) + 64;
        buildingMesh.position.z = 0;

        buildingMesh.scale.x = 64;
        buildingMesh.scale.y = 150;
        buildingMesh.scale.z = 64;

        buildingMesh.updateMatrix();
        cityGeometry.merge(buildingMesh.geometry, buildingMesh.matrix);

    */
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