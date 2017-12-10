const allConnections = {}
var ytdl = require("ytdl-core");
var Youtube = require("youtube-api");
var Playlist = require("./playlist.js");
const streamOptions = { seek: 0, volume: 1, choice:"ffmpeg" };

Youtube.authenticate({
    type:"key",
    key : "AIzaSyAlvHMtpi6PgFsA_ErZFU_CJfRBgn309Dc"
});
const joinChannel = (voiceChannel, initialSong) => {
    return voiceChannel.join().then(connection => {
        const uid = Date.now()
        var playlist = new Playlist(uid, uid);
        connection.playlist = playlist;
        connection.id = uid
        allConnections[uid] = connection
        //ytdl ger mig en readable stream från en länk med vid,music
        //en gång per join som beyder att jag kan s
        //console.log("Play")
        //search(firstSong, connection,'first', message)
        return new Promise((resolve, reject) => {
            resolve(connection)
        })
    }).catch(console.error)
}

function createStream(connection, pl, opt){
    if(opt=="skipping"){
        connection.player.dispatcher.end();
    } else {
        const stream = ytdl('https://www.youtube.com/watch?v='+pl.list[0], {filter : 'audioonly'});
        if  (opt == "first" ){
            var dispatcher = connection.playStream(stream, streamOptions);
        } else if(opt=="newsong" || opt == "ading") {
            var dispatcher = connection.playStream(stream, streamOptions);
        }
        dispatcher.on("end",function(){
            console.log("stream has ended");
            pl.list.shift();
            if  (pl.list.length > 0 ){
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

function playMusic (searched, connection, opt, message, cb){
    var id ;
    let playlist = connection.playlist
    Youtube.search.list({ part:"snippet",q: searched, type:"video", maxResults: 25 }, (err,data) => {
        var vidId = data.items[0].id.videoId;
        id = vidId;
        var videoTitle = data.items[0].snippet.title;
        message.channel.send("`"+videoTitle.toString()+"` has been added to the *playlist*.")
        if  (opt == "ading" ){ //&& playlist.list.length >0
            playlist.list.push(id);
        }else{
            playlist.add(id);
            var listenerId = playlist.uid;
            createStream(connection, playlist, opt);
        }
    })
}
module.exports = {
    playMusic: playMusic,
    createStream: createStream,
    joinChannel: joinChannel
}
