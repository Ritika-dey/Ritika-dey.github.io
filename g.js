/* var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}; 

var game = new Phaser.Game(config);
var cursors ,jet,sky, bombs , coins , bullet , explosion,gunShot,coinhit;
var score = 0;
var gOver = false;*/

class g extends Phaser.Scene {
    constructor() {
        super('Play')
        this.score = 0;
    }

preload()
{ 
    this.load.image('sky','space3.png');
    this.load.image('jet','jet.png');
    this.load.image('bomb','bomb.png');
    this.load.image('coin','coin.png');
    this.load.image('bullet','bullet.png');
    this.load.spritesheet('explosion','explosion.png',{
        frameWidth: 16 ,
        frameHeight: 16
    });

    this.load.audio('shot','gunshot.wav')
    this.load.audio('coinhit','coinhit.wav')
    this.load.audio('endgame', 'end.mp3')
}

create ()
{
    this.sky = this.add.tileSprite(400, 300,config.width, config.height, 'sky');
    this.jet = this.physics.add.image(400, 500, 'jet').setScale(0.2).setOrigin(0.5, 0)
    this.jet.setCollideWorldBounds(true);

    //bomb creation
    this.bombs = this.physics.add.group({

        key: 'bomb',
        repeat: 10,
        setXY: {X:20 , Y:50,
        stepX: Phaser.Math.Between(10, config.width-15),
        stepY: Phaser.Math.Between(15,300)
        }
    })

    //coin creation
    this.coins = this.physics.add.group();

    for(let i=0;i< 10;i++)
    {
       let coinX = Phaser.Math.Between(0, config.width-15)
       let coinY = Phaser.Math.Between(0,200)
       let newCoin = this.coins.create(coinX,coinY,'coin')
    }

    //motion of bomb and coin
    this.setObjVelocity(this.coins);
    this.setObjVelocity(this.bombs);

    //cursor calling
    this.cursors = this.input.keyboard.createCursorKeys();

    //bullet shoot function call and creation
    this.input.on('pointerdown', this.shoot , this)
    
    //animation
    this.anims.create({
    key: 'explode',
    frames: this.anims.generateFrameNumbers('explosion'),
    framerate: 20,
    hideOnComplete: true
    })

    //coin jet collision
    this.physics.add.collider(this.jet, this.coins,this.coinCollect, null, this)
    this.physics.add.collider(this.jet, this.bombs,this.gameOver, null, this)

    this.gunShot = this.sound.add('shot')
    this.coinhit = this.sound.add('coinhit')
    this.endgame = this.sound.add('endgame')

    //score text
    this.scoreText = this.add.text(15,15 , 'Score : 00',{ fontSize: 35, fill: '#fff'})
    }
//create end

//gameover 
gameOver(jet , bombs)
{
  this.endgame.play()
  this.physics.pause()
  this.gOver = true
  jet.setTint(0xff0000)
   
}

//collect coins
coinCollect(jet , coins)
{
    this.coinhit.play() // sound
    coins.disableBody(true,true)
    //when coins get absorbed and new bombs created 
     let x = Phaser.Math.Between(0, config.width-20)
     let y = Phaser.Math.Between(0, 200)
     coins.enableBody(true ,x , 0 , true ,true)
    //new velocity
     let velX = Phaser.Math.Between(-100, 100);
     let velY = Phaser.Math.Between(50, 100);
     coins.setVelocity(velX,velY)

     //new score
     this.score += 10
     this.scoreText.setText('Score : ' + this.score)
}

//shoot function
 shoot ()
{
    this.bullet = this.physics.add.image(this.jet.x , this.jet.y ,'bullet').setScale(0.1)
    this.bullet.setRotation(-Phaser.Math.PI2 / 4);
    this.bullet.setVelocityY(-400);
    this.physics.add.collider(this.bullet,this.bombs, this.destroy, null, this)
}


//distroy function
 destroy(bullet,bomb)
{
    this.gunShot.play() //sound

    bomb.disableBody(true, true)
    this.bullet.disableBody(true, true)

    this.explosion = this.add.sprite(bomb.x, bomb.y , 'explosion').setScale(2)
    this.explosion.setRotation(-Phaser.Math.PI2/4)
    this.explosion.play('explode')
    //when bombs get destroyed new bombs created 
    let x = Phaser.Math.Between(0, config.width-20)
    let y = Phaser.Math.Between(0, 200)
    bomb.enableBody(true ,x , 0 , true ,true)
    //new velocity
    let velX = Phaser.Math.Between(-100, 100);
    let velY = Phaser.Math.Between(50, 100);
    bomb.setVelocity(velX,velY)

    // new score
    this.score += 15
    this.scoreText.setText('Score : ' + this.score)
}

//object velocity
 setObjVelocity(bombs)
{
    bombs.children.iterate(function (bomb){
       let velX = Phaser.Math.Between(-100, 100);
       let velY = Phaser.Math.Between(50, 100);
       bomb.setVelocity(velX,velY)
    })
}


  update ()
{
    if(this.gOver && !this.endgame.isPlaying)
      {
        this.scene.start('EndGame', { totalScore: this.score })
        
      }

    //for screen movement
    this.sky.tilePositionY -= 1
    //for velocity in x direction
    if(this.cursors.left.isDown)
       this.jet.setVelocityX(-150);
    else if(this.cursors.right.isDown)
       this.jet.setVelocityX(150);
    else
    this.jet.setVelocityX(0);


    //for velocity in y direction
    if(this.cursors.up.isDown)
      this.jet.setVelocityY(-150);
    else if(this.cursors.down.isDown)
      this.jet.setVelocityY(150);
    else
      this.jet.setVelocityY(0);

      this.checkIfFinish(this.bombs);
      this.checkIfFinish(this.coins);
}

//for checking positon of bomb and coin
 checkIfFinish(bombs)
{
    let game = this;
    bombs.children.iterate(function(bomb){
        if(bomb.y > config.height)
          game.resetPos(bomb)
    })
}

//for respositioning bomb and coin

 resetPos(bomb)
 {
    bomb.y = 0;
    let random = Phaser.Math.Between(20 , config.width - 20)
    bomb.x = random
 }
}