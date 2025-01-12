const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    fs.readdir('tasks', function(err, files) {
        if (err) {
            console.log(err);
            return res.status(500).send('Error reading directory');
        }
        res.render('index', { files: files });
    });
});

app.post('/create', function(req, res) {
    const taskTitle = req.body.title.split(' ').join('');
    const taskDetails = req.body.details;

    fs.writeFile(`./tasks/${taskTitle}.txt`, taskDetails, function(err) {
        if (err) {
            console.log(err);
            return res.status(500).send('Error creating task');
        }
        res.redirect('/');
    });
});

app.get('/show/:filename', function(req, res) {
    fs.readFile(`./tasks/${req.params.filename}`, 'utf-8', function(err, filedata) {
        if (err) {
            console.log(err);
            return res.status(500).send('Error reading task file');
        }
        res.render('show', { filename: req.params.filename, filedata: filedata });
    });
});

app.get('/edit/:filename', function(req, res) {
    res.render('edit', { filename: req.params.filename });
});

app.post('/edit', function(req, res) {
    const oldFile = req.body.oldfile;
    const newFile = req.body.newfile.split(' ').join('');

    fs.rename(`./tasks/${oldFile}`, `./tasks/${newFile}.txt`, function(err) {
        if (err)
             {
            console.log(err);
            return res.status(500).send('Error renaming task');
        }
        res.redirect('/');
    });
});

app.get('/delete/:filename', function(req, res) {
    const filename = req.params.filename;
    fs.unlink(`./tasks/${filename}`, function(err) {
        if (err) {
            console.log(err);
            return res.status(500).send('Error deleting task');
        }
        res.redirect('/');
    });
});

app.listen(5050, function() {
    console.log('Server is running on port 5050');
});
