'use strict';

window.sketchClass = class extends Sketch {
  desc = "&lt;makes a sound that is a cross between that of a gastly and a ghast&gt;";

  constructor() {
    super();
    this.blockSize = 8;
    this.gridW = Math.floor(this.canvas.width / this.blockSize);
    this.gridH = Math.floor(this.canvas.height / this.blockSize);
  }


  load() {
    super.load();
    this.fire = [];

    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * 2 * Math.PI;
      this.fire.push( {
        angle,
        birth: -i * 0.033 
      });
    }
  }

  update() {

    const angle = Math.random() * 2 * Math.PI;
    this.fire.push( {
      angle,
      birth: this.t
    });

    this.fire = this.fire.filter( f => {
      return (this.t - f.birth) < 4;
    });
    

  }

  /*
    x, y is the top front corner of box
    width goes \
    depth goes /
    height goes |
  */
  drawBox(ctx, x, y, width, depth, height, fill, line) {
    const angle = Math.PI / 6;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = fill;
    ctx.strokeStyle = line;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, height);
    ctx.lineTo(depth * Math.cos(angle), height - depth * Math.sin(angle));
    ctx.lineTo(depth * Math.cos(angle), -depth * Math.sin(angle));
    ctx.lineTo(0, 0);
    ctx.lineTo(-width * Math.cos(angle), -width * Math.sin(angle));
    ctx.lineTo(-width * Math.cos(angle), height - width * Math.sin(angle));
    ctx.lineTo(0, height);
    ctx.moveTo(-width * Math.cos(angle), -width * Math.sin(angle));
    ctx.lineTo(-width * Math.cos(angle) + depth * Math.cos(angle), -width * Math.sin(angle) - depth * Math.sin(angle));
    ctx.lineTo(depth * Math.cos(angle), -depth * Math.sin(angle));
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    
    ctx.translate(width / 2, height / 2);

    const floatx = 5 * Math.cos(this.t * 0.9 + 555);
    const floaty = 5 * Math.sin(this.t * 1.2 + 333);
    ctx.translate(floatx, floaty);
    //face goes on left face of cube
    //purple fire
    ctx.fillStyle = 'hsl(263, 36%, 50%)';
    this.fire.forEach( f => {
      const age = t - f.birth;
      const p = age / 4;
      const radius = 100 * (1 - p);
      ctx.beginPath();
      ctx.arc(p * 200 * Math.cos(f.angle), p * 200 * Math.sin(f.angle), radius, 0, 2 * Math.PI);
      ctx.fill();
    });


    //square with tenticles
    const bodyHeight = 100;
    const bodyColor = 'hsl(263, 0%, 88%)';
    let ti = 0;
    for (let ty = 1; ty >= 0; ty--) {
      for (let tx = 0; tx < 3; tx++) {
        const w = bodyHeight * 0.1;
        const d = w;
        const h = bodyHeight * 0.7;
        const x = -(tx + 0.5) * 33 * Math.cos(Math.PI / 6) + (ty + 1) * 33 * Math.cos(Math.PI / 6) + 3 * Math.sin(this.t + ti * 444) ;
        const y = 100 - (tx + 0.5) * 33 * Math.sin(Math.PI / 6) - (ty + 1) * 33 * Math.sin(Math.PI / 6) + 3 * Math.cos(this.t + ti * 333);
        this.drawBox(ctx, x, y, w, d, h, bodyColor , 'black');
        ti++;
      }
    }
    this.drawBox(ctx, 0, 0, bodyHeight, bodyHeight, bodyHeight, bodyColor, 'black');

    //arc eyes
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    const rex = window.rex ?? -10;
    const rey = window.rey ?? 20;
    ctx.beginPath();
    ctx.arc(rex, rey, 25, -Math.PI / 4, Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    const rex2 = window.rex2 ?? -80;
    const rey2 = window.rey2 ?? -5;
    ctx.beginPath();
    const sa = window.sa ?? 0.6;
    ctx.arc(rex2, rey2, 25, sa, sa + 5 * Math.PI / 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'black';
    const px = window.px ?? -20;
    const py = window.py ?? 25;
    const dx = 3 * Math.cos(this.t);
    const dy = 3 * Math.sin(this.t * 1.3 + 444);
    ctx.beginPath();
    ctx.arc(px + dx, py + dy, 3, 0, 2 * Math.PI);
    ctx.fill();
    const px2 = window.px2 ?? -75;
    const py2 = window.py2 ?? 5;
    ctx.beginPath();
    ctx.arc(px2 + dx, py2 + dy, 3, 0, 2 * Math.PI);
    ctx.fill();


    //ghast mouth
    ctx.beginPath();
    ctx.lineWidth = 4;
    const mx1 = window.mx1 ?? -20;
    const my1 = window.my1 ?? 74;
    const mx2 = window.mx2 ?? -60;
    const my2 = window.my2 ?? 50;
    ctx.moveTo(mx1, my1);
    ctx.lineTo(mx2, my2);
    ctx.stroke();
  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
