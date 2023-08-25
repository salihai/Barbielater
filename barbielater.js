const express = require("express");

const app = express();

const bodyParser = require('body-parser');
const { runGpt } = require("./library/chatgpt");
const { runEden } = require("./library/edenai");

app.use(express.urlencoded({extended: true}));

app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

require('dotenv').config();

const { MongoClient } = require("mongodb");
const url = `mongodb+srv://${process.env.user}:${process.env.password}@cluster0.ovkodvt.mongodb.net/`;
const client = new MongoClient(url);
const dbName = "barbielater";
                      
const insert = async (text) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("user");                                                                                                                                      
        let userText = {
            "text": text
        }
        await col.insertOne(userText);
        console.log("Success!");
    } catch (err) {
        console.log(err.stack);
    }
    finally {
        await client.close();
    }
};


const find = async () => {
    try{
        await client.connect();

        const db = client.db(dbName);
        const col = db.collection("user");
        const doc = col.find();
        let words = [];

        await doc.forEach((user) => {

            let sentence = user.text.toLowerCase().split(" ");

            for(let i=0; i<sentence.length; i++){

                const index = words.findIndex(item => item[0] === sentence[i]);
                
                if (index === -1) {
                    words.push([sentence[i], 1]);
                } else {
                    words[index][1] += 1;
                }

            }
        });

        console.log(words);

        let max = words[0][1];
        let repeatedIndex;

        for(let i=0; i<words.length; i++){

            if(words[i][1] > max){

                max = words[i][1];
                maxRepeated = i;
            }
        }

        console.log(words[maxRepeated]);
        
        
    }finally{
        await client.close();
    }
};


find();


app.listen(8080, () => {
    console.log("Server is Listening on port 8080");
});

app.get('/', (req, res) => {

    res.send('Welcome to Barbielater!');
    
});

app.post('/translate',  (req, res) => {

    let text = req.body.text;
    //console.log(text);
    insert(text);


    //const translate = runGpt(text, 'English', 'Turkish');
    //console.log(translate);
    
    let source_language = req.body.source_language;
    let target_language = req.body.target_language;

    runEden(text, source_language, target_language).then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).send('Something went wrong!');
    });

    //console.log(trEden);

});

app.get('/return', (req, res) => {

    res.send('Not ready yet.');

});




