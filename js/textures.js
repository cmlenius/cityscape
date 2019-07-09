function rgbToHex(r, g, b) {
    function toHex(rgb) {
        var hex = Number(rgb).toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    }

    return '#' + toHex(Math.floor(r)) + toHex(Math.floor(g)) + toHex(Math.floor(b));

}

function fract(x) {
    return x - Math.floor(x);
}

function genCityTexture() {
    let STEP = 4,
        WINX = 10 * STEP,
        WINY = 8 * STEP;

    let textureCanvas = document.createElement('canvas');
    textureCanvas.width = 440;
    textureCanvas.height = 1024;

    let context = textureCanvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;

    let winColor = [Math.random()*80 + 175,
                    Math.random()*80 + 175,
                    Math.random()*80 + 175];

    let isWindowOn = {};
    for (let x = WINX; x < textureCanvas.width; x += WINX) {
        for (let y = WINY; y < textureCanvas.height; y += WINY) {
            let key = x.toString() + "," + y.toString();
            isWindowOn[key] = Math.random();
        }
    }

    for (let x = 0; x < textureCanvas.width; x += STEP) {
        for (let y = 0; y < textureCanvas.height; y += STEP) {

            // Edges
            if (x < WINX || textureCanvas.width - WINX < x ||
                y < WINY*2 || textureCanvas.height - WINY*2 < y ||
                (5*WINX <= x && x <= 6*WINX)) {

                let randVal = Math.floor(Math.random() * 16);
                context.fillStyle = rgbToHex(randVal,randVal,randVal);
            }

            // Windows
            else if ((4 < x % WINX && x % WINX < 36) &&
                     (8 < y % WINY && y % WINY < 32)) {

                let tmpx = x - x % WINX,
                    tmpy = y - y % WINY,
                    key = tmpx.toString() + "," + tmpy.toString();

                // Window On
                if (isWindowOn[key] >= 0.65) {
                    let randVal = Math.floor(Math.random() * 32);
                    context.fillStyle = rgbToHex(winColor[0] - randVal,
                                                 winColor[1] - randVal,
                                                 winColor[2] - randVal);
                }

                // Window Off
                else {
                    let randVal = Math.floor(Math.random() * 16) + 32 ;
                    context.fillStyle = rgbToHex(randVal,randVal,randVal);
                }
            }

            // Wall
            else {
                let winColor = Math.floor(Math.random() * 16) + 16;
                context.fillStyle = rgbToHex(winColor,winColor,winColor);
            }
            context.fillRect(x, y, STEP, STEP);
        }
    }

    let texture = new THREE.Texture(textureCanvas);
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.needsUpdate = true;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    return texture;
}


function genPlaneTexture() {
    let STEP = 8;

    let textureCanvas = document.createElement('canvas');
    textureCanvas.width = GRID_SIZE;
    textureCanvas.height = GRID_SIZE;

    let context = textureCanvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;

    context.fillStyle = "#182518";
    context.fillRect(0,0,GRID_SIZE,GRID_SIZE);

    // draw street outlines
    for(let i=0; i<SECTIONS; i++){
        context.fillStyle = "#111111";
        context.fillRect(SECTION_SIZE*i+STEP,0, 2,GRID_SIZE);
        context.fillRect(SECTION_SIZE*(i+1)-STEP-2,0, 2,GRID_SIZE);
        context.fillRect(0,SECTION_SIZE*i+STEP, GRID_SIZE,2);
        context.fillRect(0,SECTION_SIZE*(i+1)-STEP-2, GRID_SIZE,2);
    }

    // draw streets
    for(let i=0; i<SECTIONS; i++){
        context.fillStyle = "#333333";
        context.fillRect(SECTION_SIZE*i, 0, STEP, GRID_SIZE);
        context.fillRect(SECTION_SIZE*(i+1) - STEP, 0, STEP, GRID_SIZE);
        context.fillRect(0, SECTION_SIZE*i, GRID_SIZE, STEP);
        context.fillRect(0, SECTION_SIZE*(i+1) - STEP, GRID_SIZE, STEP);
    }

    return textureCanvas;

}

function addLight(h, s, l, x, y, z) {
    let textureLoader = new THREE.TextureLoader();
    let textureFlare0 = textureLoader.load('../textures/lensflare0.png');
    let textureFlare3 = textureLoader.load('../textures/lensflare3.png');

    let light = new THREE.PointLight(0xffffff, 1.5, 2000);
    light.color.setHSL(h, s, l);
    light.position.set(x, y, z);
    scene.add(light);

    let lensflare = new THREE.Lensflare();
    lensflare.addElement(new THREE.LensflareElement(textureFlare0, 100, 0, light.color));
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 60, 0.6));
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 70, 0.7));
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 120, 0.9));
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 70, 1));
    light.add(lensflare);
}
