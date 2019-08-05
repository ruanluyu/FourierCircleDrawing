import Victor from 'victor'

export class FourierCircleRenderer {
  constructor (context, height, width) {
    this.context = context;
    this.height = height;
    this.width = width;
    this.size = new Victor(1, 1);
    this.lastPos = new Victor(0, 0);
    this.t = 0;
    this.reversey = 1;
    this.maxCircle = -1;
    this.rotationSpeed = 0.0005;
    this.drawCoord();
    this.initSpot();
    this.working = false
  }

  load(data) {
    this.data = data
    this.rp = [];
    for (let i = 0; i < data.length; ++i) {
      this.rp[i] = [
        Math.sqrt(data[i][0] * data[i][0] + data[i][1] * data[i][1]),
        Math.atan2(data[i][1], data[i][0])
      ];
    }
  }

  drawCoord () {
    this.coordCanvas = document.createElement('canvas');
    this.coordCanvas.height = this.height;
    this.coordCanvas.width = this.width;
    let context = this.coordCanvas.getContext('2d');
    context.clearRect(0, 0, this.coordCanvas.height, this.coordCanvas.width);
    context.strokeStyle = 'rgba(0, 15, 25, 100)';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(0, this.coordCanvas.height / 2);
    context.lineTo(this.coordCanvas.width, this.coordCanvas.height / 2);
    context.stroke();
    context.beginPath();
    context.moveTo(this.coordCanvas.width / 2, 0);
    context.lineTo(this.coordCanvas.width / 2, this.coordCanvas.height);
    context.stroke();
  }

  initSpot () {
    this.spotCanvas = document.createElement('canvas');
    this.spotCanvas.height = this.height;
    this.spotCanvas.width = this.width;
    this.spotCanvasContext = this.spotCanvas.getContext('2d');
    this.spotCanvasContext.translate(this.spotCanvas.width / 2, this.spotCanvas.height / 2);
  }

  draw () {
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.drawImage(this.coordCanvas, 0, 0);
    this.t += this.rotationSpeed;
    let center = new Victor(0, 0);
    let pointer = new Victor(0, 0);
    this.context.strokeStyle = 'rgb(255, 255, 255)';
    this.context.fillStyle = 'rgba(0, 0, 0, 0)'
    let num = this.maxCircle > 0 ? Math.min(this.maxCircle, this.data.length) : this.data.length;
    for (let i = 0; i < num; ++i) {
      let m = i > 0 ? Math.floor((i + 1) / 2) * ((i % 2 == 0) ? -1 : 1) : 0;//changed
      let r = this.rp[i][0];
      this.context.strokeStyle = 'rgb(175, 175, 175)';
      this.context.beginPath();
      this.context.ellipse(center.x * this.size.x + this.width / 2, this.reversey * center.y * this.size.y + this.height / 2, r * this.size.x, r * this.size.y, 0, 0, 2 * Math.PI);//Changed here
      this.context.stroke();
      let theta = this.reversey * this.t * m + this.rp[i][1];
      pointer.add(new Victor(r * Math.cos(theta), r * Math.sin(theta)));
      if (m == 0)
        pointer = new Victor(this.data[0][0], this.data[0][1]);
      this.context.strokeStyle = 'rgb(100, 100, 100)';
      this.context.beginPath();
      this.context.moveTo(center.x * this.size.x + this.width / 2, this.reversey * center.y * this.size.y + this.height / 2);
      this.context.lineTo(pointer.x * this.size.x + this.width / 2, this.reversey * pointer.y * this.size.y + this.height / 2);
      this.context.stroke();
      center = pointer.clone();
    }
    //console.log(this.t, pointer.x, pointer.y);
    this.context.strokeStyle = 'rgb(10, 255, 10)';
    this.context.fillStyle = 'rgba(100, 124, 255, 150)';
    this.context.beginPath();
    this.context.ellipse(pointer.x * this.size.x + this.width / 2, this.reversey * pointer.y * this.size.y + this.height / 2, 4, 4, 0, 0, 2 * Math.PI);//Changed here
    this.context.stroke();
    if (this.t >= 0) {
      this.spotCanvasContext.beginPath();
      this.spotCanvasContext.strokeStyle = 'rgba(0, 0, 0, 0)';
      this.spotCanvasContext.fillStyle = 'rgb(0, 155, 255)';
      this.spotCanvasContext.ellipse(pointer.x * this.size.x, this.reversey * pointer.y * this.size.y, 2.5, 2.5, 0, 0, 2 * Math.PI);//Changed here
      this.spotCanvasContext.fill();
      this.context.drawImage(this.spotCanvas, 0, 0);
    }
    this.lastPos = pointer;
    if (this.working) {
      window.requestAnimationFrame(this.draw.bind(this))
    }
  }

  play() {
    if (!this.data) return
    this.working = true
    this.draw()
  }

  pause() {
    this.working = false
  }
}
