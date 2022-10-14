'use strict';

window.sketchClass = class extends Sketch {
  desc = "Don't worry, the 2.88 trillion unique clowns can't hurt you.";

  constructor() {
    super();
    this.blockSize = 4;
    this.gridW = Math.floor(this.canvas.width / this.blockSize);
    this.gridH = Math.floor(this.canvas.height / this.blockSize);
  }


  load() {
    super.load();

  }

  rr(min, max) {
    this.offset++;
    return this.lmap(this.rnd(this.seed + this.offset), 0, 1, min, max);
  }


  update() {
    const duration = 3;
    this.seed = Math.floor((new Date()).getTime() / (duration * 1000));
    this.offset = this.rnd(this.seed * 9999);
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'hsl(45, 45%, 87%)';
    ctx.fillRect(0, 0, width, height);

    ctx.translate(width / 2, height / 2);

    //head
    ctx.fillStyle = `hsl(${this.rr(0, 360)}, ${this.rr(30, 100)}%, ${this.rr(30, 90)}%)`;
    ctx.beginPath();
    ctx.ellipse(0, 0, width * 0.4, height * 0.4, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    const irisColor = `hsl(${this.rr(44, 188)}, ${this.rr(30, 64)}%, ${this.rr(30, 60)}%)`;
    const browHeight = this.rr(-40, -60);
    const browWidth = this.rr(1, 20);
    const browColor = `hsl(${this.rr(0, 360)}, ${this.rr(0, 100)}%, ${this.rr(0, 100)}%)`;
    const aboveEyeType = Math.floor(this.rr(0, 3));
    const aec = `hsl(${this.rr(0, 360)}, ${this.rr(0, 100)}%, ${this.rr(0, 100)}%)`;
    const aew = this.rr(20, 80);
    const aeh = this.rr(20, 80);
    const belowEyeType = 2; //Math.floor(this.rr(0, 3));
    const bec = `hsl(${this.rr(0, 360)}, ${this.rr(0, 100)}%, ${this.rr(0, 100)}%)`;
    const bew = this.rr(20, 80);
    const beh = this.rr(20, 80);

    for (let side = -1; side <= 1; side+=2) {
      //eyes
      ctx.fillStyle = 'white';
      ctx.beginPath();
      const eyeLimit = 0.5;
      const dy = 10;
      ctx.arc(side * 70, -50 - dy, 20, eyeLimit, Math.PI - eyeLimit);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(side * 70, -50 + dy, 20, Math.PI + eyeLimit, 2 * Math.PI - eyeLimit);
      ctx.fill();
      ctx.fillStyle = irisColor;
      ctx.beginPath();
      ctx.arc(side * 70, -50, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(side * 70, -50, 5, 0, Math.PI * 2);
      ctx.fill();


      //above eye
      ctx.fillStyle = aec;
      switch (aboveEyeType) {
        case 0 : {
          ctx.fillRect(side * 70 - aew/2, -120 - aeh / 2, aew, aeh); 
          break;
        }
        case 1: {
          ctx.beginPath();
          ctx.ellipse(side * 70, -120, aew / 2, aeh / 2, 0, 0, 2 * Math.PI);
          ctx.fill();
          break;
        }
        case 2: {
          ctx.beginPath();
          ctx.moveTo(side * 70, -120 - aeh / 2);
          ctx.lineTo(side * 70 + aew / 2, -120 + aeh / 2);
          ctx.lineTo(side * 70 - aew / 2, -120 + aeh / 2);
          ctx.lineTo(side * 70, -120 - aeh / 2);
          ctx.fill();
          break;
        }
      }

      //below eye
      ctx.fillStyle = bec;
      switch (belowEyeType) {
        case 0 : {
          ctx.fillRect(side * 70 - aew/2, -30 , aew, aeh); 
          break;
        }
        case 1: {
          ctx.beginPath();
          ctx.ellipse(side * 70, 0, aew / 2, aeh / 2, 0, 0, 2 * Math.PI);
          ctx.fill();
          break;
        }
        case 2: {
          ctx.beginPath();
          ctx.moveTo(side * 70, 0 + aeh / 2);
          ctx.lineTo(side * 70 + aew / 2, 0 - aeh / 2);
          ctx.lineTo(side * 70 - aew / 2, 0 - aeh / 2);
          ctx.lineTo(side * 70, 0 + aeh / 2);
          ctx.fill();
          break;
        }
      }

      //eyebrow
      const browLimit = 0.5;
      ctx.fillStyle = 'brown';
      ctx.lineWidth = browWidth;
      ctx.lineCap = 'round';
      ctx.strokeStyle = browColor;
      ctx.beginPath();
      ctx.arc(side * 70, browHeight, 50, Math.PI + browLimit, 2 * Math.PI - browLimit);
      ctx.stroke();
    }

    //nose
    const nosec = `hsl(${this.rr(0, 360)}, ${this.rr(0, 100)}%, ${this.rr(0, 100)}%)`;
    ctx.fillStyle = nosec;
    ctx.beginPath();
    ctx.arc(0, 0, this.rr(20, 50), 0, 2 * Math.PI);
    ctx.fill();

    //mouth
    const mouthDir = Math.floor(this.rr(0, 2));
    const mouthc = `hsl(${this.rr(0, 360)}, ${this.rr(0, 100)}%, ${this.rr(0, 100)}%)`;
    const mouthr = 100;
    const mouthl = 0.4;
    ctx.lineWidth = this.rr(2, 50);
    ctx.fillStyle = mouthc;
    ctx.beginPath();
    if (mouthDir === 0) {
      ctx.arc(0, 30, mouthr, mouthl, Math.PI - mouthl);
    } else {
      ctx.arc(0, 160, mouthr, Math.PI + mouthl, 2 * Math.PI - mouthl);
    }
    ctx.stroke();

    //hair
    const rb = this.rr(0, 100) < 5;
    for (let a = 0; a < 1 * Math.PI / 2 + 0.1; a += 0.2) {
       if (rb) {
         ctx.fillStyle = `hsl(${this.rr(0, 360)}, 100%, 50%)`;
       }
       ctx.beginPath();
       ctx.arc(width * 0.4 * Math.cos(-a), width * 0.4 * Math.sin(-a), 30, 0, 2 * Math.PI);
       ctx.arc(width * 0.4 * Math.cos(Math.PI - a), width * 0.4 * Math.sin(-a), 30, 0, 2 * Math.PI);
       ctx.fill();
    }



  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
