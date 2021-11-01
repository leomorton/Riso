class CMYKColour {
  constructor() {
    this.cyan = 0.0;
    this.magenta = 0.0;
    this.yellow = 0.0;
    this.black = 0.0;

    this.red = 0.0;
    this.green = 0.0;
    this.blue = 0.0;
  }

  setColourFromCMYK(cyanIn, magentaIn, yellowIn, blackIn) {
      this.cyan = constrain(cyanIn, 0, 1.0);
      this.magenta = constrain(magentaIn, 0, 1.0);
      this.yellow = constrain(yellowIn, 0, 1.0);
      this.black = constrain(blackIn, 0, 1.0);
      
      this.red = 255.0 * (1 - this.cyan) * (1 - this.black);
      this.green = 255.0 * (1 - this.magenta) * (1 - this.black);
      this.blue = 255.0 * (1 - this.yellow) * (1 - this.black);
  }

  setColourFromRGB(redIn, greenIn, blueIn) {
    this.red = redIn;
    this.green = greenIn;
    this.blue = blueIn;

    // convert to CMY
    this.cyan = 1.0 - (this.red / 255);
    this.magenta = 1.0 - (this.green / 255);
    this.yellow = 1.0 - (this.blue / 255);

    //convert to CMYK
    this.black = 1.0;

    if (this.cyan < this.black) { 
      this.black = this.cyan; 
    }
    if (this.magenta < this.black) { 
      this.black = this.magenta; 
    }
    if (this.yellow < this.black) { 
      this.black = this.yellow; 
    }
    if (this.cyan != 1.0 && this.black != 1.0) {
      this.cyan = ( this.cyan - this.black ) / ( 1 - this.black );
    }
    if (this.magenta != 1.0 && this.black != 1.0) {
      this.magenta = ( this.magenta - this.black ) / ( 1 - this.black );
    }
    if (this.yellow != 1.0 && this.black != 1.0) {
      this.yellow = ( this.yellow - this.black ) / ( 1 - this.black ); 
    }
  }
  
  getRGB() {
    return color(this.red, this.green, this.blue);
  }
}