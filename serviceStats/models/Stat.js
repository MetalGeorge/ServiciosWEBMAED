var db=require('../dbconnection'); //reference of dbconnection.js
 
var Stat={

getAllStats:function(callback){
    return db.query("SELECT * FROM votes",callback); 
},

addStat:function(Stat,callback){
    db.query("INSERT INTO votes (voterid, ideaid)  VALUES (?,?)",[Stat.voterid,Stat.ideaid],callback);
    //db.query("UPDATE ideas SET votes (SELECT COUNT(*) FROM votes.ideaid = ?))",[Stat.ideaid],callback);
    return "Insert votes, stats updated";
},

deleteStatByVoterId:function(voterid,callback){
    db.query("DELETE FROM votes WHERE voterid=?",[voterid],callback);
    return "Delete votes (voterid), stats updated";
},

deleteStatByIdeaId:function(ideaid,callback){
    db.query("DELETE FROM votes WHERE ideaid=?",[ideaid],callback);
    return "Delete votes (ideaid), stats updated";
}

};

module.exports=Stat;


