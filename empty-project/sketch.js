let mic;

function setup(){
  createCanvas(400, 400);

  mic = new p5.AudioIn();
  mic.start();
}

function draw() {
  background(50);
  
  let level = mic.getLevel();
  let dia = map(level, 0.0, 1.0, 0, 1000);
  console.log(level);

  ellipse(width/2, height/2, dia, dia);
}

