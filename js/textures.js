const WINDOW_SIZE = 64;

function rgbaToHex(r, g, b) {
    function toHex(rgb) {
        var hex = Number(rgb).toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    }

    return '#' + toHex(r) + toHex(g) + toHex(b);

}

function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), 255];
}

function genWindow() {
    let windowCanvas = document.createElement('canvas');
    windowCanvas.width = WINDOW_SIZE;
    windowCanvas.height = WINDOW_SIZE;

    let context = windowCanvas.getContext("2d");
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, WINDOW_SIZE, WINDOW_SIZE);

    let red = 0.5 + (Math.random() % 128 / 256) + Math.random() * 10 / 50,
        blue = red,
        green = red;

    let average = (red + blue + green) / 3.0,
        bright = average > 0.5,
        potential = Math.floor(average * 255);

    if (bright) {
        for (let x = 2; x < windowCanvas.width; x++) {
            for (let y = 2; y < windowCanvas.height; y++) {
                let color = [255, 0, Math.random() * 255, 255],
                    hue = 0.2 + Math.random() * 100 / 300 + Math.random() * 100 / 300 + Math.random() * 100 / 300,
                    rgba = hslToRgb(hue, 0.3, 0.5);
                rgba[3] = Math.random() * potential / 144;
                context.fillStyle = 'rgba(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ',' + rgba[3] + ')';
                context.fillRect(x, y, 1, 1);
            }
        }
    }


    let repeats = Math.random() * 6 + 1;
    let height = WINDOW_SIZE + Math.random() * 3 - 1 + Math.random() * 3 - 1;

    for (let x = 2; x < windowCanvas.width; x++) {
        height = WINDOW_SIZE;
        height *= Math.random();
        height *= Math.random();
        height *= Math.random();
        height = (WINDOW_SIZE + height) / 2;
        context.fillStyle = 'rgba(0,0,0,' + Math.random() + ')';
        //context.fillRect(x, 0, 1, WINDOW_SIZE);
    }

    return windowCanvas;
}

function genCityTexture() {
    let textureCanvas = document.createElement('canvas');
    textureCanvas.width = 1024;
    textureCanvas.height = 1024;
    let context = textureCanvas.getContext('2d');

    context.imageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;

    for (let x = WINDOW_SIZE; x < textureCanvas.width; x += WINDOW_SIZE) {
        for (let y = WINDOW_SIZE; y < textureCanvas.height; y += WINDOW_SIZE) {
            let randVal = Math.random();
            if (randVal < 0.3) {
                context.fillRect(x, y, 0, 0)
            } else {
                let noise = genWindow();
                context.drawImage(noise, x, y, 32, 32);
            }
        }
    }

    return textureCanvas;
}


/*
function genCityTexture() {
    let canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 64;

    let context = canvas.getContext("2d");
    context.fillStyle = '#000000';
    context.fillRect(0, 0, 32, 64);

    for (let y = 4; y < canvas.height; y += 2) {
        for (let x = 2; x < canvas.width; x += 2) {
            context.fillStyle = "#fc5234";

            let randVal = Math.random();
            let randVal2 = Math.random();

            if (randVal < 0.3) randVal = 0;
            if (randVal2 < 0.3) randVal2 = 0;

            context.fillRect(x, y, 1, 1);
        }
    }

    let bigCanvas = document.createElement('canvas');
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
*/

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