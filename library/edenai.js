const request = require('request');


const runEden = async (input, source_language, target_language) => {

    const sdk = require('api')('xxx');
 
    sdk.auth('xxx');
    
    await sdk.translation_automatic_translation_create({
        response_as_dict: true,
        attributes_as_list: false,
        show_original_response: false,
        providers: 'openai',
        text: input,
        source_language: source_language,
        target_language: target_language
    })
    .then(({ data }) => {console.log(data.openai.text);})
    .catch(err => console.error(err));

};


module.exports = {
    runEden: runEden
}

















