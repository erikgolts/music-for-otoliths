import Tone from 'tone';

// piano
import c_3 from './samples/piano/C3.wav';
import a_3 from './samples/piano/A3.wav';
import d_sharp3 from './samples/piano/Dsharp3.wav';
import f_sharp3 from './samples/piano/Fsharp3.wav';

var piano = new Tone.Sampler({
	"C3" : c_3,
	"D#3" : d_sharp3,
  "F#3" : f_sharp3,
  "A3" : a_3
}, {
  "attack": 8,
  "volume": -20
});

// oboe
import a_sharp3 from './samples/oboes/Asharp3.wav';
import a_sharp4 from './samples/oboes/Asharp4.wav';
import a_sharp5 from './samples/oboes/Asharp5.wav';
import c_sharp4 from './samples/oboes/Csharp4.wav';
import c_sharp5 from './samples/oboes/Csharp5.wav';
import c_sharp6 from './samples/oboes/Csharp6.wav';
import e4 from './samples/oboes/E4.wav';
import e5 from './samples/oboes/E5.wav';
import e6 from './samples/oboes/E6.wav';
import g4 from './samples/oboes/G4.wav';
import g5 from './samples/oboes/G5.wav';

var oboe = new Tone.Sampler({
	"A#3" : a_sharp3,
	"A#4" : a_sharp4,
  "A#5" : a_sharp5,
  "C#4" : c_sharp4,
	"C#5" : c_sharp5,
  "C#6" : c_sharp6,
  "E4" : e5,
  "E5" : e4,
  "E6" : e6,
  "G4" : g4,
  "G5" : g5
}, {
  "attack": 5,
  "volume": -24
});

// harp
import harp_a2 from './samples/harp/A2.wav';
import harp_a4 from './samples/harp/A4.wav';
import harp_a6 from './samples/harp/A6.wav';
import harp_b1 from './samples/harp/B1.wav';
import harp_b3 from './samples/harp/B3.wav';
import harp_b5 from './samples/harp/B5.wav';
import harp_c3 from './samples/harp/C3.wav';
import harp_c5 from './samples/harp/C5.wav';
import harp_d2 from './samples/harp/D2.wav';
import harp_d4 from './samples/harp/D4.wav';

var harp = new Tone.Sampler({
  "A2": harp_a2,
  "A4": harp_a4,
  "A6": harp_a6,
  "B1": harp_b1,
  "B3": harp_b3,
  "B5": harp_b5,
  "C3": harp_c3,
  "C5": harp_c5,
  "D2": harp_d2,
  "D4": harp_d4
}, {
  "volume": -12
});


// effects/components
var reverb = new Tone.Freeverb({
  "roomSize": 0.998,
  "dampening": 1700,
  "wet": 0.9
});

var delay = new Tone.PingPongDelay("4n", 0.8).toMaster();

var delay2 = new Tone.PingPongDelay(1.2, 0.9).toMaster();

var autofilter = new Tone.AutoFilter({
    frequency  : '1n',
    type  : 'sine' ,
    depth  : 1 ,
    min : 100,
    baseFrequency  : 200,
    octaves  : 1 ,
    wet: 1,
    filter  : {
      type  : 'lowpass' ,
      rolloff  : -12 ,
      Q  : 0.2
    }
});

var shiftDown = new Tone.PitchShift(-12);

var hipass = new Tone.Filter(60, "highpass");
var lopass = new Tone.Filter(800, "lowpass");
var lopass2 = new Tone.Filter(300, "lowpass");


// timeline, note trigger
var startNote = function(note){
  var interval = new Tone.CtrlRandom({"min" : 30,"max" : 80}).value;
  var offset = new Tone.CtrlRandom({"min" : 4,"max" : 40}).value;
  new Tone.Loop(function(time){
  	oboe.triggerAttack(note).connect(lopass);
    lopass.connect(delay).toMaster();
  }, interval, {
    'probability': 0.6,
    'humanize': true
  })
  .start(offset);
};

var startDrone = function(note){
  new Tone.Loop(function(time){
  	piano.triggerAttack(note).connect(lopass2);
    //shiftDown.connect(delay);
    lopass2.connect(delay2);
    delay2.toMaster();
    //autofilter.toMaster().start();
  }, 16.2, { 'humanize': true }).start();
};

var startDrone2 = function(note){
    new Tone.Loop(function(time){
    piano.triggerAttack(note).connect(lopass2);
    lopass2.toMaster();
  }, 18.6, { 'humanize': true }).start(3);
};

var startDrone3 = function(note){
  new Tone.Loop(function(time){
  	piano.triggerAttack(note).connect(lopass2);
    lopass2.toMaster();
  }, 12.9, { 'humanize': true }).start(1);
};

var startHarp = function(note1, note2, interval, offset){
  new Tone.Loop(function(time){
    harp.triggerAttack(note1).connect(reverb)
    reverb.toMaster();
    harp.triggerAttack(note2).toMaster();
  }, interval).start(offset);
};


startNote('G3');
startNote('G4');
startNote('D3');
startNote('D4');
startNote('A4');
startNote('E4');
startNote('C5');

startDrone('G2');
startDrone2('A3');
startDrone3('C3');

startHarp('A5','D6', 32.3, 60);
startHarp('C5','G6', 46.3, 1);
//startHarp('A5','D6', 3, 1);

Tone.Buffer.on( 'load', function() {
    //Tone.Master.connect(reverb);
    Tone.Transport.bpm.value = 50;
    Tone.Transport.start();
});
