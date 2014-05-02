+function(){

var Audio = window.Audio = {
  buffers: {},
  source_loop: {},
  files: {
    'walking': '/sounds/footsteps.wav',
    'jump': '/sounds/jump.wav',
    'land': '/sounds/land.wav'
  }
};

Audio.load = function(){
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  Audio.context = new window.AudioContext();

  for (var n in Audio.files){
    Audio.loadFile(n, Audio.files[n]);
  };
};

Audio.loadFile = function(name, path){
  var req = new XMLHttpRequest();
  req.responseType = 'arraybuffer';

  req.open('GET', path, true);
  req.onload = function() {
    Audio.context.decodeAudioData(
      req.response,
      function(buffer) {
        Audio.buffers[name] = buffer;
        Audio.source_loop[name] = {};
      },
      function(e) {
        console.log(e)
        console.error('Error decoding audio "'+path+'".');
      }
    );
  };
  req.send();
};

Audio.play = function(n){
  Audio.source_loop[n] = Audio.context.createBufferSource();
  Audio.source_loop[n].buffer = Audio.buffers[n];
  Audio.source_loop[n].connect(Audio.context.destination);

  Audio.source_loop[n].start(0);
};

Audio.start = function(n, opts){
  if (!opts) opts = {};

  Audio.source_loop[n] = Audio.context.createBufferSource();
  Audio.source_loop[n].buffer = Audio.buffers[n];
  Audio.source_loop[n].loop = true;
  Audio.source_loop[n].connect(Audio.context.destination);

  Audio.source_loop[n].start(0, opts.delay||0);
};

Audio.stop = function(n, opts) {
  if (!opts) opts = {};

  Audio.source_loop[n].stop(0, opts.delay||0);
};

}();
