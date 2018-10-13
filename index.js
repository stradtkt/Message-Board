const mongoose = require('mongoose');
const models = require('./models');
const express = require('express');
const path = require('path');
const parser = require('body-parser');
const port = process.env.PORT || 8000;
const app = express();

mongoose.connect('mongodb://localhost:27017/message_board', {useNewUrlParser: true});
mongoose.connection.on('connected', () => console.log("MongoDB is now connected"));

let messageErrors = {},
    commentErrors = {};

app
    .set('view engine', 'ejs')
    .set('views', path.resolve('views'))
app
    .use(parser.urlencoded({extended: true}))
    .use(express.static(__dirname + "/static"))
    .use(express.static(__dirname + '/node_modules/bootstrap'))
    .use(express.static(__dirname + '/node_modules/jquery'))
    .use(express.static(__dirname + '/node_modules/popper.js'));


app.get('/', (req,res) => {
    models.Message.find({})
        .then(messages => {
            res.render('index', {messages, messageErrors, commentErrors});
            messageErrors = {};
            commentErrors = {};
        })
        .catch(console.log('Error with fetching messages'));
});

app.post('/message/new', (req, res) => {
    models.Message.create(req.body)
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
    models.Comment.create(req.body)
        .then(comment => {
            return models.Message.findByIdAndUpdate(req.params.id, {$push: {comments: comment}})
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
    console.log(`Express pp listening on port ${port}`);
});