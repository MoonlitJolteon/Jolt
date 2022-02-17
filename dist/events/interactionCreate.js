"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
module.exports = {
    event: "interactionCreate",
    execute({ client, event }) {
        if (event.isCommand())
            return;
        if (event.isSelectMenu()) {
            const interaction = event;
            if (interaction.customId == "timezoneSelect") {
                interaction.message.delete();
                index_1.bot.guildSettings.set(`${interaction.guildId}-timezone`, interaction.values[0]);
                return interaction.reply(`Server timezone has been set to ${interaction.values[0]}`);
            }
        }
    }
};
