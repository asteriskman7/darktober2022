'use strict';

window.sketchClass = class extends Sketch {
  desc = "Ow, I think I broke my everything.";

  constructor() {
    super();
    this.blockSize = 4;
    this.gridW = Math.floor(this.canvas.width / this.blockSize);
    this.gridH = Math.floor(this.canvas.height / this.blockSize);
  }


  load() {
    super.load();

    this.objects = [];
  }

  rndRange(min, max) {
    return this.lmap(Math.random(), 0, 1, min, max);
  }

  fireBlood(x, y, dir) {
    const count = this.rndRange(40, 90);

    for (let i = 0; i < count; i++) {
      if (dir === 'right') {
        const p = {
          type: 'particle',
          //c: `hsl(0, ${this.rndRange(40,60)}%, ${this.rndRange(40,60)}%)`,
          c: `hsl(0, 80%, ${this.rndRange(40,50)}%)`,
          r: this.rndRange(1, 5),
          x: x,
          y: y,
          vx: this.rndRange(-2, 10),
          vy: this.rndRange(-10, 5),
          alive: true
        }
        this.objects.push(p);
      } else {
        const p = {
          type: 'particle',
          c: `hsl(0, 80%, ${this.rndRange(40,50)}%)`,
          r: this.rndRange(1, 5),
          x: x,
          y: y,
          vx: this.rndRange(-10, 10),
          vy: this.rndRange(-10, -5),
          alive: true
        }
        this.objects.push(p);
      }
    }
  }

  fireBody() {
    const bodyEmoji = [
      '\u{1f57a}',
      '\u{1f483}',
      '\u{1f938}',
      '\u{1f6b6}'
    ];
    const body = {
      type: 'body',
      x: 500,
      y: 300,
      vx: this.rndRange(-45, -30),
      vy: -20,
      a: this.rndRange(0, 6.28),
      char: bodyEmoji[Math.floor(Math.random() * bodyEmoji.length)],
      state: 'flying',
      alive: true
    };
    this.objects.push(body);
    this.body = body;
  }

  placeDecal(x, y, r, img, a, char) {
    const decal = {
      type: 'decal',
      img: img,
      c: `hsl(0, 80%, ${this.rndRange(40,50)}%)`,
      char,
      a,
      x,
      y,
      r,
      startTime: this.t,
      alive: true
    };
    this.objects.push(decal);
  }
  

  update() {
    if (this.body === undefined) {
      this.fireBody();
    }


    this.objects.forEach( o => {

      if (o.type === 'decal') {
        o.alive = this.t - o.startTime < 3;
        return;
      }

      const drag = o.r === undefined ? 0.98 : this.lmap(o.r, 1, 5, 0.99, 0.85);
      o.vx = o.vx * drag;
      o.vy = o.vy + 1;
      o.x += o.vx;
      o.y += o.vy;

      if (o.x < 20) {
        o.x = 20;
        if (o.vy < 0) {
          o.vy = 0;
        }
        if (o.type === 'body' && o.state === 'flying') {
          this.fireBlood(o.x, o.y, 'right');
        }
        if (o.type === 'particle' && o.state !== 'hit') {
          this.placeDecal(o.x, o.y, o.r, 'circle');
        }
        o.state = 'hit';
      }

      if (o.y > this.canvas.height - 30) {
        if (o.type === 'particle') {
          this.placeDecal(o.x, o.y, o.r, 'circle');
        } else {
          this.fireBlood(o.x + 10, o.y - 20, 'up');
          this.placeDecal(o.x, o.y, 0, 'body', o.a, o.char);
        }
        o.alive = false; 
      } else {
        o.alive = !(o.x < 0 || o.x > this.canvas.width || o.y < 0 || o.y > this.canvas.height);
      }
    });

    this.objects = this.objects.filter( o => o.alive );
    if (!this.body.alive) {
      this.body = undefined;
    }
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'hsl(183, 66%, 41%)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'grey';
    ctx.fillRect(-10, -10, 40, height + 20);

    ctx.fillStyle = 'green';
    ctx.fillRect(-10, height - 30, width + 20, 40);

    this.objects.forEach( o => {
      switch (o.type) {
        case 'particle': {
          ctx.fillStyle = o.c;
          ctx.beginPath();
          ctx.arc(o.x, o.y, o.r, 0, 2 * Math.PI);
          ctx.fill();
          break;
        }
        case 'decal': {
          if (o.img === 'circle') {
            //ctx.fillStyle = o.c;
            ctx.fillStyle = `hsla(0, 50%, 50%, ${this.lmap(t - o.startTime, 0, 3, 1, 0)})`;
            ctx.beginPath();
            ctx.arc(o.x, o.y, o.r, 0, 2 * Math.PI);
            ctx.fill();
          } else {
            ctx.save();
            ctx.translate(o.x, o.y);
            ctx.rotate(o.a);
            ctx.fillStyle = `hsla(0, 50%, 50%, ${this.lmap(t - o.startTime, 0, 3, 1, 0)})`;
            ctx.font = '50px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(o.char, 0, 0);
            ctx.restore();
          }
          break;
        }
        case 'body': {
          ctx.save();
          ctx.translate(o.x, o.y);
          ctx.rotate(o.a);
          ctx.fillStyle = 'black';
          ctx.font = '50px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(o.char, 0, 0);
          ctx.restore();
          break;
        }
      }
    });

  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
