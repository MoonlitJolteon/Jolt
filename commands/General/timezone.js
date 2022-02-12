const { Command, RichMenu } = require('klasa');
const { MessageEmbed } = require('discord.js');
const timezones = require('../../resources/timezones.json');
module.exports = class extends Command {

  constructor(...args) {
    /**
     * Any default options can be omitted completely.
     * if all options are default, you can omit the constructor completely
     */
    super(...args, {
      enabled: true,
      runIn: ['text'],
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
      permissionLevel: 6,
      description: '',
      extendedHelp: 'No extended help available.',
      usage: '<set|clear> [timezone:string]',
      usageDelim: ' ',
      quotedStringSupport: false,
      subcommands: true
    });
  }

  async set(message, [timezone, ...params]) {
    if (!timezone) return await message.send("```timezone is a required argument```");
    if (timezone.length != 3) return message.send("```Timezone must be in the form of the 3 letter long abbreviation```");
    let possibleZones = timezones.filter(zone => zone.abbr == timezone.toUpperCase())[0];
    if (possibleZones) possibleZones = possibleZones.utc;
    else possibleZones = [];

    if (possibleZones.length > 1) {
      let menu = new RichMenu(new MessageEmbed()
        .setColor(0x673AB7)
        .setAuthor(this.client.user.username, this.client.user.displayAvatarURL())
        .setTitle('Please choose a timezone:')
        .setDescription('Use the arrow reactions to scroll between pages.\nUse number reactions to select an option.')
      );

      for (const zone of possibleZones) {
        menu.addOption(' V', zone);
      }
      const collector = await menu.run(await message.send("Loading timezones..."), {filter: (Reaction, User) => {return User.id == message.author.id}});
      const choice = await collector.selection;

      if (choice === null) {
        return collector.message.delete();
      } else {
        await collector.message.delete();
      }

      timezone = possibleZones[parseInt(choice)];
    } else if (possibleZones.length == 1) {
      timezone = possibleZones[0]
    } else {
      return message.channel.send("Unfortunately, it would appear that timezone doesn't exist.");
    }

    await message.channel.send(`Timezone Set: ${timezone}`);
    await message.guild.settings.update('timezone', timezone);
  }

  async clear(message, [...params]) {
    message.guild.settings.update('timezone', 'America/New_York');
    message.send("Timezone reset to default (Eastern Time)");
  }

};
