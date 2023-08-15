const { Configuration, OpenAIApi } = require("openai");

require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.API_KEY_CHATGPT,
});
const openai = new OpenAIApi(configuration);

const runGpt = async (input, source_language, target_language) => {

    const prompt = `Translate the following ${source_language} text to ${target_language}: ${input}`;
    
    const chatCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{"role": "system", "content": "You are a helpful assistant that translates text."},
                    {role: "user", content: prompt}],
                    max_tokens:150,
                    n:1,
                    stop:null,
                    temperature:0.5,
    });
    const translation = chatCompletion.data.choices[0].message.content;
    return translation;
}

module.exports = {
    runGpt :runGpt
}