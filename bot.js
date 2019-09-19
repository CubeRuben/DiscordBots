const Discord = require('discord.js');
const bot = new Discord.Client();
const prefix = "!";

bot.on('ready', () => {
	locale: 'ru';
	console.log("Bot loaded");
});

bot.on('message', message => {
	let args = message.content.split(' ');
	let cmd = args[0].toUpperCase();
	/*switch(cmd) 
	{
		case prefix + "CHANGESCP":
			let number_of_scp = Math.random();
			bot.user.setActivity("SCP-", { type: 'LISTENING' });
		break;
		case prefix + "JOIN":
			message.member.voiceChannel.join();
		break;
		case prefix + "LEAVE":
			bot.user.
		break;
	}*/
});

bot.on('guildMemberAdd', member => {
	member.addRole('530682603477532672');
	console.log("New user " + member.user.username + " joined");
	member.user.send("[read ~/scp-079/dialogs/guild_member_add.txt]\nДобро пожаловать на сервер Zone 19 Staff\n[member.[error]]");
});

bot.login('NTM0MDA4MTYyMzkxNDI1MDI0.XNq9Gg.hFl9FzjYRvJgxyLNZf4VYGbIsds');