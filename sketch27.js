'use strict';

window.sketchClass = class extends Sketch {
  desc = "A parasite is just a pet you haven't pet yet.";

  constructor() {
    super();
    this.blockSize = 8;
    this.gridW = Math.floor(this.canvas.width / this.blockSize);
    this.gridH = Math.floor(this.canvas.height / this.blockSize);
  }


  load() {
    super.load();

    this.foodr = 0;
    this.worm = [ ];

    for (let i = 0; i < 20; i++) {
      this.worm.push({
        x: 300 - i * 10,
        y: 300,
        r: 10,
        a: Math.random() * 2 * Math.PI,
        tx: Math.random() * this.canvas.width,
        ty: Math.random() * this.canvas.height,
        l: this.lmap(Math.random(), 0, 1, 35, 45)
      });
    }

    this.cells = [];
    for (let i = 0; i < 400; i++) {
      this.cells.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        r: 10,
        l: this.lmap(Math.random(), 0, 1, 35, 55),
        s: this.lmap(Math.random(), 0, 1, 35, 45) 
      });
    }
  }

  update() {
    this.foodr = Math.min(20, this.foodr + 0.1);
    const speed = 0.7;
    this.worm.forEach( (w, i) => {
      if (i === 0) {
        const dx = w.x - w.tx;
        const dy = w.y - w.ty;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > (w.r  + this.foodr)) {
          const angle = Math.atan2(dy, dx) + Math.sin(this.t * 2) * Math.PI / 3;
          w.x -= speed * Math.cos(angle);
          w.y -= speed * Math.sin(angle);
        } else {
          w.tx = Math.random() * this.canvas.width;
          w.ty = Math.random() * this.canvas.height;
          this.foodr = 0;
        }
      } else {
        const leader = this.worm[i - 1];
        const dx = w.x - leader.x;
        const dy = w.y - leader.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > w.r) {
          const angle = Math.atan2(dy, dx);
          const moveDist = dist - w.r;
          w.x -= moveDist * Math.cos(angle);
          w.y -= moveDist * Math.sin(angle);
        }
      }
    });

    this.cells.forEach( c => {
      //if it overlaps with something, move in the opposite direction until it doesn't

      let wormMoved = false;
      this.worm.forEach( w => {
        const dx = c.x - w.x;
        const dy = c.y - w.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const totalSize = c.r + w.r;
        if (dist < totalSize) {
          wormMoved = true;
          const angle = Math.atan2(dy, dx);
          const moveDist = dist - totalSize;
          c.x -= moveDist * Math.cos(angle);
          c.y -= moveDist * Math.sin(angle);
        }
      });

      //move away from target
      const dx = c.x - this.worm[0].tx;
      const dy = c.y - this.worm[0].ty;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const totalSize = c.r + this.foodr;
      if (dist < totalSize) {
        //wormMoved = true;
        const angle = Math.atan2(dy, dx);
        const moveDist = dist - totalSize;
        c.x -= moveDist * Math.cos(angle);
        c.y -= moveDist * Math.sin(angle);
      }


      if (!wormMoved) {
        this.cells.forEach( c2 => {
          if (c2 === c) {return;}
          const dx = c2.x - c.x;
          const dy = c2.y - c.y;
          const d2 = dx * dx + dy * dy;
          const totalSize = c2.r + c.r;
          if (d2 < totalSize * totalSize) {
            const angle = Math.atan2(dy, dx);
            const moveDist = Math.sqrt(d2) - totalSize;
            c.x += moveDist * Math.cos(angle);
            c.y += moveDist * Math.sin(angle);
          }


        });
        const heat = 0.2;
        c.x += this.lmap(Math.random(), 0, 1, -heat, heat);
        c.y += this.lmap(Math.random(), 0, 1, -heat, heat);
      }

      c.x = Math.min(this.canvas.width, Math.max(0, c.x));
      c.y = Math.min(this.canvas.height, Math.max(0, c.y));

    });
  }


  draw(ctx, width, height, t) {
    ctx.fillStyle = 'hsl(206, 41%, 75%)';
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = 'hsla(206, 41%, 85%, 0.5)';
    this.worm.forEach( w => {
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.r + 4, 0, 2 * Math.PI);
      ctx.fill();
    });
    this.worm.forEach( w => {
      ctx.fillStyle = `hsla(206, 41%, ${w.l}%, 0.5)`;
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.r, 0, 2 * Math.PI);
      ctx.fill();
    });

    ctx.fillStyle = `hsla(206, 60%, 85%, 0.5)`;
    this.cells.forEach( c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
      ctx.fill();
    });
    this.cells.forEach( c => {
      ctx.fillStyle = `hsla(206, ${c.s}%, ${c.l}%, 0.5)`;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r - 2, 0, 2 * Math.PI);
      ctx.fill();
    });

    ctx.fillStyle = 'hsla(169, 30%, 85%, 0.5)';
    ctx.beginPath();
    ctx.arc(this.worm[0].tx, this.worm[0].ty, this.foodr, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = 'hsla(169, 30%, 55%, 0.5)';
    ctx.beginPath();
    ctx.arc(this.worm[0].tx, this.worm[0].ty, Math.max(0, this.foodr - 2), 0, 2 * Math.PI);
    ctx.fill();


    const grad = ctx.createRadialGradient(
      width / 2, height / 2, 10,
      width / 2, height / 2, 730
    );
    grad.addColorStop(0, 'hsla(0, 0%, 0%, 0)');
    grad.addColorStop(0.5, 'hsla(0, 0%, 0%, 0.9)');
    ctx.fillStyle = grad;
    ctx.fillRect(-50, -50, width + 100, height + 100);
  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
