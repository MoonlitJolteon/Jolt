const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: language => language.get('COMMAND_PING_DESCRIPTION')
		});
	}

	async run(message) {
    await message.member.roles.remove('890702367362809897');
    message.send("Sorry to see you're no longer interested, perhaps another time.");
	}

};
