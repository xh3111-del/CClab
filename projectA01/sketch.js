let eyeSize = 30;
let isBlinking = false;
let shrinking = false;
let Timer2 = 0;
let bodycolor;
let fadespeed = 10;
let glowIntensity = 0;
let glowColor;
let monsterX, monsterY;
let monsterSize = 150;
let isSpiky = false;
let spikeSize = 10;
let spikeCount = 12;
let star = false;
let footOffsetX = monsterSize * 0.25;
let footY = monsterY + monsterSize * 0.55;
let footWidth = monsterSize * 0.25;
let footHeight = monsterSize * 0.15;
let footup = false;
// 花花部分变量

let timer;
let X = 0;
let Y = 0;
let angle = 0;
let U, F, O;

// 离屏画布（花花）
let creativeGraphic;

//stars
// 星空粒子
let stars = [];
let numStars = 200;

// 流星数组
let meteors = [];

function setup() {
  createCanvas(800, 500);
  colorMode(HSB, 360, 100, 100, 1);
  background("black");

  // 初始化怪兽
  monsterX = 400;
  monsterY = 250;
  bodycolor = random(0, 360);
  glowColor = random(0, 360);

  // 初始化花花画布
  creativeGraphic = createGraphics(800, 500);
  creativeGraphic.colorMode(RGB);
  creativeGraphic.background(0);
  timer = 190;

  // 初始化星星
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      z: random(0.5, 2),
      size: random(1, 3),
      hue: random(180, 260),
      brightness: random(60, 100),
      flickerSpeed: random(0.02, 0.05),
      flickerPhase: random(TWO_PI),
    });
  }
}

function draw() {
  console.log("monsterY:", monsterY, "monsterSize:", monsterSize);
  // === 更新花花背景 ===
  updateCreativeGraphic();

  // 把花花贴在主画布背景
  image(creativeGraphic, 0, 0);

  // === 渐变叠层（让背景柔和点） ===
  fill(random(180, 360), random(30, 60), random(70, 90), 1 / fadespeed);
  noStroke();
  rect(0, 0, width, height);

  // === 怪兽移动与眨眼 ===
  monsterX = lerp(monsterX, mouseX, 0.07);
  monsterY = lerp(monsterY, mouseY, 0.07);

  Timer2 += 1;
  if (Timer2 > 100) {
    isBlinking = true;
    footup = true;
    Timer2 = 0;
  }
  if (isBlinking) {
    eyeSize = lerp(eyeSize, 5, 0.3);
    if (eyeSize < 6) isBlinking = false;
  } else {
    eyeSize = lerp(eyeSize, 30, 0.3);
  }

  // === 发光层 ===
  glowIntensity = lerp(glowIntensity, random(0.3, 0.8), 0.02);
  if (frameCount % 60 === 0) {
    glowColor = (glowColor + random(-30, 30)) % 360;
  }

  fill(glowColor, 80, 100, glowIntensity);
  noStroke();
  circle(monsterX, monsterY, monsterSize + 30);

  fill(glowColor, 80, 100, glowIntensity * 0.5);
  circle(monsterX, monsterY, monsterSize + 50);

  fill(glowColor, 80, 100, glowIntensity * 0.35);
  circle(monsterX, monsterY, monsterSize + 70);

  //foot
  fill(bodycolor, 60, 100); // 脚颜色稍深一点
  noStroke();
  
  
  
    // === 怪兽身体 ===
  fill(bodycolor, 85, 90);
  noStroke();
  circle(monsterX, monsterY, monsterSize);
  



  // === 身体大小动画 ===
  if (monsterSize >= 300) shrinking = true;
  if (shrinking) {
    monsterSize = lerp(monsterSize, 150, 0.05);
    if (monsterSize <= 165) {
      monsterSize = 150;
      shrinking = false;
    }
  }

  // === 尖刺 ===
  if (isSpiky === true) {
    for (let i = 0; i < spikeCount; i++) {
      let angle = map(i, 0, spikeCount, 0, TWO_PI);
      fill(random(0, 360), 80, 90);
      noStroke();
      triangle(
        monsterX,
        monsterY,
        monsterX + cos(angle) * (monsterSize / 2 + spikeSize + 10),
        monsterY + sin(angle) * (monsterSize / 2 + spikeSize + 10),
        monsterX + cos(angle + PI / 15) * (monsterSize / 2 + spikeSize / 2),
        monsterY + sin(angle + PI / 15) * (monsterSize / 2 + spikeSize / 2)
      );
    }
    /*push();
  translate(monsterX, monsterY);
  imageMode(CENTER);
  image(creativeGraphic, 0, 0, monsterSize, monsterSize);
  pop();*/
  }

  // === 眼睛 ===
  fill(360, 0, 100);
  ellipse(monsterX - 40, monsterY - 20, eyeSize + 15, eyeSize + 10);
  fill(0);
  ellipse(monsterX - 40, monsterY - 20, eyeSize / 2, eyeSize / 2);

  fill(360, 0, 100);
  ellipse(monsterX + 40, monsterY - 20, eyeSize + 15, eyeSize + 10);
  fill(0);
  ellipse(monsterX + 40, monsterY - 20, eyeSize / 2, eyeSize / 2);

  // === 嘴巴 ===
  noFill();
  stroke(0);
  strokeWeight(4);
  arc(monsterX, monsterY + 20, 60, 40, 0, PI);
  strokeWeight(1);
  
  
  
    // 左脚
  ellipse(monsterX - footOffsetX, footY, footWidth, footHeight);
  // 右脚
  ellipse(monsterX + footOffsetX, footY, footWidth, footHeight);
  
  if(footup=false){
  footY--;
  }else{
    footY++;
  }

}

// === 花花动态背景函数 ===
function updateCreativeGraphic() {
  creativeGraphic.noStroke();
  creativeGraphic.fill(0, 10); // 轻微透明，形成拖影
  creativeGraphic.rect(0, 0, creativeGraphic.width, creativeGraphic.height);

  angle += 1;
  timer++;
  if (timer >= 200) {
    X = random(50, 750);
    Y = random(50, 450);
    U = random(0, 255);
    F = random(0, 255);
    O = random(0, 255);
    timer = 0;
    creativeGraphic.fill(U, F, O);
    creativeGraphic.stroke("white");
    for (let r = 40; r >= 0; r -= 15) {
      creativeGraphic.circle(X, Y, r);
    }
  }

  let sineValue = sin(angle * 6) * 80;
  let noiseValue = noise(frameCount * 0.5) * 60;
  let radDist = 15 + sineValue + noiseValue;
  let M = radDist + 20;
  let x = X + cos(angle) * radDist;
  let y = Y + sin(angle) * radDist;

  creativeGraphic.fill(O, F, U);
  creativeGraphic.circle(x, y, random(6, 12));

  if ((star = true)) {
    push();
    noStroke();
    fill(0, 0, 0, 0.08);
    rect(0, 0, width, height);

    blendMode(ADD);
    for (let s of stars) {
      let flicker =
        sin(frameCount * s.flickerSpeed + s.flickerPhase) * 0.4 + 0.6;
      s.x += 0.1 * s.z;
      if (s.x > width + 10) s.x = -10;

      for (let i = 0; i < 3; i++) {
        fill(s.hue, 50, s.brightness, 0.04 * flicker);
        circle(s.x, s.y, s.size * 14 * (1 - i * 0.28));
      }
      fill(s.hue, 40, 100, 0.8 * flicker);
      circle(s.x, s.y, s.size);
    }
    blendMode(BLEND);
    pop();
  }
}

function mousePressed() {
  bodycolor = random(0, 360);
  monsterSize = monsterSize + 15;
  glowIntensity = 1;
  star = !star;
}

function keyPressed() {
  if (keyCode === 32) {
    isSpiky = !isSpiky;    
  }
}
