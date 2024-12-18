const mongoose = require('mongoose');
const newsSchema = mongoose.Schema({
    title: String,
    description: {
        type: String,
        required: [true,'Please add a title']
    },
    category: String,
    source: String,
    
  },{
    timestamps: true
  }
);

module.exports = mongoose.model('news', newsSchema);