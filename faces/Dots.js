const DOTS_COUNT = 850;
const MS_PER_DAY = 86400000;

export default class Dots {
  constructor(context, canvasFactory) {
    this.context = context;
    this.dimensions = {width: 0, height: 0, centerX: 0, centerY: 0, longestDimension: 0, shortestDimension: 0};
    this.canvasFactory = canvasFactory;
    this.backgroundCanvas = null;
    this.dotCanvas = null;
    this.setSize({width: context.canvas.width, height: context.canvas.height});
    this.generateAssets();
  }

  setSize(newSize) {
    const {width, height} = newSize;
    const centerX = width / 2;
    const centerY = height / 2;
    const longestDimension = width > height ? width : height;
    const shortestDimension = width < height ? width : height;
    this.dimensions = {width, height, centerX, centerY, longestDimension, shortestDimension};
    this.generateBackground();
  }

  getTargetTimestamp(time) {
    const today = new Date(time.getTime());
    today.setHours(23);
    today.setMinutes(59);
    today.setSeconds(59);
    today.setMilliseconds(999);
    const targetDate = new Date(today.toISOString());
    return targetDate.getTime();
  }

  generateBackground() {
    const {width, height, centerX, centerY, longestDimension} = this.dimensions;
    this.backgroundCanvas = this.backgroundCanvas || this.canvasFactory.getCanvas();
    this.backgroundCanvas.width = width;
    this.backgroundCanvas.height = height;

    const bgContext = this.backgroundCanvas.getContext('2d');

    const gradient = bgContext.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      longestDimension
    );

    gradient.addColorStop(0.2, "rgb(0,25,56)");
    gradient.addColorStop(1, "rgb(0,64,142)");
    bgContext.fillStyle = gradient;
    bgContext.rect(0, 0, width, height);
    bgContext.fill();
  }

  generateDot() {
    this.dotCanvas = this.dotCanvas || this.canvasFactory.getCanvas();
    this.dotCanvas.width = 3;
    this.dotCanvas.height = 3;

    const dotContext = this.dotCanvas.getContext('2d');

    const gradient = dotContext.createRadialGradient(1.5, 1.5, 0, 1.5, 1.5, 1.5);
    gradient.addColorStop(0.4, `rgba(180,180,180,1.0)`);
    gradient.addColorStop(1, `rgba(180,180,180,0.0)`);
    dotContext.fillStyle = gradient;

    dotContext.beginPath();
    dotContext.arc(1.5, 1.5, 1.5, 0, 2 * Math.PI);
    dotContext.fill();
  }

  generateAssets() {
    this.generateBackground();
    this.generateDot();
  }

  drawBackground() {
    const context = this.context;
    const backgroundCanvas = this.backgroundCanvas;
    context.drawImage(backgroundCanvas, 0, 0);
  }

  drawDots(progress) {
    const {longestDimension, width, height} = this.dimensions;
    const context = this.context;
    const arcMultiplier = progress * -1;
    const radiusMultiplier = longestDimension / DOTS_COUNT;

    for (var i = 0; i < DOTS_COUNT; i++) {
      const radius = i * radiusMultiplier;
      const arc = i * arcMultiplier * 2 * Math.PI;
      const x = Math.sin(arc) * radius + width / 2;
      const y = Math.cos(arc) * radius + height / 2;

      context.drawImage(this.dotCanvas, x - 1.5, y - 1.5);
    }
  }

  drawTime() {
    const context = this.context;
    const { height } = this.dimensions;
    const timeString = new Date().toLocaleTimeString();
    context.font = "2em Raleway";
    context.fillStyle = "rgba(255,255,255,0.8)";
    context.fillText(timeString, 10, height / 2);
  }

  draw(time) {
    const now = time.getTime();
    //const now = new Date("2018-09-15T00:00:00").getTime();
    const msRemaining = this.getTargetTimestamp(time) - now;
    const progress = (MS_PER_DAY - msRemaining) / MS_PER_DAY;
    this.drawBackground();
    this.drawDots(progress);
    this.drawTime();
  }
}
