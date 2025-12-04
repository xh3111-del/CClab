let bubbles = [];
let emitRate = 0.15;
let maxBubbles = 350;

let mySound, mySound2, mySound3, mySound4, mySound5;
let bubbleSplice, bubbleSplice2, bubbleSplice3;

let bubbleNumber;
let bubbleSize;
let mic;
let timer = 0;
let img;
// 初始化定时器相关变量（移除重复声明）
let timer2 = 0;
let interval = 400;
let current = 0;
let lastSwitchTime = 0;
let a = 1000; // 每个阶段的长度（帧数），你可以根据需要调整
let cam;
let seeds = [];
let mist = [];

// 全局音量变量，确保其它函数可以读取
let lev = 0;

// 舞台控制：0=selfPortrait,1=cam,2=bubbleWand,3=dandelion,4=birthdayCake
let stage = 0;
let playOnce = [false, false, false, false, false];

function preload() {
  // 请确保这些文件存在，若没有就替换成你有的音频或注释掉相应 loadSound 行
  // 我在下面对播放做了安全检查（isLoaded + isPlaying），即使不存在文件也不会崩溃（但会报浏览器媒体加载失败）
  mySound = loadSound("assets/mySound.mp3");
  mySound2 = loadSound("assets/mySound2.mp3");
  // 如果没有这些文件，也不会阻止程序运行（但音效自然不会播放）
  mySound3 = loadSound("assets/mySound3.mp3");
  mySound4 = loadSound("assets/mySound4.mp3");
  mySound5 = loadSound("assets/mySound5.mp3");

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
}

function draw() {
  push();
    colorMode(RGB);
    fill(255);
    noStroke();
    textSize(25);
    text("Camera stage — press 's' to save snapshot", 10, 20);
    text("come some music? click here to play!",10,40);
    pop();
  // 更新全局音量
  if (mic && typeof mic.getLevel === "function") {
    lev = mic.getLevel();
  } else {
    lev = 0;
  }

  timer++;

  // 计算舞台（每 a 帧为一个阶段，共 5 个阶段）
  stage = floor(timer / a);
  if (stage > 4) stage = 4; // 限制在 0..4

  // 当进入某个阶段时播放一次音效（如果可用）
  if (!playOnce[stage]) {
    playStageSound(stage);
    // 重置可能的 stage-locals
    playOnce[stage] = true;
  }

  // 根据 stage 显示不同画面
  if (stage === 0) {
    selfProtrait();
  } else if (stage === 1) {
    cameraPicture();
    
  } else if (stage === 2) {
    bubbleWand();
  } else if (stage === 3) {
    dandelion();
  } else if (stage === 4) {
    birthdayCake();
  }
}

// 防止在 draw 每帧疯狂触发播放：只在进入阶段时播放一次（并且检查 isLoaded/isPlaying）
function playStageSound(stageIndex) {
  // 你可以根据需要把不需要的音频设为 null 或移除
  try {
    if (stageIndex === 0 && mySound && mySound.isLoaded && mySound.isLoaded()) {
      if (!mySound.isPlaying()){ mySound.play();}
    }
    if (stageIndex === 1 && mySound2 && mySound2.isLoaded && mySound2.isLoaded()) {
      if (!mySound2.isPlaying()) {
        mySound.stop();
      mySound2.play();}
    }
    if (stageIndex === 2 && mySound3 && mySound3.isLoaded && mySound3.isLoaded()) {
      if (!mySound3.isPlaying()) {
        mySound2.stop();
        mySound3.play();}
    }
    if (stageIndex === 3 && mySound4 && mySound4.isLoaded && mySound4.isLoaded()) {
      if (!mySound4.isPlaying()) {
        mySound3.stop();
      mySound4.play();}
    }
    if (stageIndex === 4 && mySound5 && mySound5.isLoaded && mySound5.isLoaded()) {
      if (!mySound5.isPlaying()) {
        mySound4.stop();
      mySound5.play();}
    }
  } catch (e) {
    // 若浏览器阻止自动播放或加载失败，则忽略错误，程序继续执行
    // console.warn("音频播放失败或不存在：", e);
  }
}

// 截屏
function keyPressed() {
  if (key === "s" || key === "S") {
    saveCanvas("myCanvas", "png");
  }
}

// ================== 泡泡 Wand ==================
function bubbleWand() {
  background('#FFFBDA');


  // 使用全局 lev
  bubbleSize = map(lev, 0, 0.12, 10, 150);
  bubbleSize = constrain(bubbleSize, 5, 100);

  bubbleNumber = floor(map(lev, 0, 0.12, 0, 10));
  bubbleNumber = constrain(bubbleNumber, 0, 50);

  // 基础生成（少量随机产生）
  if (random() < emitRate) {
    bubbles.push(new Bubble(mouseX - 70, mouseY - 10));
  }
  // 根据音量生成更多
  if (lev > 0.01) {
    for (let i = 0; i < bubbleNumber; i++) {
      bubbles.push(new Bubble(mouseX - 70 + random(-20,20), mouseY - 10 + random(-20,20)));
    }
  }

  // 更新并显示泡泡（倒序删除）
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let bubble= bubbles[i];
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

  // 因为画布是 HSB，在这里我们用局部 RGB 来画亮点
  push();
  colorMode(RGB);
  fill(200, 240, 255, 200);
  stroke(255, 255, 255, 180);
  strokeWeight(1.5);
  ellipse(-70, -10, 20, 20);
  pop();

  pop();
}

// =================== Bubble class ===================
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
    // 用噪声让水平位置漂移
    this.posX += (noise(this.posX * 0.01, frameCount * 0.01) - 0.5) * 1.2;
    this.posY -= this.speed;

    this.age++;
    if (this.age > this.lifespan) this.dead = true;
    if (this.posY + this.size < -50) this.dead = true;
  }

  display() {
    push();
    translate(this.posX, this.posY);

    let transparent = map(this.age, 0, this.lifespan, 100, 10); // alpha in HSB 0..100

    // 半透明填充
    noStroke();
    fill(this.color2, 30, 100, transparent * 0.4);
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

    // 高光（使用 RGB 色彩空间以获得白色亮点）
    push();
    colorMode(RGB);
    noStroke();
    fill(255, 255, 255, transparent * 2.55 * 0.9); // 转成 0-255 alpha
    ellipse(-this.size * 0.12, -this.size * 0.12, this.size * 0.22);

    fill(200, 200, 255, transparent * 2.55 * 0.5);
    ellipse(this.size * 0.12, this.size * 0.12, this.size * 0.12);
    pop();

    pop();
  }
}

// 放音乐或戳泡泡（鼠标按下）
function mousePressed() {
  // 播放主音效（如果加载）
  try {
    if (mySound && mySound.isLoaded && mySound.isLoaded()) {
      if (!mySound.isPlaying()) mySound.play();
    }
  } catch (e) {}


  
}

// ================== 蒲公英 ==================
function dandelion() {
  image(img,0,0,800,800);


  // 用正确的音量变量 lev
  let blowCount = floor(map(lev, 0, 0.3, 0, seeds.length));
  blowCount = constrain(blowCount, 0, seeds.length);
if (seeds.length===0){
  for (let i = 0; i < 150; i++) {
    let seedX = width/2 + random(-30, 30);
     let seedY=height/2 + random(-30, 30);
    seeds.push(new Seed(seedX,seedY));
  }
}

  // 让前 n 个种子飞
  for (let i = 0; i < blowCount; i++) {
    seeds[i].isFlying = true;
  }

  // 更新 & 显示
  for (let s of seeds) {
    s.update();
    s.display();
  }

  // 蒲公英中心
  fill(255);
  noStroke();
  circle(width/2, height/2, 20);
}

class Seed {
  constructor(x, y) {
    this.x = x;
    this.y = y;
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
    line(this.x, this.y, this.x + 5, this.y - 10);
    fill(255);
    circle(this.x + 5, this.y - 10, 3);
  }
}

// ================== 生日蛋糕 ==================
function birthdayCake() {
  background('black');
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
    fill('rgb(201,163,54)');
    ellipse(0, 0, 45, 25);
    fill('pink');
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
    fill('pink');
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
  let radius = 140; // 缩小半径避免超出蛋糕
  let flicker = sin(frameCount * 0.2) * 3;

  for (let i = 0; i < candleCount; i++) {
    let angle = 360 / candleCount * i;

    let x = cos(angle) * radius * 0.55;
    let y = sin(angle) * radius * 0.25;

    push();
    translate(x, y);

    noStroke();
    fill("#F7E6B5");
    rect(-4, -25, 8, 35, 3);

    fill("#ff80aa");
    rect(-4, -15, 8, 4, 2);

    // 火焰
    fill("#ffcc33");
    ellipse(0, -32 + flicker * 0.4, 12, 18);
    fill("#ff9933");
    ellipse(0, -36 + flicker, 8, 12);

    pop();
  }

  pop();

  pop();
}

// ================= 自画像 =================
function selfProtrait() {
  // 自画像里使用弧度模式以配合 PI 的操作（使用 push/pop 避免影响全局）
  push();
  angleMode(RADIANS);

  timer2++;
  background("#7DE2C9");
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
  arc(140, 250, 120, 120, 2 * PI, PI);
  arc(110, 170, 60, 30, PI, 2 * PI);
  

  // 嘴巴的动作：每隔 interval 切换状态
  if (millis() - lastSwitchTime > interval) {
    current = 1 - current; // 0 <-> 1
    lastSwitchTime = millis();
  }

  if (current === 0) {
    stroke(0);
    noFill();
    bezier(130, 180, 90, 290, 300, 260, 100, 240);
  } else {
    // 圆形嘴
    noStroke();
    fill(0);
    circle(140, 260, 50);
  }

  pop(); // 恢复角度模式与绘图状态
}
function cameraPicture(){
  background(0);
   image(cam, 0, 0, 400,400);
   //mist
   for(let i =0;i<100;i++){
    mist[i]= new Mist(this.x,this.y);

   }
   for(let i =0;i<500;i++){
    mist[i].move();
    mist[i].display();
   }
   class Mist{
constructor(){
  this.x = random(250,width);
  this.y = random(250,height);
  this.size = random(10,20);
  
}
move(){

}
display(){
  nostroke();
  fill('grey');
  circle(this.x,this.y,this.size);
}
   }
splice(){

}

}