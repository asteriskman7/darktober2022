'use strict';

window.sketchClass = class extends Sketch {
  desc = "Fear the unknown for therein lie the Old Ones.";

  constructor() {
    super();
    this.blockSize = 8;
    this.gridW = Math.floor(this.canvas.width / this.blockSize);
    this.gridH = Math.floor(this.canvas.height / this.blockSize);
  }


  load() {
    super.load();
    this.cmonster = document.createElement('canvas');
    this.cmonster.width = this.canvas.width;
    this.cmonster.height = this.canvas.height;
    this.mctx = this.cmonster.getContext('2d');
    this.cbmonster = document.createElement('canvas');
    this.cbmonster.width = this.canvas.width;
    this.cbmonster.height = this.canvas.width;
    this.bmctx = this.cbmonster.getContext('2d');
    this.bmctx.filter = 'blur(3px)';
  }

  update() {

  }


  draw(ctx, width, height, t, mousePoint) {
    ctx.fillStyle = 'hsl(222, 25%, 25%)';
    ctx.fillRect(0, 0, width, height);

    //monster
    this.mctx.clearRect(0, 0, width, height);
    this.mctx.fillStyle = 'grey';
    this.mctx.fillRect(110 + 60 * Math.sin(this.t / 2), 100 + 5 * Math.sin(this.t), 5, 5);
    this.mctx.fillRect(110 + 60 * Math.sin(this.t / 2.1 + 555), 100 + 5 * Math.sin(this.t + 555), 5, 5);
    //light
    if (Math.random() > 0.9) {
      const gradLight = ctx.createRadialGradient(
        50 + 120 / 2, 80 + 150 + 30, 5,
        50 + 120 / 2, 80 + 150 + 30, 100 
      );
      gradLight.addColorStop(0, 'yellow');
      gradLight.addColorStop(1, 'hsla(0, 0%, 0%, 0.1)');
      ctx.fillStyle = gradLight;
      ctx.fillRect(50, 80, 120, 150);
    }
    //tenticles
    this.mctx.strokeStyle = 'hsl(104, 64%, 26%)';
    this.mctx.lineWidth = 5;
    this.mctx.lineCap = 'round';
    for (let i = 0; i < 5; i++) {
      const bx = 50 + 120 / 2 + 50 * Math.sin(this.t / 5) * Math.cos(this.t / 3 );
      const by = 80 + 150 + 30;
      const angle = this.lmap(i, 0, 4, 5 * Math.PI / 4, 7 * Math.PI / 4);
      const l = 60 + 20 * Math.sin(this.t * 2 + i * 988);
      const ex = bx + l * Math.cos(angle) + 3 * Math.sin(this.t * 4 + i * 11);
      const ey = by + l * Math.sin(angle) + 3 * Math.sin(this.t * 5 + i * 12);
      this.mctx.beginPath();
      this.mctx.moveTo(bx, by);
      this.mctx.lineTo(ex, ey);
      this.mctx.stroke();

    }

    const blurOn = true;

    //copy monster into window with blur
    this.bmctx.clearRect(0, 0, width, height);
    this.bmctx.drawImage(this.cmonster, 0, 0, width, height);
    if (blurOn) {
      ctx.drawImage(this.cbmonster, 0, 0, 50+55, height, 0, 0, 50+55, height);
      ctx.drawImage(this.cbmonster, 50 + 120 - 55, 0, 55, height, 50 + 120 - 55, 0, 55, height);
      ctx.drawImage(this.cmonster, 50+55, 0, 120 - 55 * 2, height, 50+55, 0, 120 - 55 * 2, height);
    } else {
      ctx.drawImage(this.cmonster, 0, 0, width, height);
    }

    //wall
    ctx.fillStyle = 'hsl(62, 35%, 86%)';
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    //window hole
    ctx.rect(50, 80, 120, 150);
    ctx.fill('evenodd');
    
    //carpet
    ctx.fillStyle = 'hsl(51, 35%, 47%)';
    ctx.fillRect(0, 300, width, height - 300);

    //window

    //outline
    ctx.strokeStyle = 'hsl(51, 37%, 28%)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.rect(50, 80, 120, 150);
    ctx.moveTo(50, 80 + 75);
    ctx.lineTo(50 + 120, 80 + 75);
    ctx.stroke();

    //curtains
    if (blurOn) {
      ctx.fillStyle = 'hsla(183, 37%, 28%, 0.8)';
      ctx.fillRect(50, 80, 55, 150);
      ctx.fillRect(50 + 120 - 55, 80, 55, 150);
    }


    //tv
    //table
    ctx.fillStyle = 'hsl(130, 19%,  25%)';
    ctx.fillRect(260, 255, 200, 80);

    //stand
    ctx.fillStyle = 'hsl(183, 0%, 19%)';
    ctx.fillRect(260 + 100 - 20, 250, 40, 5);
    ctx.fillRect(260 + 100 - 5, 240, 10, 10); 
    //outline
    ctx.fillRect(260 + 100 - 75, 165, 150, 75);
    //screen
    const pixelSize = 2;
    const bw = 5;
    const sw = 150 - bw * 2;
    const sh = 75 - bw * 2;
    const sx0 = 260 + 100 - 75 + bw;
    const sy0 = 165 + bw;
    if (Math.sin(this.t) * Math.cos(this.t * 4) > 0) {
    //if (false) {
      for (let sx = 0; sx < Math.floor(sw/pixelSize); sx++) {
        for (let sy = 0; sy < Math.floor(sh/pixelSize); sy++) {
          ctx.fillStyle = `hsl(0, 0%, ${Math.random() * 70 + 15}%)`;
          ctx.fillRect(sx0 + sx * pixelSize, sy0 + sy * pixelSize, pixelSize, pixelSize);
        }
      }
    } else {
      const dl = this.lmap(Math.random(), 0, 1, -5, 5);
      ctx.fillStyle = `hsl(0, 98%, ${43 + dl}%)`;
      ctx.fillRect(sx0, sy0, sw, sh);
      ctx.font = '8px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `hsl(0, 98%, ${90 + dl}%)`;
      ctx.fillText('EMERGENCY BROADCAST SYSTEM', sx0 + sw / 2, sy0 + 10);
      const lines = [
       'THIS IS NOT A TEST',
       'STAY INSIDE',
       'STAY AWAY FROM WINDOWS',
       'IGNORE PHONE CALLS',
       'LOCK ALL DO@OD$@!!'
      ];
      lines.forEach( (s, i) => {
        ctx.fillText(s, sx0 + sw / 2, sy0 + 20 + i * 10);
      });
    }

    const grad = ctx.createRadialGradient(
      110, 154, 10,
      110, 154, 630
    );
    grad.addColorStop(0, 'hsla(0, 0%, 0%, 0.4)');
    grad.addColorStop(0.65, 'hsla(0, 0%, 0%, 0.9)');
    ctx.fillStyle = grad;
    ctx.fillRect(-50, -50, width + 100, height + 100);
  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
