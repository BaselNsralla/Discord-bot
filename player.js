const joinChannel = (voiceChannel, initialSong) => {
    voiceChannel.join().then(connection => {
        var pl = new Playlist(message.channel.id, init);
        connection.playlist = pl;
        init++
        //ytdl ger mig en readable stream från en länk med vid,music
        //en gång per join som beyder att jag kan s
        console.log("Play")
        search(firstSong,connection,pl,"first",message)
    }).catch(console.error)
}
