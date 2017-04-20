var mysql = require("mysql");
const isset = require('isset');

function LOGIN_ROUTER(router,pool,md5) {
    var self = this;
    self.handleRoutes(router,pool,md5);
}

LOGIN_ROUTER.prototype.handleRoutes= function(router,pool,md5) {
    
    router.post("/login",function(req,res){
    	var data = {
    		error:true,
			error_msg:"",
			user : {}
		};

        if (isset(req.body.username) && isset(req.body.password)) {
			var query = `SELECT username, password,
						(case when hak_akses = 'Admin_1' then username else nama_spg end) as nama_spg ,
						(case when hak_akses = 'Admin_1' then 'Nippon Paint' else nama_toko end) as nama_toko ,
						(case when hak_akses = 'Admin_1' then hak_akses else depot end) as depot FROM t_login l
	         			LEFT JOIN t_user u ON u.kode_spg = l.username 
	         			WHERE l.username = ? AND (l.hak_akses = 'Admin' OR l.hak_akses = 'Admin_1')`;
	        var table = [req.body.username];
	        query = mysql.format(query,table);
	        pool.getConnection(function(err,connection){
		        connection.query(query,function(err,rows){
		            connection.release();
	            	if(err) {
						res.status(500);
		                res.json({"error" : true, "error_msg" : "Error executing MySQL query"});
		            } else {
		                if(rows.length != 0){
		                	if (rows[0].password == md5(req.body.password)) {
					            data.error = false;
					            data.error_msg = 'Success..';
					            data.user = {
									kode_spg : rows[0].username,
									nama_spg : rows[0].nama_spg,
									nama_toko : rows[0].nama_toko,
									depot : rows[0].depot
								};
					            res.json(data);
					        }else{
					        	data.error_msg = 'Login fail check password..';
					        	res.status(403);
				            	res.json(data);
					        }
				        }else{
				            data.error_msg = 'No users Found..';
				            res.status(404);
				            res.json(data);
				        }
		            }
		        });
	    	});
	    }else{
	    	data.error_msg = 'Missing some params..';
	    	res.status(400);
	        res.json(data);
	    }
    });
}

module.exports = LOGIN_ROUTER;
