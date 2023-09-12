const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const { runGpt } = require("./library/chatgpt");
const { runEden } = require("./library/edenai");
const stopwords = require('stopword');
const axios = require('axios');

app.use(express.urlencoded({extended: true}));

app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

require('dotenv').config();

const { MongoClient } = require("mongodb");
const url = `mongodb+srv://${process.env.user}:${process.env.password}@cluster0.ovkodvt.mongodb.net/`;
const client = new MongoClient(url);
const dbName = "barbielater";
                      
const insert = async (text, reqHead) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("user");                                                                                                                                      
        let userText = {
            "text": text,
            "connection": reqHead.connection, 
            "content-length": reqHead["content-length"],
            "sec-ch-ua": reqHead["sec-ch-ua"].split(",")[0], 
            "content-type": reqHead["content-type"],
            "sec-ch-ua-platform": reqHead["sec-ch-ua-platform"], 
            "accept-language": reqHead["accept-language"].split(",")[0],
            "user-agent": reqHead["user-agent"].split(" ")[0]
        }
        await col.insertOne(userText);
        //console.log("Success!");
    } catch (err) {
        console.log(err.stack);
    }
    finally {
        await client.close();
    }
};

const stopWords = stopwords.eng;

const find = async () => {
    try{
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("user");
        const doc = col.find();

        let words = [];

        await doc.forEach((user) => {

            let sentence = user.text.toLowerCase().split(" ");

            sentence = stopwords.removeStopwords(sentence, stopWords);

            //console.log(sentence);

            for(let i=0; i<sentence.length; i++){

                const index = words.findIndex(item => item[0] === sentence[i]); 

                if (index === -1) {
                    words.push([sentence[i], 1]);
                } else {
                    words[index][1] += 1;
                }
            }
        });

        //console.log(words);

        let max = words[0][1];

        let repeatedIndex;

        for(let i=0; i<words.length; i++){

            if(words[i][1] > max){

                max = words[i][1];
                maxRepeated = i;
            }
        }

        //console.log(words[maxRepeated]);

        const topTen = (words.slice().sort((a,b) => b[1] - a[1])).slice(0,5);

        //console.log(topTen);

        return topTen;
        
    }catch (err) {
        console.log(err.stack);
    }finally{
        await client.close();
    }
};

app.listen(8080, () => {
    console.log("Server is Listening on port 8080");
});

app.get('/', (req, res) => {

    res.send('Welcome to Barbielater!');
    
});


app.get('/topTen', (req, res) => {
    find().then((data) => {
        res.status(200).send(data);
    }).catch((err)=>{
        res.status(404).send("Data extraction error!");
    })
});



app.get('/wordMean', (req, res) => {
    const word = req.query.word;
    //console.log(word);
    axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
   .then((response) => {
        if(response){
            res.status(200).send(response.data);
        }
   }).catch(() => {
        res.status(400).send({});
   });
});

app.post('/translate',  (req, res) => {

    let text = req.body.text;
    //console.log(text);
    insert(text, req.headers);

    //const translate = runGpt(text, 'English', 'Turkish');
    //console.log(translate);
    
    let source_language = req.body.source_language;
    let target_language = req.body.target_language;

    runEden(text, source_language, target_language).then((data) => {
        res.status(200).send(data);
    }).catch((err) => {
        res.status(500).send('Something went wrong!');
    });

    //console.log(trEden);


    
});



app.get('/return', (req, res) => {

    res.send('Not ready yet.');

});




