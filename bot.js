const { Client, Intents, Collection } = require('discord.js')
const { Player } = require('discord-player')
const { token } = require('./config.json')
const { codeBlock } = require('@discordjs/builders')
const fs = require('fs')

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
})
const player = new Player(client)

client.commands = new Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.data.name, command)
}

client.login(token)

client.once('ready', () => {
    console.log(`Bot logged in as ${client.user.username}`)
})

player.on('')

client.on('interactionCreate', interaction => {
    if (!interaction.isCommand() || !client.commands.has(interaction.commandName)) return

    try {
        await client.commands.get(interaction.commandName).execute(interaction, player)
    } catch (e) {
        console.error(e)
        interaction.followUp({ content: `Error executing command:\n${codeBlock(e)}`, ephemeral: true })
    }
})