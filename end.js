class end extends Phaser.Scene {
    constructor() {
        super('EndGame')
    }

    init(data) {
        this.score = data.totalScore;
    }

    preload() {
        this.load.image('end-game', 'game-end.jpeg')
    }

    create() {
        this.add.image(400, 300, 'end-game').setScale(0.7)
        this.add.text(180, 50, 'Your Score : ' + this.score, { fontSize: 48 })
    }
}