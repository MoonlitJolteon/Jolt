
const { MessageEmbed, Message } = require('discord.js');
const { Command } = require('klasa');

module.exports = class extends Command {

  constructor(...args) {
    /**
     * Any default options can be omitted completely.
     * if all options are default, you can omit the constructor completely
     */
    super(...args, {
      enabled: true,
      runIn: ['text', 'dm', 'group'],
      requiredPermissions: [],
      requiredSettings: [],
      aliases: [],
      autoAliases: true,
      bucket: 1,
      cooldown: 0,
      promptLimit: 0,
      promptTime: 30000,
      deletable: false,
      guarded: false,
      nsfw: false,
      permissionLevel: 10,
      description: '',
      extendedHelp: 'No extended help available.',
      usage: '<player:string>',
      usageDelim: undefined,
      quotedStringSupport: false,
      subcommands: false
    });
  }

  async run(message, [player, ...params]) {
    const ignite = require('../../helpers/igniteAPI')
    let data = await ignite.getPlayerCache(player);
    console.log(data)
  }

  async init() {
  }

};
