var game = new Phaser.Game(800, 600, Phaser.AUTO);
var score = 0;
var scoreText;

game.state.add('MainState', MainState);
game.state.start('MainState');
