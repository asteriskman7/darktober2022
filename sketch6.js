'use strict';

window.sketchClass = class extends Sketch {
  desc = '';

  constructor() {
    super();
  }

  load() {
    super.load();

    //need to find eye sockets of skull
    //eyes are regions that are mirrored around the central axis,
    // don't cross the central axis
    const ctest = document.createElement('canvas');
    ctest.width = this.canvas.width;
    ctest.height = this.canvas.height;
    
    const ctx = ctest.getContext('2d');
    this.drawSkull(ctx);

    const data = ctx.getImageData(0, 0, ctest.width, ctest.height).data;

    const regions = [];

    const seenPixels = {};
    let solidPixels = 0;

    for (let x = 0; x < Math.floor(this.canvas.width / 2); x++) {
      for (let y = 0; y < this.canvas.height; y++) {
        if (seenPixels[`${x},${y}`] !== undefined) {
          continue;
        }

        const i = (x + y * this.canvas.width) * 4;
        const r = data[i + 0];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a === 255) {
          const rgbSum = r + g + b;
          //if dark
          if (rgbSum < 30) {
            const mirrorI = ((511 - x) + y * this.canvas.width) * r;
            const mr = data[mirrorI + 0];
            const mg = data[mirrorI + 1];
            const mb = data[mirrorI + 2];
            const ma = data[mirrorI + 3];
            const rgbSumMirror = mr + mg + mb;
            //if mirror also dark
            if (ma === 255 && rgbSumMirror < 30 && seenPixels[`${511 - x},${y}`] === undefined) {
              //flood fill both sides
              //if it crosses the central axis, the right region will be empty because
              //  all of its points will already be in the left region
              const rl = this.floodFill(data, seenPixels, x, y);
              const rr = this.floodFill(data, seenPixels, 511 - x, y);

              if (rl.length > 0 && rr.length > 0) {
                regions.push(rl);
                regions.push(rr);
                console.log(rl, rr);
              }
            }
          }
        }
      }
    }

    if (regions.length === 0) {
      //just force something
      regions.push([201,229]);
      regions.push([307,229]);
    }

    this.regions = regions;
    this.bugs = [];

  }

  floodFill(data, seenPixels, x, y) {
    const edges = [[x, y]];
    const region = [];

    while (edges.length > 0) {
      const curEdge = edges.pop();
      if (seenPixels[`${curEdge[0]},${curEdge[1]}`]) {
        continue;
      }

      region.push(curEdge);
      seenPixels[`${curEdge[0]},${curEdge[1]}`] = true;

      //add unseen neighbors
      [-1, 0, 1].forEach( dx => {
        [-1, 0, 1].forEach( dy => {
          if (dx === 0 && dy === 0) {return;}
          const testx = curEdge[0] + dx;
          const testy = curEdge[1] + dy;

          //if point is black and not seen add to edges
          const ti = 4 * (testx + testy * this.canvas.width);
          const tr = data[ti + 0];
          const tg = data[ti + 1];
          const tb = data[ti + 2];
          const ta = data[ti + 3];
          const rgbSum = tr + tg + tb;

          if (rgbSum < 30 && ta === 255 && seenPixels[`${testx},${testy}`] === undefined) {
            edges.push([testx, testy]);
          }
        });
      });
    }

    let sumx = 0;
    let sumy = 0;
    region.forEach( p => {
      sumx += p[0];
      sumy += p[1];
    });

    return [Math.floor(sumx / region.length), Math.floor(sumy / region.length)];
  }

  update() {

    if (this.bugs.length < 1000) {
      this.bugs.unshift({
        source: Math.floor(Math.random() * this.regions.length),
        a: Math.PI * 2 * Math.random(),
        s: 50 * Math.random(),
        r: this.lmap(Math.random(), 0, 1, 6, 10),
        start: this.t,
        c: `hsl(${this.lmap(Math.random(), 0, 1, 27, 43)}, ${this.lmap(Math.random(), 0, 1, 80, 100)}%, ${this.lmap(Math.random(), 0, 1, 18, 30)}%)`
      });
    }

    this.bugs = this.bugs.filter( b => {
      if (b.x === undefined) {return true;}
      return !(b.x < -20 || b.x > (this.canvas.width + 20) || b.y < -20 || b.y > (this.canvas.height + 20));
    });

  }

  drawSkull(ctx) {
    ctx.font = '250px sans';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText('\u{1f480}', 255, 255);
  }

  draw(ctx, width, height, t, mousePoint) {
    ctx.fillStyle = 'hsl(231, 100%, 12%)';
    ctx.fillRect(0, 0, width, height);

    //draw skull
    this.drawSkull(ctx);

    //draw bugs coming out
    this.bugs.forEach( b => {
      ctx.fillStyle = b.c;
      const bage = this.t - b.start;
      const bx = this.regions[b.source][0] + bage * b.s * Math.cos(b.a);
      const by = this.regions[b.source][1] + bage * b.s * Math.sin(b.a);
      b.x = bx;
      b.y = by;
      ctx.beginPath();
      //ctx.arc(bx, by, b.r, 0, Math.PI * 2);
      ctx.ellipse(bx, by, b.r, b.r * 0.75, b.a, 0, Math.PI * 2);
      ctx.fill();
    });


  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
