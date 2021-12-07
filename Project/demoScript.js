//various hardcoded noteSequences
var FUR_ELISE, MINUET, concatenated;
//players and visualizer players 
var player, visualizer, visualizerPlayer;
//music vae model and player
var music_vae, vaePlayer, visualizer2, vaeVisualizer, vaeVisualizerPlayer;
//initializes hardcoded noteSequences and creates players
init();
//create and initialize music vae model
initializeMusicVAE();

function init() {
  FUR_ELISE = {
    notes: [
      {pitch: 76, startTime: 0.0, endTime: 0.5},
      {pitch: 75, startTime: 0.5, endTime: 1.0},
      {pitch: 76, startTime: 1.0, endTime: 1.5},
      {pitch: 75, startTime: 1.5, endTime: 2.0},
      {pitch: 76, startTime: 2.0, endTime: 2.5},
      {pitch: 71, startTime: 2.5, endTime: 3.0},
      {pitch: 74, startTime: 3.0, endTime: 3.5},
      {pitch: 72, startTime: 3.5, endTime: 4.0},
      {pitch: 69, startTime: 4.0, endTime: 5.5},
      {pitch: 60, startTime: 5.5, endTime: 6.0},
      {pitch: 64, startTime: 6.0, endTime: 6.5},
      {pitch: 69, startTime: 6.5, endTime: 7.0},
      {pitch: 71, startTime: 7.0, endTime: 8.5},
      {pitch: 64, startTime: 8.5, endTime: 9.0},  
      {pitch: 68, startTime: 9.0, endTime: 9.5}, 
      {pitch: 71, startTime: 9.5, endTime: 10.0},
      {pitch: 72, startTime: 10.0, endTime: 11.0},
  
    ],
    totalTime: 11
  };

  MINUET = {
    notes: [
      {pitch: 74, startTime: 0.0, endTime: 0.5},
      {pitch: 67, startTime: 0.5, endTime: 0.75},
      {pitch: 69, startTime: 0.75, endTime: 1.0},
      {pitch: 71, startTime: 1.0, endTime: 1.25},
      {pitch: 72, startTime: 1.25, endTime: 1.5},
      {pitch: 74, startTime: 1.5, endTime: 2.0},
      {pitch: 67, startTime: 2.0, endTime: 2.5},
      {pitch: 67, startTime: 2.5, endTime: 3.0},
      {pitch: 76, startTime: 3.0, endTime: 3.5},
      {pitch: 72, startTime: 3.5, endTime: 3.75},
      {pitch: 74, startTime: 3.75, endTime: 4.0},
      {pitch: 76, startTime: 4.0, endTime: 4.25},
      {pitch: 78, startTime: 4.25, endTime: 4.5},
      {pitch: 79, startTime: 4.5, endTime: 5.0},
      {pitch: 67, startTime: 5.0, endTime: 5.5},
      {pitch: 67, startTime: 5.5, endTime: 6.0},
    ],
    totalTime: 6
  };

  //creates a player for noteSequences, which is a representation of a music's information,
  //much life a MIDI file. everything in magenta js music uses noteSequences. 
  //player = new mm.Player();
  
  player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
  //creates a visualizer for a hardcoded noteSequence on the canvas with id: canvas.
  visualizer = new mm.Visualizer(FUR_ELISE, document.getElementById('canvas1'));

  //updates the visualizer after a note is played and stops when the noteSequence is fully played
  visualizerPlayer = new mm.Player(false, {
    run: (note) => visualizer.redraw(note),
    stop: () => {console.log('played');}
  });
}

//music vae: (variational autoencoder)
//1. creates new noteSequences (reconstruct or variations of input data)
//2. interpolate between two noteSequences

//temperature determines randomness of resulting noteSequence
var vae_temperature = 1.5;
function initializeMusicVAE() {
  //initialize music VAE
  music_vae = new mm.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_4bar_small_q2');
  music_vae.initialize();
  
  //Create a player for new sequence
  //vaePlayer = new mm.Player();

  //Changed player to play using piano sounds
  vaePlayer = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');

  //vaeVisualizer = new mm.Visualizer(concatenated, document.getElementById('canvas2'));
  vaeVisualizerPlayer = new mm.Player(false, {
    run: (note) => vaeVisualizer.redraw(note),
    stop: () => {console.log('played');}
  });

}

//function to play new sequence
function playVAE(event) {
  if (vaePlayer.isPlaying()) {
    vaePlayer.stop();
    event.target.textContent = 'Play';
    return;
  } else {
    event.target.textContent = 'Stop';
  }
  music_vae
  .sample(1, vae_temperature)
  .then((sample) => vaePlayer.start(sample[0]));
}

//determines how many interpolations there
var num_interpolations = 3;
//plays the interpolations between the two noteSequences
function playInterpolation() {
  if (vaeVisualizerPlayer.isPlaying()) {
    vaeVisualizerPlayer.stop();
    return;
  }
  //music VAE requires quantized noteSequences
  const one = mm.sequences.quantizeNoteSequence(FUR_ELISE, 4);
  const two = mm.sequences.quantizeNoteSequence(MINUET, 4);
  
  //interpolates and starts the VAE player
  music_vae
  .interpolate([one, two], num_interpolations + 2)
  .then((sample) => {
    concatenated = mm.sequences.concatenate(sample);
    vaeVisualizer = new mm.PianoRollCanvasVisualizer(concatenated, document.getElementById('canvas2'));
    vaeVisualizerPlayer.start(concatenated);
  });
}

//function to play a hardcoded noteSequence using a player of choice
function startOrStop(event, p, seq = FUR_ELISE) {
  if (p.isPlaying()) {
    p.stop();
    event.target.textContent = 'Play';
  } else {
    p.start(seq).then(() => {
      const btns = document.querySelectorAll('.controls > button');
      for (let btn of btns) {
        btn.textContent = 'Play';
      }
    });
    event.target.textContent = 'Stop';
  }
}
