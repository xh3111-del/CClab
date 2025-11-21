let bubbles = [];
let emitRate = 0.15;
let maxBubbles = 350;

let mySound, mySound2;
let bubbleSplice, bubbleSplice2, bubbleSplice3;

let bubbleNumber;
let bubbleSize;
let mic;
let timer = 0;
let img;

function preload() {
  mySound = loadSound("assets/mySound.mp3");
  mySound2 = loadSound("assets/mySound2.mp3");
 // mySound3 = land("assets/bubbleSplice3.mp3");
  img = loadImage("assets/pugongying.png");
}

function setup() {
  let cnv = createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100, 100);

  mic = new p5.AudioIn();
  mic.start();

  cnv.parent("p5-canvas-container");
}

function draw() {
  timer++;
  if (timer < 300){
  background('#FFFBDA');

  text("Come some music?", 10, 10);
  text("click s to keep this moment");


  // 安全音量读取
  let lev = 0;
  if (mic && typeof mic.getLevel === 'function') lev = mic.getLevel();

  bubbleSize = map(lev, 0, 0.12, 10, 150);
  bubbleSize = constrain(bubbleSize, 5, 100);

  bubbleNumber = floor(map(lev, 0, 0.12, 0, 10));
  bubbleNumber = constrain(bubbleNumber, 0, 50);

  // 基础生成
  if (random() < emitRate) {
    bubbles.push(new Bubble(mouseX - 70, mouseY - 10));
  }
  // 音量生成
  for (let i = 0; i < bubbleNumber; i++) {
    bubbles.push(new Bubble(mouseX - 70, mouseY - 10));
  }

  // 更新泡泡
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let b = bubbles[i];
    b.update();
    b.display();
    //b.move();

    if (b.dead) {
      bubbles.splice(i, 1);
    }
  }

  // 限制数量
  if (bubbles.length > maxBubbles) {
    bubbles.splice(0, bubbles.length - maxBubbles);
  }

  drawWand();
}

function drawWand() {
  push();
  translate(mouseX, mouseY);

  strokeWeight(6);
  stroke(180, 150, 120);
  line(0, 0, -70, -10);

  noStroke();
  fill(100, 60, 40);
  rect(-8, -8, 16, 12, 4);

  fill(200, 240, 255, 200);
  stroke(255, 255, 255, 180);
  strokeWeight(1.5);
  ellipse(-70, -10, 20, 20);

  pop();
}

// ===================
// Bubble class
// ===================
class Bubble {
  constructor(x, y) {
    this.posX = x - random(-10, 10);
    this.posY = y;

    this.size = bubbleSize + random(-10, 10);
    this.lifespan = random(140, 260);
    this.age = 0;
    this.hueShift = random(-20, 20);
    this.dead = false;
    this.speed = random(1, 5);
    this.color = random(360);

    this.color2 = random(360);
  }

  update() {
    this.posX += noise(0.0005 * frameCount);
    this.posY -= this.speed;

    this.age++;
    if (this.age > this.lifespan) this.dead = true;
    if (this.posY + this.size < -50) this.dead = true;
  }

  /*move() {
    if(this.posX<800&&this.posX>0)
    {
      this.posX += this.Xspd;
    }
    else
    {
      this.x = this.NewX;
      this.x+= this.Xspd;
    }
  if(this.posY<800&&this.posY>0)
  {
    this.posY += this.Yspd;
  }
    else
    {
      this.posY = this.NewY;
      this.posY+=this.Yspd;
    }
  } */

  display() {
    push();
    translate(this.posX, this.posY);

    let a = map(this.age, 0, this.lifespan, 100, 10);

    fill(this.color2, 30, 100, a * 0.4);
    noStroke();
    ellipse(0, 0, this.size);

    // 外圈
    let hue1 = (this.color + frameCount * 0.8) % 360;
    let hue2 = (this.color + 180 + this.hueShift) % 360;

    noFill();
    strokeWeight(2);

    stroke(hue1, 80, 100, a);
    ellipse(0, 0, this.size + 2);

    stroke(hue2, 70, 100, a * 0.7);
    ellipse(0, 0, this.size + 4);

    // 高光
    noStroke();
    fill(0, 0, 100, a * 0.9);
    ellipse(-this.size * 0.2, -this.size * 0.2, this.size * 0.3);

    fill(200, 30, 100, a * 0.5);
    ellipse(this.size * 0.25, this.size * 0.25, this.size * 0.15);

    pop();
  }
}
else if(timer > 300&& timer<600){
  //蒲公英
  image = (img,0,0,800,800);
filter = (GRAY,4);


}

}

function mousePressed() {
  if (mySound && mySound.isLoaded()) {
    mySound.play();
  }

  // 戳泡泡
  /*for (let i = bubbles.length - 1; i >= 0; i--) {
    let b = bubbles[i];
    let d = dist(mouseX, mouseY, b.posX, b.posY);

    if (d < b.size / 2) {
      if (bubbleSplice && bubbleSplice.isLoaded()) bubbleSplice.play();
      if (bubbleSplice2 && bubbleSplice2.isLoaded()) bubbleSplice2.play();
      if (bubbleSplice3 && bubbleSplice3.isLoaded()) bubbleSplice3.play();

      bubbles.splice(i, 1);
      break;
    }
  } */
}

function keyPressed() {
  if (key == "s") {
    saveCanvas("myCanvas", "png");
  }
}

