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

async function test(text, lang) {
    let result;
    try {
        if (ISO6391.getCode(lang) == '') throw err;
        result = await translate(text, {to: ISO6391.getCode(lang)});
    }
    catch (err) { //error not being catched
        console.log("CANNOT DETECT LANGUAGE\nPLEASE MAKE SURE YOU SPELL THE LANGUAGE CORRECTLY\n\nIF THAT'S NOT THE ISSUE, I DO NOT SUPPORT THAT LANGUAGE\nSORRY :(");
        return;
    }
    if (result.from.text.autoCorrected) console.log('Did you mean \'' + result.from.text.value + '\'?');
    console.log('Detected language: ' + ISO6391.getName(result.from.language.iso));
    console.log('Translating to ' + lang + ': ' + result.text);
}
test('Hey there, my name is Isha', 'French');

const BOT_START = Date.now() / 1000;

const comments = new CommentStream(client, {
    subreddit: 'all',
    limit: 10,
    pollTime: 10000
});

const canSummon = (msg) => {
    return msg && msg.toLowerCase().includes('/u/translate-text');
};

comments.on('item', (item) => {
    if (item.created_utc < BOT_START) return;
    if (!canSummon(item.body)) return;
    item.reply('hello world');
    console.log(item);
});
