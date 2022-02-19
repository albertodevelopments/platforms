'use strict'

import { createLayers } from '/js/layers.js'
import { listenEvents } from '/js/keyboard.js'
import {
    playerWalkLeftArray,
    playerWalkRightArray,
    createPlayer,
} from '/js/player.js'
import { keys } from '/js/keyboard.js'
import {
    loadPlatforms,
    spawnPlatforms,
    drawPlatforms,
    updatePlatforms,
    drawCoins,
    updateCoins,
    coinsArray,
} from '/js/platforms.js'

import {
    createSnails,
    createFlies,
    checkCollisions,
    snailsArray,
    fliesArray,
    walkingSnailArray,
    flyingFlyArray,
    enemiesDraw,
    enemiesUpdate,
} from '/js/enemies.js'
import {
    loadCoinsImages,
    goldRotationSprites,
    silverRotationSprites,
    bronzeRotationSprites,
    grabCoin,
} from '/js/coins.js'

import { pickedCoinAudio } from '/js/audio.js'

let canvas, context
let gameLayers = [],
    player
const gameSpeed = 9
const tileSize = 64
const staggerFrames = 10
let playerFrame, movementCounter
const gravity = 0.5
let snailsFrame, snailsMovementCounter
let fliesFrame, fliesMovementCounter
let score, lifes
let displayScore, displayLifes
let coinsImages
let coinsFrame, coinsRotationCounter
const coinAudio = pickedCoinAudio()
let coinsPickedSound

const init = async () => {
    canvas = document.getElementById('canvas')
    context = canvas.getContext('2d')
    canvas.width = innerWidth
    canvas.height = innerHeight

    coinsPickedSound = new Howl({
        src: ['/sounds/coins.wav'],
        loop: false,
    })

    listenEvents()

    /** Inicializamos variables */
    snailsFrame = 0
    snailsMovementCounter = 0
    fliesFrame = 0
    fliesMovementCounter = 0
    coinsRotationCounter = 0
    coinsFrame = 0
    movementCounter = 0
    score = 0
    lifes = 3
    playerFrame = 0

    displayScore = document.getElementById('score')
    displayScore.innerHTML = score

    displayLifes = document.getElementById('lifes')
    displayLifes.innerHTML = lifes

    gameLayers = await createLayers(tileSize)
    player = await createPlayer(tileSize)
    await loadPlatforms(tileSize)
    await createSnails(tileSize)
    await createFlies(tileSize)
    coinsImages = await loadCoinsImages()

    animate()
}

const stop = async () => {
    context.clearRect(0, 0, innerWidth, innerHeight)

    gameLayers = await createLayers(tileSize)
    player = await createPlayer(tileSize)

    const skyLayer = gameLayers['sky']
    const groundLayer = gameLayers['ground']
    const cloudsLayer = gameLayers['clouds']

    skyLayer.draw(context)
    groundLayer.draw(context)
    cloudsLayer.draw(context)
    player.position.y = innerHeight - tileSize - player.height
    player.draw(context)
}

const update = async (player, gameLayers) => {
    const skyLayer = gameLayers['sky']
    const groundLayer = gameLayers['ground']
    const cloudsLayer = gameLayers['clouds']

    skyLayer.draw(context)
    groundLayer.draw(context)
    cloudsLayer.draw(context)
    spawnPlatforms(coinsImages)
    drawPlatforms(context)
    drawCoins(context)
    enemiesDraw(context)

    if (keys.up.pressed) {
        if (player.position.y >= 200) {
            player.jump(20)
        } else {
            player.jump(16)
        }
    } else {
        player.jumping = false
    }

    snailsArray.forEach(enemy => {
        enemy.speedModifier = 0.1
    })
    fliesArray.forEach(enemy => {
        enemy.speedModifier = 0.4
    })
    if (keys.right.pressed) {
        if (player.position.x >= 400) {
            groundLayer.update(gameSpeed)
            cloudsLayer.update(gameSpeed)
            snailsArray.forEach(enemy => {
                enemy.speedModifier = 0.7
            })
            fliesArray.forEach(enemy => {
                enemy.speedModifier = 0.9
            })
            updatePlatforms(gameSpeed)
            updateCoins(gameSpeed)
        }

        if (player.speed.y === 0) {
            if (playerFrame % staggerFrames === 0) {
                player.image.src = playerWalkRightArray[movementCounter]

                movementCounter++
                if (movementCounter === 2) movementCounter = 0
            }
            playerFrame++
        } else {
            player.image.src = '/img/chars/Purple_Right1.png'
        }
    } else if (keys.left.pressed) {
        if (player.speed.y === 0) {
            if (playerFrame % staggerFrames === 0) {
                player.image.src = playerWalkLeftArray[movementCounter]

                movementCounter++
                if (movementCounter === 2) movementCounter = 0
            }
            playerFrame++
        } else {
            player.image.src = '/img/chars/Purple_Left1.png'
        }
    }

    if (coinsFrame % staggerFrames === 0) {
        coinsArray.forEach(coin => {
            switch (coin.type) {
                case 'gold':
                    coin.image = goldRotationSprites[coinsRotationCounter]
                    break
                case 'silver':
                    coin.image = silverRotationSprites[coinsRotationCounter]
                    break
                case 'bronze':
                    coin.image = bronzeRotationSprites[coinsRotationCounter]
                    break
            }
        })

        coinsRotationCounter++
        if (coinsRotationCounter === 3) coinsRotationCounter = 0
    }
    coinsFrame++

    if (snailsFrame % staggerFrames === 0) {
        snailsArray.forEach(enemy => {
            enemy.image.src = walkingSnailArray[snailsMovementCounter]
        })

        snailsMovementCounter++
        if (snailsMovementCounter === 2) snailsMovementCounter = 0
    }
    snailsFrame++

    if (fliesFrame % staggerFrames === 0) {
        fliesArray.forEach(enemy => {
            enemy.image.src = flyingFlyArray[fliesMovementCounter]
        })

        fliesMovementCounter++
        if (fliesMovementCounter === 2) fliesMovementCounter = 0
    }
    fliesFrame++

    enemiesUpdate(tileSize)

    player.update(gameSpeed, tileSize, gravity)
    player.draw(context)
}

const animate = () => {
    context.clearRect(0, 0, innerWidth, innerHeight)

    const grabbedCoin = grabCoin(player)
    if (grabbedCoin) {
        switch (grabbedCoin.type) {
            case 'gold':
                score += 500
                break
            case 'silver':
                score += 300
                break
            case 'bronze':
                score += 100
        }
        console.log('pick')
        coinsPickedSound.play()
        displayScore.innerHTML = score
    }

    update(player, gameLayers)

    if (checkCollisions(player)) {
        lifes--
        displayLifes.innerHTML = lifes
    }

    if (lifes === 0) {
        console.log('Has perdido!!!')
        stop()
        return
    }

    requestAnimationFrame(animate)
    //setTimeout(animate, 1000 / 20)
}

window.addEventListener('DOMContentLoaded', init)
