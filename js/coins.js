'use strict'

import { loadImage } from '/js/loaders.js'
import { coinsArray, setCoinsArray } from '/js/platforms.js'

export const goldRotationSprites = []
export const silverRotationSprites = []
export const bronzeRotationSprites = []

export class Coin {
    constructor(image, position, type) {
        this.image = image
        this.spriteWidth = 81
        this.spriteHeight = 93
        this.width = 40.5
        this.height = 45.5
        this.position = position
        this.speedModifier = 0.5
        this.staggerFrames = 10
        this.type = type
    }

    draw = context => {
        context.drawImage(
            this.image,
            0,
            0,
            this.spriteWidth,
            this.spriteHeight,
            this.position.x - this.width / 2,
            this.position.y - this.height,
            this.width,
            this.height
        )
    }

    update = gameSpeed => {
        this.speed = this.speedModifier * gameSpeed
        this.position.x -= this.speed
    }

    checkPlayerCollision = player => {
        let collision = false
        if (
            player.position.x + player.width >= this.position.x &&
            player.position.x <= this.position.x + this.width / 2
        ) {
            if (
                (player.speed.y === 0 &&
                    player.position.y <= this.position.y &&
                    player.position.y + player.height >= this.position.y) ||
                (player.speed.y > 0 &&
                    player.position.y + player.height <= this.position.y &&
                    player.position.y + player.height + player.speed.y >=
                        this.position.y)
            ) {
                collision = true
            }
        }

        return collision
    }
}

export const loadCoinsImages = async () => {
    const goldCoin1 = await loadImage('/img/coins/gold1.png')
    const goldCoin2 = await loadImage('/img/coins/gold2.png')
    const goldCoin3 = await loadImage('/img/coins/gold3.png')
    const silverCoin1 = await loadImage('/img/coins/silver1.png')
    const silverCoin2 = await loadImage('/img/coins/silver2.png')
    const silverCoin3 = await loadImage('/img/coins/silver3.png')
    const bronzeCoin1 = await loadImage('/img/coins/bronze1.png')
    const bronzeCoin2 = await loadImage('/img/coins/bronze2.png')
    const bronzeCoin3 = await loadImage('/img/coins/bronze3.png')

    const coins = {
        gold1: goldCoin1,
        gold2: goldCoin2,
        gold3: goldCoin3,
        silver1: silverCoin1,
        silver2: silverCoin2,
        silver3: silverCoin3,
        bronze1: bronzeCoin1,
        bronze2: bronzeCoin2,
        bronze3: bronzeCoin3,
    }

    goldRotationSprites.push(goldCoin1)
    goldRotationSprites.push(goldCoin2)
    goldRotationSprites.push(goldCoin2)
    silverRotationSprites.push(silverCoin1)
    silverRotationSprites.push(silverCoin2)
    silverRotationSprites.push(silverCoin3)
    bronzeRotationSprites.push(bronzeCoin1)
    bronzeRotationSprites.push(bronzeCoin2)
    bronzeRotationSprites.push(bronzeCoin3)

    return coins
}

export const generateCoins = (x1, x2, y, coinsImages) => {
    let coin1 = null
    let coin2 = null
    let type

    // if (Math.random() > 0.4) {
    if (Math.random() > 0.4) {
        let image = new Image()

        if (Math.random() < 0.1) {
            image = coinsImages.gold1
            type = 'gold'
        } else if (Math.random() < 0.4) {
            image = coinsImages.silver1
            type = 'silver'
        } else {
            image = coinsImages.bronze1
            type = 'bronze'
        }

        coin1 = new Coin(
            image,
            {
                x: x1,
                y: y,
            },
            type,
            1
        )

        if (Math.random() < 0.2) {
            image = coinsImages.gold1
            type = 'gold'
        } else if (Math.random() < 0.4) {
            image = coinsImages.silver1
            type = 'silver'
        } else {
            image = coinsImages.bronze1
            type = 'bronze'
        }
        coin2 = new Coin(
            image,
            {
                x: x2,
                y: y,
            },
            type,
            2
        )
    }

    return [coin1, coin2]
}

export const grabCoin = (player, gravity) => {
    let coinGrabbed = null
    for (let i = 0; i < coinsArray.length; i++) {
        const coin = coinsArray[i]
        if (coin.checkPlayerCollision(player, gravity)) {
            coinGrabbed = coin
            break
        }
    }

    if (coinGrabbed) {
        setCoinsArray(coinsArray.filter(element => element !== coinGrabbed))
    }

    return coinGrabbed
}
