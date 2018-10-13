const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name for the message is required'],
        trim: true,
        min: [3, 'Name has a min length of 3'],
        max: [30, 'Name has a max length of 30']
    },
    message: {
        type: String,
        trim: true,
        required: [true, 'Message content is required to post a message'],
        min: [10, 'Message content has a min length of 10'],
        max: [1000, 'Message content has a max length of 1000']
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comments'
    }]
}, 
{
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
