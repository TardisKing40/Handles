import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
// run start in chatgpt.js
import { getGptResponse } from './chatgpt.js';
import ms from 'ms';

// const whitelistedUsers = [
//     '275015570284478466'
// ];

import dotenv from 'dotenv';
dotenv.config();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!whitelistedUsers.includes(message.author.id)) {
        const messageinput = message.author.id + " " + message.content;
        const gptResponse = await getGptResponse(messageinput);
        
        const args = gptResponse.split(' ');
        const user = args.shift().toLowerCase();
        const action = args[0];
        const reason = gptResponse.split(' ').slice(2).join(' ');
        
        const member = message.guild.members.cache.get(user);
        
        const messagedata = {
            user: user,
            action: action,
            reason: reason,
            message: message.content
        }

        console.log(JSON.stringify(messagedata));

        const banReason = `Reason: ${reason} \nMessage: ${message.content} \n-Automod`
        
        // message.channel.send(gptResponse);
        
        switch (action) {
            case 'message':
                message.reply(reason);
                break;
            case 'ban':
                if (!member.bannable) return message.channel.send('Your immune to my ban hammer!');
                member.ban({ reason: banReason });
                message.channel.send('Banned. Reason: ' + reason);
                break;
            case 'kick':
                if (!member.kickable) return message.channel.send('I cant seem to kick you!');
                member.kick(banReason);
                message.channel.send('Kicked. Reason: ' + reason);
                break;
            case 'timeout':
                member.timeout(ms('1h'), reason);
                message.channel.send('Timeout. Reason: ' + reason);
                break;
            case 'uptime':
                message.channel.send('Uptime: ' + ms(client.uptime, { long: true }));
                break;
        }
    }
});

client.login(process.env.BOT_TOKEN);