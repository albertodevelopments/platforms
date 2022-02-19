'use strict'

import { loadImage } from '/js/loaders.js'

export class Layer {
    constructor(image, x, y, width, height, speedModifier) {
        this.image = image
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.x2 = this.width
        this.speedModifier = speedModifier
    }

    update = gameSpeed => {
        this.speed = this.speedModifier * gameSpeed
        if (this.x <= -this.width) {
            this.x = this.width + this.x2 - this.speed
        }
        if (this.x2 <= -this.width) {
            this.x2 = this.width + this.x - this.speed
        }
        this.x = Math.floor(this.x - this.speed)
        this.x2 = Math.floor(this.x2 - this.speed)
    }

    draw = context => {
        context.drawImage(this.image, this.x, this.y, this.width, this.height)
        context.drawImage(this.image, this.x2, this.y, this.width, this.height)
    }
}

const createGroundLayer = (tileSize, tileImage) => {
    /** Creamos el suelo componiendo tiles */
    const groundLayer = document.createElement('canvas')
    groundLayer.width = 20 * tileSize
    groundLayer.height = tileSize
    const groundContext = groundLayer.getContext('2d')

    for (let x = 0; x < 20; ++x) {
        groundContext.drawImage(
            tileImage,
            0,
            0,
            tileSize,
            tileSize,
            x * tileSize,
            0,
            tileSize,
            tileSize
        )
    }
    return groundLayer
}

/** Del spritesheet extraemos las tres nubes y creamos un array
 *  de tres imágenes
 */
const createCloudsLayer = async () => {
    const cloudsSpriteSheet = await loadImage('/img/layers/clouds.png')
    const cloudsLayer = document.createElement('canvas')
    cloudsLayer.width = innerWidth
    cloudsLayer.height = innerHeight
    const cloudsContext = cloudsLayer.getContext('2d')

    const position1 = {
        x: 50,
        y: 250,
    }

    const position2 = {
        x: Math.floor(innerWidth / 3),
        y: 225,
    }

    const position3 = {
        x: Math.floor((2 * innerWidth) / 3),
        y: 175,
    }

    cloudsContext.drawImage(
        cloudsSpriteSheet,
        40,
        0,
        150,
        100,
        position1.x,
        position1.y,
        150,
        100
    )

    cloudsContext.drawImage(
        cloudsSpriteSheet,
        0,
        100,
        250,
        150,
        position2.x,
        position2.y,
        250,
        150
    )
    cloudsContext.drawImage(
        cloudsSpriteSheet,
        250,
        115,
        240,
        140,
        position3.x,
        position3.y,
        250,
        140
    )

    return cloudsLayer
}

export const createLayers = async tileSize => {
    const gameLayers = []

    const skyLayerImage = await loadImage('/img/layers/sky.png')
    const skyLayer = new Layer(
        skyLayerImage,
        0,
        0,
        skyLayerImage.width,
        skyLayerImage.height,
        0
    )

    const fogLayer = await loadImage('/img/layers/fog.png')

    const groundTile = await loadImage('/img/layers/ground-tile.png')
    const groundLayerImage = createGroundLayer(tileSize, groundTile)

    const groundLayer = new Layer(
        groundLayerImage,
        0,
        innerHeight - tileSize,
        groundLayerImage.width,
        groundLayerImage.height,
        0.5
    )

    const cloudsLayerImage = await createCloudsLayer()
    const cloudsLayer = new Layer(
        cloudsLayerImage,
        0,
        0,
        cloudsLayerImage.width,
        cloudsLayerImage.height,
        0.3
    )

    gameLayers['sky'] = skyLayer
    gameLayers['clouds'] = cloudsLayer
    gameLayers['fog'] = fogLayer
    gameLayers['ground'] = groundLayer
    //gameLayers['platforms'] = platformsLayer

    return gameLayers
}
