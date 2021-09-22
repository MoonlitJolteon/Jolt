const { fetchCustomExpireTwoArgs } = require("./cache")
const rp = require('request-promise');
const cheerio = require('cheerio');
const numToWord = require("./numToWord");

const invalid = "Invalid🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚";

const getStats = async (name, db) => {
    let url = `https://ignitevr.gg/stats/player/${name}?db=${db}`
    let data;
    await rp(url).then((html) => {
        const $ = cheerio.load(html)
        if($('#echo-stats-output').text() == "\nPlayer not found!\n") data = invalid;

        let items = $('.tooltip2').text().split("\n\n");
        let stats = {};
        for(let i = 0; i < items.length; i++) {
            let statsTmp = items[i].split("\n").filter(n => n);
            if(stats[0] == undefined) return (data = invalid);
            let key = statsTmp[0].trim().replace(/[0-9]+/g, (match, token) => numToWord.convert(match));
            key = key.replace(/[ ]/g, '-');
            key = key.replace(/['\(\)]/g, '');
            stats[key] = statsTmp[1];
        }

        data = JSON.stringify(stats, null, 0);
    });
    return data;
}

module.exports = {

    async getPlayerStats(playerName) {
        
        let ONE_DAY = (24 * (60* (60 * (60 * 1000 /* 1 Second */) /* 1 Minute */) /* 1 hour */) /* 1 Day */);
        playername = playerName.toLowerCase();
        let data = await fetchCustomExpireTwoArgs(`igniteStats/${playerName}-personal`, getStats, playerName, 'personal', ONE_DAY)
        console.log(`Personal: ${data}`)
        let stats = data == invalid ? invalid : JSON.parse(data);
        
        if(stats != invalid) return stats;

        data = await fetchCustomExpireTwoArgs(`igniteStats/${playerName}-official`, getStats, playerName, 'personal', ONE_DAY)
        stats = data == invalid ? invalid : JSON.parse(data);
        return stats;
    }
}