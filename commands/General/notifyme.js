const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: language => language.get('COMMAND_PING_DESCRIPTION')
		});
	}

	async run(message) {
    await message.member.roles.add('890702367362809897');
    message.send("You have been given the notification role, glad to keep you updated!\n\nIf you ever want to stop being notified, you can use !dontnotifyme.");
	}

};
