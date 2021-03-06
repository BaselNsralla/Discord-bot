
var Discord = require("discord.js");
var request = require("request");
const playHandler = require('./playHandler.js')
const helpers = require('./tools/helpers.js');
const movieHandler = require('./movieHandler')
var client = new Discord.Client();
_BOTUSERNAME = 'Basel-Bot'
var lolsheet = function(){
    this.list = {};
};
var commandList =["**<>play** *something* `To play something from Youtube`.", "**<>leave**  `Leaves the voice channel the bot is currently in, and resets the Playlist`.", "**<>Roberto** `Tells you someting about him`.","**<>hej** `Hej`","**<>league** *summoner*  `To show summoners rank and current game info`","**<>movie** *movie name* `Tells some info about the movie`"];
var token = "YOUR KEY HERE";
client.login(token);
client.on("ready",function(){
    console.log("READY FOR FARMING");
    var bot = client.user;
    bot.setGame("type <>help");
    client.channels.forEach(function(channel){
        var type = channel.type;
        if  (type =="text"){
            channel.send("`Hello I am ONLINE! type` **<>help** `to view my robot parts`")
        }
    });
});


client.on("message", (message) => {
    var msg = message.content;
    var voiceChannel = message.member.voiceChannel;
    var textChannel = message.channel;
    if(msg.startsWith("<>skip")){
        if (voiceChannel){
            if (helpers.alreadyVoiceMember(voiceChannel, _BOTUSERNAME, message)) {
                var connection = voiceChannel.connection;
                var playlist = connection.playlist;
                var opt = "skipping";
                playHandler.createStream(connection, playlist, opt);
            } else {
                textChannel.send('YOU ARE NOT ALLOWED TO TOUCHE ME')
            }
        }
    }

    if (msg.startsWith ("<>play")){
        if(voiceChannel) {
            const songTitle = msg.substring(7) || 'potato song';
            const voiceChannel = message.member.voiceChannel
            if (!helpers.alreadyVoiceMember(voiceChannel, _BOTUSERNAME, message)) {
                if (voiceChannel) {
                    playHandler.joinChannel(voiceChannel, songTitle).then(connection => {
                        playHandler.playMusic(songTitle, connection, 'first', message)
                    })
                }
            } else {
                playHandler.playMusic(songTitle, voiceChannel.connection , "ading", message);
            }
        }
    }

    if  (msg.toLowerCase() == "<>hej"){
        textChannel.send("Hej");
    }

    if  (msg.toLowerCase() == "<>leave"){
        if   (voiceChannel){

            voiceChannel.leave();
        }
    }

    if (msg.toLowerCase() == "<>roberto"){
        textChannel.send("**What can i tell you?**.");
    }

    if  (msg.toLowerCase() == "<>help"){
        var help = commandList.join("\n\r");
        textChannel.send(help);
    }

    if(msg.toLowerCase().startsWith("<>movie")){
        console.log("movie search");
        movieHandler.movie(msg.substring(8),message);
    }


    if(msg.startsWith("<>league")){
        var summoner = msg.substring(9) ;
        summoner = summoner.toLowerCase().replace(/\s/g,'');
        //om jag vill ha en lista så måste jag skapa en new grej;
        request("https://eune.api.pvp.net/api/lol/eune/v1.4/summoner/by-name/"+summoner+"?api_key=RGAPI-f54f34fd-3654-495e-89fa-1f8ea5a61513",
                function(error,response,body){
            if  (response.statusCode == 200){
                var sheet = new lolsheet();
                data = JSON.parse(body);
                console.log(data[summoner].id);
                var sheet = new lolsheet();
                sheet.list.summonerId = data[summoner].id;
                sheet.list.summonerName = summoner;
                currentMatch(sheet,message);
            }else{
                console.log("personen existerar inte på servern");
                message.channel.send(summoner+" doess not exist on EUNE");
            }
        });

        function currentMatch(sheet,message){
            request("https://eune.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/EUN1/"+sheet.list.summonerId+"?api_key=RGAPI-f54f34fd-3654-495e-89fa-1f8ea5a61513",function(error,response,body){
                var champId;
                var time = "this moment";
                //jag kan få ut mer än vilken champ han spelar hhärifrån
                if  (response.statusCode == 200){
                    console.log(response.statusCode);
                    data = JSON.parse(body);
                    console.log(data.gameLength);
                    time = "min: "+Math.ceil(data.gameLength/60);
                    data.participants.forEach(function(part){
                        if (part.summonerId==sheet.list.summonerId){
                            console.log(part.championId);
                            champId = part.championId;
                        }
                    });
                }else{
                    console.log("personen han sökte spelar inget just nu");
                    champId = sheet.list.summonerName+" is not playing right now";
                }
                sheet.list.champId = champId;
                sheet.list.time =  time;

                getChamp(sheet,message);
            });
        }
        function claimDevision(sheet, message){
            request("https://eune.api.pvp.net/api/lol/eune/v2.5/league/by-summoner/"+sheet.list.summonerId+"/entry?api_key=RGAPI-f54f34fd-3654-495e-89fa-1f8ea5a61513",function(error,response,body){
                if  (response.statusCode ==200){
                    var data = JSON.parse(body);
                    var tier = data[sheet.list.summonerId][0].tier;
                    var division = data[sheet.list.summonerId][0].entries[0].division;
                    var leaguePoints = data[sheet.list.summonerId][0].entries[0].leaguePoints;
                    var fullDivision = tier+" "+division+" "+leaguePoints+" lp";
                    sheet.list.division = fullDivision;
                }
                final(sheet,message);
            });
        }
        function getChamp(sheet,message){
            console.log(sheet.list.champId);
            request("https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/"+sheet.list.champId+"?api_key=RGAPI-f54f34fd-3654-495e-89fa-1f8ea5a61513",function(error,response,body){
                console.log(response.statusCode);
                var champion;
                var game;
                if   (response.statusCode  ==200){
                    champion =JSON.parse(body).name;
                    console.log();
                    game = "**"+sheet.list.summonerName+"** `is currently playing` "+ "**"+champion+"**";
                }else{
                    game = "No ongoing game";
                    champ =" No champion is being played right now";
                }
                sheet.list.championName = champion;
                sheet.list.game = game
                claimDevision(sheet,message);
            });
        }
        function final(sheet,message){
            console.log(sheet.list);
            message.channel.send("**"+sheet.list.summonerName+"**`:` **"+sheet.list.division+"** \n"+sheet.list.game+" at  **"+sheet.list.time+"**");
        }
    }

})
