let bubbles = [];
let emitRate = 0.15;
let maxBubbles = 350;

let mySound, mySound2, mySound3, mySound4, mySound5, mySound6, mySound7;
let bubbleSplice, bubbleSplice2, bubbleSplice3;

let bubbleNumber;
let bubbleSize;
let mic;
let timer = 0;
let img;
let timer2 = 0;
let interval = 300;
let current = 0;
let lastSwitchTime = 0;
let cam;
let seeds = [];


let lev = 0;

let stage = 0;
let playOnce = [false, false, false, false, false, false, false];
let fogs = [];
let fogCount = 900;
let blowing = false;
let t = 0;
let timer3 = 0;
let fogStage2ResetDone = false;
let timer4 = 0;

let confetti = [];
let explode = false;
let popSound;
let celebrationInitialized = false;


function preload() {
  mySound = loadSound("assets/mySound.mp3"); // 0
  mySound2 = loadSound("assets/mySound2.mp3"); // 2
  mySound3 = loadSound("assets/mySound3.mp3"); // 3
  mySound4 = loadSound("assets/mySound4.mp3"); // 4
  mySound5 = loadSound("assets/mySound5.mp3"); // 5
  mySound6 = loadSound("assets/pop.mp3"); // 6
  mySound7 = loadSound("assets/blow.mp3"); // 0
  img = loadImage("assets/pugongying.png");
}


function setup() {
  let cnv = createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100, 100);

  mic = new p5.AudioIn();
  mic.start();

  cnv.parent("p5-canvas-container");
  angleMode(DEGREES);

  cam = createCapture(VIDEO);
  cam.size(640, 480);
  cam.hide();
  let blowThreshold = 0.05;
  for (let i = 0; i < fogCount; i++) {
    fogs.push(new Fog(random(width), random(height)));
  }

  // 1 秒后触发吹气
  setTimeout(() => blowing = true, 1000);
}


function draw() {
  if (mic && typeof mic.getLevel === "function") {
    lev = mic.getLevel();
  } else {
    lev = 0;
  }

  timer++;
  let s0 = 600;
  let s1 = 200;
  let s2 = 600;
  let s3 = 600;
  if (stage <= 3) {
    if (timer < s0) {
      stage = 0;
    } else if (timer < s0 + s1) {
      stage = 1;
    } else if (timer < s0 + s1 + s2) {
      stage = 2;
    } else if (timer < s0 + s1 + s2 + s3) {
      stage = 3;
    } else {
      stage = 4;
    }
  }
  if (stage > 6) {
    stage = 6;
  }

  if (!playOnce[stage]) {
    playStageSound(stage);
    playOnce[stage] = true;
  }
  
  if (stage === 0) {
    background("#7DE2C9");
    selfProtrait();
    mist();
  }
  else if(stage ===1){
  userGuide();
  }
  else if (stage === 2) {
    // 重新初始化迷雾并吹散
    if (!fogStage2ResetDone) {
      fogs = [];
      for (let i = 0; i < fogCount; i++) {
        fogs.push(new Fog(random(width), random(height)));
      }
      t = 0;
      blowing = false;
      setTimeout(() => blowing = true, 1000);
      fogStage2ResetDone = true;
    }
    cameraPicture();
    mist();
  } else if (stage === 3) {
    bubbleWand();
  } else if (stage === 4) {
    dandelion();
  } else if (stage === 5) {
    timer4++;
    background("black");
    birthdayCake();
  }
  else if(stage ===6){
    push();
    background("#e8d3b5");
    selfProtrait();
    pop();
    birthdayCake();
    Celebration();
    
  }
 

  if(stage === 4 && lev > 0.1){
    console.log(stage);
    console.log("ddddd");
    stage = 5;
  }
  if(stage === 5 && lev > 0.1 && timer4 > 120){
    stage = 6;
  }

}



//BGM
// 每个阶段播放对应的音频
function playStageSound(stageIndex) {
  if (stageIndex === 0 && mySound && mySound.isLoaded && mySound.isLoaded()&&mySound7&&mySound7.isLoaded()) {
    if (!mySound.isPlaying()&&!mySound7.isPlaying()) {
      mySound.play();
      mySound7.play();
    }
  }
  if (stageIndex === 1) {
      mySound.stop();
      mySound7.stop();
  }
  if (
    stageIndex === 2 &&
    mySound2 &&
    mySound2.isLoaded &&
    mySound2.isLoaded()
  ) {
    if (!mySound2.isPlaying()) {
      mySound.stop();
      mySound2.play();
      mySound7.play();
    }
  }
  if (
    stageIndex === 3 &&
    mySound3 &&
    mySound3.isLoaded &&
    mySound3.isLoaded()
  ) {
    if (!mySound3.isPlaying()) {
      mySound2.stop();
      mySound7.stop();
      mySound3.play();
    }
  }
  if (
    stageIndex === 4 &&
    mySound4 &&
    mySound4.isLoaded &&
    mySound4.isLoaded()
  ) {
    if (!mySound4.isPlaying()) {
      mySound3.stop();
      mySound4.play();
    }
  }
  if (
    stageIndex === 5 &&
    mySound5 &&
    mySound5.isLoaded &&
    mySound5.isLoaded()
  ) {
    if (!mySound5.isPlaying()) {
      mySound4.stop();
      mySound5.play();
    }
  }
   if (
    stageIndex === 6 &&
    mySound6 &&
    mySound6.isLoaded &&
    mySound6.isLoaded()
  ) {
    if (!mySound6.isPlaying()) {
      mySound5.stop();
      mySound6.play();
    }
  }
}
// 截屏
function keyPressed() {
  if (key === "s" || key === "S") {
    saveCanvas("myCanvas", "png");
  }

  
}

function userGuide(){
  timer3++;
  push();
  background("#FFFBDA");
  colorMode(RGB);
  fill(9);
  noStroke();
  textAlign(CENTER, CENTER);
  if (timer3 < 30) {
    push();
    textSize(100);
    text("3", width/2, height/2);
    pop();
  } else if (timer3 < 60) {
    push();
    textSize(100);
    text("2", width/2, height/2);
    pop();
  } else if (timer3 < 90) {
    push();
    textSize(100);
    text("1", width/2, height/2);
    pop();
  } else {
    textSize(30);
    textAlign(LEFT, TOP);
    text("Camera stage — press 's' to save snapshot", 10, 20);
    text("come some music? click here to play!", 10, 60);
    textAlign(CENTER, CENTER);
    textSize(80);
    text("let's blow it!", width/2, height/2);
  }
  pop();
}
// ================== 泡泡 Wand ==================
function bubbleWand() {
  background("#FFFBDA");

  //声控泡泡
  bubbleSize = map(lev, 0, 0.12, 10, 150);
  bubbleSize = constrain(bubbleSize, 5, 100);

  bubbleNumber = floor(map(lev, 0, 0.12, 0, 20));
  bubbleNumber = constrain(bubbleNumber, 0, 50);
  /*
  if (random() < emitRate) {
    bubbles.push(new Bubble(mouseX - 70, mouseY - 10));
  }
    */

  if (lev > 0.03) {
    for (let i = 0; i < bubbleNumber; i++) {
      bubbles.push(
        new Bubble(mouseX - 70 + random(-20, 20), mouseY - 10 + random(-20, 20))
      );
    }

  }

  // 更新和显示泡泡，需要放在音量控制外部
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let bubble = bubbles[i];
    bubble.update();
    bubble.display();

    if (bubble.dead) {
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

  push();
  colorMode(RGB);
  fill(200, 240, 255, 200);
  stroke(255, 255, 255, 180);
  strokeWeight(1.5);
  ellipse(-70, -10, 20, 20);
  pop();

  pop();
}

class Bubble {
  constructor(x, y) {
    this.posX = x + random(-10, 10);
    this.posY = y + random(-10, 10);

    this.size = bubbleSize + random(-10, 10);
    this.size = max(3, this.size);
    this.lifespan = random(140, 260);
    this.age = 0;
    this.hueShift = random(-20, 20);
    this.dead = false;
    this.speed = random(0.5, 3);
    this.color = random(360);

    this.color2 = random(360);
  }

  update() {
    this.posX += (noise(this.posX * 0.01, frameCount * 0.01) - 0.5) * 1.2;
    this.posY -= this.speed;

    this.age++;
    if (this.age > this.lifespan) this.dead = true;
    if (this.posY + this.size < -50) this.dead = true;
  }

  display() {
    push();
    translate(this.posX, this.posY);

    let transparent = map(this.age, 0, this.lifespan, 100, 10);

    noStroke();
    fill(this.color2, 30, 100, transparent * 0.4);
    ellipse(0, 0, this.size);

    let hue1 = (this.color + frameCount * 0.8) % 360;
    let hue2 = (this.color + 180 + this.hueShift) % 360;

    noFill();
    strokeWeight(2);

    stroke(hue1, 80, 100, transparent);
    ellipse(0, 0, this.size + 2);

    stroke(hue2, 70, 100, transparent * 0.7);
    ellipse(0, 0, this.size + 4);

    push();
    colorMode(RGB);
    noStroke();
    fill(255, 255, 255, transparent * 2.55 * 0.9);
    ellipse(-this.size * 0.12, -this.size * 0.12, this.size * 0.22);

    fill(200, 200, 255, transparent * 2.55 * 0.5);
    ellipse(this.size * 0.12, this.size * 0.12, this.size * 0.12);
    pop();

    pop();
  }
}

function mousePressed() {
  playStageSound(stage);
}

// ================== 蒲公英 ==================
function dandelion() {
  image(img, 0, 0,800, 600);

  let blowCount = floor(map(lev, 0, 0.03, 0, seeds.length));
  blowCount = constrain(blowCount, 0, seeds.length);
  if (seeds.length === 0) {
    for (let i = 0; i < 150; i++) {
      //0
      let seedX = width / 2 + random(-30, 30);
      let seedY = height / 2 + random(-30, 30);
      seeds.push(new Seed(seedX, seedY));
      //1
      let seedX1 = width / 2 + random(-50, 50);
      let seedY1 = height / 2 + random(-50, 50);
      seeds.push(new Seed(seedX1, seedY1));
      //2
      let seedX2 = width / 2 + random(-20, 20);
      let seedY2 = height / 2 + random(-20, 20);
      seeds.push(new Seed(seedX2, seedY2));
      //3
      let seedX3 = width / 2 + random(-70, 70);
      let seedY3 = height / 2 + random(-70, 70);
      seeds.push(new Seed(seedX3, seedY3));
      //4
      let seedX4 = width / 2 + random(-35, 35);
      let seedY4 = height / 2 + random(-35, 35);
      seeds.push(new Seed(seedX4, seedY4));
    }
  }

  // 让前 n 个种子飞
  for (let i = 0; i < blowCount; i++) {
    seeds[i].isFlying = true;
  }

  for (let s of seeds) {
    s.update();
    s.display();
  }

  fill(255);
  noStroke();
  circle(width / 2, height / 2, 20);
}

class Seed {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(2, 10);
    this.vx = random(1, 3);
    this.vy = random(-1, 1);
    this.isFlying = false;
  }

  update() {
    if (this.isFlying) {
      this.x += this.vx;
      this.y += this.vy;
      this.vx += random(-0.02, 0.02);
      this.vy += random(-0.02, 0.02);
    }
  }

  display() {
    stroke(255);
    let fx = 5 * (this.size / 3);
    let fy = 10 * (this.size / 3);
    line(this.x, this.y, this.x + fx, this.y - fy);
    fill(255);
    circle(this.x + fx, this.y - fy, this.size);
  }
}

// ================== 蛋糕 ==================
function birthdayCake() {
  //drawCakeStand
  push();
  translate(width / 2, height / 2 + 180);
  noStroke();
  fill("#ccab7f");
  ellipse(0, 0, 500, 80);
  fill("#e8d3b5");
  ellipse(0, -10, 450, 60);
  pop();
  push();
  translate(width / 2, height / 2 + 80);

  //drawCakeBody
  push();
  noStroke();
  fill("#F0E3B4");
  rectMode(CENTER);
  rect(0, 0, 380, 200, 40);
  fill("#fffdfb");
  ellipse(0, -100, 360, 120);
  pop();

  //drawTopCreamBorder();
  push();
  let r = 180;
  for (let a = 0; a < 360; a += 20) {
    let x = cos(a) * r * 0.55;
    let y = sin(a) * 26 - 100;

    push();
    translate(x, y);
    rotate(a);
    noStroke();
    fill("rgb(201,163,54)");
    ellipse(0, 0, 45, 25);
    fill("pink");
    ellipse(-8, -4, 10, 8);
    ellipse(-8, -4, 20, 30);
    pop();
  }
  pop();

  //drawTopDecorations();
  push();
  for (let i = 0; i < 10; i++) {
    let ang = i * 36;
    let x = 30 * cos(ang);
    let y = 30 * sin(ang) - 100;
    fill("#DD315C");
    noStroke();
    ellipse(x + 4, y, 10, 7);
    ellipse(x - 4, y, 10, 7);
    ellipse(x, y + 4, 7, 10);
    ellipse(x, y - 4, 7, 10);
    fill("#ffe6af");
    ellipse(x, y, 6, 6);
    fill("#27690B");
    ellipse(x + 8, y + 3, 8, 4);
  }
  pop();

  //drawSideDecorations();
  push();
  translate(0, 20);
  let G = 360;
  let H = 9;
  for (let i = 0; i < H; i++) {
    let x = map(i, 0, H - 1, -G / 2 + 40, G / 2 - 40);

    stroke("#c4d7b1");
    strokeWeight(7);
    line(x - 18, 0, x + 18, 0);

    noStroke();
    fill("pink");
    ellipse(x - 8, 8, 22, 18);
    ellipse(x + 8, 8, 22, 18);
    triangle(x - 18, 10, x + 18, 10, x, 30);

    fill("#b02222");
    triangle(x - 10, -25, x - 2, -18, x - 10, -10);
    triangle(x + 10, -25, x + 2, -18, x + 10, -10);
    fill("#b02222");
    ellipse(x, -18, 6, 6);
  }
  pop();

  //drawHangingRuffles();
  push();
  translate(-15, 52);

  noFill();
  stroke("#cc2b2b");
  strokeWeight(5);

  let W = 340;
  let N = 8;
  for (let i = 0; i < N; i++) {
    let x1 = map(i, 0, N - 1, -W / 2 + 20, W / 2 - 20);
    let x2 = map(i + 1, 0, N - 1, -W / 2 + 20, W / 2 - 20);
    bezier(x1, 0, x1, 50, x2, 50, x2, 0);
  }

  stroke("#7DA87F");
  strokeWeight(3);
  for (let i = 0; i < N; i++) {
    let x1 = map(i, 0, N - 1, -W / 2 + 20, W / 2 - 20);
    let x2 = map(i + 1, 0, N - 1, -W / 2 + 20, W / 2 - 20);
    bezier(x1, -4, x1, 46, x2, 46, x2, -4);
  }

  pop();
  //drawCherries();
  push();
  let cherries = [
    { x: -30, y: -80 },
    { x: 20, y: -70 },
    { x: 50, y: -60 },
  ];

  for (let c of cherries) {
    push();
    translate(c.x, c.y);

    noStroke();
    fill("#8a1f1a");
    ellipse(6, 6, 35, 14);

    fill("#d63b32");
    ellipse(0, 0, 30, 25);

    fill("#ffe2dc");
    ellipse(-5, -4, 8, 6);

    stroke("#593322");
    strokeWeight(2.5);
    noFill();
    bezier(4, -2, 10, -25, 18, -35, 10, -50);

    pop();
  }

  pop();
  //drawCandleRing();
  push();
  translate(0, -100);

  let candleCount = 12;
  let radius = 200;

  for (let i = 0; i < candleCount; i++) {
    let angle = (360 / candleCount) * i;

    let x = cos(angle) * radius * 0.55;
    let y = sin(angle) * radius * 0.25;

    push();
    translate(x, y);

    noStroke();
    fill("#F7E6B5");
    rect(-4, -25, 8, 35, 3);

    fill("#ff80aa");
    rect(-4, -15, 8, 4, 2);

    if (stage === 5) {
      let flicker = sin(frameCount * 0.2) * 3;
      noStroke();
      fill("#ffcc33");
      ellipse(0, -32 + flicker * 0.4, 12, 18);
      fill("#ff9933");
      ellipse(0, -36 + flicker, 8, 12);
    }

    pop();
  }

  pop();

  pop();
 
}

// 蜡烛火焰已集成在蜡烛环循环中

// ================= 自画像 =================
function selfProtrait() {
  push();
  angleMode(RADIANS);

  timer2++;
  strokeWeight(10);
  stroke("rgb(94,71,15)");
  arc(200, 170, 60, 30, PI, 2 * PI);
  circle(90, 190, 10);
  circle(170, 190, 10);
  stroke("brown");
  circle(90, 190, 2);
  circle(170, 190, 2);
  stroke("rgba(129,95,53,0.73)");
  fill("rgb(241,226,116)");
  bezier(130, 180, 90, 290, 300, 260, 100, 240);
  bezier(120, 60, 60, 60, 20, 110, 30, 260);
  fill("rgb(245,201,126)");
  bezier(110, 100, 260, 140, 220, 240, 210, 210);
  stroke("rgb(197,131,233)");
  bezier(120, 60, 150, 120, 10, 130, 50, 260);
  bezier(120, 60, 230, 70, 210, 120, 240, 190);
  fill("#52C0F1");
  arc(150, 310, 150, 200, PI / 5, (4 * PI) / 5);
  fill("#8E6FC4");
  stroke("rgb(223,112,159)");
  bezier(230, 200, 240, 290, 270, 350, 270, 400);
  bezier(90, 290, 80, 320, 70, 370, 70, 400);
  arc(40, 300, 50, 70, 0, 2 * PI);
  line(40, 340, 10, 400);
  fill(210, 188, 171);
  stroke("rgb(88,179,106)");
  arc(200, 170, 60, 30, PI, 2 * PI);
  arc(110, 170, 60, 30, PI, 2 * PI);
  fill("rgb(241,226,116)");
  arc(140, 250, 120, 120, 2 * PI, PI);

  //嘴巴
  if (millis() - lastSwitchTime > interval) {
    current = 1 - current;
    lastSwitchTime = millis();
  }

  if (current === 0) {
    stroke("rgba(129,95,53,0.73)");
    noFill();
    bezier(130, 180, 90, 290, 300, 260, 100, 240);
  } else {
    stroke("rgba(129,95,53,0.73)");
    circle(140, 260, 50);
  }

  pop();
  
}

//fogs

 
class Fog {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.baseAlpha = random(80, 130);
    this.alpha = this.baseAlpha;
    this.size = random(60, 140);

    this.vel = createVector(0, 0);
  }

  applySoftWind() {
    let n = noise(this.pos.x * 0.001, this.pos.y * 0.001, t);
    let angle = map(n, 0, 1, -0.6, 0.6);

    let wind = p5.Vector.fromAngle(angle);
    wind.mult(0.2);
    this.vel.lerp(wind, 0.05);
  }

  applyBlow() {
    let n = noise(
      (this.pos.x + t * 200) * 0.002,
      (this.pos.y + t * 200) * 0.002
    );

    let blowDir = createVector(1, 1).normalize();
    blowDir.mult(map(n, 0, 1, 0.3, 2.0));

    this.vel.lerp(blowDir, 0.08);
    this.alpha = lerp(this.alpha, 0, 0.01);
  }

  update() {
    this.pos.add(this.vel);
    this.pos.x += random(-0.2, 0.2);
    this.pos.y += random(-0.2, 0.2);
  }

  display() {
    noStroke();
    fill(220, this.alpha);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}
function mist() {
  t += 0.003;

  for (let fog of fogs) {

    fog.applySoftWind();

    if (blowing) fog.applyBlow();

    fog.update();
    fog.display();
  }
}

//========用户的脸===========
function cameraPicture() {
  background("#7DE2C9");
  image(cam, 0, 0, 400, 400);

  /*
  //mist
  for (let i = 0; i < 500; i++) {
    mist[i] = new SecMist(this.x, this.y);
  }
  for (let i = 0; i < 500; i++) {
    mist[i].move();
    mist[i].display();
  }
  let spliceNumber = map(lev,0,0.01,0,500);
  mist.splice(i, spliceNumber);
  class SecMist {
    constructor() {
      this.x = random(250, width);
      this.y = random(250, height);
      this.size = random(10, 20);
    }
    move() {
      thisX = this.x += random(-1, 1);
      this.y = this.y += random(-1, 1);
    }
    display() {
      nostroke();
      fill('rgb(249,233,233)');
      circle(this.x, this.y, this.size);
    }
  }
    */
}
function Celebration(){
  push();
  angleMode(DEGREES);

  if (stage !== 6) {
    celebrationInitialized = false;
  }

  if (stage === 6 && !celebrationInitialized) {
    makeConfetti();
    explode = true;
    setTimeout(() => { explode = false; }, 350);
    celebrationInitialized = true;
  }

  if (explode) {
    noStroke();
    fill(255, 200, 0, 150);
    ellipse(width/2, height/2, 120, 120);
    fill(255, 80, 0, 180);
    ellipse(width/2, height/2, 60, 60);
  }

  for (let c of confetti) {
    c.update();
    c.show();
  }

  pop();
}


// 生成彩带
function makeConfetti() {
  confetti = [];
  for (let i = 0; i < 120; i++) {
    confetti.push(new Confetti());
  }
}

// 彩带
class Confetti {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;

    // 初始飞出方向
    this.vx = random(-3, 3);
    this.vy = random(-6, -2);

    this.w = random(3, 6);     // 彩带宽度
    this.h = random(12, 18);   // 彩带长度
    this.angle = random(360);  // 彩带自身旋转角度
    this.spin = random(-5, 5); // 旋转速度

    this.color = color(random(255), random(255), random(255));
  }

  update() {
    // 运动
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.12;   // 下落加速度（重力）

    // 左右飘动
    this.x += sin(radians(frameCount * 0.5 + this.angle)) * 0.5;
    // 旋转
    this.angle += this.spin;

    // 落地后停住（可删除）
    if (this.y > height - this.h/2) {
      this.y = height - this.h/2;
    }
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    noStroke();
    fill(this.color);
    rectMode(CENTER);
    rect(0, 0, this.w, this.h, 2); // 小纸条
    pop();
  }
}
