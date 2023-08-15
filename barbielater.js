const express = require("express");

const app = express();

const bodyParser = require('body-parser');
const { runGpt } = require("./library/chatgpt");
const { runEden } = require("./library/edenai");

app.use(express.urlencoded({extended: true}));

app.use(bodyParser.json());

app.listen(8080, () => {
    console.log("Server is Listening on port 8080");
});


app.get('/', (req, res) => {
    res.send('Welcome to Barbielater!');
});

 app.post('/translate',  (req, res) => {

    let text = req.body.text;
   
    //const translate = runGpt(text, 'English', 'Turkish');
    //console.log(translate);


    runEden(text, 'en', 'tr');

    //console.log(trEden);
    //res.send(trEden);

    
});

app.get('/return', (req, res) => {
    res.send('Not ready yet.');
});



