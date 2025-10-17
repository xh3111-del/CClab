let dur = 500;
let timer;
let X = 0;
let Y = 0;
let noiseLevel = 300;
let noiseScale = 0.009;
let angle = 0;
let U;
let F;

let O;
let r;
let isPressed = false;
let posX1 = 0;
let posX2 = 0;
let posY1 = 0;
let posY2 = 0;
function setup() {
  let canvas = createCanvas(800, 500);
   canvas.parent("p5-canvas-container");
  timer = 190;
  angleMode(DEGREES);
  background("black");
}

//createGraphics(){
  
//}

function draw() {
  posX1 = X;
  posX2 = X;
  posY1 = Y;
  posY2 = Y;
  console.log(isPressed);
  angle = angle + 1;
  timer++;
  if (timer >= dur) {
    X = random(50, 750);
    Y = random(50, 750);
    U = random(0, 255);
    F = random(0, 255);
    O = random(0, 255);
    timer = 0;
    fill(U, F, O);
    stroke("white");
    for (let r = 40; r >= 0; r -= 15) {
      circle(X, Y, r);
      
      
    }
  }

  if (mouseIsPressed === true&&X-40<mouseX<X+40&&Y-40<mouseY<Y+40) {
    isPressed = true;
  }
  if (isPressed === true) {
    let sineValue = sin(angle * 6) * 80;
    let noiseValue = noise(frameCount * 0.5) * 60;
    let radDist = 15 + sineValue + noiseValue;
    let M = radDist + 20;
    let x = X + cos(angle) * radDist;
    let y = Y + sin(angle) * radDist;
    let l = X + cos(angle) * M;
    let p = Y + sin(angle) * M;
    //translate(x, y);
    //rotate(angle);
    fill(O, F, U);
    circle(x, y, 5);
    fill(U,O,F);
    //rotate(-angle);
    triangle(l, p, l + 5, p + 5, l - 5, p - 5);
     //U=U+random(10,20);
     // F=F+random(10,20);
     //O=O+random(10,20);
  }
}


