'use strict'

import { loadImage } from '/js/loaders.js'

export let snailsArray = []
export let fliesArray = []
const spawnSpeed = innerWidth
let initialSnailSprite, initialFlySprite
const totalEnemies = 5
const fliesHeight = 400

export class Enemy {
    constructor(
        image,
        position,
        spriteWidth,
        spriteHeight,
        width,
        height,
        speedModifier
    ) {
        this.image = image
        this.spriteWidth = spriteWidth
        this.spriteHeight = spriteHeight
        this.width = width
        this.height = height
        this.position = position
        this.speedModifier = speedModifier
        this.speed = {
            x: 8,
            y: 0,
        }
    }

    update = () => {
        this.position.x -= this.speed.x * this.speedModifier
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

    checkPlayerCollision = player => {
        let collision = false
        if (
            player.position.x + player.width >= this.position.x &&
            player.position.x <= this.position.x + this.width
        ) {
            // console.log(player.position.y + player.height, this.position.y)
            if (
                (player.speed.y === 0 &&
                    player.position.y <= this.position.y + this.height &&
                    player.position.y + player.height >= this.position.y) ||
                (player.speed.y > 0 &&
                    player.position.y + player.height <= this.position.y &&
                    player.position.y + player.height + player.speed.y >=
                        this.position.y) ||
                (player.speed.y < 0 &&
                    player.position.y <= this.position.y + this.height &&
                    player.position.y >=
                        this.position.y + this.height + player.speed.y)
            ) {
                collision = true
            }
        }

        return collision
    }
}

export const removeSnail = (snail, groundSize) => {
    const lastSnail = snailsArray[snailsArray.length - 1].position.x
    snailsArray = snailsArray.filter(element => element !== snail)
    snailsArray.push(
        new Enemy(
            initialSnailSprite,
            {
                x: lastSnail + spawnSpeed,
                y: innerHeight - groundSize - 46.5,
            },
            54,
            31,
            81,
            46.5,
            0.1
        )
    )
}

export const removeFly = fly => {
    const lastFly = fliesArray[fliesArray.length - 1].position.x
    fliesArray = fliesArray.filter(element => element !== fly)
    fliesArray.push(
        new Enemy(
            initialFlySprite,
            {
                x: lastFly + spawnSpeed,
                y: fliesHeight,
            },
            72,
            36,
            72,
            36,
            0.4
        )
    )
}

export const walkingSnailArray = [
    '/img/enemies/snailWalk1.png',
    '/img/enemies/snailWalk2.png',
]

export const flyingFlyArray = [
    '/img/enemies/flyFly1.png',
    '/img/enemies/flyFly2.png',
]

export const createSnails = async groundSize => {
    if (!initialSnailSprite) {
        initialSnailSprite = await loadImage('/img/enemies/snailWalk1.png')
    }
    for (let i = 0; i < totalEnemies; i++) {
        const snail = new Enemy(
            initialSnailSprite,
            {
                x: innerWidth + i * spawnSpeed,
                y: innerHeight - groundSize - 46.5,
            },
            54,
            31,
            81,
            46.5,
            0.1
        )
        snailsArray.push(snail)
    }
}

export const createFlies = async () => {
    if (!initialFlySprite) {
        initialFlySprite = await loadImage('/img/enemies/flyFly1.png')
    }
    for (let i = 0; i < totalEnemies; i++) {
        const fly = new Enemy(
            initialFlySprite,
            {
                x: innerWidth + innerWidth / 2 + i * spawnSpeed,
                y: fliesHeight,
            },
            72,
            36,
            72,
            36,
            0.4
        )
        fliesArray.push(fly)
    }
}

export const enemiesDraw = context => {
    snailsArray.forEach(snail => {
        snail.draw(context)
    })

    fliesArray.forEach(fly => {
        fly.draw(context)
    })
}

export const enemiesUpdate = groundSize => {
    snailsArray.forEach(snail => {
        snail.update()

        if (snail.position.x + snail.width < 0) {
            removeSnail(snail, groundSize)
        }
    })

    fliesArray.forEach(fly => {
        fly.update()

        if (fly.position.x + fly.width < 0) {
            removeFly(fly)
        }
    })
}

export const checkCollisions = player => {
    let collision = false
    for (let i = 0; i < snailsArray.length; ++i) {
        const snail = snailsArray[i]

        if (snail.checkPlayerCollision(player)) {
            removeSnail(snail)
            collision = true
            break
        }
    }
    if (!collision) {
        for (let i = 0; i < fliesArray.length; ++i) {
            const fly = fliesArray[i]

            if (fly.checkPlayerCollision(player)) {
                removeFly(fly)
                collision = true
                break
            }
        }
    }
    return collision
}
