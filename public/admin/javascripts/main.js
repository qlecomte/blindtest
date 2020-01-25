const socket = io('/admin')

const tableClients = document.getElementById('clients')
let clientList = []

function addClient ({clientId, uniqueId, score}) {
    clientList.push({clientId: clientId, username: null, uniqueId: uniqueId, msg: '', score: score})
    updateClientViewList()
}

function removeClient (clientId) {
    const clientIndex = clientList.findIndex(function (client) {
        return client.clientId === clientId
    })

    if (clientIndex !== -1) {
        clientList.splice(clientIndex, 1)
        updateClientViewList()
    }
}

function updateClientViewList () {
    // Clear tableClients
    while (tableClients.firstChild) {
        tableClients.removeChild(tableClients.firstChild)
    }

    // Build client list
    for (const client of clientList) {
        const template = document.getElementById('table-row').content.cloneNode(true)
        template.getElementById('username').innerText = client.username ? client.username : client.uniqueId
        template.getElementById('lock').style.display = client.locked ? 'inline' : 'none'
        template.getElementById('msg').innerText = client.msg
        template.getElementById('score').innerText = client.score
        template.getElementById('button-yes').addEventListener('click', (event) => validateAnswer(client.clientId, client.msg, true))
        template.getElementById('button-no').addEventListener('click', (event) => validateAnswer(client.clientId, client.msg, false))

        tableClients.appendChild(template)
    }
}

function displayMessage ({clientId, msg}) {
    const clientIndex = clientList.findIndex(function (client) {
        return client.clientId === clientId
    })

    if (clientIndex !== -1) {
        clientList[clientIndex].msg = msg
        clientList[clientIndex].timestamp = Date.now()
        updateClientViewList()
    }
}

function cleanClients () {
    socket.emit('cleanClients')

    for (const client of clientList) {
        client.locked = false
    }

    updateClientViewList()
}

function lockClients () {
    socket.emit('lockClients')

    for (const client of clientList) {
        client.locked = true
    }

    updateClientViewList()
}

function unlockClients () {
    socket.emit('unlockClients')

    for (const client of clientList) {
        client.locked = false
    }

    updateClientViewList()
}

function validateAnswer (clientId, answer, success) {
    event.preventDefault()

    if (!answer) {
        return
    }

    const clientIndex = clientList.findIndex(function (client) {
        return client.clientId === clientId
    })

    if (success) {
        socket.emit('validAnswer', {clientId, answer})
    } else {
        socket.emit('invalidAnswer', {clientId, answer})
    }

    clientList[clientIndex].locked = false

    updateClientViewList()

    return true
}

function updateScore ({clientId, score}) {
    const clientIndex = clientList.findIndex(function (client) {
        return client.clientId === clientId
    })

    if (clientIndex !== -1) {
        clientList[clientIndex].score = score
        updateClientViewList()
    }
}

function setUsername ({clientId, username}) {
    const clientIndex = clientList.findIndex(function (client) {
        return client.clientId === clientId
    })

    if (clientIndex !== -1) {
        clientList[clientIndex].username = username
        updateClientViewList()
    }
}

socket.on('connect', () => {
    clientList = []
})
socket.on('addClient', addClient)
socket.on('removeClient', removeClient)
socket.on('message', displayMessage)
socket.on('score', updateScore)
socket.on('username', setUsername)

