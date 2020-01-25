const answersService = require('../app/service/answers.service')

const sendClientIds = async (socket) => {
    // Push data
    for (let [key, value] of Object.entries(socket.server.nsps['/players'].sockets)) {
        socket.emit('addClient', {
            clientId: value.id,
            uniqueId: value.handshake.query.unique_id,
            score: await answersService.getScore(value.handshake.query.unique_id)
        })
    }
}

const findSocketFromUniqueId = (uniqueId, sockets) => {
    for (let [key, value] of Object.entries(sockets)) {
        if (value.handshake.query.unique_id === uniqueId) {
            return value
        }
    }
    return null
}

const findUniqueIdFromSocketId = (socketId, sockets) => {
    for (let [key, value] of Object.entries(sockets)) {
        if (value.id === socketId) {
            return value.handshake.query.unique_id
        }
    }
    return null
}

module.exports = (io) => {
    const adminNSP = io.of('/admin')
    adminNSP.on('connection', async function (socket) {
        const playerSocket = socket.server.nsps['/players']
        const adminSocket = socket.server.nsps['/admin']

        console.log(`a admin connected with id ${socket.id}`)
        await sendClientIds(socket)

        socket.on('disconnect', () => {
            // console.log(`admin disconnected with id ${socket.id}`);
        })

        socket.on('cleanClients', () => {
            playerSocket.emit('cleanInput')
        })

        socket.on('lockClients', () => {
            playerSocket.emit('lockInput')
        })

        socket.on('unlockClients', () => {
            playerSocket.emit('unlockInput')
        })

        socket.on('validAnswer', async ({clientId, answer}) => {
            const playerUniqueId = findUniqueIdFromSocketId(clientId, playerSocket.sockets)
            await answersService.sendAnswer(playerUniqueId, answer, true)

            const score = await answersService.getScore(playerUniqueId)
            adminSocket.emit('score', {clientId: clientId, score: score})

            playerSocket.sockets[clientId].emit('validAnswer', {answer})
            playerSocket.sockets[clientId].emit('cleanInput')

            playerSocket.sockets[clientId].emit('score', {score})
        })

        socket.on('invalidAnswer', async ({clientId, answer}) => {
            const playerUniqueId = findUniqueIdFromSocketId(clientId, playerSocket.sockets)
            await answersService.sendAnswer(playerUniqueId, answer, false)

            playerSocket.sockets[clientId].emit('invalidAnswer', {answer})
            playerSocket.sockets[clientId].emit('cleanInput')
        })
    })
}