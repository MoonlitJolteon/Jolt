import axios from 'axios';
import * as cache from './cache';

const ONE_SECOND = (60 * 1000 /* 1 Second */);
const ONE_MINUTE = (60 * ONE_SECOND/* 1 Minute */);
const ONE_HOUR = (60 * ONE_MINUTE/* 1 hour */);
const ONE_DAY = (24 * ONE_HOUR /* 1 Day */);
const ONE_WEEK = (7 * ONE_DAY /* 1 Day */);

const base_url = "https://api.vrmasterleague.com";

async function getSeasons(unusedParam: String) {
    let response = await axios({
        method: "GET",
        url: `${base_url}/EchoArena/Seasons`
    });
    return response.data;
}

async function findPlayer(playerName: String) {
    let response = await axios({
        method: "GET",
        url: `${base_url}/EchoArena/Players/Search`,
        params: {
            name: playerName
        }
    })
    return response.data;
}

async function getTeams() {
    let response = await axios({
        method: "GET",
        url: `${base_url}/EchoArena/Players/`
    })
    return response.data;
}

async function getTeamID(teamName: String) {
    let response = await axios({
        method: "GET",
        url: `${base_url}/EchoArena/Teams/Search`,
        params: {
            name: teamName
        }
    })
    return response.data
}

async function getTeamInfo(teamID: String) {
    let response = await axios({
        method: "GET",
        url: `${base_url}/Teams/${teamID}`
    })
    return response.data
}

async function getTeamPlayers(teamID: String) {
    let response = await axios({
        method: "GET",
        url: `${base_url}/Teams/${teamID}/Players/`
    })
    return response.data;
}

async function getTeamHistoricMatches(teamID: String) {
    let response = await axios({
        method: "GET",
        url: `${base_url}/Teams/${teamID}/Matches/History`
    });

    return response.data
}

async function getTeamUpcomingMatches(teamID: String) {
    let response = await axios({
        method: "GET",
        url: `${base_url}/Teams/${teamID}/Matches/Upcoming`
    });

    return response.data
}



export async function getTeamInfoCache(id: string) {
    let data = await cache.fetchOneArg(`vrml/Teams/${id}/Info`, getTeamInfo, id);
    return data?.team;
}

export async function searchTeamNameCache(teamName: string) {
    let data = await cache.fetchCustomExpireOneArg(`vrml/Teams/teamSearches/${teamName.toLowerCase()}`, getTeamID, teamName, ONE_WEEK);
    return data;
}

export async function getTeamMatchesCache(historic: boolean, teamID: string) {
    let data;
    if (historic) {
        data = cache.fetchOneArg(`vrml/Teams/${teamID}/HistoricMatches`, getTeamHistoricMatches, teamID);
    } else {
        data = cache.fetchOneArg(`vrml/Teams/${teamID}/UpcomingMatches`, getTeamUpcomingMatches, teamID);
    }
    return data;
}

export async function getCurrentSeasonCache() {
    let ONE_DAY = (24 * (60 * (60 * (60 * 1000 /* 1 Second */) /* 1 Minute */) /* 1 hour */) /* 1 Day */);
    let seasons = await cache.fetchCustomExpireOneArg(`vrml/seasons`, getSeasons, 'notNeeded', ONE_DAY * 30);
    return seasons[seasons.length - 1];
}