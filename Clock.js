export default class Clock {
  constructor() {
    this.running = false;
    this.face = null;
    this.skip = false;
  }

  setFace(face) {
    this.face = face;
  }

  start() {
    this.running = true;
    this.animate();
  }

  stop() {
    this.running = false;
  }

  animate() {
    const self = this;
    const tick = () => {
      const {face, running, skip} = self;
      if (face && running) {
        if (!skip) {
          const now = new Date();
          face.draw(now);  
        }
        self.skip = !self.skip;
        requestAnimationFrame(tick);
      }
    };
    tick();
  }
}