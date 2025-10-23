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


function setup() {
  createCanvas(800, 500);
  colorMode(HSB, 360, 100, 100, 1);
  background("black");
  monsterX = 400;
  monsterY = 250;

  bodycolor = random(0, 360);
  glowColor = random(0, 360);
  
 
  for(let a=0;a<400;a+=70){
    for(let b=0;b<400;b+=50){
      for(let s = 0;s<10;s++){
        let H = random(180,240);
        let S = random(60,100);
        let B = random(40,80);
        let brightness = 20+s*8;
        stroke('rgb(233,224,103)');
        strokeWeight(4);
        fill(H,S,B,5);
        ellipse(a,b,random(30,70),200); 
        rotate(50);
      }
    }
  }
}

function draw() {
  //渐变
  fill(random(180,360),random(30,60),random(70,90), 1 / fadespeed);
  noStroke();
  rect(0, 0, 800, 500);
  
  //mouseCatching
  monsterX = lerp(monsterX, mouseX, 0.07);
  monsterY = lerp(monsterY, mouseY, 0.07);
  
  // blink
  Timer2 += 1;
  if (Timer2 > 100) {
    isBlinking = true;
    Timer2 = 0;
  }
  if (isBlinking) {
    eyeSize = lerp(eyeSize, 5, 0.3);
    if (eyeSize < 6) isBlinking = false;
  } else {
    eyeSize = lerp(eyeSize, 30, 0.3);
  }

  
  
  
 //glow
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
  
  // body
  fill(bodycolor, 85, 90);
  noStroke();
  circle(monsterX, monsterY, monsterSize);
  
  
  
  // bodySize
  if(monsterSize >= 300){
    shrinking = true;
  }
    
  if(shrinking){
    monsterSize = lerp(monsterSize, 150, 0.05);
    if(monsterSize <= 165){
      monsterSize = 150;
      shrinking = false;
    }
  }
  
  //spike
  if (isSpiky===true) {
  for (let i = 0; i < spikeCount; i++) {
      let angle = map(i, 0, spikeCount, 0, TWO_PI);
      fill(random(0,360),80,90);
      noStroke();
      triangle(monsterX, monsterY, 
               monsterX + cos(angle) * (monsterSize / 2 + spikeSize+10), 
               monsterY + sin(angle) * (monsterSize / 2 + spikeSize+10), 
               monsterX + cos(angle + PI/15) * (monsterSize / 2 + spikeSize/2), 
               monsterY + sin(angle + PI/15) * (monsterSize / 2 + spikeSize/2));}
  }
     
    
    
    // eyes
  fill(360, 0, 100);
  ellipse(monsterX - 40, monsterY - 20, eyeSize + 15, eyeSize + 10);
  fill(0, 0, 0);
  ellipse(monsterX - 40, monsterY - 20, eyeSize / 2, eyeSize / 2);

  fill(360, 0, 100);
  ellipse(monsterX + 40, monsterY - 20, eyeSize + 15, eyeSize + 10);
  fill(0, 0, 0);
  ellipse(monsterX + 40, monsterY - 20, eyeSize / 2, eyeSize / 2);
  
  // mouse
  noFill();
  stroke(0, 0, 0);
  strokeWeight(4);
  arc(monsterX, monsterY + 20, 60, 40, 0, PI);
  strokeWeight(1);
  
    }
  
  

//interaction
function mousePressed() {
  bodycolor = random(0, 360);
  monsterSize = monsterSize + 15;
  glowIntensity = 1;  
  
  
  
  
}

function keyPressed(){
  if(keyCode ===32){
  isSpiky = !isSpiky;}
}