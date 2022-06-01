let srcImage;
let newImage;

const sourceImageResolution = 600;
const finalImageSize = 500;

let newCMYKPixels = [];

let cyans = [];
let magentas = [];
let yellows = [];
let blacks = [];

const cyan = '#00FFFF';
const magenta = '#FF00FF';
const yellow = '#FFFF00';
const black = '#000000';

function preload() {
    srcImage = loadImage('static/image2.png');
}

function setup() {
    colorMode(RGB, 255);
    createCanvas(1500, 500);

    background(255);

    srcImage.resize(sourceImageResolution, sourceImageResolution);
    image(srcImage, 0, 0, 500, 500);
    newImage = srcImage;

    ditherCMYKLayers(newImage);

    image(newImage, 500, 0, 500, 500);

    const offset1 = 0.0;
    const offset2 = 0.0;

    blendMode(MULTIPLY);
    drawDots(cyans, cyan, 1000, 0);
    drawDots(magentas, magenta, 1000, 0);
    drawDots(yellows, yellow, 1000, 0);
    drawDots(blacks, black, 1000, 0);
}

function ditherCMYKLayers(image) {
    // fill pixel boolean arrays
    cyans = Array(image.width)
        .fill(null)
        .map(() => Array(image.height).fill(false));
    magentas = Array(image.width)
        .fill(null)
        .map(() => Array(image.height).fill(false));
    yellows = Array(image.width)
        .fill(null)
        .map(() => Array(image.height).fill(false));
    blacks = Array(image.width)
        .fill(null)
        .map(() => Array(image.height).fill(false));

    image.loadPixels();
    let imageWidth = image.width;
    let imageHeight = image.height;
    for (let y = 0; y < imageHeight - 1; y++) {
        for (let x = 0; x < imageWidth - 1; x++) {
            let pixelIndex = (x + y * imageWidth) * 4;
            let r = image.pixels[pixelIndex];
            let g = image.pixels[pixelIndex + 1];
            let b = image.pixels[pixelIndex + 2];

            let oldPixel = new CMYKColour();
            oldPixel.setColourFromRGB(r, g, b);

            // get source pixel values
            let oldC = oldPixel.cyan;
            let oldM = oldPixel.magenta;
            let oldY = oldPixel.yellow;
            let oldK = oldPixel.black;

            // threshold the pixel values
            let factor = 1;
            let newC = Math.round(factor * oldC);
            let newM = Math.round(factor * oldM);
            let newY = Math.round(factor * oldY);
            let newK = Math.round(factor * oldK);

            // set current pixel true/false base on thresholded pixel
            let newCMYK = new CMYKColour();
            newCMYK.setColourFromCMYK(newC, newM, newY, newK);
            image.pixels[pixelIndex] = newCMYK.red;
            image.pixels[pixelIndex + 1] = newCMYK.green;
            image.pixels[pixelIndex + 2] = newCMYK.blue;
            cyans[x][y] = Boolean(newC);
            magentas[x][y] = Boolean(newM);
            yellows[x][y] = Boolean(newY);
            blacks[x][y] = Boolean(newK);

            // find quantisation error ("remainder" of thresholding)
            let errC = oldC - newC;
            let errM = oldM - newM;
            let errY = oldY - newY;
            let errK = oldK - newK;

            // distribute the quantisation errors out amongst surrounding pixels - right, lower left, below, lower right
            let index = (x + 1 + y * imageWidth) * 4;
            let cmykPix = new CMYKColour();
            r = image.pixels[index];
            g = image.pixels[index + 1];
            b = image.pixels[index + 2];
            cmykPix.setColourFromRGB(r, g, b);
            let spreadCyan = cmykPix.cyan + (errC * 7.0) / 16.0;
            let spreadMagenta = cmykPix.magenta + (errM * 7.0) / 16.0;
            let spreadYellow = cmykPix.yellow + (errY * 7.0) / 16.0;
            let spreadBlack = cmykPix.black + (errK * 7.0) / 16.0;
            let finalCMYK = new CMYKColour();
            finalCMYK.setColourFromCMYK(spreadCyan, spreadMagenta, spreadYellow, spreadBlack);
            image.pixels[index] = finalCMYK.red;
            image.pixels[index + 1] = finalCMYK.green;
            image.pixels[index + 2] = finalCMYK.blue;

            // lower left
            index = (x - 1 + (y + 1) * imageWidth) * 4;

            r = image.pixels[index];
            g = image.pixels[index + 1];
            b = image.pixels[index + 2];
            cmykPix.setColourFromRGB(r, g, b);
            spreadCyan = cmykPix.cyan + (errC * 3.0) / 16.0;
            spreadMagenta = cmykPix.magenta + (errM * 3.0) / 16.0;
            spreadYellow = cmykPix.yellow + (errY * 3.0) / 16.0;
            spreadBlack = cmykPix.black + (errK * 3.0) / 16.0;

            finalCMYK.setColourFromCMYK(spreadCyan, spreadMagenta, spreadYellow, spreadBlack);
            image.pixels[index] = finalCMYK.red;
            image.pixels[index + 1] = finalCMYK.green;
            image.pixels[index + 2] = finalCMYK.blue;

            // below
            index = (x + (y + 1) * imageWidth) * 4;

            r = image.pixels[index];
            g = image.pixels[index + 1];
            b = image.pixels[index + 2];
            cmykPix.setColourFromRGB(r, g, b);
            spreadCyan = cmykPix.cyan + (errC * 5.0) / 16.0;
            spreadMagenta = cmykPix.magenta + (errM * 5.0) / 16.0;
            spreadYellow = cmykPix.yellow + (errY * 5.0) / 16.0;
            spreadBlack = cmykPix.black + (errK * 5.0) / 16.0;

            finalCMYK.setColourFromCMYK(spreadCyan, spreadMagenta, spreadYellow, spreadBlack);
            image.pixels[index] = finalCMYK.red;
            image.pixels[index + 1] = finalCMYK.green;
            image.pixels[index + 2] = finalCMYK.blue;

            // lower right
            index = (x + 1 + (y + 1) * imageWidth) * 4;

            r = image.pixels[index];
            g = image.pixels[index + 1];
            b = image.pixels[index + 2];
            cmykPix.setColourFromRGB(r, g, b);
            spreadCyan = cmykPix.cyan + (errC * 1.0) / 16.0;
            spreadMagenta = cmykPix.magenta + (errM * 1.0) / 16.0;
            spreadYellow = cmykPix.yellow + (errY * 1.0) / 16.0;
            spreadBlack = cmykPix.black + (errK * 1.0) / 16.0;

            finalCMYK.setColourFromCMYK(spreadCyan, spreadMagenta, spreadYellow, spreadBlack);
            image.pixels[index] = finalCMYK.red;
            image.pixels[index + 1] = finalCMYK.green;
            image.pixels[index + 2] = finalCMYK.blue;
        }
    }
    image.updatePixels();
}

function drawDots(dotArray, hexColour, xPos, yPos) {
    const dotSpacing = finalImageSize / dotArray.length;
    let columnError = 0.0;

    noStroke();
    fill(hexColour);
    let dotSize = 1;
    for (let x = 0; x < dotArray.length; x++) {
        columnError = 0.0; //Math.random(0, 5);
        for (let y = 0; y < dotArray[0].length; y++) {
            if (dotArray[x][y]) {
                let randomOffset = 0.0; //Math.random(-1, 1);
                let xDotPos = x * dotSpacing + xPos + randomOffset + columnError;
                let yDotPos = y * dotSpacing + yPos + randomOffset + columnError;
                ellipse(xDotPos, yDotPos, dotSize, dotSize);
            }
        }
    }
}

function index(x, y, imageWidth) {
    return x + y * imageWidth;
}

// apparently x and y counters in the dithering loop are off?

// routine to draw all layers? is that needed?

// step to adjust colours on source photo

// clearer names for source resolution, what that effects on final pic, etc.
// clean up the positioning of the final image
// split up the CYMK-dither-layer steps. split the image to layers. dither each layer. draw the dithered image. single

// half tone effect instead of dither? other dithering algorithms?

// UI to adjust source res, target DPI/res, thresholding during dither

// filters on final image / other aging effects?

// obviously a UI for uploading images, refreshing final image

// animated rendering of final image
