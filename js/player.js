'use strict'

import { loadImage } from '/js/loaders.js'
import { keys } from '/js/keyboard.js'
import { checkCollisions } from '/js/platforms.js'

class Player {
    constructor(image, speedModifier) {
        this.image = image
        this.spriteWidth = 132
        this.spriteHeight = 161
        this.width = 66
        this.height = 81
        this.position = {
            x: 100,
            y: 300,
        }
        this.speedModifier = speedModifier
        this.speed = {
            x: 0,
            y: 0,
        }
        this.jumping = false
    }

    update = (gameSpeed, groundSize, gravity) => {
        if (keys.right.pressed && this.position.x < 400) {
            this.speed.x = this.speedModifier * gameSpeed
        } else if (keys.left.pressed && this.position.x > 100) {
            this.speed.x = -this.speedModifier * gameSpeed
        } else {
            this.speed.x = 0
        }

        const collision = checkCollisions(this)

        // Ajustamos la velocidad vertical
        if (
            this.position.y + this.height + this.speed.y <=
                innerHeight - groundSize &&
            !collision
        ) {
            this.speed.y += gravity
        } else {
            this.speed.y = 0
        }

        this.position.y += this.speed.y
        this.position.x += this.speed.x

        if (this.position.y <= 0) {
            this.speed.y = gravity
        }
    }

    jump = jumpModifier => {
        if (!this.jumping) {
            if (this.speed.y === 0) {
                this.speed.y -= jumpModifier
            }
            this.jumping = true
        }
    }

    draw = context => {
        context.drawImage(
            this.image,
            0,
            0,
            this.spriteWidth,
            this.spriteHeight,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }
}

export const playerWalkRightArray = [
    '/img/chars/Purple_Right2.png',
    '/img/chars/Purple_Right3.png',
]

export const playerWalkLeftArray = [
    '/img/chars/Purple_Left2.png',
    '/img/chars/Purple_Left3.png',
]

export const createPlayer = async () => {
    const sprite = await loadImage('/img/chars/Purple_Front1.png')
    const player = new Player(sprite, 0.5) // El mismo modificador de velocidad que el suelo

    return player
}
