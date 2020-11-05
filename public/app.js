
/*
Q1: line41, how could I adjust p5 canvas location in style ?
Q2: line55, how could I make background music sustain （loop、repeat play）?
Q3: line95, fade out doesn't work?
Q4: line 121, how could I make bubble alpha works for fill(); ?
*/

/* Initialization */
// <script type="text/javascript" src="/socket.io/socket.io.js"></script> to index.html
let socket = io();

//Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected");
});

/* -----P5----- */
let bubbles =[];
let receivedBubbles =[];
// make songs array
let songs = ["Podington_Bear_-_No_Squirell_Commotion.mp3","Podington_Bear_-_13_-_New_Skin.mp3","amphibianComposite.mp3"]
    
//generate random
let randomIndex;

// generate global value
let songsToPlay = [];  
// let bgMusic = "amphibianComposite.mp3";
// let playbgMusic;

function preload(){
    //load all songs.音乐只能在preload里load
    for (let i = 0; i < songs.length; i++){
        songsToPlay[i] = loadSound(songs[i]);
        }
} 

function setup(){
    createCanvas(1000, 600);
    background(178,255,44);
    console.log("setup!")
    
  //  *** Q1:have not fixed: playbgMusic.play(); 
  // background music play with click
  // test: if button could trigger background music
  // document.getElementById('clickbgMusic').addEventListener('click',()=>{
  //   console.log("button is clicked!!")
  
  // mouse over for play background music
  document.getElementById('Button_bgMusic').onmouseover = function(){mouseOver()};
  function mouseOver(){
    console.log("button is clicked!!") 
    
    let bgMusic = songsToPlay[2];
    console.log(songsToPlay);

    // //replay doesn't work, sustain seems cause echo
    // //bgMusic.playMode('sustain');
    // bgMusic.play();

    // original version
      if (bgMusic.isPlaying()) {
          bgMusic.pause();} else {  
          bgMusic.play();}
      
        console.log(bgMusic);
        //bgMusic.play();
        console.log(bgMusic.isPlaying());
        //console.log(playbgMusic)
        //document.getElementById("Button_bgMusic").style.color = "white";
      }

      //get data from server
    socket.on('bubbleData',function(obj){
        console.log("recieving bubble info!!" + obj.x + "," + obj.y + "," + obj.diameter)
        console.log("receving color" + obj.col)
        drawPos(obj);
      }
    );

    // socket.on('bubbleData',newDrawing);

}

// function newDrawing(data)
// {
//   console.log('receving'+ data.x + "," + data.y + "," +data.diameter);
//   fill('red');
//   ellipse(data.x,data.y,data.diameter);
// }

function mousePressed(){
    let al =100;
    let colR = 30;
    let colG = random(70,160);
    let colB = random(10,200);
    let c = color(colR,colG,colB,al);
    let r = random(20,60);
    // let c = color(30,random(70,160),random(10,200),alpha);
    console.log("mouse press color!!!" + c);

    let b = new Bubble(mouseX,mouseY,r,c,al)
    // console.log('sending' + mouseX + "," + mouseY)

    // data.col is rgba()
    let data={
      x : mouseX,
      y : mouseY,
      diameter : r,
      col : c,
    }
    socket.emit('bubbleData',data);

    bubbles.push(b);
    console.log(bubbles);
 
    // random pick sound for mouse click
    randomIndex = Math.floor(random(songs.length));
    console.log(randomIndex);
    console.log(songsToPlay[randomIndex]);
   
    song = songsToPlay[randomIndex];
    console.log(song);
    song.play();
    //*** fade out doesn't work
   // setVolume(0.2, [10], [20])


}

function drawPos(pos){

  let d = new Bubble(pos.x,pos.y,pos.diameter,pos.col,pos.al)
  console.log('sending' + mouseX + "," + mouseY)
  receivedBubbles.push(d);
}

let playOnce = true;

//
function draw() {
    //background(178,255,44);
    for(let i =0;i<bubbles.length;i++){
  
    //bubble[i].move();
    bubbles[i].show();
    bubbles[i].disappear();
    }
  }

  class Bubble { 
    constructor(x, y,d,col,al) {
      this.x = x;
      this.y = y;
      this.diameter = d;
      this.alpha = al;
      this.color =  col;
    }
  
//     // move() {
//     //   this.x = this.x + random(-1, 1);
//     //   this.y = this.y + random(-2, 2);
//     // }
  
    show() {
      noStroke();
      // *** Q2: could not change color alpha
      //if alpha is less then 0, alpha = alpha -1, else alpha = 0;
      fill(this.color,this.alpha);
      //console.log("color_fill"+this.alpha)
      circle(this.x,this.y,this.diameter);
    }

    disappear(){
        this.alpha = this.alpha - 1;
        this.diameter = this.diameter + 1;
    }
  }

  // function drawPos(pos){
  //   circle(pos.x,pos.y,pos.diameter);
  // }