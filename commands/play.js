const ytdl = require('ytdl-core')
const ytsearch = require('yt-search')
const { SlashCommandBuilder } = require('@discordjs/builders')

const queue = new Map()

module.exports = {
    data: new SlashCommandBuilder().setName('play').setDescription('Play a song from YouTube')
        .addStringOption(option => option.setName('query').setDescription('Name of song to play').setRequired(true)),
    execute: async (interaction, player) => {
        if (!interaction.member.voice.channel) return void interaction.reply({ content: 'You need to be in a voice channel.', ephemeral: true })

    }
}