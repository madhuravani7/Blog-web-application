import express from "express";
import bodyParser from "body-parser";


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let posts = [];

app.get("/", (req, res)=>{
    res.render("index.ejs", {posts});
})

app.get("/create", (req, res)=>{
    res.render("post.ejs")
})

app.post('/create', (req, res) => {
    const { title, content } = req.body;
    // Add the new post to the posts array (or database)
    posts.push({ title, content });
    res.redirect('/');
});

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
})