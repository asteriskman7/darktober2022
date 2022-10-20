'use strict';

window.sketchClass = class extends Sketch {
  desc = "Did you know? If you go deep enough under water, you can hold your breath for the rest of your life.";

  constructor() {
    super();
    this.blockSize = 16;
    this.gridW = Math.floor(this.canvas.width / this.blockSize);
    this.gridH = Math.floor(this.canvas.height / this.blockSize);
  }


  load() {
    super.load();
    //this.minl = Infinity;
    //this.maxl = -Infinity;
    this.bubbles = [];
  }

  update() {
  }



  draw(ctx, width, height, t) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, width, height);

    const f = Math.pow(Math.cos(this.t * 0.2), 2);
    ctx.fillStyle = `hsla(0, 100%, 50%, ${f})`;
    ctx.font = `${f * 200}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const facex = width / 2 + this.pnoise(this.t, 0) * 40 * f;
    const facey = height / 2 + this.pnoise(this.t + 100, 0) * 40 * f;

    if (f < 0.95 && Math.random() > 0.92) {
      this.bubbles.push( {
        x: facex,
        y: facey,
        d: f
      });
    }

    if (f <= 0.99) {
      ctx.fillText('\u{1f632}', facex, facey);
    }

    ctx.lineWidth = 2;

    this.bubbles.forEach( b => {
      if (b.d < 0.99) {
        b.d += 0.01;
        b.x += this.lmap(Math.random(), 0, 1, -2, 2);
        b.y += this.lmap(Math.random(), 0, 1, -2, 2);
        ctx.strokeStyle = `hsla(0, 100%, 100%, ${b.d * 2})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 10 * b.d, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });


    for (let x = 0; x < this.gridW; x++) {
      for (let y = 0; y < this.gridH; y++) {
        const l = this.noise3([x * 0.1, y * 0.1, this.t * 10]) * 40 +
          this.noise3([x * 0.01, y * 0.01, this.t * 1]) * 60;
        ctx.fillStyle = `hsla(200, 100%, ${l * 0.2}%, 0.9)`;
        ctx.fillRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
      }
    }

    if (f > 0.99) {
      ctx.fillText('\u{1f627}', facex, facey);
    }
    this.bubbles.forEach( b => {
      if (b.d > 0.99) {
        b.d += 0.01;
        b.x += this.lmap(Math.random(), 0, 1, -2, 2);
        b.y += this.lmap(Math.random(), 0, 1, -2, 2);
        ctx.strokeStyle = `hsla(0, 100%, 100%, ${b.d * 0.3})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 10 * b.d, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });
    this.bubbles = this.bubbles.filter( b => b.d < 1 && b.d > f );
  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
