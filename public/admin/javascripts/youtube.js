'use strict'

function updateVideo () {
    // Prevent form submit to reload the page
    event.preventDefault()

    // Find the video Id from the input
    let videoId = parseUrl(document.getElementById('videoId').value)

    // Update the iframe
    if (videoId) {
        const video = document.getElementById('video')
        video.setAttribute('src', `https://www.youtube.com/embed/${videoId}?start=0`)
    }

    return true
}

function parseUrl (url) {
    const regexp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([0-9A-Za-z_-]{11,13}).*$/gi
    const match = regexp.exec(url)
    return match && match.length > 7 ? match[7] : false
}