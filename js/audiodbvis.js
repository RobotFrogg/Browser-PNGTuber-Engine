let max = 0;

let listen = async () => {
  let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  let context = new AudioContext();
  let source = context.createMediaStreamSource(stream);
  let processor = context.createScriptProcessor(undefined, 1);
  processor.onaudioprocess = e => {
    max = 0;
    let data = e.inputBuffer.getChannelData(0);
    for (let x of data) {
      let y = Math.abs(x);
      if (y > max) max = y;
    }
  };
  source.connect(processor);
  processor.connect(context.destination);
};

let canvas = document.querySelector("#db");
let width = canvas.width;
let height = canvas.height;
let c2d = canvas.getContext("2d");
c2d.fillStyle = "#fff";
let speaking = false;
let speakTimerBuffeer = 20;
let speakTimer = speakTimerBuffeer;
let draw = () => {
  // 
  // let data = c2d.getImageData(1, 0, width - 1, height);
  // c2d.putImageData(data, 0, 0);
  // // 
  // c2d.clearRect(width - 1, 0, 1, height);
  // 
  let h = max * height;
  let y = height - h;
  // c2d.fillRect(width - 1, y, 1, h);
  document.getElementById("otherstate").innerText = `Speaking Volume: ${h}`;
// turn this into state machine later
  if (h>=35){
    speaking = true;
    speaktimer = speakTimerBuffeer;
    document.getElementById("speakingboolean").innerText = `Speaking: True`;
    document.getElementById("speakingTimer").innerText = `Timer: ${speakTimer}`;
  }
  if (h<=10 && speaking){
    speakTimer = speakTimer-1;
    document.getElementById("speakingTimer").innerText = `Timer: ${speakTimer}`;
  }
  else if (speaking && speakTimer>=0){
    speakTimer = speakTimerBuffeer;
    document.getElementById("speakingTimer").innerText = `Timer: ${speakTimer}`;
  }
 if (speakTimer <=0){
    document.getElementById("speakingboolean").innerText = `Speaking: False`;
    speaking=false;
    speakTimer=speakTimerBuffeer;
  }




};

let audiogatedetection = () => {

}

let loop = () => {
  audiogatedetection();
  draw();
  requestAnimationFrame(loop);
};

loop();
listen();
