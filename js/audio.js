'use strict'

export const pickedCoinAudio = () => {
    const audio = document.createElement('audio')
    audio.setAttribute('src', '/sounds/coins2.mp3') // Playonloop: Summer Deal
    audio.volume = 1
    audio.loop = false

    return audio
}
