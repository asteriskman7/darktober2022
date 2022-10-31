'use strict';

window.sketchClass = class extends Sketch {
  desc = "Count Von Count from Sesame Street isn't unusual in his counting.<br>This is a common vampire trait.<br>This implies that if he ever escapes Sesame Street,<br>Count Von Count will drink your blood faster than you can count to 3!";

  constructor() {
    super();
    this.blockSize = 8;
    this.gridW = Math.floor(this.canvas.width / this.blockSize);
    this.gridH = Math.floor(this.canvas.height / this.blockSize);
  }


  load() {
    super.load();
    this.emoji = {
      bat: '\u{1f987}',
      vampire: '\u{1f9db}'
    }
  }

  update() {

  }


  draw(ctx, width, height, t, mousePoint) {
    ctx.fillStyle = 'hsl(0, 83%, 34%)';
    ctx.fillRect(0, 0, width, height);

    ctx.translate(width / 2, 0);

    ctx.font = '40px Verdana';
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.textAlign = 'center';

    ctx.strokeText('\u{26e7}', 0, 50);
    ctx.fillText('\u{26e7}', 0, 50);

    ctx.font = '20px Verdana';
    ctx.strokeText('Fun fact:', 0, 100);
    ctx.fillText('Fun fact:', 0, 100);
    ctx.strokeText('The volume of a cone shaped stake', 0, 130);
    ctx.fillText('The volume of a cone shaped stake', 0, 130);
    ctx.strokeText('with radius \u{221a} R (\u{221a} being stake shaped)', 0, 160);
    ctx.fillText('with radius \u{221a} R (\u{221a} being stake shaped)', 0, 160);
    ctx.strokeText('and height AM (the time when the sun rises)', 0, 190);
    ctx.fillText('and height AM (the time when the sun rises)', 0, 190);
    ctx.strokeText('is', 0, 220);
    ctx.fillText('is', 0, 220);
    ctx.strokeText('V=AM*PI*R/3', 0, 250);
    ctx.fillText('V=AM*PI*R/3', 0, 250);


    for (let i = 0; i < 6; i++) {
      ctx.fillText(this.emoji.bat, 100 * Math.sin(this.t * 2 + this.rnd(i * 13) * 2 * Math.PI), 350 + 20 * Math.sin(this.t + this.rnd(i) * 2 * Math.PI));
    }

    ctx.font = '40px Verdana';
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'yellow';
    for (let i = 0; i < 6; i++) {
      const x = this.lmap(i, 0, 5, -200, 200) + 5 * Math.sin(this.t / 1 + this.rnd(i * 666) * 2 * Math.PI);
      const y = 450;
      ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath();
      ctx.ellipse(x, y - 40, 12, 6, 0, 0, 2 * Math.PI);
      for (let j = 3; j >= 0; j--) {
        ctx.strokeStyle = `hsla(50, 100%, 50%, ${this.lmap(j, 0, 3, 0.4, 0.1)})`;
        ctx.lineWidth = this.lmap(j, 0, 3, 2, 8);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillText(this.emoji.vampire, x, y);
    }

  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
