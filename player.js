const allConnections = []
const joinChannel = (voiceChannel, initialSong) => {
    voiceChannel.join().then(connection => {
        const uid = Date.now()
        var playlist = new Playlist(message.channel.id, uid);
        connection.playlist = playlist;
        connection.id = uid
        allConnections.push(connection)
        //ytdl ger mig en readable stream från en länk med vid,music
        //en gång per join som beyder att jag kan s
        console.log("Play")
        search(firstSong,connection, playlist, 'first', message)
    }).catch(console.error)
}
