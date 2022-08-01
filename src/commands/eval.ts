import { CommandInteraction, MessageEmbed } from "discord.js";
const errorNoPermissions = new MessageEmbed().setColor("#FF0000").setTitle("Error").setDescription(`Sorry, only server admins can use this command (Jolt considers admins to be anyone with 'manage server' permissions.)`);

const clean = async (text: any) => {
    // If our input is a promise, await it before continuing
    if (text && text.constructor.name == "Promise")
        text = await text;

    // If the response isn't a string, `util.inspect()`
    // is used to 'stringify' the code in a safe way that
    // won't error out on objects with circular references
    // (like Collections, for example)
    if (typeof text !== "string")
        text = require("util").inspect(text, { depth: 1 });

    // Replace symbols with character code alternatives
    text = text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));

    // Send off the cleaned up result
    return text;
}



module.exports = {
    type: "slash",
    name: "eval",
    description: "Eval code",
    options: [
        {
            name: "command",
            description: "Command to run",
            type: "STRING",
            required: true
        }
    ],
    defaultPermission: true,

    async execute({ interaction }: { interaction: CommandInteraction }) {
        if (interaction.member?.user.id != '237360479624757249') return interaction.reply({ embeds: [errorNoPermissions], ephemeral: true });
        await interaction.deferReply({ ephemeral: true });
        try {
            const evaled = eval(interaction!.options!.getString('command') ?? "No command found...");
            interaction.editReply(await clean(evaled));
        } catch (e: any) {
            interaction.editReply(await clean(e));
        };
    }
}