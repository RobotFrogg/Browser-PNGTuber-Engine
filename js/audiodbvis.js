let max = 0;

const listen = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const context = new AudioContext();
  const source = context.createMediaStreamSource(stream);
  const processor = context.createScriptProcessor(undefined, 1);
  processor.onaudioprocess = e => {
    max = 0;
    const data = e.inputBuffer.getChannelData(0);
    for (const x of data) {
      const y = Math.abs(x);
      if (y > max) max = y;
    }
  };
  source.connect(processor);
  processor.connect(context.destination);
};

const canvas = document.querySelector("#db");
const width = canvas.width;
const height = canvas.height;
const c2d = canvas.getContext("2d");
c2d.fillStyle = "#fff";
const draw = () => {
  // 今までのを1pxひだりへ
  const data = c2d.getImageData(1, 0, width - 1, height);
  c2d.putImageData(data, 0, 0);

  // 消す
  c2d.clearRect(width - 1, 0, 1, height);
  // 描く
  const h = max * height;
  const y = height - h;
  c2d.fillRect(width - 1, y, 1, h);
};

const loop = () => {
  draw();
  requestAnimationFrame(loop);
};

loop();
listen();
