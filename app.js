//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


mongoose.set('strictQuery', "false");

mongoose.connect('mongodb://localhost:27017/blogDB');

const postSchema = mongoose.Schema({
  title: String,
  content: String,
  truncatedContent: String
});

const Post = mongoose.model("Post", postSchema);

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var _ = require("lodash");

let posts = [];

app.get("/", function (req, res) {


  Post.find({}, function (err, foundPost) {
    console.log(foundPost)
    res.render("home", {
      startingContent: homeStartingContent,
      postsArray: foundPost,
    });
  });
});

app.get("/about", function (req, res) {
  res.render("about", {
    startingContent: aboutContent,
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    startingContent: contactContent,
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {


  const myString = req.body.postBody;
  const myTruncatedString = myString.substring(0, 100);

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    truncatedContent: myTruncatedString + "..."
  });

  post.save();

  res.redirect("/");
});

app.get("/posts/:topic", function (req, res) {
  const requestedTitle = _.capitalize(req.params.topic);

  console.log(requestedTitle);

  Post.findOne({ title: requestedTitle }, function (err, foundPost) {
    console.log(foundPost);

    if (!err) {
      if (!foundPost) {
        // creating a new list
        res.render("post", {
          title: "Dosent Exist",
          content: "You need to compose the post to see it"
        });

      } else {
        // Showing old list

        res.render("post", {
          title: foundPost.title,
          content: foundPost.content
        });
      }
    }
  });
});

app.listen(3000, function () {
  console.log("Server running on port 3000");
});
