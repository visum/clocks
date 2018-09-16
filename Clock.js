export default class Clock {
  constructor() {
    this.running = false;
    this.face = null;
  }

  setFace(face) {
    this.face = face;
  }

  start() {
    this.running = true;
    this.tick();
  }

  stop() {
    this.running = false;
  }

  tick() {
    const tick = this.tick.bind(this);
    const {face, running} = this;
    if (face && running) {
      const now = new Date();
      face.draw(now);
      requestAnimationFrame(tick);
    }
  }
}