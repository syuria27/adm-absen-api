var mysql = require("mysql");
const isset = require('isset');

function USER_ROUTER(router,pool) {
    var self = this;
    self.handleRoutes(router,pool);
}

USER_ROUTER.prototype.handleRoutes= function(router,pool) {
    
    router.get("/users/:depot",function(req,res){
    	var data = {
    		error:true,
			error_msg:"",
			users : []
		};

		if (req.params.depot === "Admin_1") {
			var query = `SELECT kode_spg, nama_spg, nama_toko, depot
        			FROM t_user`;	
		} else {
			var query = `SELECT kode_spg, nama_spg, nama_toko, depot
        			FROM t_user WHERE depot = ?`;
		}

        
	    var table = [req.params.depot];
	    query = mysql.format(query,table);
	    pool.getConnection(function(err,connection){
		    connection.query(query,function(err,rows){
		        connection.release();
	           	if(err) {
		            res.status(500);
		            data.error_msg = "Error executing MySQL query";
			        res.json(data);
			    } else {
		            if(rows.length > 0){
		            	console.log(rows);
		               	data.error = false;
				        data.error_msg = 'Success..';				        
				        data.users = rows;
				        res.status(200);
				        res.json(data);
			        }else{
			            data["error_msg"] = 'No users Found..';
			            res.status(404);
			            res.json(data);
			        }
		        }
		    });
	    });
	    
    });

    router.get("/user/:kode_spg",function(req,res){
    	var data = {
    		error:true,
			error_msg:"",
			user : {}
		};

		var query = `SELECT kode_spg, nama_spg, nama_toko, depot
        			FROM t_user WHERE kode_spg = ?`;	
		
	    var table = [req.params.kode_spg];
	    query = mysql.format(query,table);
	    pool.getConnection(function(err,connection){
		    connection.query(query,function(err,rows){
		        connection.release();
	           	if(err) {
		            res.status(500);
		            data.error_msg = "Error executing MySQL query";
			        res.json(data);
		        } else {
		            if(rows.length > 0){
		               	data.error = false;
				        data.error_msg = 'Success..';
				        data.user = rows[0];
				        res.status(200);
				        res.json(data);
			        }else{
			            data.error_msg = 'No user Found..';
			            res.status(404);
			            res.json(data);
			        }
		        }
		    });
	    });
    });
}

module.exports = USER_ROUTER;
