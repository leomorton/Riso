let srcImage;
let newImage;

let sourceImageResolution = 600;

let newCMYKPixels = [];

let cyans = [];
let magentas = [];
let yellows = [];
let blacks = [];

function preload() {
  srcImage = loadImage("static/image2.jpg");
}

function setup() {
  // noSmooth(); - unnecessary
  colorMode(RGB, 255);
  createCanvas(1500, 500);

  background(255);

  srcImage.resize(sourceImageResolution, sourceImageResolution);
  image(srcImage, 0, 0, 500, 500);
  newImage = srcImage;

  // newCMYKPixels = new CMYKColour - initialise array of size width x height.
  ditherCMYKLayers(newImage);

  image(newImage, 500, 0, 500, 500);
}

function ditherCMYKLayers(image) {
  // fill pixel boolean arrays
  cyans = Array(image.width).fill(null).map(() => Array(image.height).fill(false));
  magentas = Array(image.width).fill(null).map(() => Array(image.height).fill(false));
  yellows = Array(image.width).fill(null).map(() => Array(image.height).fill(false));
  blacks = Array(image.width).fill(null).map(() => Array(image.height).fill(false));

  image.loadPixels();
  let imageWidth = image.width;
  let imageHeight = image.height;
  for (let y = 0; y < imageHeight - 1; y++) {
    for (let x = 0; x < imageWidth - 1; x++) {
      let pixelIndex = (x + y * imageWidth) * 4;
      let r = image.pixels[pixelIndex];
      let g = image.pixels[pixelIndex + 1];
      let b = image.pixels[pixelIndex + 2];
      
      let oldPixel = new CMYKColour()
      oldPixel.setColourFromRGB(r, g, b);

      // get source pixel values
      let oldC = oldPixel.cyan;
      let oldM = oldPixel.magenta;
      let oldY = oldPixel.yellow;
      let oldK = oldPixel.black;

      // threshold the pixel values
      let factor = 1.0;
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
      let errY = oldM - newY;
      let errK = oldM - newK;

      // distribute the quantisation errors out amongst surrounding pixels - right, lower left, below, lower right
      let index = (x + 1 + y * imageWidth) * 4;
      let cmykPix = new CMYKColour();
      r = image.pixels[index]
      g = image.pixels[index + 1];
      b = image.pixels[index + 2];
      cmykPix.setColourFromRGB(r, g, b);
      let spreadCyan = cmykPix.cyan + errC * 7.0 / 16.0;
      let spreadMagenta = cmykPix.magenta + errM * 7.0 / 16.0;
      let spreadYellow = cmykPix.yellow + errY * 7.0 / 16.0;
      let spreadBlack = cmykPix.black + errK * 7.0 / 16.0;
      let finalCMYK = new CMYKColour();
      finalCMYK.setColourFromCMYK(spreadCyan, spreadMagenta, spreadYellow, spreadBlack);
      image.pixels[index] = finalCMYK.red;
      image.pixels[index + 1] = finalCMYK.green;
      image.pixels[index + 2] = finalCMYK.blue;
      
      index = (x-1 + y+1 * imageWidth) * 4;
      //cmykPix = new CMYKColour();
      r = image.pixels[index]
      g = image.pixels[index + 1];
      b = image.pixels[index + 2];
      cmykPix.setColourFromRGB(r, g, b);
      spreadCyan = cmykPix.cyan + errC * 3.0 / 16.0;
      spreadMagenta = cmykPix.magenta + errM * 3.0 / 16.0;
      spreadYellow = cmykPix.yellow + errY * 3.0 / 16.0;
      spreadBlack = cmykPix.black + errK * 3.0 / 16.0;
      //finalCMYK = new CMYKColour();
      finalCMYK.setColourFromCMYK(spreadCyan, spreadMagenta, spreadYellow, spreadBlack);
      image.pixels[index] = finalCMYK.red;
      image.pixels[index + 1] = finalCMYK.green;
      image.pixels[index + 2] = finalCMYK.blue;

      index = (x + y+1 * imageWidth) * 4;
      //cmykPix = new CMYKColour();
      r = image.pixels[index]
      g = image.pixels[index + 1];
      b = image.pixels[index + 2];
      cmykPix.setColourFromRGB(r, g, b);
      spreadCyan = cmykPix.cyan + errC * 5.0 / 16.0;
      spreadMagenta = cmykPix.magenta + errM * 5.0 / 16.0;
      spreadYellow = cmykPix.yellow + errY * 5.0 / 16.0;
      spreadBlack = cmykPix.black + errK * 5.0 / 16.0;
      //finalCMYK = new CMYKColour();
      finalCMYK.setColourFromCMYK(spreadCyan, spreadMagenta, spreadYellow, spreadBlack);
      image.pixels[index] = finalCMYK.red;
      image.pixels[index + 1] = finalCMYK.green;
      image.pixels[index + 2] = finalCMYK.blue;

      index = (x+1 + y+1 * imageWidth) * 4;
      //cmykPix = new CMYKColour();
      r = image.pixels[index]
      g = image.pixels[index + 1];
      b = image.pixels[index + 2];
      cmykPix.setColourFromRGB(r, g, b);
      spreadCyan = cmykPix.cyan + errC * 1.0 / 16.0;
      spreadMagenta = cmykPix.magenta + errM * 1.0 / 16.0;
      spreadYellow = cmykPix.yellow + errY * 1.0 / 16.0;
      spreadBlack = cmykPix.black + errK * 1.0 / 16.0;
      //finalCMYK = new CMYKColour();
      finalCMYK.setColourFromCMYK(spreadCyan, spreadMagenta, spreadYellow, spreadBlack);
      image.pixels[index] = finalCMYK.red;
      image.pixels[index + 1] = finalCMYK.green;
      image.pixels[index + 2] = finalCMYK.blue;
    }
  }
  image.updatePixels();
  
}




function index(x, y, imageWidth) {
  return x + y * imageWidth;
}