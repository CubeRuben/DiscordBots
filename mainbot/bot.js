const Discord = require('discord.js');
const login = require("./token.json");
const fs = require("fs");
const request = require("request");

const bot = new Discord.Client();

const prefix = "";

var voiceConnection;

function listeningSCP() 
{
	let number_of_scp = Math.random();
	number_of_scp = Math.round(number_of_scp * 1000);
	let string_of_number_of_scp = "";
	if (number_of_scp < 10) { string_of_number_of_scp = "00" + number_of_scp.toString(); } 
	else if (number_of_scp < 100) { string_of_number_of_scp = "0" + number_of_scp.toString(); }
	else if (number_of_scp < 1000) { string_of_number_of_scp = "" + number_of_scp.toString();}
	bot.user.setActivity("SCP-" + string_of_number_of_scp, { type: 'LISTENING' });
}

function checkTeamKllers(channel) 
{
	let info = fs.readFileSync("../teamkillers.txt").toString();
	let players = info.split(';');
	for (let i = 0; i < players.length - 1; i++) 
	{
		let player = players[i].split(' ');
		const embed = new Discord.RichEmbed()
			.setColor("#FF0000")
			.setTitle("Убийство союзников")
			.addField("Ник: " + player[1], "Ник игрока, который нарушил правила. Если ник не разбочив, то посмотрите его в Steam профиле")
			.addField("Профиль Steam: https://steamcommunity.com/profiles/" + player[0], "Steam профиль нарушителя")
			.addField("SteamID64: " + player[0], "SteamID64 нарушителя")
			.addField("Порт сервера: " + player[player.length - 1], "Порт сервера: 7777 - 1 сервер, 7778 - 2 сервер")
			.setFooter("Обезопасить Удержать Заблокировать")
			.setThumbnail("http://scp-ru.wdfiles.com/local--files/component:theme/logo.png")
			;
		channel.send(embed);
	}
	fs.writeFileSync("../teamkillers.txt", "");
}

function cassiePlay(args, textChannel, index) 
{
	if (index < args.length) 
	{
		if (voiceConnection == null) 
		{
			textChannel.send("**ERROR: Я не разговариваю с вами**");
			return;
		}

		let word = args[index];

		if (word.includes('/') || word.includes('\\')) 
		{
			textChannel.send("**ERROR: Доступ запрещён**");
			return;
		}

		const dispatcher = voiceConnection.playFile('./cassie/' + word.toLowerCase() + '.ogg', { type: 'ogg/opus' } );

		dispatcher.on('end', () => {
			setTimeout(() => cassiePlay(args, textChannel, index + 1), 100);
		});
	}
}

function reactRoleGetingMessage(message) 
{
	message.react(message.guild.emojis.get('616944368028483605'));
	message.react(message.guild.emojis.get('603174262802612239'));
	message.react(message.guild.emojis.get('638880035331112986'));
	message.react(message.guild.emojis.get('616945472065634305'));
}

/*function checkBanList(message) 
{
	let banList = fs.readFileSync("../SteamIdBans.txt");
	let lines = banList.toString().split('\n');
	let msgBanList = "```bash\n\"Список игроков, которые заблокированы на нашем сервере\"\n";

	for	(let i = 0; i < lines.length - 1; i++) 
	{
		let player = lines[i].split(';');
		let date = new Date();
		date.setMinutes(player[5] / 600000000);
		//.getDate().toString() + "." + date.getMonth().toString() + "." + (date.getFullYear() - 2019).toString()
		msgBanList += player[0] + " - " + date.toDateString() + "\n";
	}
	msgBanList += "```"
    message.edit(msgBanList);
}*/

bot.on('ready', () => {
	locale: 'ru';

	let channelForTeamKillers = bot.channels.find(channel => channel.id == '625299054733164585');
	/*let channelForBanList = bot.channels.find(channel => channel.id == '611119158448488468');
    channelForBanList.send("Запуск").then( (msg) => {
        checkBanList(msg)
        setInterval(() => checkBanList(msg), 10000);
    });*/

	console.log("Bot online");
	listeningSCP();
	setInterval(() => checkTeamKllers(channelForTeamKillers), 10000);
});

bot.on('message', message => {
	let args = message.content.split(' ');
	let cmd = args[0].toUpperCase();
	if (message.channel.id == "577860407784505346") 
	{
		switch(cmd) 
		{
			case prefix + "CHANGESCP":
				listeningSCP();
			break;
			case prefix + "JOIN":
				let voiceChannel = message.member.voiceChannel;

				if (voiceChannel == null) 
				{
					message.channel.send("**ERROR: Вы не были найдены в голосовом чате**");
					break;
				}

				voiceChannel.join()
				.then(connection => {
					voiceConnection = connection
				});
				message.channel.send("**INFO: Я присоединился к вам**");
			break;
			case prefix + "LEAVE":
				if (voiceConnection == null) 
				{
					message.channel.send("**INFO: Я не разговариваю с вами**");
					break;
				}
				voiceConnection.disconnect();
				message.channel.send("**INFO: Я покинул вас**");
			break;
			case prefix + "CASSIE":
				cassiePlay(args, message.channel, 1);
			break;
			/*case prefix + "DOCUMENT":
				if (!args[1]) 
				{
					message.channel.send("Нет номера SCP");
					return;
				}

				let document = new Discord.RichEmbed()
				.setColor('#888888')
				.setTitle();

				message.channel.send(document);
			break;*/
		}
	}
	

	if (message.channel.id == '625327729461559338') 
	{
		switch (cmd) 
		{
			case prefix + "GET":
				message.channel.send( { files: [args[1]] } );
			break;
			case prefix + "DOWNLOAD":
				//message.attachments.first();
				request.get(message.attachments.first().url)
				.on('error', () => message.channel.send("Ошибка"))
				.pipe(fs.createWriteStream('downloads/' + message.attachments.first().filename))
			break;
			case prefix + "SENDGETINGROLEMESSAGE":
				const messageForGettingRoles = new Discord.RichEmbed()
				.setAuthor("Получение ролей")
				.setColor("#00ff00")
				.setTitle("При первом выборе роли, Вы её получите\nПри повторном выборе, её с Вас снимут")
				.addField("<:like:616944368028483605> - Роль Новости", "Уведомления об новостях проекта и SCP SL", false)
				.addField("<:kva:603174262802612239> - Роль Объявления AutoEvents", "Уведомления об упоминании игроков AutoEvents", false)
				.addField("<:RP_2:638880035331112986> - Роль Объявления LightRP", "Уведомления об упоминании игроков LightRP", false)
				.addField("<:respect:616945472065634305> - Роль Анимешник", "Доступ к аниме каналам", false);
				message.guild.channels.find(channel => channel.id == '639459635107201034').send(messageForGettingRoles)
				.then(msg => reactRoleGetingMessage(msg));
			break;
		}
	}
	
});

bot.on('guildMemberAdd', member => {
	member.addRole('530682603477532672');
	console.log("New user " + member.user.username + " joined");
	member.user.send("```bash\n[call event 'guildMemberAdd']\n[read '~/scp-079/dialogs/guild_member_add.txt']\n\"Добро пожаловать на сервер Zone 19 Staff\"\n```");
});

bot.on('messageReactionAdd', (messageReaction, user) => {
	if (messageReaction.message.channel.id == '639459635107201034') 
	{
		if (bot.user != user) 
		{
			let member = bot.guilds.find(guild => guild.id == '530426891614552085').members.find(member => member.user == user);

			switch (messageReaction.emoji.id) 
			{
				case '638880035331112986':
					if (member.roles.get('636131807062130688') == null)  
					{ member.addRole('636131807062130688'); member.addRole('639581517307183106'); }
					else 
					{ member.removeRole('636131807062130688'); }
				break;
				case '603174262802612239':
					if (member.roles.get('639460078956707840') == null) 
					{ member.addRole('639460078956707840'); member.addRole('639581517307183106'); } 
					else 
					{ member.removeRole('639460078956707840'); }
				break;
				case '616944368028483605':
					if (member.roles.get('639460289259241502') == null) 
					{ member.addRole('639460289259241502'); member.addRole('639581517307183106'); } 
					else 
					{ member.removeRole('639460289259241502'); }
				break;
				case '616945472065634305':
					if (member.roles.get('635568091971190836') == null) 
					{ member.addRole('635568091971190836'); member.addRole('639581517307183106'); } 
					else 
					{ member.removeRole('635568091971190836'); }
				break;
			}
			
			setTimeout(() => {

			member = bot.guilds.find(guild => guild.id == '530426891614552085').members.find(member => member.user == user);

			if ((member.roles.get('636131807062130688') == null) && (member.roles.get('639460078956707840') == null) && (member.roles.get('639460289259241502') == null) && (member.roles.get('635568091971190836') == null)) 
			{
				member.removeRole('639581517307183106');
			}

			}, 1000);

			messageReaction.remove(user);
		}
	}
});

bot.on('error', error => {
	console.log("Something ERROR");
});


bot.login(login.token);