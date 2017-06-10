BunnyDefender.StartMenu = function(game) {
    this.startBG;
    this.startPrompt;
    this.ding;
}

BunnyDefender.StartMenu.prototype = {
	//create function built hai pahly sy hi phraser main
	create: function () {
        this.ding = this.add.audio('select_audio');
        
		startBG = this.add.image(0, 0, 'titlescreen');
		startBG.inputEnabled = true; //this is going to allow mouse clickes and touches
		startBG.events.onInputDown.addOnce(this.startGame, this); //this is going to bind event handler
		
		startPrompt = this.add.bitmapText(this.world.centerX-155, this.world.centerY+180, 'eightbitwonder', 'Touch to Start!', 24);
	},
//startGame khud bnaya hai humny
	startGame: function (pointer) {
        this.ding.play();
		this.state.start('Game');
	}
};
