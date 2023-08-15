const request = require('request');

const sdk = require('api')('@eden-ai/v2.0#1a6e2ell3ljq2h');

require('dotenv').config();

const runEden = async (input, source_language, target_language) => {
 
    sdk.auth(process.env.API_KEY_EDEN);
    
    const translateResult = await sdk.translation_automatic_translation_create({
        response_as_dict: true,
        attributes_as_list: false,
        show_original_response: false,
        providers: 'openai',
        text: input,
        source_language: source_language,
        target_language: target_language
    })
    console.log(translateResult.data.openai.text);
    return translateResult.data.openai.text;
    //.then(({ data }) => {console.log(data.openai.text);})
    //.catch(err => console.error(err));

};


module.exports = {
    runEden: runEden
}

















