const Discord = require("discord.js");
const login = require("./login.json");
const fs = require("fs");

const bot = new Discord.Client();

function checkNumberOfPlayers() 
{
    let numberOfPlayers = fs.readFileSync("../server7777.txt");
    console.log((numberOfPlayers - 1) + " of 30");
    bot.user.setActivity(", что " + (numberOfPlayers - 1) + " из 30 игроков на сервере", {type: "WATCHING"} );
}

bot.on('ready', () => {
    console.log("Server bot loaded");
    checkNumberOfPlayers();
    setInterval(() => checkNumberOfPlayers(), 10000);
});

bot.login(login.token);