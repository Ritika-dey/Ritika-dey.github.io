class startg extends Phaser.Scene{
    constructor(){
        super('start')
    }


preload()
{
    this.load.image('start', 'space.jpg')
    this.load.image('play-now' , 'play_now.webp')
}

create()
{
    this.add.image(400,300,'start').setScale(0.5)
    this.startbtn = this.add.image(400,400,'play-now').setScale(0.5)
    this.startbtn.setInteractive();
    this.startbtn.on('pointerdown', this.startGame , this)
}

startGame()
{
    this.scene.start('Play');
}
}