
const { MessageEmbed, Message } = require('discord.js');
const { RichMenu, Command } = require('klasa');

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
      usage: '',
      usageDelim: undefined,
      quotedStringSupport: false,
      subcommands: false
    });
    this.menu = null;
  }

  async run(message, [player, ...params]) {
    const collector = await this.menu.run(await message.send("Loading teams..."));
    const choice = await collector.selection;

    if (choice === null) {
      return collector.message.delete();
    }

    // console.log(choice);
  }

  async init() {
    let options = [
      {
        name: "Name",
        id: "id"
      },
      {
        name: "Name1",
        id: "id1"
      },
      {
        name: "Name2",
        id: "id2"
      },
      {
        name: "Name3",
        id: "id3"
      },
      {
        name: "Name4",
        id: "id4"
      }
    ]

    this.menu = new RichMenu(new MessageEmbed()
      .setColor(0x673AB7)
      .setAuthor(this.client.user.username, this.client.user.displayAvatarURL())
      // .setTitle('Advanced Commands Help:')
      // .setDescription('Use the arrow reactions to scroll between pages.\nUse number reactions to select an option.')
    );

    for (const option of options) {
      this.menu.addOption(option.name, option.id);
    }
  }

};
