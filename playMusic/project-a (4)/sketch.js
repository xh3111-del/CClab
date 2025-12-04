/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/


let osc;
let noteIndex = 0;
let mic;
//let notes;
function setup() {
  osc = new p5.Oscillator("sine");
  createCanvas(400, 400);
  mic.start();
}

function draw() {
  background(220);
  let freqValue = map(mouseX,0,width,100,800);
  //let ampValue = map(mic,0,1,0,1);
  //频率
  osc.freq(freqValue);
  //音量
  osc.amp(mic);
  //for loop(x,y){
  //  rect()
  
}
function mousePressed(){
   osc.start();
noteIndex++;
}
