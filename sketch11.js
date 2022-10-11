'use strict';

window.sketchClass = class extends Sketch {
  desc = 'Humans are but slowly rotting meat and everything we do has the stink of it.';

  constructor() {
    super();
    this.blockSize = 2;
    this.gridW = Math.floor(this.canvas.width / this.blockSize);
    this.gridH = Math.floor(this.canvas.height / this.blockSize);
  }

  addBlock(type, x, y, v) {
    if (this.grid[`${x},${y}`] !== undefined) {
      const block = this.grid[`${x},${y}`];
      block.v = v;
      return block;
    }

    const block = {type, x, y, v, alive: true};
    this.blocks.push(block);
    this.grid[`${x},${y}`] = block;
    return block;
  }

  addWordBlocks() {
    const wordList = 'happiness,joy,pride,gratitude,serenity,hope,love,excitement,calm,inspiration,affection,care,humility,jubilation,kindness,confidence,curiosity,empathy,passion,nostalgia,satisfaction,empathy,strength,trust'.split`,`;
    let word;
    while (word === undefined || word === this.lastWord) {
      word = wordList[Math.floor(Math.random() * wordList.length)];
    }
    this.lastWord = word;

    const canvas = document.createElement('canvas');
    canvas.width = this.canvas.width;
    canvas.height = this.canvas.height;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'hsl(0, 0%, 10%)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.font = 'bold 70px sans-serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const wx = this.lmap(Math.random(), 0, 1, this.canvas.width * 0.25, this.canvas.width * 0.75);
    const wy = this.lmap(Math.random(), 0, 1, this.canvas.height * 0.25, this.canvas.height * 0.75);
    ctx.translate(wx, wy);
    ctx.rotate(this.lmap(Math.random(), 0, 1, -Math.PI/6, Math.PI/6));
    ctx.fillText(word, 0, 0);
    
    const data = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;

    for (let x = 0; x < this.gridW; x++) {
      for (let y = 0; y < this.gridH; y++) {
        const ix = x * this.blockSize;
        const iy = y * this.blockSize;
        const i = (ix + iy * this.canvas.width) * 4;
        const r = data[i + 0];
        const g = data[i + 1];
        const b = data[i + 2];

        const blockState = (r + g + b) > (127 * 3);
        if (blockState) {
          this.addBlock('cell', x, y, blockState ? 100 : 0);
        }
      }
    }

  }

  load() {
    super.load();

    this.grid = {};
    this.blocks = [];

    this.addWordBlocks();
    this.nextWordTime = 2;
  }

  moveBlock(b, newx, newy) {
    this.grid[`${b.x},${b.y}`] = undefined;
    b.x = newx;
    b.y = newy;
    this.grid[`${b.x},${b.y}`] = b;
  }

  getBlockValue(x, y) {
    const block = this.grid[`${x},${y}`];
    if (block === undefined) {return 0;}
    return block.v;
  }

  update() {

    if (this.t >= this.nextWordTime) {
      this.nextWordTime = this.t + this.lmap(Math.random(), 0, 1, 2, 5);
      this.addWordBlocks();
    }

    //update blocks
    this.blocks.forEach( b => {

      switch (b.type) {
        case 'cell': {
          //get the sum of the values around a block
          let sum = 0;
          sum += this.getBlockValue(b.x,   b.y+1);
          sum += this.getBlockValue(b.x,   b.y-1);
          sum += this.getBlockValue(b.x+1, b.y);
          sum += this.getBlockValue(b.x-1, b.y);
          
          if (sum < 100 * 4) {
            b.v = (b.v * 9 + sum / 4) / 10;
          }
          if (Math.random() > 0.5) {
            //top/bottom
            if (this.getBlockValue(b.x, b.y-1) === 0) {
              this.addBlock('cell', b.x, b.y-1, b.v / 2 );
              b.v = b.v / 2;
            }
          } else {
            //left/right
          }
          b.alive = b.v > 5;
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
    

    //remove dead blocks
    this.blocks = this.blocks.filter( b => {
      if (!b.alive) {
        this.grid[`${b.x},${b.y}`] = undefined;
      }
      return b.alive;
    });
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    //draw blocks
    this.blocks.forEach( b => {
      ctx.fillStyle = `hsl(90, ${b.v}%, ${b.v}%)`;
      ctx.fillRect(b.x * this.blockSize, b.y * this.blockSize, this.blockSize, this.blockSize);
    });

  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
