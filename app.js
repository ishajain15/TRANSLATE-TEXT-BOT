const Snoowrap = require('snoowrap');
const { CommentStream, InboxStream } = require('snoostorm');

const client = new Snoowrap({
    userAgent: 'translate-text',
    clientId: 'GVdDOS6abpCaCA',
	clientSecret: 'cHMzGT8LqqwK0d6ndM5WGPyR2B5JAA',
	username: 'translate-text',
	password: '!translate776'
});

/* 
//NOT A VERY GOOD DETECTOR, 
//CANNOT DETECT LANGUAGE IF ONE WORD IS GIVEN AS INPUT
const cld = require('cld');
async function testCld(txt) {
    let result;
    try {
        result = await cld.detect(txt);
    }
    catch (err) {
        console.log("CANNOT DETECT LANGUAGE :(");
        return;
    }
    console.log(result);
    let languageName = result.languages[0].name;
    console.log('DETECTED LANGUAGE: ' + languageName);
}
testCld('Bonjour');
*/

// If you've installed from npm, do:
const translate = require('@k3rn31p4nic/google-translate-api');
const ISO6391 = require('iso-639-1');

async function translateText(item, text, lang) {
    let result;
    try {
        let isocode = ISO6391.getCode(lang);
        if (isocode == '') throw err;
        if (isocode == 'zh') isocode = 'zh-cn';
        result = await translate(text, {to: isocode});
    }
    catch (err) { //error not being catched
        item.reply("CANNOT DETECT LANGUAGE\n\nPLEASE MAKE SURE YOU SPELL THE LANGUAGE CORRECTLY\n\nIF THAT'S NOT THE ISSUE, I DO NOT SUPPORT THAT LANGUAGE\n\nSORRY :(");
        return;
    }
    let response = '';
    if (result.from.text.autoCorrected) response = response.concat('Did you mean \'' + result.from.text.value + '\'?\n\n');
    if (result.from.language.iso != 'zh-CN' && result.from.language.iso != 'zh-TW') response = response.concat('Detected language: ' + ISO6391.getName(result.from.language.iso) + '\n');
    else response = response.concat('Detected language: Chinese\n')
    response = response.concat('\nTranslating to ' + lang + ': ' + result.text);
    console.log('RESPONSE: ' + response);
    item.reply(response);
}
//translateText('Hello my freind, what is the date?', 'French');

const BOT_START = Date.now() / 1000;

const comments = new CommentStream(client, {
    subreddit: 'testingground4bots',
    limit: 10,
    pollTime: 2000
});

const canSummon = (msg) => {
    return msg && msg.toLowerCase().includes('translate-text');
};

comments.on('item', (item) => {
    let language = 'English';
    if (item.created_utc < BOT_START) return;
    if (!canSummon(item.body)) return;
    console.log(item);
    if (item.body.replace('translate-text', '').trim() != '') {
        language = item.body.replace('translate-text', '').trim();
    }
    //item.reply('hello world');
    let prefix = item.parent_id.substring(0,3);
    if (prefix == 't3_') {
        console.log('t3_');
        client.getSubmission(item.parent_id).fetch().then(submission => {
            console.log(submission.selftext);
            translateText(item, submission.selftext, language);
        });
    } else {
        console.log('t1_');
        client.getComment(item.parent_id).fetch().then(parentComment => {
            console.log(parentComment.body);
            translateText(item, parentComment.body, language);
        });
    }
});
