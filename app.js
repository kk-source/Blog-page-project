const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();
const dotenv = require('dotenv').config();
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({extended:false}));

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const postSchema = new mongoose.Schema({
    title: String,
    body: String,
})
// const posts = [{title:'Home', body:homeStartingContent}];
const post = mongoose.model('posts', postSchema);
// mongoose.connect("mongodb://localhost:27017/postDB");
mongoose.connect(process.env.MONGO_URL);

app.get('/', async function(req, res){
    await post.find({}, async function(err, posts){
        if (posts.length === 0){
            const item = new post({
                title: 'Home',
                body: homeStartingContent,
            })
            await item.save();
            res.redirect('/');
        }
        else
        res.render('home', {posts});
    }).clone();
    // runs twice so we need to use clone (1 in .find() and 2 in callback)
})

app.get('/compose', (req, res)=>{
    res.render('compose', {});
})

app.post('/compose', async function(req, res){
    const postTitle = req.body.postTitle, postBody = req.body.postBody;
    // posts.push({title:postTitle, body:postBody});
    const item = new post({
        title: _.capitalize(postTitle),
        body: postBody,
    });
    await item.save();
    res.redirect('/');
})

app.get('/posts/:id', async (req, res)=>{
    // const title = _.capitalize(req.params.post);
    const id = req.params.id;
    await post.findOne({_id:id}, function(err, found){
        if (found){
            res.render('post', {title:found.title, body:found.body});
            return false;
        }
        else{
            res.redirect('/');
        }
    }).clone();
    
})

app.get('/about', function(req, res){
    res.render('about', {aboutContent});
})

app.get('/contact', function(req, res){
    res.render('contact', {contactContent});
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
app.listen(port, ()=>{
    console.log('Server listening on ' + port);
})

/*
// Results in 'Query was already executed' error, because technically this `find()` query executes twice.
await Model.find({}, function(err, result) {});

const q = Model.find();
await q;
await q.clone(); // Can `clone()` the query to allow executing the query again
*/