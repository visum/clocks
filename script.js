import Dots from "./faces/Dots.js";
import Clock from "./Clock.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const canvasFactory = {
  getCanvas: () => {
    return document.createElement('canvas');
  }
};

const dots = new Dots(context, canvasFactory);
const clock = new Clock();

const resizeCanvas = function() {
  canvas.width = window.document.body.clientWidth;
  canvas.height = window.document.body.clientHeight;
  dots.setSize({width:canvas.width, height:canvas.height});
};

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

clock.setFace(dots);
clock.start();
