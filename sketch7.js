'use strict';

window.sketchClass = class extends Sketch {
  desc = 'It was totally worth it.';

  load() {
    super.load();
    this.lt = 0;
    console.log(this.lt);
  }

  draw(ctx, width, height, t) {
    const f = (Math.cos(t * 2 * Math.PI / 10 + Math.PI) + 1) / 2;

    const shake = 30;
    ctx.translate(shake * f * Math.random(), shake * f * Math.random());

    ctx.fillStyle = 'hsl(272, 8%, 20%)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, width * f, 10);
    ctx.save();
    ctx.translate(width / 2, height / 2);


    //loop
    ctx.fillStyle = 'white';
    this.lt += 0.033 + f * 0.3;
    for (let i = 0; i < 8; i++) {
      const pt = this.lt + i * 999 * this.rnd(i * 2);
      const x = 150 * Math.cos(pt);
      const y = 50 * Math.sin(pt) + 2 * Math.sin(pt * 20 + 6.2 * this.rnd(i * 111));
      ctx.fillRect(x, y, 2, 2);
    }
    ctx.strokeStyle = `hsla(0, 0%, 100%, ${f * 0.6})`;
    ctx.lineWidth = this.lmap(f, 0, 1, 1, 3);
    ctx.beginPath();
    ctx.ellipse(0, 0, 150, 50, 0, 0, 2 * Math.PI);
    ctx.stroke();

    //portal
    const pf = Math.max(0, this.lmap(f, 0, 1, -0.1, 1));
    const pa = pf;
    ctx.fillStyle = `hsl(119, 43%, 50%, ${pa})`;
    const pw = 20 * pf + this.rnd(this.t) * pf * 4 + 10;
    const ph = 30 * pf + this.rnd(this.t*2) * pf * 2 + 10;
    ctx.beginPath();
    ctx.ellipse(0, 0, pw, ph, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    
    //demon
    const squid = '\u{1f991}';
    ctx.font = '20px sans';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 1;
    const sf = Math.max(0, this.lmap(f, 0, 1, -0.4, 1));
    for (let i = 0; i < 6; i++) {
      const sx = (this.rnd(i * 44) - 0.5) * sf * 120;
      const sy = 20 * sf * Math.sin(this.t * 8 * this.rnd(i * 12) + 6 * this.rnd(i * 33));
      ctx.fillStyle = `hsla(119, 80%, 50%, ${sf})`;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(sx, sy);
      ctx.stroke();
      ctx.fillText(squid, sx, sy);
    }

    ctx.restore();
    //building
    ctx.fillStyle = 'hsl(220, 14%, 78%)';
    ctx.beginPath();
    ctx.moveTo(-50, -50);
    ctx.lineTo(width + 100, -50);
    ctx.lineTo(width + 100, height + 100);
    ctx.lineTo(-50, height + 100);
    ctx.lineTo(-50, -50);

    const wbx = 70;
    const wby = 130;
    const ww = 50;
    const wh = 50;
    const wsx = 15;
    const wsy = 10;
    for (let x = 0; x < 6; x++) {
      for (let y = 0; y < 4; y++) {
        const wx = wbx + x * (ww + wsx);
        const wy = wby + y * (wh + wsy);
        ctx.moveTo(wx, wy);
        ctx.lineTo(wx + ww, wy);
        ctx.lineTo(wx + ww, wy + wh);
        ctx.lineTo(wx, wy + wh);
        ctx.lineTo(wx, wy);
      }
    }
    ctx.fill('evenodd');


    //sign
    ctx.fillStyle = 'hsl(38, 43%, 23%)';
    ctx.fillRect(width / 2 - 50, 30, 100, 70);
    ctx.fillStyle = 'hsl(38, 43%, 43%)';
    ctx.fillRect(width / 2 - 45, 35, 90, 60);

    ctx.fillStyle = 'black';
    ctx.font = '20px Comic-Sans';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Welcome', width / 2, 45);
    ctx.fillText('to the', width / 2, 65);
    ctx.fillText('LHC', width / 2, 85);

    const grad = ctx.createRadialGradient(
      width/2, height/2, 10,
      width/2, height/2, 730
    );

    grad.addColorStop(0, 'hsla(0, 0%, 0%, 0)');
    grad.addColorStop(this.lmap(f, 0, 1, 1, 0.45), 'hsla(0, 0%, 0%, 0.8)');
    ctx.fillStyle = grad;
    ctx.fillRect(-50, -50, width + 100, height + 100);


  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
