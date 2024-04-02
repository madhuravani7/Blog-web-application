import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, join(__dirname, 'public/images'));
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

let posts = [];

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("index", { posts });
});

app.get("/create", (req, res) => {
    res.render("post");
});

app.post('/create', upload.single('image'), (req, res) => {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;
    posts.push({ title, content, image });
    res.redirect('/');
});

app.get('/edit/:index', (req, res) => {
    const index = req.params.index;
    const post = posts[index];
    res.render('edit', { post, index });
});

// Update route
app.post('/edit/:index', upload.single('image'), (req, res) => {
    const index = req.params.index;
    const { title, content } = req.body;
    let image = req.body.currentImage; // Get the current image filename from the form data
    
    // Check if a new image has been uploaded
    if (req.file) {
        image = req.file.filename; // Update the image filename with the new uploaded image
    }

    // Update the post based on index
    posts[index] = { title, content, image };
    
    res.redirect('/');
});


app.post('/delete/:index', (req, res) => {
    const index = req.params.index;
    posts.splice(index, 1);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
