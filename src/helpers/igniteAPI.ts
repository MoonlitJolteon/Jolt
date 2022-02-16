import axios from "axios";
import * as cache from './cache';

const ONE_SECOND = (60 * 1000 /* 1 Second */);
const ONE_MINUTE = (60 * ONE_SECOND/* 1 Minute */);
const ONE_HOUR = (60 * ONE_MINUTE/* 1 hour */);
const ONE_DAY = (24 * ONE_HOUR /* 1 Day */);
const ONE_WEEK = (7 * ONE_DAY /* 1 Week */);

const ignite_url = "https://api.ignitevr.workers.dev/";

async function getPlayer(playerName: String) {
    let response = await axios({
        method: "GET",
        url: `${ignite_url}/player_stats/${playerName}?x-api-key=${process.env.IGNITE_TOKEN}`
    }).catch(e => {

    })
    // console.log(response);
    return response != undefined ?  response.data : undefined;
}

export async function getPlayerCache(playerName: String) {
    let data = await cache.fetchCustomExpireOneArg(`ignite/${playerName}`, getPlayer, playerName, ONE_WEEK);
    return data;
}