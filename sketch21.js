'use strict';

window.sketchClass = class extends Sketch {
  desc = "Welcome to the witch detector! \nUse your mind to push the line to the right and your powers will be evaluated.";

  constructor() {
    super();
    this.blockSize = 8;
    this.gridW = Math.floor(this.canvas.width / this.blockSize);
    this.gridH = Math.floor(this.canvas.height / this.blockSize);
  }


  load() {
    super.load();
    this.history = [];
    this.curVal = 0;
    this.emoji = {
      woman: '\u{1f469}',
      oldWoman: '\u{1f475}',
      eight: '\u{1f3b1}',
      mushroom: '\u{1f344}',
      crystal: '\u{1f52e}',
      witch: '\u{1f9d9}\u{200d}\u{2640}\u{fe0f}'
    };
    this.ranks = [
      {emoji: 'woman', desc: 'Just a normal person', c: '#ffc83d', s: 18},
      {emoji: 'eight', desc: 'You play at magic', c: '#383838', s: 20},
      {emoji: 'mushroom', desc: 'You can access the power of nature', c: '#f03a17', s: 24},
      {emoji: 'oldWoman', desc: 'You have the wisdom of age', c: '#f2f2f2', s: 30},
      {emoji: 'crystal', desc: 'You can see beyond time', c: '#886ce4', s: 38},
      {emoji: 'witch', desc: 'You are a full witch!', c: '#69eaff', s: 48}
    ];
  }

  update() {
    this.curVal += this.lmap(Math.random(), 0, 1, -1, 1) - 0.02;
    this.curVal = Math.min(Math.max(this.curVal, 0), this.gridW - 1);
    this.history.unshift(this.curVal);
    if (this.history.length > this.gridH) {
      this.history = this.history.slice(0, this.gridH);
    }
  }



  draw(ctx, width, height, t) {
    ctx.fillStyle = 'hsl(269, 44%, 33%)';
    ctx.fillRect(0, 0, width, height);

    const curRank = Math.floor(this.history[0] * this.ranks.length / this.gridW);
    const f = this.history[0] / this.gridW;
    const shake = 20;
    ctx.translate(shake * f * f * Math.random() - shake * f * f / 2, shake * f * f * Math.random() - shake * f * f / 2);
    this.history.forEach( (v, i) => {
      const rank = Math.floor(v * this.ranks.length / this.gridW);
      ctx.fillStyle = this.ranks[rank].c;
      ctx.fillRect(v * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize);
    });

    ctx.font = '70px serif';

    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    this.ranks.forEach( (r, i) => {
      let dx = 0;
      let dy = 0;
      if (i === curRank) {
        dx = 0;
        dy = -20;
      }
      ctx.fillText(this.emoji[r.emoji], i * 83 + dx, 400 + dy);
    });

    ctx.fillStyle = 'hsla(0, 100%, 100%, 0.5)';
    ctx.fillRect(30, 450, width - 60, 50);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${this.ranks[curRank].s}px serif`;
    ctx.fillStyle = this.ranks[curRank].c;
    const descX = width / 2;
    const descY = 475;
    ctx.fillText(this.ranks[curRank].desc, descX, descY);

    const grad = ctx.createRadialGradient(
      width / 2, height / 2, 10,
      width / 2, height / 2, 730
    );
    grad.addColorStop(0, 'hsla(0, 0%, 0%, 0)');
    grad.addColorStop(this.lmap(this.history[0] / this.gridW, 0, 1, 1, 0.35), 'hsla(0, 0%, 0%, 0.8)');
    ctx.fillStyle = grad;
    ctx.fillRect(-50, -50, width + 100, height + 100);
  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
