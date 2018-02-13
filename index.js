
	// If you use, please give credits to me, papershredder432.
	// You can set the activity to what you want.
	// Where it says "if(message.member.roles.find('name', '<Role>')"
		// You have to change the roles to what the Role name is
	// Thank you, there are still minor issues to be fixed but this 
	// is a start.
	// To change the the prefix, token, and client ID, navigate to 
	// .\HappysModRequests\required\cfgs\botvars.json

const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

    // Required Loader
var pkg = JSON.parse(fs.readFileSync('./required/pkgs/package.json', 'utf-8'));
var pkg_lock = JSON.parse(fs.readFileSync('./required/pkgs/package-lock.json', 'utf-8'));
var bv = JSON.parse(fs.readFileSync('./required/cfgs/botvars.json', 'utf-8'));

    // Config
const prefix = bv.ClientPrefix;
const token = bv.ClientToken;
const id = bv.ClientID;

    // Listener Events
client.login(`${token}`);
client.on('ready', () => {
    console.log("Bot Launched...");
    client.user.setActivity("HappysModRequest bot, still being worked.");
});

    // Commands
client.on('message', function(message) {
    let msg = message.content.toUpperCase();
    let sender = message.author;
    let cont = message.content.slice(prefix.length).split(" ");
    let args = cont.slice(1);
    let member = message.author.username;
    let membertag = message.author.tag;

    if(sender.bot)return;
        // Help Command
    if(msg.startsWith(prefix + `HELP`)) {
        if(message.member.roles.find('name', 'Customer') || message.member.roles.find('name', 'Staff')) {
            message.channel.send("To request a mod, please specify what you want. \nRequest Usage: **request *put request here*");
            message.channel.send("**YOU CAN ONLY SEND A REQUEST ONE TIME OR THE PREVIOUS IS DELETED!!!**");
        } else {
            message.channel.send("You need to have the **Customer** *or* **Staff** role! \nTo get the **Customer** role, do **customer");
        }
    }
        // Staff commands
    if(msg.startsWith(prefix + `COMMANDS`)) {
        if(message.member.roles.find('name', 'Customer')) {
            message.channel.send("Commands availabe to **Customer**: ```Request <Insert your request> : Makes a request```");
        }
        if(message.member.roles.find('name', 'Staff')) {
            message.channel.send("Commands availabe to **Customer**: ```Request <Insert your request> : Makes a request```");
            message.channel.send("Commands available to **Staff**:```Viewrequest or VR <User Mention> : Views the mentioned member's request \nDeleterequest or DR <User Mention> : Deletes the mentioned member's request```");
        } else {
            if(!message.member.roles.find('name', 'Customer')) {
                message.channel.send("Do `**customer` and get more commands.")
            }
        }
    }
        // Customer Role Give
    if(msg.startsWith(prefix + `CUSTOMER`)) {
        message.member.roles.get(`410198922963845121`);
        if(!message.member.roles.find('name', 'Customer')) {
            const member = message.member.addRole(`410198922963845121`);
            message.channel.send("You are now a **Customer**!");
        } else {
            const member = message.member.removeRole(`410198922963845121`);
            message.channel.send("You are no longer a **Customer**.")
        }
    }
        // Request Command
    if(msg.startsWith(prefix + `REQUEST`)) {
        if(message.author.bot)return;
        fs.writeFileSync(`./requests/${message.author.id}.txt`, message.content, function(error) {
            console.log(error);
        });
        message.reply("Request successfully added to the queue!");
    }
        // View Request
    if(msg.startsWith(prefix + `VIEWREQUEST`) || msg.startsWith(prefix + `VR`)) {
        if(!message.member.roles.find('name', 'Staff')) {
            message.channel.send("You must have the role **Staff** to view a request!");
        } else {
            let target = message.mentions.users.first().id || message.author;
            var request = fs.readFile(`./requests/${target}.txt`, 'utf8', function(err, data) {
                if(err) 
                return console.error(err);
                message.channel.send(data);
            });
        }
    }
        // Delete Request
    if(msg.startsWith(prefix + `DELETEREQUEST`) || msg.startsWith(prefix + `DR`)) {
        if(!message.member.roles.find('name', 'Staff')) {
            message.channel.send("You must have the role **Staff** to delete a request!");
        } else {
            let target = message.mentions.users.first().id || message.author;
            fs.unlink(`./requests/${target}.txt`);
            message.reply(`${member}'s request has been deleted!`);
        }
    }
});