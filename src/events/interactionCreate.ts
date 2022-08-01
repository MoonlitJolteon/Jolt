import { Message, SelectMenuInteraction } from "discord.js";
import { bot } from '../index'

module.exports = {
    event: "interactionCreate",
    execute({ client, event }: { client: any, event: any }) {
        if (event.isCommand())
            return;


        if (event.isSelectMenu()) {
            const interaction = event as SelectMenuInteraction;
            
            if(interaction.customId == "timezoneSelect") {
                (interaction.message as Message).delete();
                bot.guildSettings.set(`${interaction!.guildId!}-timezone`, interaction.values[0]);
                return interaction.reply(`Server timezone has been set to ${interaction.values[0]}`);
            }
        }

    }

}