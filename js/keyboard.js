'use strict'

export const keys = {
    right: {
        pressed: false,
    },
    left: {
        pressed: false,
    },
    up: {
        pressed: false,
    },
}

const handleEvent = (eventName, eventCode) => {
    if (eventName === 'keydown') {
        switch (eventCode) {
            case 'ArrowLeft':
            case 'KeyD':
                keys.left.pressed = true
                break
            case 'ArrowRight':
            case 'KeyA':
                keys.right.pressed = true
                break
            case 'ArrowUp':
            case 'KeyW':
                keys.up.pressed = true
                break
        }
    }

    if (eventName === 'keyup') {
        switch (eventCode) {
            case 'ArrowLeft':
            case 'KeyD':
                keys.left.pressed = false
                break
            case 'ArrowRight':
            case 'KeyA':
                keys.right.pressed = false
                break
            case 'ArrowUp':
                keys.up.pressed = false
            case 'KeyW':
                break
        }
    }
}

export const listenEvents = () => {
    ;['keydown', 'keyup'].forEach(eventName => {
        window.addEventListener(eventName, event => {
            handleEvent(eventName, event.code)
        })
    })
}
