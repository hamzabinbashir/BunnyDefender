BunnyDefender.Game = function (game) {
    this.totalBunnies;
    this.bunnyGroup;
    this.totalSpacerocks;
    this.spacerockgroup;
    this.burst;
    this.gameover;
    this.countdown;
    this.overmessage;
    this.secondElapsed;
    this.timer;
    this.music;
    this.ouch;
    this.boom;
    this.ding;
    //this.button;
};
 //it wil run only once and it is a good point to set up that we need in that space
BunnyDefender.Game.prototype = {
   
     //it helps us to know whats going on in our game
    create: function () {
        this.gameover = false;
        this.secondElapsed = 0;
        this.timer = this.time.create(false); //false is  going to tell the timer that we donot want it to remove it self from the game its an auto distroy mechanism agr true karogy to timer ek bar hi chlyga jbhi humny loop lgaya hai taky chlta rhy false main...
        this.timer.loop(1000, this.updateSeconds, this);
        this.totalBunnies = 20;
        this.totalSpacerocks = 13;
        this.music = this.add.audio('game_audio');
        this.music.play('', 0, 0.3, true);   //marker, position, volume, loop
        this.ouch = this.add.audio('hurt_audio');
        this.boom = this.add.audio('explosion_audio');
        this.ding = this.add.audio('select_audio');

        
        this.buildWorld();
    },
    
    updateSeconds: function () {
      this.secondElapsed++; //incrementing second elapsed  
    },
    
    buildWorld: function () {
        this.add.image(0, 0, 'sky');
        this.add.image(0, 800, 'hill');
        this.add.image(-170, -100, 'ship');
        this.add.image(-230, -100, 'alien');
        this.buildAlien;
        this.buildBunnies();
        this.buildSpaceRocks();
        this.buildEmitter();
        this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Bunnies Left' + this.totalBunnies, 20);
        this.timer.start(); //timer loop going as soon everything is ready
    },
    
    buildBunnies: function () {
    this.bunnygroup = this.add.group(); //this will create a new group for us called bunny group
    this.bunnygroup.enableBody = true; //tis allow the bunny group to enable with different objects
    for (var i=0; i<this.totalBunnies; i++) {
        //bunny kdhr place hoga x axis and y axis main uski calculation rand generaton k lyian
        var b = this.bunnygroup.create(this.rnd.integerInRange(-10, this.world.width-50), this.rnd.integerInRange(this.world.height-180, this.world.height-60), 'bunny', 'Bunny0000');
        b.anchor.setTo(0.5, 0.5);
        b.body.moves = false; //allow us to control manully
        b.animations.add('Rest', this.game.math.numberArray(1,58));
        b.animations.add('Walk', this.game.math.numberArray(68,107));
        b.animations.play('Rest', 24, true);
        this.assignBunnyMovement(b);
    }
},
   //anuimation bunny ki
    assignBunnyMovement: function(b) {
    bposition = Math.floor(this.rnd.realInRange(50, this.world.width-50));
    bdelay = this.rnd.integerInRange(2000, 6000);
    if(bposition < b.x){
        b.scale.x = 1; //bunny ko ek direction sy dosri direction main ly jaiga yh anchor size sy mila hota hai
    }else{
        b.scale.x = -1;
    }
        //actual movement                //time   //yh natural movement k lyain
    t = this.add.tween(b).to({x:bposition}, 3500, Phaser.Easing.Quadratic.InOut, true, bdelay); //properties, duration, ease, autoStart, delay
    t.onStart.add(this.startBunny, this);
    t.onComplete.add(this.stopBunny, this);
},
   
startBunny: function(b) {
    b.animations.stop('Rest');
    b.animations.play('Walk', 24, true);
},

stopBunny: function(b) {
    b.animations.stop('Walk');
    b.animations.play('Rest', 24, true);
    this.assignBunnyMovement(b);
},
    //space rock
    buildSpaceRocks: function() {
    this.spacerockgroup = this.add.group(); //it will declare a new group
    for(var i=0; i<this.totalSpacerocks; i++) {
        var r = this.spacerockgroup.create(this.rnd.integerInRange(0, this.world.width), this.rnd.realInRange(-1500, 0), 'spacerock', 'SpaceRock0000');
        var scale = this.rnd.realInRange(0.3, 1.0);
        r.scale.x = scale;
        r.scale.y = scale;
        this.physics.enable(r, Phaser.Physics.ARCADE); //physics function pahly sy hi hai
        r.enableBody = true;
        r.body.velocity.y = this.rnd.integerInRange(200, 400); //velocity y will determine how fast the rocks will come to the ground
        r.animations.add('Fall'); //just fall animation
        r.animations.play('Fall', 24, true); //playing fall
        r.checkWorldBounds = true; //once the space rock  has left stage  it will be able to fire up the event that it has left the world
        r.events.onOutOfBounds.add(this.resetRock, this); //bind event ... calling this.reset rock and it will pass through this
    }

},
    
    resetRock: function(r) {
        if(r.y > this.world.height){
            this.respawnRock(r);
        }
    },
    
    respawnRock: function(r){
        if(this.gameover == false){
      r.reset(this.rnd.integerInRange(0, this.world.width), this.rnd.realInRange(-1500, 0));
      r.body.velocity.y = this.rnd.integerInRange(200, 400);
        }
    },
    
    //fire
    
    buildEmitter:function() {
    this.burst = this.add.emitter(0, 0, 80); //this will create brst object 3rd thing amount of particle emitter can hold
    this.burst.minParticleScale = 0.3;
    this.burst.maxParticleScale = 1.2;
    this.burst.minParticleSpeed.setTo(-30, 30);
    this.burst.maxParticleSpeed.setTo(30, -30);
    this.burst.makeParticles('explosion'); //passing the refrence of image
    this.input.onDown.add(this.fireBurst, this); //want this to happen when we touch or click
},

fireBurst: function(pointer) {
    //setting x and y property of fire
     if(this.gameover == false){
    this.boom.play();
    this.boom.voulme = 0.2;
    this.burst.emitX = pointer.x;
    this.burst.emitY = pointer.y;
    this.burst.start(true, 2000, null, 10); //(explode, lifespan, frequency, quantity) 20
     }
},


    
    //it will run constantly here we put  logics and other things
    //attack ki power rocks ko torny ki
    burstCollision: function(r, b) {
     this.respawnRock(r);
},
   //bunny remove  
    bunnyCollision:function(r, b){
      if(b.exists){
          this.ouch.play();
          this.respawnRock(r);
          this.makeGhost(b);
          b.kill(); // pahly sy hi function hai kill
          this.totalBunnies--;
          this.checkBunniesLeft();
      }  
    },
    
    checkBunniesLeft: function() {
      if(this.totalBunnies <=0){
          this.gameover = true;
          this.music.stop();
          this.countdown.setText('Bunnies Left 0');
          //game over text
          this.overmessage = this.add.bitmapText(this.world.centerX-180, this.world.centerY-40, 'eightbitwonder', 'GAME OVER\n\n' + this.secondElapsed, 42);
          this.overmessage.align = "center";
          this.overmessage.inputEnabled = true;
           this.overmessage.events.onInputDown.addOnce(this.quitGame, this);
          //yha tk aue else k bad ek nechy function hai
      }else{
              this.countdown.setText('Bunnies Left' + this.totalBunnies);
          }   
    },
    
    quitGame:function(pointer) {
      this.ding.play();
      this.state.start('StartMenu'); //we need to load the different state we will send user to the start menu
    },
    
    friendlyFire: function(b, e){
        if(b.exists){
            this.ouch.play();
            this.makeGhost(b);
            b.kill();
            this.totalBunnies--;
            this.checkBunniesLeft();
        }
    },
    //bunny ghost
    makeGhost: function(b) {
    bunnyghost = this.add.sprite(b.x-20, b.y-180, 'ghost');
    bunnyghost.anchor.setTo(0.5, 0.5);
    bunnyghost.scale.x = b.scale.x;
    this.physics.enable(bunnyghost, Phaser.Physics.ARCADE); //pahly sy hi hai yh function
    bunnyghost.enableBody = true;
    bunnyghost.checkWorldBounds = true; //notify when bunny left the screen
    bunnyghost.body.velocity.y = -400;
},
    
    update: function() {
        //entites,,1st group,,2nd group,,function is going to be call when the collision happen
        this.physics.arcade.overlap(this.spacerockgroup, this.burst, this.burstCollision, null, this);
        this.physics.arcade.overlap(this.spacerockgroup, this.bunnygroup, this.bunnyCollision, null, this);
        this.physics.arcade.overlap(this.bunnygroup, this.burst, this.friendlyFire, null, this);
    } 
}