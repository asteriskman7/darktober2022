'use strict';

window.sketchClass = class extends Sketch {
  desc = "<a href='https://www.youtube.com/watch?v=bc5Nk1DXyEY'>In the fields, the bodies burning<br>As the war machine keeps turning</a>";

  constructor() {
    super();
    this.blockSize = 8;
    this.gridW = Math.floor(this.canvas.width / this.blockSize);
    this.gridH = Math.floor(this.canvas.height / this.blockSize);

    this.emoji = {
      baby: '\u{1f476}',
      boy: '\u{1f466}',
      man: '\u{1f468}',
      skull: '\u{1f480}',
      rich: '\u{1f911}',
      arm: '\u{1f4aa}',
      cash: '\u{1f4b5}',
      coin: '\u{1fa99}',
      dollar: '\u{1f4b2}'
    };
  }


  load() {
    super.load();
    this.money = [];
  }

  update() {
    if (Math.random() > 0.9) {
      const type = Math.random() > 0.5;
      this.money.push({
        type,
        e: type ? this.emoji.coin : this.emoji.cash, 
        x: 0,
        y: -100,
        vx: this.lmap(Math.random(), 0, 1, -1, 1),
        vy: type ? 16 : 4,
        r : Math.random() * 2 * Math.PI
      });
    }

    this.money.forEach( m => {
      if (m.type) {
        m.vy += 1;
        m.y += m.vy;
        m.x += m.vx;
      } else {
        m.vy += 0.0;
        m.y += m.vy;
        m.x += m.vx + this.lmap(Math.random(), 0, 1, -1, 1);
      }
    });

    this.money = this.money.filter( m => m.y < 520 );
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, width, height);
    
    ctx.translate(width / 2, height / 2);

    const teeth = 12;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let side = -1; side <= 1; side +=2) {
      ctx.save();
      ctx.font = '35px serif';

      //main gear
      ctx.fillStyle = 'yellow';
      ctx.beginPath();
      ctx.arc(side * 120, -100, 100, 0, 2 * Math.PI);
      ctx.fill();
      for (let tooth = 0; tooth < teeth; tooth++) {
        const rawAngle = side * tooth * 2 * Math.PI / teeth + (2 * Math.PI * this.t / 16) + 
          (side === 1 ? 0 : side * 2 * Math.PI / (2 * teeth)) ;
        let angle = rawAngle + 2 * Math.PI;
        while (angle >= 2 * Math.PI ) {
          angle = angle - 2 * Math.PI;
        }
        const tx = side * 120 * Math.cos(angle) + side * 120;
        const ty = 120 * Math.sin(-angle) - 100;
        let emoji = this.emoji.boy;
        if (angle > Math.PI / 2) {emoji = this.emoji.man;}
        if (angle > Math.PI)     {emoji = this.emoji.skull;}
        if (angle > 3 * Math.PI / 2) {emoji = this.emoji.baby;}
        ctx.save();
        ctx.translate(tx, ty);
        ctx.rotate(side * -angle + side * Math.PI / 2);
        ctx.fillText(emoji, 0, 0);
        ctx.restore();
        ctx.beginPath();
        ctx.moveTo(side * 120, -100);
        ctx.lineTo(side * 100 * Math.cos(angle) + side * 120, 100 * Math.sin(-angle) - 100);
        ctx.stroke();
      }

      const sw = 44;
      const sh = 44;
      ctx.font = '14px serif';
      for (let stage = 0; stage < 4; stage++) {
        let angle = side * stage * 2 * Math.PI / 4 + 2 * Math.PI;
        while (angle >= 2 * Math.PI) {
          angle = angle - 2 * Math.PI;
        }
        const sx = side * 120 * Math.cos(angle) + side * 120;
        const sy = 120 * Math.sin(-angle) - 100;
        let text = 'Grow';
        if (angle >= Math.PI / 2) {text = 'Train'}
        if (angle >= Math.PI)     {text = 'War'}
        if (angle >= 3 * Math.PI / 2) {text = 'Birth'}
        ctx.fillStyle = 'red';
        ctx.fillRect(sx - sw / 2, sy - sh / 2, sw, sh);
        ctx.fillStyle = 'black';
        ctx.fillText(text, sx, sy);
      }

      const bw = 18;
      ctx.fillStyle = 'orange';
      ctx.beginPath();
      ctx.arc(side * 120, -100, bw, 0, 2 * Math.PI);
      ctx.fill();

      //belt
      ctx.lineStyle = 'black';
      const dashStart = (this.t * 2 * Math.PI * bw / 16) % 10;
      const dashPattern = [dashStart];
      for (let i = 0; i < 200; i++) {
        dashPattern.push(5);
      }
      ctx.beginPath();
      ctx.moveTo(side * (120 + bw) , 200);
      ctx.lineTo(side * (120 + bw), -100);
      ctx.arc(side * 120, -100, bw, side === 1 ? 0 : Math.PI, side === 1 ? Math.PI : 0, side === 1);
      ctx.lineTo(side * (120 - bw), 200);
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.strokeStyle = 'white';
      ctx.stroke();
      ctx.setLineDash(dashPattern);
      ctx.strokeStyle = 'black';
      ctx.stroke();

      //driving gear
      const driveAngle = 2 * Math.PI * this.t / 16;
      ctx.font = '35px serif';
      ctx.save();
      ctx.translate(side * 120, 200);
      ctx.rotate(- driveAngle * side);
      ctx.fillText(this.emoji.rich, 0, 0);
      ctx.restore();

      //money coming out 
      this.money.forEach( m => {
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.r);
        ctx.fillText(m.e, 0, 0);
        ctx.restore();
      });

      ctx.restore();
    }

  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
