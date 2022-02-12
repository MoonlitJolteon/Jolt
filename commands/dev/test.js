
const { MessageEmbed, Message } = require('discord.js');
const { RichMenu, Command } = require('klasa');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/New_York")
const timezones = require('../../resources/timezones.json');

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
      usage: '<timezone:string>',
      usageDelim: undefined,
      quotedStringSupport: false,
      subcommands: false
    });
    this.menu = null;
  }

  async run(message, [timezone, ...params]) {
  }

  async init() { }
};
