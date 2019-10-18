const Discord = require('discord.js');
const login = require("./token.json");
const fs = require("fs");

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

		const dispatcher = voiceConnection.playFile('./cassie/' + word.toLowerCase() + '.wav');

		dispatcher.on('end', () => {
			setTimeout(() => cassiePlay(args, textChannel, index + 1), 100);
		});
	}
}

bot.on('ready', () => {
	let channel = bot.channels.find(channel => channel.id == '625299054733164585');
	
	locale: 'ru';
	console.log("Bot online");
	listeningSCP();
	setInterval(() => checkTeamKllers(channel), 10000);
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

	if ((message.author.id == '416281457376624651') || (message.author.id == '372775021996802049') || (message.author.id == '405261561586909185') || (message.author.id == '530332416557187095'))
	{
		if (message.channel.id == '625327729461559338') 
		{
			switch (cmd) 
			{
				case prefix + "GETBANLISTIP":
					message.channel.send({files:[{ attachment: '../.config/SCP Secret Laboratory/IpBans.txt', name: 'IpBans.txt' }]});
				break;
				case prefix + "GETBANLISTSTEAMID":
						message.channel.send({files:[{ attachment: '../.config/SCP Secret Laboratory/SteamIdBans.txt', name: 'SteamIdBans.txt' }]});
				break;
				case prefix + "GETCONFIGREMOTEADMIN":
						message.channel.send({files:[{ attachment: '../scpslserver/servers/public/config_remoteadmin.txt', name: 'config_remoteadmin.txt' }]});
				break;
			}
		}
	}
});

bot.on('guildMemberAdd', member => {
	member.addRole('530682603477532672');
	console.log("New user " + member.user.username + " joined");
	member.user.send("[read ~/scp-079/dialogs/guild_member_add.txt]\nДобро пожаловать на сервер Zone 19 Staff\n[member.[error]]");
});

bot.login(login.token);