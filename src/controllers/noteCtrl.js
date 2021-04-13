// imports
const Note = require("../models/note");

// routes
const noteCtrl = {

   // get all notes
   getAll: async (req, res) => {
      try {
         const user = req.user;
         const data = await Note.find({userid: user.id});
         if(!data) return res.status(500).json({msg: 'notes not found !'});
         return res.json(data);
      } catch (err) {
         return res.status(500).json({msg: err.message});
      }
   },

   // get a particular note
   getOne: async (req, res) => {
      try {
         const user = req.user;
         const data = await Note.findOne({$and: [{_id: req.params.id}, {userid: user.id}]});
         if(!data) return res.status(500).json({msg: 'post not found'});
         return res.json(data);
      } catch (err) {
         return res.status(500).json({msg: err.message});
      }
   },

   // post a note
   post: async (req, res) => {
      try {
         const user = req.user;
         const { title, content } = req.body;
         const newNote = new Note({ title, content, userid:user.id });
         const savedData = await newNote.save();
         if(!savedData) return res.status(500).json({msg: 'err while saving'});
         return res.json(savedData);
      } catch (err) {
         return res.status(500).json({msg: err.message});
      }
   },

   // edit a note
   edit: async (req, res) => {
      try {
         const user = req.user;
         const { title, content } = req.body;
         const updates = { title, content };
         await Note.findOneAndUpdate({$and: [{_id: req.params.id}, {userid: user.id}]}, updates, {new: true}, (err, data) => {
            if(err) return res.status(500).json({msg: err.message});
            if(!data) return res.status(500).json({msg: 'note not found'});
            return res.json(data);
         });
      } catch (err) {
         return res.status(500).json({msg: err.message});
      }
   },

   // delete a note
   delete: async (req, res) => {
      try {
         const data = await Note.findOneAndDelete({$and: [{_id: req.params.id}, {userid: req.user.id}]});
         if(!data) return res.status(500).json({msg: 'note not found'});
         return res.json({msg: 'note deleted'});
      } catch (err) {
         return res.status(500).json({msg: err.message});
      }
   },

   // delete all notes
   deleteAll: async (req, res) => {
      try {
         const data = await Note.deleteMany({userid: req.user.id});
         if(!data) return res.status(500).json({msg: "err occured"});
         if(data) return res.json({msg: "Notes deleted Successfully"});
      } catch (err) {
         return res.status(500).json({msg: err.message});
      }
   },
};

// exports
module.exports = noteCtrl;