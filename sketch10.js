'use strict';

window.sketchClass = class extends Sketch {
  desc = '\ud80c\udd3f\ud80c\udef4\ud80c\udfcf\ud80c\udc8b\ud80c\uddcb\ud80c\udef4\ud80c\ude0e\ud80c\udd53\ud80c\udd3f\ud80c\ude16';

  constructor() {
    super();
    this.blockSize = 4;
    this.gridW = Math.floor(this.canvas.width / this.blockSize);
    this.gridH = Math.floor(this.canvas.height / this.blockSize);
  }

  addBlock(type, x, y, c, active = false) {
    if (this.grid[`${x},${y}`] !== undefined) {
      return undefined;
    }

    const block = {type, x, y, c, active, alive: true};
    this.blocks.push(block);
    this.grid[`${x},${y}`] = block;
    return block;
  }

  load() {
    super.load();
    this.grid = {};
    this.blocks = [];

    //place ground
    for (let x = 0; x < this.gridW; x++) {
      const bx = x;
      const by = this.gridH - 1;
      this.addBlock('static', bx, by, 'brown');
    }

    //place blocks
    const pw = 10;
    const bw = 10;
    const bh = 8;
    for (let level = pw; level > 0; level--) {
      for (let mbx = 0; mbx < level; mbx++) {
        const basex = 15 + mbx * bw + Math.floor((pw - level) * bw / 2);
        const basey = 40 + level * bh;
        for (let bx = 0; bx < bw; bx++) {
          for (let by = 0; by < bh; by++) {
            const c = (bx === 0 || by === 0) ? `hsl(50, 74%, ${38 + this.lmap(Math.random(), 0, 1, -3, 3)}%)` : `hsl(50, 74%, ${58 + this.lmap(Math.random(), 0, 1, -5, 5)}%)`;
            const block = this.addBlock('sand', basex + bx, basey + by, c);
          }
        }
      }
    }

  }

  moveBlock(b, newx, newy) {
    this.grid[`${b.x},${b.y}`] = undefined;
    b.x = newx;
    b.y = newy;
    this.grid[`${b.x},${b.y}`] = b;
  }

  update() {
    //spawn rain 
    const rainCount = Math.pow(Math.sin(this.t / 6), 8) * 8;
    for (let i = 0; i < rainCount; i++) {
      const block = this.addBlock(
        'rain', 
        Math.floor(Math.random() * this.gridW), 
        -1, 
        `hsl(220, 60%, ${50 + this.lmap(Math.random(), 0, 1, -5, 5)}%)`,
        true);
    }

    //update blocks
    let sandCount = 0;
    this.blocks.forEach( b => {
      sandCount += b.type === 'sand' ? 1 : 0;
      if (!b.active) {return;}

      switch (b.type) {
        case 'sand': {
          //fall down if possible
          if (this.grid[`${b.x},${b.y+1}`] === undefined) {
            this.moveBlock(b, b.x, b.y + 1);
          } else {
            if (this.grid[`${b.x},${b.y+1}`].type === 'static') {
             // b.alive = false;
            }
            //fall down left or right
            if (Math.random() > 0.5) {
              //left
              if (this.grid[`${b.x-1},${b.y+1}`] === undefined) {
                this.moveBlock(b, b.x - 1, b.y + 1);
              } else {
                if (this.grid[`${b.x-2},${b.y+1}`] === undefined) {
                  this.moveBlock(b, b.x - 2, b.y + 1);
                }
              }
            } else {
              //right
              if (this.grid[`${b.x+1},${b.y+1}`] === undefined) {
                this.moveBlock(b, b.x + 1, b.y + 1);
              } else {
                if (this.grid[`${b.x+2},${b.y+1}`] === undefined) {
                  this.moveBlock(b, b.x + 2, b.y + 1);
                }
              }
            }
          }
          break;
        }
        case 'rain': {
          const downBlock = this.grid[`${b.x},${b.y+1}`];
          if (downBlock == undefined) {
            this.moveBlock(b, b.x, b.y + 1);
          } else {
            b.alive = false;
            if (downBlock.type === 'sand') {
              downBlock.active = true;
              const doubleDown = this.grid[`${b.x},${b.y+2}`];
              if (doubleDown !== undefined && doubleDown.type === 'static') {
                downBlock.alive = false;
              }
            }
          }
          break;
        }
        default: {
          //do nothing
        }
      }
      if (b.x < 0 || b.x >= this.gridW || b.y >= this.gridH) {
        b.alive = false;
      }
    });
    

    if (sandCount === 0) {
      this.load();
      return;
    }


    //remove dead blocks
    this.blocks = this.blocks.filter( b => {
      if (!b.alive) {
        this.grid[`${b.x},${b.y}`] = undefined;
      }
      return b.alive;
    });
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'hsl(195, 39%, 30%)';
    ctx.fillRect(0, 0, width, height);

    //draw blocks
    this.blocks.forEach( b => {
      ctx.fillStyle = b.c;
      ctx.fillRect(b.x * this.blockSize, b.y * this.blockSize, this.blockSize, this.blockSize);
    });

    //draw clouds
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `hsla(220, 8%, ${this.lmap(this.rnd(i + 666), 0, 1, 40, 60)}%, 0.7)`;
      ctx.beginPath();
      const cw = this.lmap(this.rnd(i), 0, 1, 40, 100);
      const cx = this.lmap(this.rnd(i + 777), 0, 1, 0, this.canvas.width);
      const cy = this.lmap(this.rnd(i + 888), 0, 1, 0, 70);
      const car = this.lmap(this.rnd(i + 999), 0, 1, 1.2, 2.0);
      const ch = cw / car;
      ctx.ellipse(cx, cy, cw, ch, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
