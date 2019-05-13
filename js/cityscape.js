function generateScene() {
    var planeGeometry = new THREE.PlaneGeometry( 1000, 1000, 32 );
    var planeMaterial = new THREE.MeshBasicMaterial({color: 0x550000, side: THREE.DoubleSide});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);
}

