/* Initialization */
// <script type="text/javascript" src="/socket.io/socket.io.js"></script> to index.html
let socket = io('/private');

//Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Connected");
  socket.emit('joined');
});

socket.on('joined',function(data){
  // let userIndex = data;
  console.log("get info" + data.UserJoined);
  
  document.getElementById('userCounter').innerHTML = "";
  let elt = document.createElement('p');
  elt.classList.add('userCounter');
  elt.innerHTML = "Together! You got new connection: " + data.UserJoined;
  document.getElementById('userCounter').appendChild(elt);
})

/* -----P5----- */
let bubbles = [];
let receivedBubbles = [];
// make songs array
let songs = [
  "/Music/tibetan-singing-bowl.mp3",
  "/Music/bird-whistling-robin-.mp3",
  "/Music/fauxpress__bell-meditation.mp3",
  "/Music/Clip_No_Squirell_Commotion.mp3", 
  "/Music/Podington_Bear_-_13_-_New_Skin.mp3", 
  "/Music/Clip_amphibianComposite.mp3",
  "/Music/Zen-bell-02.mp3",
  "/Music/space-flight-sound-effect.mp3"
]

let slider;
//generate random for music
let randomIndex;
// generate global value for song
let songsToPlay = [];
let backgroundMusic;

function preload() {
  //load all songs.音乐只能在preload里load
  for (let i = 0; i < songs.length; i++) {
    songsToPlay[i] = loadSound(songs[i]);
  }
  //make a background music
  backgroundMusic = loadSound('/Music/rain-on-the-roof.mp3');
}

/* -----setup----- */
function setup() {
  createCanvas(1400, windowHeight);
  //console.log("setup!")

  // mouse over for play background music
  document.getElementById('Button_bgMusic').onclick = function () { mouseOverBgMusic() };

  //get data from server
  socket.on('bubbleData', function (obj) {
    drawPos(obj);
    // play music here
    song = songsToPlay[obj.musicIndex];
    song.play();
  }
  );
 
  //play previews song
  socket.on('previews', (data) => {
    console.log(data);
    let indexArray = data.indexes;
    console.log(indexArray);

    // doesn't work yet
    for (let j = 0; j < indexArray.length; j++) {
      let indexOne = indexArray[j];
      console.log(indexOne);
      // playPreviews(obj);
      song = songsToPlay[indexOne];
      //song.setVolume(,5,5);
      song.play();
      //console.log("previews!!" + song);
    }
  })

  // mouse over play song.index
  document.getElementById('Button_UTD').addEventListener ('click',()=>{
    socket.emit('playPreview')
    console.log("button is clicked!!")
  });
}

function mouseOverBgMusic() {
  console.log("button is clicked!!")
  backgroundMusic.setVolume(0.7);
  // backgroundMusic.loop();

  // original version
  if (backgroundMusic.isPlaying()) {
    backgroundMusic.pause();
  } else {
    //backgroundMusic.play();
    backgroundMusic.loop();
  }

  // console.log(bgMusic);
  // //bgMusic.play();
  // console.log(bgMusic.isPlaying());
  // //console.log(playbgMusic)
}

function mousePressed() {
  //两个变量要用（）
  if((mouseX>0 && mouseX<1400) && (mouseY>0 && mouseY<800)){  
    //let al = 100;
    let colR = random(70, 200);
    let colG = random(70, 160);
    let colB = random(10, 200);
    let c = color(colR, colG, colB);

    //let c = color(colR, colG, colB, al);
    let r = random(20, 60);
    // let c = color(30,random(70,160),random(10,200),alpha);
    console.log("mouse press color!!!" + c);

    // random pick sound for mouse click
    randomIndex = Math.floor(random(songs.length));
    //randomJumpTime = random(0, 30);

    console.log(randomIndex);
    console.log(songsToPlay[randomIndex]);

    let data = {
      x: mouseX,
      y: mouseY,
      diameter: r,
      r: colR,
      g: colG,
      b: colB,
      //alp: al,
      musicIndex: randomIndex,
      //musicJumpTime : randomJumpTime
  }
  socket.emit('bubbleData', data);
}
}

function drawPos(pos) {

  let d = new Bubble(pos.x, pos.y, pos.diameter, pos.r, pos.g, pos.b, pos.al)
  //console.log('sending' + mouseX + "," + mouseY)
  bubbles.push(d);
}

let playOnce = true;

function draw() {
  background(178, 255, 44);
  //background(178,255,44);
  for (let i = 0; i < bubbles.length; i++) {
    //bubble[i].move();
    bubbles[i].show();
    bubbles[i].disappear();
  }
  //remove bubble when alpha =0;
  for(let i = bubbles.length-1; i>=0;i--){
    if(bubbles[i].finished()){
      //console.log("before" + bubbles.length);
      bubbles.splice(i,1);
      //console.log("after" + bubbles.length);
    }
  }
}

class Bubble {
  constructor(x, y, d, r, g, b) {
    this.x = x;
    this.y = y;
    this.diameter = d;
    this.alpha = 200;
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
    //fill(12, 98, 123, this.alpha);
    fill(this.colR, this.colG, this.colB, this.alpha);
    //console.log("color_fill"+this.alpha)
    circle(this.x, this.y, this.diameter);
    if((this.x>0 && this.x<700) &&(this.y>0 && this.y<400)){
      fill(0,0,0, 0.7*this.alpha);
    rect(2*this.x,2*this.y,1,this.diameter);
    }else{
      fill(0,0,0,0.7*this.alpha);
    rect(0.5*this.x,2*this.y,this.diameter*2,3);
    }
    // if(this.x>700 && this.y<300){
    //   fill(this.colG, this.colB, this.colR, 2*this.alpha);
    // rect(0.5*this.x,2*this.y,2,this.diameter*2);
    // }
   
    

  }

  finished() {
    return this.alpha < 0;
  }

  disappear() {
    this.alpha = this.alpha - 1;
    this.diameter = this.diameter + 1;
    this.colR -=1;
    this.colG +=1;
    this.colB +=1;
    
  }
}
