// imports
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// generate token
const generate_token = (length, email) => {
   //edit the token allowed characters
   var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
   var b = [];  
   for (var i=0; i<length; i++) {
       var j = (Math.random() * (a.length-1)).toFixed(0);
       b[i] = a[j];
   }
   return b.join("")+"_"+email;
}

// send mail
const sendEmailVerifyMail = async (name, email, token) => {

   const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
         user: 'tyson20130586@gmail.com',
         pass: `${process.env.EMAIL_SENDER_PASS}`
      }
   });
   await transporter.sendMail({
      from: 'tyson20130586@gmail.com',
      to: email,
      subject: 'Email Verification',
      html: `<p>Hi ${name} !</p> 
            <p>Thank you for choosing Quick Notes. Here is your email verification link <a href='https://temp-mern-note.herokuapp.com/auth/email-verification/${token}'>Click Here</a> </p>
            <p>Please verify your email before use. <span style='font-size:100px;'>&#128516;</span> </p>`
   });

}

// routes
const userCtrl = {

   // login
   login: async (req, res) => {
      try {
         // validating creds
         const {email, password} = req.body;
         const data = await User.findOne({email});
         if(!data) return res.status(400).json({msg: 'email/password invalid'});
         const matched = await bcrypt.compare(password, data.password);
         if(!matched) return res.status(400).json({msg: 'email/password invalid'});
         // creating token
         const payload = {name: data.username, id: data._id, email: data.email, verified: data.emailconfirm};
         const token = jwt.sign(payload, process.env.TOKENSECRET, {expiresIn: "1d"});
         return res.json({payload, token});
      } catch (err) {
         console.log(err);
         res.status(500).json({msg: err.message});
      }
   },

   // signup
   signup: async (req, res) => {
      try {
         // validating creds
         const {email, username, password, cpassword} = req.body;
         let data = await User.findOne({email});
         if(!data) data = await User.findOne({username});
         if(data) return res.status(400).json({msg: 'user already registered'});
         if(password !== cpassword) return res.status(400).json({msg: 'password not matched'});
         const hashedPass = await bcrypt.hash(password, 10);
         const emailToken = generate_token(50, email);
         // creating new user
         const newUser = new User({username, email, password: hashedPass, emailtoken: emailToken});
         const savedData = await newUser.save();
         if(!savedData) return res.status(400).json({msg: 'err while saving data'});
         // sending email verification mail
         sendEmailVerifyMail(username, email, emailToken).catch(console.error);
         // creating token
         const payload = {name: savedData.username, id: savedData._id, email: savedData.email, verified: savedData.emailconfirm};
         const token = jwt.sign(payload, process.env.TOKENSECRET, {expiresIn: "1d"});
         return res.json({payload, token});
      } catch (err) {
         console.log(err);
         res.status(500).json({msg: err.message});
      }
   },

   // verify
   verify: (req, res) => {
      try {
         const token = req.header("Authorization");
         jwt.verify(token, process.env.TOKENSECRET, (err, verified) => {
            if(err) return res.json({result: false});
            if(!verified) return res.json({result: false});
            if(verified) return res.json({result: true, payload: {name: verified.name, email: verified.email, id: verified.id, verified: verified.verified}});
         });
      } catch (err) {
         console.log(err);
         return res.status(500).json({result: false});
      }
   },

   // edit user
   edit: async (req, res) => {
      try {
         const {email, username, password, cpassword, id} = req.body;
         let data = await User.findOne({email});
         // someone else owns the email
         if(data && data._id != id) return res.status(500).json({msg: 'email already exists'});
         // good to go
         if(password !== cpassword) return res.status(500).json({msg: 'passwords not matched'});
         let updates = null;
         if(password === '' && cpassword === '') updates = {email, username};
         else {
            const hashedPass = await bcrypt.hash(password, 10);
            updates = {email, username, password: hashedPass};
         }
         await User.findOneAndUpdate({_id: id}, updates, {new: true}, (err, data) => {
            if(err) return res.status(500).json({msg: err.message});
            if(!data) return res.status(500).json({msg: 'some error occured'});
            return res.json({msg: 'success'});
         });
      } catch (err) {
         return res.status(500).json({msg: err.message});
      }
   },

   // email confirm
   emailConfirm: async (req, res) => {
      try {
         const emailtoken = req.params.token;
         const email = emailtoken.substring(emailtoken.indexOf('_') + 1);
         await User.findOneAndUpdate({email, emailtoken}, {emailconfirm: true}, {new: true}, (err, data) => {
            if(err) return res.status(500).json({msg: err.message});
            if(!data) return res.status(404).json({msg: "token invalid"});
            if(data) return res.send("<p>Wola !! email verified successfully. You can login now :)</p> <a href='https://temp-mern-note.netlify.app/mail-activated'>Go to login page</a>");
         });
      } catch (err) {
         return res.status(500).json({msg: err.message});
      }
   },

   // resend email
   resendEmail: async (req, res) => {
      try {
         const {email, id} = req.user;
         const data = await User.findOne({_id: id, email});
         if(!data) return res.status(404).json({msg: "Not found"});
         if(data) {
            sendEmailVerifyMail(data.username, data.email, data.emailtoken);
            return res.json({msg: "email sent"});
         }
      } catch (err) {
         return res.status(500).json({msg: err.message});
      }
   },
};

// exports
module.exports = userCtrl;