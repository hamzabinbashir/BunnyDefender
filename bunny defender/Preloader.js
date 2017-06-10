BunnyDefender.Preloader =function(game) {
    this.preloadBar = null;
    this.titleText = null;
    this.ready = false;  
};

BunnyDefender.Preloader.prototype = {
	
	preload: function () {
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar'); //sprite inside of phaser it allows to do is use a specific sprite as a  preloader and  crops it in certain ways
		this.preloadBar.anchor.setTo(0.5, 0.5);
		this.load.setPreloadSprite(this.preloadBar);
		this.titleText = this.add.image(this.world.centerX, this.world.centerY-220, 'titleimage');
		this.titleText.anchor.setTo(0.5, 0.5);
        this.load.image('titlescreen','images/TitleBG.png');
        this.load.bitmapFont('eightbitwonder','fonts/eightbitwonder.png','fonts/eightbitwonder.fnt');
        this.load.image('hill','images/hill.png');
        this.load.image('sky','images/sky.png');
        this.load.image('ship','images/ship.png');
        this.load.image('alien','images/alien.png');
        //this.load.image('bunny','images/animal.png');
        this.load.atlasXML('bunny', 'images/spritesheets/bunny.png', 'images/spritesheets/bunny.xml');
      this.load.atlasXML('spacerock','images/spritesheets/SpaceRock.png','images/spritesheets/SpaceRock.xml');
        this.load.image('explosion','images/explosion.png');
        this.load.image('ghost','images/ghost.png');
        //sound
        this.load.audio('explosion_audio', 'audio/explosion.mp3');
        this.load.audio('hurt_audio', 'audio/hurt.mp3');
        this.load.audio('select_audio', 'audio/select.mp3');
        this.load.audio('game_audio', 'audio/bgm.mp3');
	},

	create: function () {
		this.preloadBar.cropEnabled = false; //force show the whole thing
	},
    
    

	update: function () {
        //k sound fully loaded hai bs wo check karna hai 
        document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    console.log(Media);
}
     if(this.cache.isSoundDecoded('game_audio') && this.ready == false){
	   	this.ready = true; //creates function is ready to run true jaisy hi game ready hoga jb yh work kryga jbhi true hai
        this.state.start('StartMenu');
        }
	}
};
