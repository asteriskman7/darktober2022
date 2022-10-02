'use strict';

window.sketchClass = class extends Sketch {
  desc = 'You must have moved it because I know I didn\'t move it!';

  drawP(ctx, x, y) {
    ctx.fillStyle = 'hsl(51, 62%, 81%)';
    ctx.beginPath();

    //draw body
    const pwidth = 55;
    ctx.moveTo(x, y - 60);
    ctx.lineTo(x + pwidth, y + pwidth * 0.8);
    const br = window.br ?? 50;
    const dy = window.dy ?? -43;
    const da = window.da ?? 1.0;
    ctx.arc(x + pwidth / 2, y + pwidth * 0.8 + dy, br, da, Math.PI - da);
    ctx.arc(x - pwidth / 2, y + pwidth * 0.8 + dy, br, da, Math.PI - da);
    ctx.lineTo(x - pwidth, y + pwidth * 0.8);

    ctx.closePath();
    
    //draw transparent
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.closePath();

    ctx.fill('evenodd');

    //draw glass
    ctx.fillStyle = 'hsla(50, 100%, 90%, 0.4)';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    //draw pin
    ctx.fillStyle = 'hsl(50, 62%, 47%)';
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'hsl(33, 100%, 74%)';
    ctx.fillRect(0, 0, width, height);
    ctx.font = '20px Grandstander';

    this.targets = [];

    //draw yes/no
    ctx.font = 'bold 30px sans-serif';
    ctx.fillStyle = 'hsl(33, 100%, 20%)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const ynhMargin = 80;
    ctx.fillText('YES', ynhMargin, 30);
    this.targets.push([ynhMargin, 30]);
    ctx.textAlign = 'right';
    ctx.fillText('NO', width - ynhMargin, 30);
    this.targets.push([width - ynhMargin, 30]);

    //draw letters
    ctx.font = 'bold 40px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    'ABCDEFGHIJKLM'.split``.forEach( (l, i) => {
      ctx.save();
      const r = 700;
      const angleStart = 1.25;
      const a = this.lmap(i, 0, 12, Math.PI - angleStart , angleStart);
      const x = width / 2 + r * Math.cos(a);
      const y = 875 - r * Math.sin(a);
      ctx.translate(x, y);
      this.targets.push([x, y]);
      const rot = a - Math.PI / 2;
      ctx.rotate(-rot);
      //ctx.fillText(l, x + width / 2, y + 875);
      ctx.fillText(l, 0, 0);
      ctx.restore();
    });
    'NOPQRSTUVWXYZ'.split``.forEach( (l, i) => {
      ctx.save();
      const r = 600;
      const angleStart = 1.20;
      const a = this.lmap(i, 0, 12, Math.PI - angleStart , angleStart);
      const x = width / 2 + r * Math.cos(a);
      const y = 875 - r * Math.sin(a);
      ctx.translate(x, y);
      this.targets.push([x, y]);
      const rot = a - Math.PI / 2;
      ctx.rotate(-rot);
      ctx.fillText(l, 0, 0);
      ctx.restore();
    });

    //draw numbers
    '1234567890'.split``.forEach( (n, i) => {
      const r = 600;
      const angleStart = 1.35;
      const a = this.lmap(i, 0, 9, Math.PI - angleStart , angleStart);
      const x = width / 2 + r * Math.cos(a);
      const y = 375; //- r * Math.sin(a);
      ctx.fillText(n, x, y);
      this.targets.push([x, y]);
    });

    //draw good bye
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('G O O D   B Y E', width / 2, height - 50);

    //draw planchette
    //this.drawP(ctx, 50 * Math.cos(this.t) + width / 2, 
    //  75 * Math.sin(this.t * 1.2) + height / 2);
    this.drawP(ctx, this.pos.x, this.pos.y);
  }

  load() {
    this.t = 0;
    this.lastTargetTime = 0;
    this.lastTarget = {x: 256, y: 256};
    this.pos = {x: 256, y: 256};
    this.targets = [[255, 255]];
  }

  update() {
    if (this.target === undefined) {
      this.target = {};
      const targetIndex = Math.floor(Math.random() * this.targets.length);
      this.target.x = this.targets[targetIndex][0];
      this.target.y = this.targets[targetIndex][1];
      console.log(this.target, targetIndex, this.targets);
    } else {
      const f = (this.t - this.lastTargetTime) / 3;
      this.pos.x = this.lastTarget.x + 
        (this.target.x - this.lastTarget.x) * f;
      this.pos.y = this.lastTarget.y + 
        (this.target.y - this.lastTarget.y) * f;

      const targetDist2 = (this.pos.x - this.target.x) * (this.pos.x - this.target.x) +
        (this.pos.y - this.target.y) * (this.pos.y - this.target.y);
      if (targetDist2 < 10) {
        this.lastTarget = this.target;
        this.lastTargetTime = this.t;
        this.target = undefined;
      }
    }
  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
