const imdb = require("imdb-api");

function movie(title,message){
    imdb.getReq({name:title},(err,data)=>{
        if  (err){
            console.log(err);
        }
        message.channel.sendFile(data.poster);
        message.channel.send("\n"+"`Rating`: "+"**"+data.rating+"**"+"\n"+"`Type:` "+"**"+data.genres+"**"+"\n"+"`Description:` "+"**"+data.plot+"**");
    })
}


module.export = {
    movie : movie
}
