'use strict'

import { loadImage } from '/js/loaders.js'
import { generateCoins } from '/js/coins.js'

export const platformsArray = []
let distanceX = innerWidth
let initialPlatformImages = []
export let coinsArray = []

export class Platform {
    constructor(image, x, y, width, height) {
        this.image = image
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.speedModifier = 0.5
    }

    checkPlayerCollision = player => {
        let collision = false
        if (
            player.position.x + player.width / 2 >= this.x &&
            player.position.x + player.width / 2 <= this.x + this.width
        ) {
            if (
                (player.speed.y >= 0 &&
                    player.position.y + player.height <= this.y &&
                    player.position.y + player.height + player.speed.y >=
                        this.y) ||
                (player.speed.y < 0 &&
                    player.position.y <= this.y + this.height / 2 &&
                    player.position.y >=
                        this.y + this.height / 2 + player.speed.y)
            ) {
                collision = true
            }
        }
        return collision
    }

    update = gameSpeed => {
        this.speed = this.speedModifier * gameSpeed
        this.x -= this.speed
    }

    draw = context => {
        context.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}

const createSmallPlatform = (
    tileSize,
    leftTileImage,
    rightTileImage,
    centerTileImage
) => {
    const smallPlatform = document.createElement('canvas')
    smallPlatform.width = 3 * tileSize
    smallPlatform.height = tileSize
    const platformContext = smallPlatform.getContext('2d')

    platformContext.drawImage(
        leftTileImage,
        0,
        0,
        tileSize,
        tileSize,
        0,
        0,
        tileSize,
        tileSize
    )

    platformContext.drawImage(
        centerTileImage,
        0,
        0,
        tileSize,
        tileSize,
        tileSize,
        0,
        tileSize,
        tileSize
    )

    platformContext.drawImage(
        rightTileImage,
        0,
        0,
        tileSize,
        tileSize,
        2 * tileSize,
        0,
        tileSize,
        tileSize
    )

    return smallPlatform
}

const createMediumPlatform = (
    tileSize,
    leftTileImage,
    rightTileImage,
    centerTileImage
) => {
    const mediumPlatform = document.createElement('canvas')
    mediumPlatform.width = 5 * tileSize
    mediumPlatform.height = tileSize
    const platformContext = mediumPlatform.getContext('2d')

    platformContext.drawImage(
        leftTileImage,
        0,
        0,
        tileSize,
        tileSize,
        0,
        0,
        tileSize,
        tileSize
    )

    for (let x = 1; x < 4; ++x) {
        platformContext.drawImage(
            centerTileImage,
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

    platformContext.drawImage(
        rightTileImage,
        0,
        0,
        tileSize,
        tileSize,
        4 * tileSize,
        0,
        tileSize,
        tileSize
    )
    return mediumPlatform
}

const createBigPlatform = (
    tileSize,
    leftTileImage,
    rightTileImage,
    centerTileImage
) => {
    const bigPlatform = document.createElement('canvas')
    bigPlatform.width = 7 * tileSize
    bigPlatform.height = tileSize
    const platformContext = bigPlatform.getContext('2d')

    platformContext.drawImage(
        leftTileImage,
        0,
        0,
        tileSize,
        tileSize,
        0,
        0,
        tileSize,
        tileSize
    )

    for (let x = 1; x < 6; ++x) {
        platformContext.drawImage(
            centerTileImage,
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

    platformContext.drawImage(
        rightTileImage,
        0,
        0,
        tileSize,
        tileSize,
        6 * tileSize,
        0,
        tileSize,
        tileSize
    )
    return bigPlatform
}

const loadPlatformImages = async tileSize => {
    const [leftPlatformTile, rightPlatformTile, centerPlatformTile] =
        await Promise.all([
            loadImage('/img/layers/platform-left.png'),
            loadImage('/img/layers/platform-right.png'),
            loadImage('/img/layers/platform-center.png'),
        ])

    return [
        createSmallPlatform(
            tileSize,
            leftPlatformTile,
            rightPlatformTile,
            centerPlatformTile
        ),
        createMediumPlatform(
            tileSize,
            leftPlatformTile,
            rightPlatformTile,
            centerPlatformTile
        ),
        createBigPlatform(
            tileSize,
            leftPlatformTile,
            rightPlatformTile,
            centerPlatformTile
        ),
    ]
}

/** Creamos grupos de 3 plataformas con los diferentes anchos */
export const loadPlatforms = async tileSize => {
    const [smallPlatformImage, mediumPlatformImage, bigPlatformImage] =
        await loadPlatformImages(tileSize)

    initialPlatformImages = [
        smallPlatformImage,
        mediumPlatformImage,
        bigPlatformImage,
    ]
}

export const spawnPlatforms = coinsImages => {
    if (platformsArray.length > 50) {
        for (let i = 0; i < 20; i++) {
            platformsArray.pop()
        }
    }

    /** Selección aleatoria de la altura */
    let heights = [350, 375, 450]

    let selectedHeight = heights[Math.floor(Math.random() * heights.length)]

    /** Selección aleatoria de plataformas */
    let selectedImage
    let platformImages = initialPlatformImages.map(image => image)

    selectedImage =
        platformImages[Math.floor(Math.random() * platformImages.length)]

    distanceX += 400

    platformsArray.push(
        new Platform(
            selectedImage,
            distanceX,
            selectedHeight,
            selectedImage.width,
            selectedImage.height
        )
    )

    /** Generamos el array de monedas que hay en las plataformas */
    const [coin11, coin12] = generateCoins(
        distanceX + selectedImage.width / 3,
        distanceX + (2 * selectedImage.width) / 3,
        selectedHeight - 10,
        coinsImages
    )

    if (coin11) coinsArray.push(coin11)
    if (coin12) coinsArray.push(coin12)

    distanceX += 225 + selectedImage.width
    platformImages = platformImages.filter(
        platform => platform !== selectedImage
    )

    selectedImage =
        platformImages[Math.floor(Math.random() * platformImages.length)]

    heights = heights.filter(height => height !== selectedHeight)
    selectedHeight = heights[Math.floor(Math.random() * heights.length)]

    platformsArray.push(
        new Platform(
            selectedImage,
            distanceX,
            selectedHeight,
            selectedImage.width,
            selectedImage.height
        )
    )

    /** Generamos el array de monedas que hay en las plataformas */
    const [coin21, coin22] = generateCoins(
        distanceX + selectedImage.width / 3,
        distanceX + (2 * selectedImage.width) / 3,
        selectedHeight - 10,
        coinsImages
    )

    if (coin21) coinsArray.push(coin21)
    if (coin22) coinsArray.push(coin22)

    distanceX += 175 + selectedImage.width

    platformImages = platformImages.filter(
        platform => platform !== selectedImage
    )

    selectedImage =
        platformImages[Math.floor(Math.random() * platformImages.length)]

    heights = heights.filter(height => height !== selectedHeight)
    selectedHeight = heights[Math.floor(Math.random() * heights.length)]

    platformsArray.push(
        new Platform(
            selectedImage,
            distanceX,
            selectedHeight,
            selectedImage.width,
            selectedImage.height
        )
    )

    /** Generamos el array de monedas que hay en las plataformas */
    const [coin31, coin32] = generateCoins(
        distanceX + selectedImage.width / 3,
        distanceX + (2 * selectedImage.width) / 3,
        selectedHeight - 10,
        coinsImages
    )

    if (coin31) coinsArray.push(coin31)
    if (coin32) coinsArray.push(coin32)

    distanceX += selectedImage.width
}

export const drawPlatforms = context => {
    platformsArray.forEach(platform => {
        platform.draw(context)
    })
}

export const drawCoins = context => {
    coinsArray.forEach(coin => {
        coin.draw(context)
    })
}

export const updatePlatforms = gameSpeed => {
    platformsArray.forEach(platform => {
        platform.update(gameSpeed)
    })
}

export const updateCoins = gameSpeed => {
    coinsArray.forEach(coin => {
        coin.update(gameSpeed)
    })
}

export const checkCollisions = (player, gravity) => {
    let collision = false
    for (let i = 0; i < platformsArray.length; i++) {
        collision = platformsArray[i].checkPlayerCollision(player, gravity)
        if (collision) break
    }

    return collision
}

export const setCoinsArray = newCoinsArray => {
    coinsArray = newCoinsArray
}
