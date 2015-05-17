// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);

var score=0;
var labelScore;
var player;
var pipes;
/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
game.load.image("playerImg","assets/jamesBond.gif");
    game.load.audio("score","assets/point.ogg");

game.load.image("pipe","assets/pipe.png");
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {

game.physics.startSystem(Phaser.Physics.ARCADE);
    // set the background colour of the scene
    game.stage.setBackgroundColor("#FFCCCC");
    game.add.text(20, 20, "Welcome to my game!",
        {font: "40px Georgia, serif", fill: "#0066FF"});

    player = game.add.sprite(50, 50, "playerImg");
    game.physics.arcade.enable(player);

    player.body.gravity.y=100;

   labelScore = game.add.text(20, 60, "0");
    pipes=game.add.group();

    game.input.onDown.add(clickHandler);
    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(playerJump);
    game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(moveRight);
    game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(moveLeft);


    generatePipe();

    var pipeInterval=1.90;
    game.time.events.loop(pipeInterval*Phaser.Timer.SECOND,generatePipe);
    player.checkWorldBounds=true;
    player.events.onOutofBounds.add(gameOver);
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
    game.physics.arcade.overlap(player,pipes,gameOver);
}

function clickHandler (event){
    //alert(event.x + ":" + event.y);
    alert(score);
    game.add.sprite(event.x,event.y,"playerImg");
player.x=event.x;
    player.y=event.y;
    }

function getPoint() {
    score = score +1;
    game.sound.play("score");
}

function changeScore() {
    score=score +1;
    game.sound.play("score");
    labelScore.setText(score.toString());
}

function moveRight(){
    player.x=player.x+10
}

function moveLeft () {
player.x=player.x-10
}


function generatePipe(){
    //calculate a random position for the gap
    var gapStart=game.rnd.integerInRange(1,5);
    //generate the pipes, except where the gap should be
    for (var count=0;count<8;count=count+1) {
        if(count!=gapStart&&count!=gapStart+1){
            addPipeBlock(800,count*50);
        }
    }
    changeScore();
}

function addPipeBlock(x,y) {
    //add a new pipe part to the 'pipes' group
    var pipe=pipes.create(x,y,"pipe");
    game.physics.arcade.enable(pipe);
    pipe.body.velocity.x=-200;
}

function playerJump(){
    player.body.velocity.y=-200;
}

function gameOver(){
    game.destroy();
}