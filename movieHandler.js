const imdb = require("imdb-api");

function movie(title,message){
    imdb.getReq({name:title, opts: {apiKey: 'ee78fc22', timeout: 30000}},(err,data)=>{
        if  (err){
            console.log(err);
            return
        }
        if (data.poster != 'N/A') {
          message.channel.sendFile(data.poster);
        }
        message.channel.send("\n"+"`Rating`: "+"**"+data.rating+"**"+"\n"+"`Type:` "+"**"+data.genres+"**"+"\n"+"`Description:` "+"**"+data.plot+"**");
    })
}


module.exports = {
    movie : movie
}
