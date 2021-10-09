const axios = require("axios");
const cache = require("./cache")

IGNITE_URL = "https://api.ignitevr.workers.dev/"

const invalid = "Invalid🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚";

async function getPlayer(playerName) {
  let response = await axios({
    method: "GET",
    url: `${IGNITE_URL}/player_stats/${playerName}?x-api-key=${process.env.IGNITE_TOKEN}`
  })

  // if(response.data.error) return "Invalid🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚";
  return response.data;
}

module.exports = {
  async getPlayerCache(playerName) {
    let ONE_DAY = (24 * (60 * (60 * (60 * 1000 /* 1 Second */) /* 1 Minute */) /* 1 hour */) /* 1 Day */);
    let data = await cache.fetchCustomExpire(`ignite/${playerName}`, getPlayer, playerName, ONE_DAY * 7);
    return data;
  }
}