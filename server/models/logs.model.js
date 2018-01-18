const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
    const LogSchema = new Schema({
        date: {type: Date, default: Date.now},
        type: {type: String, default: "General"},
        content: {type: String, default: null},
        user: {type: String, default: null}
    });
    
    // save the model
  module.exports = mongoose.model('Log', LogSchema);