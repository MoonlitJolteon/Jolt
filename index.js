const { KlasaClient, Schema } = require('klasa');
const { config } = require('./config');
require('dotenv').config();
const token = process.env.TOKEN;
process.env.TZ = 'America/Indiana/Indianapolis' 
KlasaClient.defaultUserSchema
    .add('floatPoints', 'integer', {default: 0})
    .add('missedPractices', 'integer', {default: 0})
    .add('substitute', 'boolean', {default: false})
    .add('position', 'string', {default: "None"})
    .add('oculusName', 'string', {default: ""});

let naniTeamMember = '793257448114487366';
let naniBotPermsRole = '882480303061487616';
KlasaClient.defaultPermissionLevels
    .add(3, ({ guild, member }) => guild && member.roles.cache.get(naniTeamMember) != undefined)
    .add(5, ({ guild, member }) => guild && member.roles.cache.get(naniBotPermsRole) != undefined)

const client = new KlasaClient(config);

require("./server").keepAlive();
client.login(token);


