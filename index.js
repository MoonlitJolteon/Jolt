const { KlasaClient, Schema } = require('klasa');
const discord = require('discord.js');
const { config } = require('./config');
require('dotenv').config();
const token = process.env.TOKEN;
const secondary_token = process.env.SECONDARY_TOKEN
process.env.TZ = 'America/Indiana/Indianapolis'
KlasaClient.defaultUserSchema
  .add('floatPoints', 'integer', { default: 0 })
  .add('missedPractices', 'integer', { default: 0 })
  .add('substitute', 'boolean', { default: false })
  .add('position', 'string', { default: "None" })
  .add('oculusName', 'string', { default: "" });

KlasaClient.defaultGuildSchema
  .add('timezone', 'string', { default: 'America/New_York'});

let naniTeamMember = '793257448114487366';
let naniBotPermsRole = '882480303061487616';
KlasaClient.defaultPermissionLevels
  .add(3, ({ guild, member }) => guild && member.roles.cache.get(naniTeamMember) != undefined)
  .add(5, ({ guild, member }) => guild && member.roles.cache.get(naniBotPermsRole) != undefined)

const client = new KlasaClient(config);
const secondary_client = new discord.Client();

client.secondary = secondary_client;
require("./server").keepAlive();
client.login(token);
