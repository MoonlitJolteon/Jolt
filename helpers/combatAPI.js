const axios = require("axios");
const cache = require("./cache");

COMBAT_URL = "https://ecranked.ddns.net/api/v1/"

async function getPlayer(playerName) {
    let response = await axios({
        method: "GET",
        url: `${COMBAT_URL}user/${playerName}`
    });
    return response.data;
}

async function getPlayerList() {
    let response = await axios({
        method: "GET",
        url: `${COMBAT_URL}user/@all`
    });
    return response.data;
}

module.exports = {
    async getPlayerListCache() {
        const players = await cache.fetch('ecr/teamlist', getPlayerList);
        return players;
    },

    async getPlayerCache(playerName) {
        const player = await cache.fetch(`ecr/players/${playerName.toLowerCase()}`, getPlayer, playerName);
        return player;
    },
    
    getLoadout(bitmap) {
        const weapons = ["Pulsar", "Nova", "Comet", "Meteor"];
        const ordnance = ["Detonator", "Stun Field", "Arc Mine", "Instant Repair"];
        const tacMod = ["Repair Matrix", "Threat Scanner", "Energy Barrier", "Phase Shift"];

        const obj = {
            weapon: weapons[bitmap >> 4],
            ordnance: ordnance[(bitmap & 15) >> 2],
            tacMod: tacMod[bitmap & 3]
        }

        return obj;
    }
}