'use strict';

window.sketchClass = class extends Sketch {
  desc = "(Use headphones) Don't try this at home.";

  constructor() {
    super();
    this.blockSize = 4;
    this.gridW = Math.floor(this.canvas.width / this.blockSize);
    this.gridH = Math.floor(this.canvas.height / this.blockSize);
  }


  load() {
    super.load();
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.lastNote = undefined;
  }

playFreq(time, freq, duration, passedOpts) {
  var sampleRate = this.audioCtx.sampleRate;
  
  let options = {...{
    type: 'sine',
    fadeInTime: 0,
    mainVolume: 0.1,
    channels: 1,
    continuous: false,
    side: 3, //0 = none, 1 = left, 2 = right, 3 = both
    t0: 0, //initial time
    a0: [0] //initial value
  }, ...passedOpts};

  let fadeInSamples = options.fadeInTime *  sampleRate;
  //let fadeOutSamples = fadeTime * sampleRate;

  var frameCount = this.audioCtx.sampleRate * duration;
  // Create an empty buffer at the
  // sample rate of the AudioContext

  var myArrayBuffer = this.audioCtx.createBuffer(options.channels, frameCount, this.audioCtx.sampleRate);
  const finalValues = (new Array(options.channels)).fill(0);
  for (var channel = 0; channel < options.channels; channel++) {
  
   if (((1 << channel) & options.side) === 0) {continue;} 
  
   // This gives us the actual array that contains the data
   var nowBuffering = myArrayBuffer.getChannelData(channel);

   var components = [
     {type: options.type, freq: freq, vol: 1.0}
   ];
   var totalVolume = components.reduce((a,e) => a + e.vol, 0);
   var volumeScale = options.mainVolume / totalVolume;
   components.forEach(component => {
     for (var i = 0; i < frameCount; i++) {
       // audio needs to be in [-1.0; 1.0]
       const t = i / sampleRate;
       let vol;
       if (options.continuous) {
         vol = component.vol;
       } else {
         const fadeSamples = sampleRate * 0.01;
         //this fade is tiny just to avoid clipping on start/stop
         if (i < fadeSamples) {
           vol = component.vol * i / fadeSamples;
         } else if (i + fadeSamples > frameCount) {
           vol = component.vol * (frameCount - i) / fadeSamples;
         } else {
           vol = component.vol;
         }
       }
       
       if (i < fadeInSamples) {
         vol *= vol * i / fadeInSamples;
       }
              
       switch (component.type) {
         case 'sine': {
           let freq = component.freq;
           nowBuffering[i] += volumeScale * vol * Math.sin(freq * 2 * Math.PI * (t + options.t0));
           break;
         }
         case 'spook': {
           let freq = component.freq + component.freq * 0.01 * Math.sin(i / 1000);
           const sampleVol = volumeScale * vol * Math.sin(i / 4000 + channel * Math.PI / 2);
           nowBuffering[i] += sampleVol * Math.sin(freq * 2 * Math.PI * (t + options.t0));
           break;
         }
         case 'saw': {
           let freq = component.freq;
           nowBuffering[i] += volumeScale * vol * freq * (t % (1/freq));
           break;
         }
         case 'seq':
           component.notes.forEach( note => {           
             if (t >= note.start && t < note.stop) {
               let fadeTime = 0.1;
               let fadeVolume = Math.tanh((t-fadeTime/2)*6/fadeTime)+1;
               nowBuffering[i] += fadeVolume * volumeScale * vol * Math.sin(note.freq * 2 * Math.PI * t);
             }
           });
           break;
         case 'rnd':
           if (i === 0) {
             nowBuffering[i] += options.a0[channel]; //volumeScale * vol * (Math.random() * 2 - 1);
           } else {           
             const Fc = component.freq; //corner frequency of filter
             const Ts = sampleRate; //sampling period
             const RC = 1 / (2 * Math.PI * Fc);  //time constant
             const alpha = (1/Ts) / (RC + 1/Ts); //smoothing factor
             const newVal = volumeScale * vol * (Math.random() * 2 - 1);
             nowBuffering[i] += alpha * newVal + (1-alpha) * nowBuffering[i-1];
           }
           break;
       }
       finalValues[channel] = nowBuffering[i];
     }
   });
  }  
  // Get an AudioBufferSourceNode.
  // This is the AudioNode to use when we want to play an AudioBuffer
  var source = this.audioCtx.createBufferSource();
  // set the buffer in the AudioBufferSourceNode
  source.buffer = myArrayBuffer;
  // connect the AudioBufferSourceNode to the
  // destination so we can hear the sound
  source.connect(this.audioCtx.destination);
  // start the source playing
  
  source.start(this.audioCtx.currentTime + time);
  return finalValues;
}

  update() {
  }

  noteToFreq(type, value) {
    const base = [293.66, 87.31][type];
    const a = Math.pow(2, 1/12);
    return base * Math.pow(a, 2 * value);
  }


  drawBar(ctx, x, y, trebleNotes, bassNotes, words, t, start, end) {
    //x,y is the center of the gclef

    ctx.save();

    ctx.translate(x, y);
    ctx.fillStyle = 'black';
    const gclef = '\u{1d11e}';
    const fclef = '\u{1d122}';
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '30px serif';
    words.split` `.forEach( (w, i) => {
      const active = !(t < i || t >= (i + 1));
      ctx.fillText(w, 100 + 100 * i, -100 - active * 10);
    });

    ctx.beginPath();
    const lineSpace = 25;
    for (let i = 0; i < 5; i++) {
      ctx.moveTo(-30, lineSpace * (i - 2));
      ctx.lineTo(450, lineSpace * (i - 2));
      ctx.moveTo(-30, 250 + lineSpace * (i - 2));
      ctx.lineTo(450, 250 + lineSpace * (i - 2));
    }
    ctx.stroke();

    ctx.font = '120px serif';
    ctx.fillText(gclef, 0, 0);
    ctx.fillText(fclef, 0, 250);

    if (start) {
      ctx.font = 'bold 60px serif';
      ctx.fillText('4', 45, -27);
      ctx.fillText('4', 45, 27);
    }

    if (end) {
      ctx.beginPath();
      ctx.moveTo(450,   0 - 2 * lineSpace);
      ctx.lineTo(450,   0 + 2 * lineSpace);
      ctx.moveTo(450, 250 - 2 * lineSpace);
      ctx.lineTo(450, 250 + 2 * lineSpace);
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(440,   0 - 2 * lineSpace);
      ctx.lineTo(440,   0 + 2 * lineSpace);
      ctx.moveTo(440, 250 - 2 * lineSpace);
      ctx.lineTo(440, 250 + 2 * lineSpace);
      ctx.stroke();
    }

    ctx.fillStyle = 'black';

    [{
       notes: trebleNotes,
       staff0Y: 0
     },
     { 
       notes: bassNotes,
       staff0Y: 250
     }
    ].forEach((s, si) => {
      let noteX = 100;
      const note0Y = s.staff0Y + lineSpace * 2.5;
      for (let i = 0; i < 4; i++) {
        noteX = 100 + i * 100;
        const active = !(t < i || t >= (i + 1));
        const f = t - i;
        const duration = s.notes[i * 2];
        const value = parseInt(s.notes[i * 2 + 1], 16);
        let noteY = note0Y - (lineSpace * 0.5) * value;
        const thisNote = `${si},${i}`;
        ctx.fillStyle = 'black';
        ctx.lineWidth = 5;
        switch (duration) {
          case 'q': {
            if (active) {
              if (thisNote !== this.lastNote) {
                const freq = this.noteToFreq(si, value);
                this.playFreq(0, freq, 0.4, {type: 'spook', channels: 2, side: 3, continuous: false});
                this.playFreq(0, freq * 2, 0.4, {type: 'spook', channels: 2, side: 3, continuous: false});
                this.lastNote = thisNote;
              }
              noteX += 2 * Math.sin(f * Math.PI * 10);
              noteY += -5 * Math.sin(f * Math.PI * 1);
              ctx.beginPath();
              ctx.ellipse(noteX, noteY, 18, 12, 0, Math.PI + 0.8 * Math.sin(f * Math.PI), 2 * Math.PI);
              ctx.fill();
              ctx.beginPath();
              ctx.ellipse(noteX, noteY, 18, 12, 0, 0, Math.PI - 0.8 * Math.sin(f * Math.PI));
              ctx.fill();
              ctx.beginPath();
              ctx.moveTo(noteX + 15, noteY);
              ctx.lineTo(noteX + 15, noteY - 80);
              ctx.stroke();
              ctx.fillStyle = 'red';
              ctx.beginPath();
              ctx.ellipse(noteX + 10, noteY - 6, 3, 3 * Math.sin(f * Math.PI), 0, 0, Math.PI * 2);
              ctx.fill();

            } else {
              ctx.beginPath();
              ctx.ellipse(noteX, noteY, 18, 12, 0, 0, 2 * Math.PI);
              ctx.fill();
              ctx.beginPath();
              ctx.moveTo(noteX + 15, noteY);
              ctx.lineTo(noteX + 15, noteY - 80);
              ctx.stroke();

            }
            break;
          }
          case 'h': {
            ctx.beginPath();
            ctx.arc(noteX, noteY, 12, 0, 2 * Math.PI);
            ctx.stroke();
            break;
          }
          case '-': {
            const hrwidth = 24;
            const hrheight = 8;
            ctx.fillRect(noteX - hrwidth / 2, noteY - hrheight / 2, hrwidth, hrheight);
            break;
          }
          case '|': {
            ctx.fillText('\u{1d13d}', noteX, noteY);
            break;
          }
        }
        noteX += 100;
      }
    });

    ctx.restore();
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'white';
    ctx.fillStyle = 'hsl(28, 100%, 50%)';
    ctx.fillRect(0, 0, width, height);

    const localt = t * 2;

    const notes = [
      ['q0q0-5  ', '-5  qa  ', 'Trick or treat!'],
      ['q0q0-5  ', '-5  qa  ', 'Smell my feet!'],
      ['q0q0|5q1', '-5  qa  ', 'Give me some- thing'],
      ['q0q0-5  ', '-5  qa  ', 'Good to eat!'],
      ['q0q0-5  ', '-5  qa  ', 'If you don\'t,'],
      ['q0q0-5  ', '-5  qa  ', 'I don\'t care!'],
      ['q0q0|5q1', '-5  qa  ', 'I\'ll pull down your'],
      ['q0q0-5  ', '-5  qa  ', 'Un- der- wear!']
    ];

    const notesIndex = Math.floor(localt / 4) % notes.length;

    this.drawBar(ctx, 40, 140, notes[notesIndex][0], notes[notesIndex][1], notes[notesIndex][2], localt % 4, notesIndex === 0, notesIndex === (notes.length - 1));

  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
