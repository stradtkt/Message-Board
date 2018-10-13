const mongoose = require('mongoose');
const { Schema } = mongoose;


const commentSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name for the message is required'],
        trim: true,
        min: [3, 'Name has a min length of 3'],
        max: [30, 'Name has a max length of 30']
    },
    comment: {
        type: String,
        trim: true,
        required: [true, 'Comment content is required to post a message'],
        min: [10, 'Comment content has a min length of 10'],
        max: [255, 'Comment content has a max length of 255']
    }
}, 
{
    timestamps: true
});


module.exports = mongoose.model("Comment", commentSchema);
