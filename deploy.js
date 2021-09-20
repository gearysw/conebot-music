const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { token, guildID, applicationID } = require('./config.json')

const rest = new REST({ version: '9' }).setToken(token)

const slashCommands = [
    new SlashCommandBuilder().setName('play').setDescription('Search for and play a YouTube video with audio only').addStringOption(option => option.setName('search').setDescription('Search terms to lookup or link to video').setRequired(true)),
    new SlashCommandBuilder().setName('pause').setDescription('Pause a currently playing audio'),
    new SlashCommandBuilder().setName('resume').setDescription('Resumes a paused audio'),
    new SlashCommandBuilder().setName('stop').setDescription('Stops a currently playing audio and disconnects the bot from the voice channel'),
    new SlashCommandBuilder().setName('nowplaying').setDescription('Shows the currently playing audio'),
    new SlashCommandBuilder().setName('skip').setDescription('Skips the currently playing audio'),
    new SlashCommandBuilder().setName('lookup').setDescription('Look up the search results for the given search terms').addStringOption(option => option.setName('search').setDescription('Search terms to lookup on YouTube').setRequired(true))
]

const builtCommands = []

for (const s of slashCommands) {
    builtCommands.push(s.toJSON())
}

(async () => {
    try {
        console.log('Registering slash commands...')
        const res = await rest.put(
            Routes.applicationGuildCommands(applicationID, guildID), { body: builtCommands }
        )
        console.log(`Registered ${res.length} commands: ${res.map(c => c.name).join(', ')}`)
    } catch (error) {
        console.error(error)
    }
})()