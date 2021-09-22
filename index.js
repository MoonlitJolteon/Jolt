const { KlasaClient, Schema } = require('klasa');
const { config, token } = require('./config');

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

client.login(token);
