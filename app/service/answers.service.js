const knex = require('../database/knex')
const moment = require('moment')

module.exports = {
    getScore: async function (userId) {
        const score = await knex('answers').count('success', {as: 'count'}).where({userId: userId, success: true})
        return score[0].count
    },
    getRanks: async function (userId) {
        const ranks = await knex('answers')
            .select({
                userId: 'userId'
            })
            .count('*', {as: 'score'})
            .groupBy('userId')
            .orderBy('score', 'desc')

        const rank = ranks.findIndex((rank) => rank.userId === userId)

        return (rank > -1) ? rank + 1 : ranks.length + 1
    },
    sendAnswer: async function (userId, answer, success) {
        return await knex('answers').insert({
            userId: userId,
            answer: answer,
            success: success,
            date: moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        })
    }
}