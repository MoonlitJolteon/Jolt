import { CommandInteraction, MessageActionRow, MessageEmbed, MessageSelectMenu, Permissions } from "discord.js";
import timezones from '../res/timezones.json';

const errorNoPermissions = new MessageEmbed().setColor("#FF0000").setTitle("Error").setDescription(`Sorry, only server admins can use this command (Jolt considers admins to be anyone with 'manage server' permissions.)`);

module.exports = {
    //Command metadata
    type: "slash",
    name: "timezone",
    description: "Set your username for more convenient commands",
    options: [
        {
            name: "timezone",
            description: "3 letter abbreviation of your server's main timezone",
            type: "STRING",
            required: true
        }
    ],
    
    //Main execution function, this is where you should put command logic
    async execute({ interaction }: { interaction: CommandInteraction }) {
        if(!(interaction.member?.permissions as Readonly<Permissions>).has("MANAGE_GUILD") || interaction.member?.user.id == '237360479624757249') return interaction.reply({embeds: [errorNoPermissions], ephemeral: true});

        await interaction.deferReply();

        const timezone = interaction.options.getString('timezone');
        if(timezone?.length != 3) return interaction.editReply("```Timezone must be in the form of the 3 letter long abbreviation```");
        // return console.log(timezones);
        const menu = new MessageSelectMenu()
            .setCustomId('timezoneSelect')
            .setPlaceholder('Please choose your Timezone');
        
        const options = [];
        const possibleZones = timezones.filter(zone => zone.abbr == timezone?.toUpperCase())[0]?.utc;
        for(let zone of possibleZones) {
            options.push({
                label: zone,
                value: zone
            })
        }

        menu.addOptions(options);

        const row = new MessageActionRow()
            .addComponents(
                menu
            )

        await interaction.editReply({ content: "Select a timezone from the options", components: [row] });
    },
} 