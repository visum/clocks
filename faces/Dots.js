const DOTS_COUNT = 850;
const MS_PER_DAY = 86400000;

export default class Dots {
  constructor(context) {
    this.context = context;
  }

  getDimensions() {
    const context = this.context;
    const width = context.canvas.width;
    const height = context.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const longestDimension = centerX > centerY ? centerX : centerY;
    const shortestDimension = centerX < centerY ? centerX : centerY;
    return {width, height, centerX, centerY, longestDimension, shortestDimension};
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

  drawBackground() {
    const context = this.context;
    const {centerX, centerY, longestDimension, width, height} = this.getDimensions();
    const gradient = context.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      longestDimension
    );
    gradient.addColorStop(0.2, "rgb(0,25,56)");
    gradient.addColorStop(1, "rgb(0,64,142)");
    context.fillStyle = gradient;
    context.rect(0, 0, width, height);
    context.fill();
  }

  drawDots(progress) {
    const {longestDimension, width, height} = this.getDimensions();
    const context = this.context;
    const arcMultiplier = progress * -1;
    const radiusMultiplier = longestDimension / DOTS_COUNT;

    for (var i = 0; i < DOTS_COUNT; i++) {
      const blue = (255 - 180) * (i / DOTS_COUNT) + 180;
      const radius = i * radiusMultiplier;
      const arc = i * arcMultiplier * 2 * Math.PI;
      const x = Math.sin(arc) * radius + width / 2;
      const y = Math.cos(arc) * radius + height / 2;

      const gradient = context.createRadialGradient(x, y, 0, x, y, 1.5);
      gradient.addColorStop(0.4, `rgba(180,180,${blue},1.0)`);
      gradient.addColorStop(1, `rgba(180,180,${blue},0.0)`);
      context.fillStyle = gradient;

      context.beginPath();
      context.arc(x, y, 1.5, 0, 2 * Math.PI);
      context.fill();
    }
  }

  drawTime() {
    const context = this.context;
    const { height } = this.getDimensions();
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
