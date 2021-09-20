const { Client, Intents, Collection, MessageEmbed } = require('discord.js')
const voice = require('@discordjs/voice')
// const { Player } = require('discord-player')
const { token } = require('./config.json')
const { codeBlock } = require('@discordjs/builders')
const fs = require('fs')
const ytdl = require('ytdl-core-discord')
const yts = require('yt-search')

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
})
// const player = 

// client.commands = new Collection()
// const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
// for (const file of commandFiles) {
//     const command = require(`./commands/${file}`)
//     client.commands.set(command.data.name, command)
// }

client.login(token)

const queue = new Map()
const player = voice.createAudioPlayer()
const connections = []

client.once('ready', () => {
    console.log(`Bot logged in as ${client.user.username}`)
})

client.on('interactionCreate', async interaction => {
    // if (!interaction.isCommand() || !client.commands.has(interaction.commandName)) return
    if (!interaction.isCommand) return;
    interaction.deferReply()

    try {
        switch (interaction.commandName) {
            case 'play':
                const searchTermsPlay = interaction.options.getString('search')

                break

            case 'lookup':
                const searchTermsLookup = interaction.options.getString('search')
                const reply = await searchYT(searchTermsLookup)


                interaction.editReply(reply)
                break


            default:
                interaction.editReply({ content: 'whu', ephemeral: true })
        }
    } catch (e) {
        console.error(e)
        interaction.followUp({ content: `Error executing command:\n${codeBlock(e)}`, ephemeral: true })
    }
})

async function probeAndCreateResource(readableStream) {
    const { stream, type } = await voice.demuxProbe(readableStream)
    return voice.createAudioResource(stream, { inputType: type })
}

async function searchYT(searchTerms) {
    const isUrl = checkUrl(searchTerms)
    const searchResults = await yts(searchTerms)
    const videos = searchResults.videos.slice(0, 5)
    // console.log(videos);

    if (!videos.length) throw 'No search results'
    if (isUrl) {
        const video = videos[0]
        const embed = new MessageEmbed()
            .setTitle(video.title)
            .setURL(video.url)
            .setImage(video.image)
            .setAuthor(video.author.name, null, video.author.url)
            .setDescription(`Duration: ${video.timestamp}\nViews: ${video.views}\nUploaded ${video.ago}`)
            .setColor('RED')
        return { embeds: [embed] }
    }

    const embed = new MessageEmbed().setTitle('Search Results').setColor('#FF0000')
    for ([i, v] of videos.entries()) {
        embed.addField(`${i+1}. ${v.title} | ${v.author.name} | ${v.timestamp}`, v.url)
    }
    return { embeds: [embed] }
}

function checkUrl(string) {
    let url

    try {
        url = new URL(string)
    } catch (error) {
        return false
    }

    return true
}