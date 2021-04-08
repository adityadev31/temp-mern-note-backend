// import
const jwt = require("jsonwebtoken");

// use
const Auth = (req, res, next) => {
   try {
      const token = req.header("Authorization");
      if(!token) return res.status(500).json({msg: 'invalid authentication'});
      jwt.verify(token, process.env.TOKENSECRET, (err, verified) => {
         if(err) return res.status(500).json({msg: 'invalid authentication'});
         if(!verified) return res.status(500).json({msg: 'invalid authentication'});
         req.user = verified;
         next();
      });
   } catch (err) {
      return res.status(500).json({msg: 'invalid authentication'});
   }
};

// exports
module.exports = Auth;