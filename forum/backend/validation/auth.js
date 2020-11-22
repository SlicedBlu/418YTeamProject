const JWT = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
    verify: function(req) {
        const authHeader = req.headers['token'];
        const token = authHeader;
        console.log(token);
        if (token == null) 
        return null;
    
        return JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
            if (err)
           return null;
    
            req.user = user;
            //console.log("Authenticated");
            return {userId: user.userId, username: user.username, email: user.email, role: user.role}
        });
    }    
}