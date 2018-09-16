import Dots from "./faces/Dots.js";
import Clock from "./Clock.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const dots = new Dots(context);
const clock = new Clock();

const resizeCanvas = function() {
  canvas.width = window.document.body.clientWidth;
  canvas.height = window.document.body.clientHeight;
};

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

clock.setFace(dots);
clock.start();
