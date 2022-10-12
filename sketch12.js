'use strict';

window.sketchClass = class extends Sketch {
  desc = "Wasps: They're like bees but their honey is rage.";

  constructor() {
    super();
    this.blockSize = 4;
    this.gridW = Math.floor(this.canvas.width / this.blockSize);
    this.gridH = Math.floor(this.canvas.height / this.blockSize);
  }

  addBlock(type, x, y, state) {
    if (this.grid[`${x},${y}`] !== undefined) {
      //const block = this.grid[`${x},${y}`];
      //block.state = state;
      //return block;
      return undefined
    }

    const block = {type, x, y, state, alive: true};
    this.blocks.push(block);
    this.grid[`${x},${y}`] = block;
    if (this.blockTypes[type] === undefined) {
      this.blockTypes[type] = [];
    }
    this.blockTypes[type].push(block);
    return block;
  }


  load() {
    super.load();

    this.grid = {};
    this.blocks = [];
    this.blockTypes = { };

    //create wasp
    this.addBlock('wasp', Math.floor(this.gridW / 2), 20, 'selectFood');

    //create starting nest piece
    this.addBlock('nest', Math.floor(this.gridW / 2), this.gridH - 1);

    //create food
    for (let i = 0; i < 10; i++) {
      this.addBlock('food', Math.floor(this.lmap(Math.random(), 0, 1, 0, this.gridW)), Math.floor(this.lmap(Math.random(), 0, 1, 0, 20)));
    }

  }

  moveBlock(b, newx, newy) {
    const curBlock = this.grid[`${newx},${newy}`];
    if (curBlock !== undefined) {
      curBlock.alive = false;
      this.grid[`${newx},${newy}`] = undefined;
    }
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

  getRndBlockOfType(type) {
    const blockCount = this.blockTypes[type].length;
    if (blockCount === 0) {
      return undefined;
    }

    const blockIndex = Math.floor(Math.random() * blockCount);
    return this.blockTypes[type][blockIndex];
  }

  getHighestNest() {
    return this.blockTypes.nest.reduce( (acc, e) => {
      return Math.min(acc, e.y);
    }, Infinity);
  }

  getRndNestLocation() {
    const validLocations = [];
    this.blockTypes.nest.forEach( b => {
      //check 4 diagonal corners, add any empty ones that are inside the grid to the list
      for (let dx = -1; dx <= 1; dx+=2) {
        for (let dy = -1; dy <= 1; dy+=2) {
          const checkx = b.x + dx;
          const checky = b.y + dy;
          if (checkx >= 0 && checkx < this.gridW && checky >= 0 && checky < this.gridH) {
            if (this.grid[`${checkx},${checky}`] === undefined) {
              validLocations.push({x: checkx, y: checky});
            }
          }
        }
      }
    });
    const locationIndex = Math.floor(Math.random() * validLocations.length);
    return validLocations[locationIndex];
  }

  trySpawn(x, y) {
    //if any of the horizontally adjacent blocks are empty and surrounded by nest
    //fill that block with egg
    //spawn a wasp

    //for all the potential egg locations
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (Math.abs(dx) === Math.abs(dy)) {continue;}
        const testx = x + dx;
        const testy = y + dy;
        const testBlock = this.grid[`${testx},${testy}`];
        if (testBlock !== undefined) {continue;}
        //check that the spot is surrounded
        let scount = 0;
        for (let ndx = -1; ndx <= 1; ndx++) {
          for (let ndy = -1; ndy <=1; ndy++) {
            if (Math.abs(ndx) === Math.abs(ndy)) {continue;}
            const nestx = testx + ndx;
            const nesty = testy + ndy;
            const nestBlock = this.grid[`${nestx},${nesty}`];
            if (nestBlock !== undefined && nestBlock.type === 'nest') {
              scount++;
            }
          }
        }
        if (scount === 4) {
          this.addBlock('egg', testx, testy);
          while (true) {
            const newx = Math.floor(Math.random() * this.gridW);
            const newy = this.getHighestNest() - 4;
            if (this.addBlock('wasp', newx, newy, 'selectFood') !== undefined) {
              break;
            }
          }
        }
        
      }
    }
  }

  update() {

    if (this.getHighestNest() < (this.gridH / 2)) {
      this.load();
      return;
    }

    const targetFoodCount = this.blockTypes.wasp.length * 4;
    let spawnAttempts = 0;
    while (this.blockTypes.food.length < targetFoodCount && spawnAttempts < targetFoodCount * 2) {
      this.addBlock('food', Math.floor(this.lmap(Math.random(), 0, 1, 0, this.gridW)), Math.floor(this.lmap(Math.random(), 0, 1, 0, 20)));
    }

    //update blocks
    this.blocks.forEach( b => {

      switch (b.type) {
        case 'wasp': {
          switch (b.state) {
            case 'selectFood': {
              b.target = this.getRndBlockOfType('food');
              b.state = 'collectFood';
              break;
            }
            case 'collectFood': {
              if (b.target === undefined || !b.target.alive) {
                b.state = 'selectFood';
              } else {
                if (b.target.x < b.x) { this.moveBlock(b, b.x-1, b.y); }
                if (b.target.x > b.x) { this.moveBlock(b, b.x+1, b.y); }
                if (b.target.y < b.y) { this.moveBlock(b, b.x,   b.y-1); }
                if (b.target.y > b.y) { this.moveBlock(b, b.x,   b.y+1); }
                if (b.x === b.target.x && b.y === b.target.y) {
                  b.state = 'selectNest';
                }
              }
              break;
            }
            case 'selectNest': {
              b.target = this.getRndNestLocation();
              b.state = 'travelNest';
              break;
            }
            case 'travelNest': {
              if (this.grid[`${b.target.x},${b.target.y}`] !== undefined) {
                b.state = 'selectNest';
              } else {
                if (b.target.x < b.x) { this.moveBlock(b, b.x-1, b.y); } else 
                if (b.target.x > b.x) { this.moveBlock(b, b.x+1, b.y); } else
                if (b.target.y < b.y) { this.moveBlock(b, b.x,   b.y-1); } else
                if (b.target.y > b.y) { this.moveBlock(b, b.x,   b.y+1); }
                if (b.x === b.target.x && b.y === b.target.y) {
                  b.state = 'placeNest';
                }
              }
              break;
            }
            case 'placeNest': {
              const newy = this.getHighestNest() - 2;
              const oldy = b.y;
              this.moveBlock(b, b.x, newy);
              this.addBlock('nest', b.x, oldy);
              b.state = 'selectFood';
              this.trySpawn(b.x, oldy);
              break;
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
    

    //remove dead blocks
    this.blocks = this.blocks.filter( b => {
      if (!b.alive) {
        this.grid[`${b.x},${b.y}`] = undefined;
      }
      return b.alive;
    });

    Object.keys(this.blockTypes).forEach( type => {
      this.blockTypes[type] = this.blockTypes[type].filter( b => {
        return b.alive;
      });
    });
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'hsl(183, 66%, 41%)';
    ctx.fillRect(0, 0, width, height);
    //draw trees 
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `hsla(116, 41%, ${this.lmap(this.rnd(i + 666), 0, 1, 40, 60)}%, 0.7)`;
      ctx.beginPath();
      const cw = this.lmap(this.rnd(i), 0, 1, 40, 100);
      const cx = this.lmap(this.rnd(i + 777), 0, 1, 0, this.canvas.width);
      const cy = this.lmap(this.rnd(i + 888), 0, 1, 0, 70);
      const car = this.lmap(this.rnd(i + 999), 0, 1, 1.2, 2.0);
      const ch = cw / car;
      ctx.ellipse(cx, cy, cw, ch, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    //draw blocks
    const blockTypeColors = {
      'wasp': 'yellow', 
      'nest': 'hsl(38, 36%, 69%)', 
      'food': 'red', 
      'egg': 'hsl(116, 86%, 45%)'
    };
    this.blocks.forEach( b => {
      ctx.fillStyle = blockTypeColors[b.type];
      ctx.fillRect(b.x * this.blockSize, b.y * this.blockSize, this.blockSize, this.blockSize);
    });

  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
