'use strict';

window.sketchClass = class extends Sketch {
  desc = 'Many philosophers do their best work stoned.';

  drawOM(ctx, r, y, a) {
    ctx.save();
    ctx.rotate(a);
    ctx.translate(0, -y);
    ctx.fillStyle = 'black';
    ctx.strokeStyle = '#80FF80';
    ctx.lineWidth = 8;
    ctx.beginPath();
    //outer circle
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke()

    //triangle
    ctx.strokeStyle = '#005AFF';
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.moveTo(r * Math.cos(-Math.PI/6), -r * Math.sin(-Math.PI/6));
    ctx.lineTo(0, -r);
    ctx.lineTo(r * Math.cos(-5 * Math.PI/6), -r * Math.sin(-5 * Math.PI/6));
    ctx.lineTo(r * Math.cos(-Math.PI/6), -r * Math.sin(-Math.PI/6));
    ctx.stroke();

    //square
    ctx.strokeStyle = 'white';
    const sqs = r * 0.8;
    const sqx = 0;
    const sqy = 10 * r / 100 ;
    ctx.strokeRect(sqx - sqs / 2, sqy - sqs / 2, sqs, sqs);

    ctx.restore();
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.font = '20px Grandstander';

    ctx.translate(width/2, height/2);

    const speed = 200;
    const limit = 512 / 0.7;
    const ymax = 65;
    const fastt = speed * this.t;
    
    for (let i = 0; i < 12; i++) {
      const f = Math.pow(0.4, i);
      ctx.globalCompositeOperation = 'difference';
      this.drawOM(ctx, 
        (fastt * f) % limit, 
        ((fastt * f) % limit) * ymax / limit,
        Math.tan(this.t * 2 + i * 2222) * Math.cos(this.t + i * 1000) * Math.PI / 32 
      );
    }

  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
