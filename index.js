const mongoose = require('mongoose');
const { Schema } = mongoose;
const express = require('express');
const path = require('path');
const parser = require('body-parser');
const port = process.env.PORT || 8000;
const app = express();

mongoose.connect('mongodb://localhost:27017/message_board', {useNewUrlParser: true});
mongoose.connection.on('connected', () => console.log("MongoDB is now connected"));


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
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, 
{
    timestamps: true
});

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
    comments: [commentSchema],
    created_at: {
        type: Date,
        default: Date.now
    }
}, 
{
    timestamps: true
});
const Message = mongoose.model('Message', messageSchema);
const Comments = mongoose.model("Comment", commentSchema);




let messageErrors = {},
    commentErrors = {};

app.set('view engine', 'ejs')
app.set('views', path.resolve('views'))
app
    .use(parser.urlencoded({extended: true}))
    .use(express.static(__dirname + "/static"))
    .use(express.static(__dirname + '/node_modules/bootstrap'))
    .use(express.static(__dirname + '/node_modules/jquery'))
    .use(express.static(__dirname + '/node_modules/popper.js'));


app.get('/', (req,res) => {
    Message.find({})
        .then(messages => {
            res.render('index', {messages, messageErrors, commentErrors});
            messageErrors = {};
            commentErrors = {};
        })
        .catch(console.log('Error with fetching messages'));
});

app.post('/message/new', (req, res) => {
    Message.create(req.body)
        .then(message => res.redirect('/'))
        .catch(error => {
            messageErrors.name = req.body.name;
            messageErrors.message = req.body.message;
            messageErrors.err = Object.keys(error.errors)
                .map(key => error.errors[key].message);
            res.redirect('/');
        });
});
app.post('/message/:id', (req, res) => {
    Comments.create(req.body)
        .then(comment => {
            return Message.findByIdAndUpdate(req.params.id, {$push: {comments: comment}})
                .then(message => res.redirect('/'))
        })
        .catch(error => {
            commentErrors.id = req.params.id;
            commentErrors.name = req.params.name;
            commentErrors.comment = req.params.comment;
            commentErrors.warnings = Object.keys(error.errors)
                .map(key => error.errors[key].message);
            res.redirect('/');
        });
});

app.listen(port, () => {
    console.log(`Express app listening on port ${port}`);
});