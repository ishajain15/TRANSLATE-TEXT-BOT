const Snoowrap = require('snoowrap');
const { CommentStream, InboxStream } = require('snoostorm');

const client = new Snoowrap({
    userAgent: 'translate-text',
    clientId: 'GVdDOS6abpCaCA',
	clientSecret: 'cHMzGT8LqqwK0d6ndM5WGPyR2B5JAA',
	username: 'translate-text',
	password: '!translate776'
});

const cld = require('cld');
async function testCld() {
    let result;
    try {
        result = await cld.detect('Bonjour mon ami');
    }
    catch (err) {
        console.log("Cannot detect language");
        return;
    }
    console.log(result);
    let languageName = result.languages[0].name;
    console.log('Detected language: ' + languageName);
}
testCld();

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
