var TWINKLE_TWINKLE;
var player, viz, vizPlayer;
createNoteSequences();
console.log("createNoteSequences()");
createPlayers();
console.log("createPlayers()");

function createNoteSequences() {
  TWINKLE_TWINKLE = {
    notes: [
      {pitch: 60, startTime: 0.0, endTime: 0.5},
      {pitch: 60, startTime: 0.5, endTime: 1.0},
      {pitch: 67, startTime: 1.0, endTime: 1.5},
      {pitch: 67, startTime: 1.5, endTime: 2.0},
      {pitch: 69, startTime: 2.0, endTime: 2.5},
      {pitch: 69, startTime: 2.5, endTime: 3.0},
      {pitch: 67, startTime: 3.0, endTime: 4.0},
      {pitch: 65, startTime: 4.0, endTime: 4.5},
      {pitch: 65, startTime: 4.5, endTime: 5.0},
      {pitch: 64, startTime: 5.0, endTime: 5.5},
      {pitch: 64, startTime: 5.5, endTime: 6.0},
      {pitch: 62, startTime: 6.0, endTime: 6.5},
      {pitch: 62, startTime: 6.5, endTime: 7.0},
      {pitch: 60, startTime: 7.0, endTime: 8.0},  
    ],
    totalTime: 8
  };
}

function createPlayers() {
  player = new mm.Player();
  console.log("created new player");
  player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
  viz = new mm.Visualizer(TWINKLE_TWINKLE, document.getElementById('canvas'));
  console.log("created new visualizer");
  vizPlayer = new mm.Player(true, {
    run: (note) => viz.redraw(note),
    stop: () => {console.log('done');}
  });
  console.log("vizPlayer created");
}

function startOrStop(event, p, seq = TWINKLE_TWINKLE) {
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