'use strict';

window.sketchClass = class extends Sketch {
  desc = "AI Description: I've created a game like flappy bird but about a mosquito. I called it my glorious plague, because mosquitoes are so fun to hit. It's not about the bug. It's about the blood.";

  load() {
    this.t = 0;
    this.highscore = 0;
    this.resetGame();
  }

  resetGame() {
    this.player = {
      x: 10,
      y: 200,
      score: 0,
      yv: 0,
      state: 'empty'
    }

    this.swapper = {
      x: 100, 
      y: 200,
      tstart: this.t
    };
  }

  update () {
    const targetX = 200;
    if (this.clicked) {
      if (this.player.score === 0) {
        this.player.yv = -4;
      } else {
        this.player.yv = -400 / this.player.score;
      }
      if (this.player.state === 'landed') {
        this.player.state = 'escape';
      }
    } else {
      this.player.yv += 0.8;
    }
    this.player.y = Math.min(this.player.y + this.player.yv, 500);
    switch (this.player.state) {
      case 'empty': {
        if (this.player.x < targetX) {
          this.player.x += 2;
        } else {
          if (this.player.y >= 500) {
            this.player.state = 'landed';
          }
        }
        break;
      }
      case 'landed': {
        this.player.score++;
        break;
      }
      case 'escape': {
        if (this.player.x > 512) {
          //escaped
          this.highscore = Math.max(this.highscore, this.player.score);
          this.resetGame();
        } else {
          this.player.x += 100/this.player.score;
        }
        break;
      }
    }

    if (this.swapper.tstart + 4 < this.t) {
      //collision
      const sw = 100;
      if (this.player.x > this.swapper.x - sw / 2 &&
          this.player.x < this.swapper.x + sw / 2 &&
          this.player.y > this.swapper.y - sw / 2 &&
          this.player.y < this.swapper.y + sw / 2) {
        //hit
        this.resetGame();
      }
      

      if ( (Math.random() > 0.98)) {
        this.swapper = {
          x: this.player.x, 
          y: this.player.y,
          tstart: this.t
        };
      }
    }
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'hsl(208, 100%, 50%)';
    ctx.fillRect(0, 0, width, height);
    ctx.font = '20px Grandstander';
    
    //draw background items?

    //draw flesh
    ctx.fillStyle = 'hsl(41, 43%, 73%)';
    ctx.beginPath();
    ctx.moveTo(0, 400);
    ctx.lineTo(256, 512);
    ctx.lineTo(0, 512);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(200, 500, 5, 0, Math.PI * 2);
    ctx.fill();

    //draw swaper shadow

    //draw player
    const size = 10 * Math.log10(this.player.score + 10);
    ctx.fillStyle = 'hsl(0, 0%, 30%)';

    const angle = this.player.state === 'empty' ? Math.atan2(this.player.y - 500, this.player.x - 200) : Math.PI;
    ctx.save();
    ctx.translate(this.player.x, this.player.y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, - size / 2);
    ctx.lineTo(-3.5 * size, 0);
    ctx.lineTo(0, size / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = 'hsl(0, 20%, 50%)';
    ctx.strokeStyle = 'hsl(0, 0%, 30%)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(this.player.x, this.player.y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.player.x, this.player.y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    //draw swapper
    const sf = (this.t - this.swapper.tstart) / 4;
    if (sf <= 1) {
      const alpha = this.lmap(sf, 0, 1, 0, 1);
      const lw = this.lmap(sf, 0, 1, 100, 2);
      ctx.lineCap = 'round';
      ctx.strokeStyle = `hsla(0, 0%, 0%, ${alpha})`;
      ctx.save();
      ctx.lineWidth = lw;
      ctx.translate(this.swapper.x, this.swapper.y);
      const sw = 100;
      ctx.beginPath();
      for (let x = 0; x < 10; x++) {
        ctx.moveTo(-sw / 2 + x * sw / 10, -sw / 2);
        ctx.lineTo(-sw / 2 + x * sw / 10, sw / 2 - sw / 10);
      }

      for (let y = 0; y < 10; y++) {
        ctx.moveTo(-sw / 2, -sw / 2 + y * sw / 10);
        ctx.lineTo(sw / 2 - sw / 10, -sw / 2 + y * sw / 10);
      }
      ctx.moveTo(0 - sw / 20, sw / 2 - sw / 10);
      ctx.lineTo(0 - sw / 20, 1000);
      ctx.stroke();
      ctx.restore();
    }

    //draw high score
    ctx.fillStyle = 'hsl(0, 35%, 49%)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`High Score: ${this.highscore}`, 10, 10);
    ctx.fillText(`Score: ${this.player.score}`, 10, 40);

  }


}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
