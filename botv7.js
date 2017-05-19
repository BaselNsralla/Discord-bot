
var Discord = require("discord.js");
var ytdl = require("ytdl-core");
var Youtube = require("youtube-api");
var Playlist = require("./playlist.js");
var request = require("request");
var client = new Discord.Client();
const imdb = require("imdb-api");
var init = 0;
var lolsheet = function(){
    this.list = {};  
};
var commandList =["**<>play** *something* `To play something from Youtube`.", "**<>leave**  `Leaves the voice channel the bot is currently in, and resets the Playlist`.", "**<>Roberto** `Tells you someting about him`.","**<>hej** `Hej`","**<>league** *summoner*  `To show summoners rank and current game info`","**<>movie** *movie name* `Tells some info about the movie`"];
const streamOptions = { seek: 0, volume: 1, choice:"ffmpeg" };
Youtube.authenticate({
    type:"key",
    key : "your-key"

});


var token = "your-token";
client.login(token);


//on going onlinde :D emits ready
client.on("ready",function(){
    console.log("READY FOR FARMING");

    var bot = client.user;
    bot.setGame("type <>help");


    client.channels.forEach(function(channel){
        var typ = channel.type;

        if  (typ=="text"){
            //channel.send("`Hello I am ONLINE! type` **<>help** `to view my robot parts`");

        }
    });




});





client.on("message",function(message){
    var msg = message.content;
    //finns det alltid ens ?
    var voiceKanal = message.member.voiceChannel;
    /*if  (typeof voiceKanal != "undefined"){
        console.log(voiceKanal);

    }*/

    //det är tilll kanalen man skriver vet du 
    var textKanal = message.channel;

    if(msg.startsWith("<>skip")){
        var door = false;
        if (typeof voiceKanal != "undefined"){
            voiceKanal.members.forEach(function(m){
                if (m.user.username=="Basel-Bot"){
                    var connection = voiceKanal.connection;
                    var playlist = connection.playlist;
                    var opt = "skipping";
                    createStream(connection,playlist,opt);
                }else{
                    return;

                }

            });


        }    




    }

    if (msg.startsWith ("<>play")){
        var gate = false;
        //pusha in Videoid i kön :D
        var firstSong;

        if  (typeof voiceKanal != "undefined"){
            voiceKanal.guild.channels.forEach(function(channel){
                if (channel == message.channel){


                    voiceKanal.members.forEach(function(m){
                        if (m.user.username=="Basel-Bot"){
                            gate=false;
                            console.log("Den är i en kanal den kommer lyssna på andra play");
                            return;
                        }else{
                            console.log("nu borde den inte lyssna på andra play");
                            gate=true;
                            //annars ska vi byta kanal o starta en ny connection med 
                            //ny lista
                            firstSong = msg.substring(7);



                        }

                    });



                } 


            });


        }


        setTimeout(function(){  

            if  (gate == true){
                console.log("FEL")
                play(voiceKanal,firstSong,message);
            }    


        },1000);   

    }
    if  (msg.toLowerCase() == "<>hej"){

        textKanal.send("Hej");

    }
    if  (msg.toLowerCase() == "<>leave"){
        if   (typeof voiceKanal != "undefind"){

            voiceKanal.leave();


        }
    }

    if (msg.toLowerCase() == "<>roberto"){
        textKanal.send("**He is my slave**.");

    }

    if  (msg.toLowerCase() == "<>help"){
        var help = commandList.join("\n\r");
        textKanal.send(help);
    }

    if(msg.toLowerCase().startsWith("<>movie")){
        console.log("movie search");
        movie(msg.substring(8),message);

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
                message.channel.send(summoner+" does not exist on EUNE");

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



    if(msg.startsWith("<>play")){
        var voice_channel = message.member.voiceChannel;
        if(typeof voice_channel != "undefined"){
            voice_channel.members.forEach(function(member){

                if(member.user.username == "Basel-Bot"){
                    var songTitle = msg.substring(7);

                    search(songTitle,voice_channel.connection,voice_channel.connection.playlist,"ading",message);



                }                  


            });
        }

    }

});








function play(voiceKanal,firstSong,message){
    var boll = true;
    voiceKanal.members.forEach(function(member){
        if(member.user.username == "Basel-Bot"){
            boll = false;
            console.log("MOTHER FUCKER"+boll);
        }
    });
    setTimeout(function(){playMusic(boll)},1000);
    function playMusic(bollen){
        if (bollen == true){
            voiceKanal.join().then(connection => {

                var pl = new Playlist(message.channel.id,init);
                connection.playlist = pl;
                init++;

                //ytdl ger mig en readable stream från en länk med vid,music
                //en gång per join som beyder att jag kan s  
                console.log("Play");
                search(firstSong,connection,pl,"first",message); 
            }).catch(console.error);


        }
    }
}


function createStream(connection,pl,opt){

    if(opt=="skipping"){
        connection.player.dispatcher.end();
           


    }else{



        if  (opt == "first" ){
            var stream = ytdl('https://www.youtube.com/watch?v='+pl.list[0], {filter : 'audioonly'});
            var dispatcher = connection.playStream(stream, streamOptions);
            console.log(dispatcher);
        }else if(opt=="newsong" || opt == "ading"){
            var  stream = ytdl('https://www.youtube.com/watch?v='+pl.list[0], {filter : 'audioonly'});
            console.log(dispatcher);
            var dispatcher = connection.playStream(stream, streamOptions);

        }/*else if(opt=="pause"){
        var  stream = ytdl('https://www.youtube.com/watch?v='+pl.list[0], {filter : 'audioonly'});
        var dispatcher = connection.playStream(stream, streamOptions);
        dispatcher.pause();


    }*/





        dispatcher.on("end",function(){

            console.log("stream has ended"); 
            pl.list.shift();


            if  (pl.list.length > 0 ){
                //en ny fakking dispatcher kommer köra då och en ny lyssnare 
                createStream(connection,pl,"newsong");
            }else{
                /* connection.channel.leave();*/
                /*connection.disconnect();*/
                /*   pl.add("ThlhSnRk21E");
            createStream(connection,pl,"pause");*/




            }

        });

    }
}

function search (searched,connection,pl,opt,message){
    var id ;
    Youtube.search.list({ part:"snippet",q: searched, type:"video", maxResults: 25 },function(err,data){

        var vidId = data.items[0].id.videoId;

        id = vidId;
        console.log(id);
        var videoTitle = data.items[0].snippet.title;

        message.channel.send("`"+videoTitle.toString()+"` has been added to the *playlist*.");

        if  (opt=="ading" && connection.playlist.list.length >0){


            console.log("lägger till"); 
            pl.list.push(id);

        }else{
            /* pl.list.shift();*/

            /*opt = "newsong"  ;  */
            build(id,connection,pl,opt);

        }

    });



}

function build  (songId,connection,pl,opt){
    pl.add(songId); 




    var listenerId = pl.uid;





    createStream(connection,pl,opt);



}

function movie(title,message){
    imdb.getReq({name:title},(err,data)=>{
        if  (err){
            console.log(err);
        }

        message.channel.sendFile(data.poster);
        message.channel.send("\n"+"`Rating`: "+"**"+data.rating+"**"+"\n"+"`Type:` "+"**"+data.genres+"**"+"\n"+"`Description:` "+"**"+data.plot+"**");


    });




}
