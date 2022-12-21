const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const name = process.env.name;
const password = process.env.password;
mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://" + name + ":" + password + "@cluster0.gn02jxi.mongodb.net/BlogDB");

const postSchema = {
  postTitle: {
    type: String,
    required: true
  },
  postContent: {
    type: String,
    required: true
  },
  postDate: {
    type: String,
    required: true
  },
  postTime: {
    type: String,
    required: true
  }
};

const Post = mongoose.model("Post", postSchema);

let dateOptions = {
  weekday: "long",
  day: "numeric",
  month: "numeric",
  year: "numeric"
};

app.get('/about', function(req, res) {
  res.render("about", {
    newAboutContent: aboutContent
  });
});

app.get('/contact', function(req, res) {
  res.render("contact", {
    newContactContent: contactContent
  });
});

app.get('/compose', function(req, res) {
  let today = new Date();
  let day = today.toLocaleDateString("en-GB", dateOptions);
  res.render("compose", {
    day: day
  });

});

app.post("/compose", function(req, res) {
  let currentDate = new Date();

  const newPost = new Post({
    postTitle: req.body.newTitle,
    postContent: req.body.newPost,
    postDate: currentDate.toLocaleDateString("en-GB", dateOptions),
    postTime: currentDate.toLocaleTimeString("en-GB")
  });
  newPost.save(function(err) {
    if (!err){
      res.redirect("/");}
      else {
        console.log(err);
      };
  });
});

app.get('/', function(req, res) {
  Post.find({}, function(err, foundPosts) {
    if (!err) {
      res.render("home", {
        homeStartingText: homeStartingContent,
        newPosts: foundPosts
      });
    } else {
      console.log(err);
    };
  });
});

app.get('/posts/:postName', function(req, res) {
  var requestedTitle = _.lowerCase(req.params.postName);
  Post.find({}, function(err, foundPosts) {
    foundPosts.forEach(function(post) {
      var storedTitle = _.lowerCase(post.postTitle);
      if (requestedTitle === storedTitle) {
        res.render("post", {
          newPostTitle: post.postTitle,
          newPostContent: post.postContent,
          newPostDate: post.postDate,
          newPostTime: post.postTime,
          newPostId: post._id
        });
      }
    });
  });
});

app.post("/post", function(req, res){
    Post.deleteOne({_id: req.body.delete}, function(err){})
    res.redirect("/");
  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
