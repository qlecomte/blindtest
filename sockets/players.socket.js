const answersService = require('../app/service/answers.service')

module.exports = (io) => {
    const playersNSP = io.of('players')
    playersNSP.on('connection', async function (socket) {
        console.log(`a player connected with id ${socket.id}`)

        const adminSocket = socket.server.nsps['/admin']
        const score = await answersService.getScore(socket.handshake.query.unique_id)
        const rank = await answersService.getRanks(socket.handshake.query.unique_id);
        socket.emit('score', {score, rank})

        adminSocket.emit('addClient', {
            clientId: socket.id,
            uniqueId: socket.handshake.query.unique_id,
            score: await answersService.getScore(socket.handshake.query.unique_id)
        })

        // Event for every message sent
        socket.on('message', function (msg) {
            adminSocket.emit('message', {clientId: socket.id, msg: msg})
        })

        // Event for every letter written on input
        socket.on('partial', function (msg) {
            // adminSocket.emit('message', {clientId: socket.id, msg: msg});
        })

        socket.on('disconnect', function () {
            adminSocket.emit('removeClient', socket.id)
            // console.log(`player disconnected with id ${socket.id}`);
        })

        socket.on('username', function (username) {
            adminSocket.emit('username', {clientId: socket.id, username: username})
        })
    })
}