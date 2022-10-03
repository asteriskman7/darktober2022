'use strict';

window.sketchClass = class extends Sketch {
  desc = 'Some monsters are afraid of fire but what of those that are not?';

  constructor() {
    super();
    this.scale = 32;
    this.width = Math.floor(this.canvas.width / this.scale);
    this.height = this.width;

  }

  load() {
    super.load();
    this.plist = [];
  }

  update() {
    for (let i = 0; i < 20; i++) {
      const newp = {
        x: this.lmap(Math.random(), 0, 1, -50, 50),
        y: 0,
        r: 5,
        c: 'red',
        vx: this.lmap(Math.random(), 0, 1, -1, 1),
        birth: this.t
      };
      this.plist.push(newp);
    }

    this.plist = this.plist.filter( p => {
      //return true if we want to keep the particle
      const age = this.t - p.birth;
      const h = this.lmap(age, 0, 2, 10, 0);
      const s = this.lmap(age, 0, 2, 100, 0);
      const l = this.lmap(age, 0, 2, 50, 0);
      const a = this.lmap(age, 0, 2, 1, 0);
      p.y -= this.lmap(age, 0, 2, 3, 6);
      const vx = this.lmap(p.x, -50, 50, -0.5, 0.5);
      p.x -= (Math.random() - 0.5) * 4 + vx;
      p.c = `hsla(${h}, ${s}%, ${l}%, ${a})`;
      return age < 2;
    });


  }

  draw(ctx, width, height, t, mousePoint) {
    ctx.fillStyle = 'hsl(231, 100%, 12%)';
    ctx.fillRect(0, 0, width, height);

    //draw flame
    ctx.save();
    ctx.translate(width / 2, 320);
    ctx.globalCompositeOperation = 'lighter';
    this.plist.forEach( p => {
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    //draw torch
    ctx.save();
    ctx.translate(width / 2, 40);
    ctx.fillStyle = 'hsl(36, 100%, 16%)';
    ctx.beginPath();
    ctx.moveTo(40, 300);
    ctx.lineTo(20, 500);
    ctx.lineTo(-20, 500);
    ctx.lineTo(-40, 300);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'hsl(36, 0%, 16%)';
    ctx.beginPath();
    ctx.moveTo(50, 300);
    ctx.lineTo(50, 280);
    ctx.lineTo(-50, 280);
    ctx.lineTo(-50, 300);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
