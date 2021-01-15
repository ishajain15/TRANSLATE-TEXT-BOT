const Snoowrap = require('snoowrap');
const { CommentStream, InboxStream } = require('snoostorm');

const client = new Snoowrap({
    userAgent: 'translate-text',
    clientId: 'GVdDOS6abpCaCA',
	clientSecret: 'cHMzGT8LqqwK0d6ndM5WGPyR2B5JAA',
	username: 'translate-text',
	password: '!translate776'
});

/* const cld = require('cld');
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

async function test(lang) {
    let result;
    try {
        result = await translate('I spea Dutch', {to: ISO6391.getCode(lang)});
    }
    catch (err) { //error not being catched
        console.log("CANNOT DETECT LANGUAGE :(");
        return;
    }
    console.log('Did you mean \'' + result.from.text.value + '\'?');
    console.log('Detected language: ' + ISO6391.getName(result.from.language.iso));
    console.log('Translating to ' + lang + ': ' + result.text);
}
test('French');

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
