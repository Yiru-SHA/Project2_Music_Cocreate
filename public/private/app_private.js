/* Initialization */
// <script type="text/javascript" src="/socket.io/socket.io.js"></script> to index.html
let socket = io('/private');

//Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Connected");
});

/* -----P5----- */
let bubbles = [];
let receivedBubbles = [];
// make songs array
let songs = ["Podington_Bear_-_No_Squirell_Commotion.mp3", "Podington_Bear_-_13_-_New_Skin.mp3", "amphibianComposite.mp3"]

//generate random
let randomIndex;

// generate global value
let songsToPlay = [];
// let bgMusic = "amphibianComposite.mp3";
// let playbgMusic;

function preload() {
  //load all songs.音乐只能在preload里load
  for (let i = 0; i < songs.length; i++) {
    songsToPlay[i] = loadSound(songs[i]);
    //set volume

  }
}

function setup() {
  createCanvas(1000, 600);

  console.log("setup!")

  // mouse over for play background music
  document.getElementById('Button_bgMusic').onmouseover = function () { mouseOver() };
  
  //up to date
  document.getElementById('');

  //get data from server
  socket.on('bubbleData', function (obj) {
    console.log("recieving bubble info!!" + obj.x + "," + obj.y + "," + obj.diameter)
    console.log("receving color" + obj.alp)
    drawPos(obj);

    // play music here
    song = songsToPlay[obj.musicIndex];
    console.log(song);

    //use obj.musicJumpTime to move the song to wherever youw ant it to start from
    song.play();
    // volume doesn't work
    song.volume(0.5);
  }
  );

}

function mouseOver() {
  console.log("button is clicked!!")

  let bgMusic = songsToPlay[2];
  console.log(songsToPlay);

  // //replay doesn't work, sustain seems cause echo
  // //bgMusic.playMode('sustain');
  // bgMusic.play();

  // original version
  if (bgMusic.isPlaying()) {
    bgMusic.pause();
  } else {

    bgMusic.volume(0.2);
    bgMusic.play();
    
  }

  console.log(bgMusic);
  //bgMusic.play();
  console.log(bgMusic.isPlaying());
  //console.log(playbgMusic)
  //document.getElementById("Button_bgMusic").style.color = "white";
}

function mousePressed() {
  let al = 100;
  let colR = 30;
  let colG = random(70, 160);
  let colB = random(10, 200);
  let c = color(colR, colG, colB, al);
  let r = random(20, 60);
  // let c = color(30,random(70,160),random(10,200),alpha);
  console.log("mouse press color!!!" + c);

  let b = new Bubble(mouseX, mouseY, r, colR, colG, colB, al)
  // console.log('sending' + mouseX + "," + mouseY)

  // data.col is rgba()


  bubbles.push(b);
  console.log(bubbles);

  // random pick sound for mouse click
  randomIndex = Math.floor(random(songs.length));
  randomJumpTime = random(0, 30);

  console.log(randomIndex);
  console.log(songsToPlay[randomIndex]);


  let data = {
    x: mouseX,
    y: mouseY,
    diameter: r,
    r: colR,
    g: colG,
    b: colB,
    alp: al,
    musicIndex: randomIndex,
    //musicJumpTime : randomJumpTime
  }
  socket.emit('bubbleData', data);


  //*** fade out doesn't work
  // setVolume(0.2, [10], [20])


}

function drawPos(pos) {

  let d = new Bubble(pos.x, pos.y, pos.diameter, pos.r, pos.g, pos.b, pos.al)
  console.log('sending' + mouseX + "," + mouseY)
  bubbles.push(d);
}

let playOnce = true;

//
function draw() {
  background(178, 255, 44);
  //background(178,255,44);
  for (let i = 0; i < bubbles.length; i++) {

    //bubble[i].move();
    bubbles[i].show();
    bubbles[i].disappear();
  }
}

class Bubble {
  constructor(x, y, d, r, g, b, al) {
    this.x = x;
    this.y = y;
    this.diameter = d;
    this.alpha = al;
    this.colR = r;
    this.colG = g;
    this.colB = b;
    //this.color =  color(this.r,this.g,this.b,this.alpha);
  }

  //     // move() {
  //     //   this.x = this.x + random(-1, 1);
  //     //   this.y = this.y + random(-2, 2);
  //     // }

  show() {
    noStroke();
    // *** Q2: could not change color alpha
    //if alpha is less then 0, alpha = alpha -1, else alpha = 0;
    fill(12, 98, 123, 50);
    //fill(this.colR,this.colG,this.colB,this.alpha);
    //console.log("color_fill"+this.alpha)
    circle(this.x, this.y, this.diameter);
  }

  disappear() {
    this.alpha = this.alpha - 1;
    this.diameter = this.diameter + 1;
  }
}

  // function drawPos(pos){
  //   circle(pos.x,pos.y,pos.diameter);
  // }
