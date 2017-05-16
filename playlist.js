//var playlist = {
//  list:[],
//   skip:function(){
//     this.list.shift();
//       
//   },
//    add:function(s){
//        this.list.push(s);
//        
//    }
//    
//};

const eventEmitter = require("events");
function playlist(id,uid){
    this.list = [];
    this.skip = function(){
        if (list.length!=0){
      this.list.shift();      
            
        }
        
    };
    
    this.id = id;
    this.add= function(s){
        this.list.push(s);
        
        
    };
   this.uid = uid;
    
}





    
module.exports =  playlist;