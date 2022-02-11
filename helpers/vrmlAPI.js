const axios = require("axios");
const cache = require("./cache")
const { MessageEmbed } = require('discord.js');

const base_url = "https://api.vrmasterleague.com"

async function getSeasons(unusedParam) {
  let response = await axios({
    method: "GET",
    url: `${base_url}/EchoArena/Seasons`
  });
  return response.data;
}

async function findPlayer(playerName) {
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

async function getTeamID(teamName) {
  let response = await axios({
    method: "GET",
    url: `${base_url}/EchoArena/Teams/Search`,
    params: {
      name: teamName
    }
  })
  return response.data
}

async function getTeamInfo(teamID) {
  let response = await axios({
    method: "GET",
    url: `${base_url}/Teams/${teamID}`
  })
  return response.data
}

async function getTeamPlayers(teamID) {
  let response = await axios({
    method: "GET",
    url: `${base_url}/Teams/${teamID}/Players/`
  })
  return response.data;
}

async function getTeamHistoricMatches(teamID) {
  let response = await axios({
    method: "GET",
    url: `${base_url}/Teams/${teamID}/Matches/History`
  });

  return response.data
}

async function getTeamUpcomingMatches(teamID) {
  let response = await axios({
    method: "GET",
    url: `${base_url}/Teams/${teamID}/Matches/Upcoming`
  });

  return response.data
}

async function compareTeams(teamName1, teamName2) {
  let ONE_DAY = (24 * (60 * (60 * (60 * 1000 /* 1 Second */) /* 1 Minute */) /* 1 hour */) /* 1 Day */);
  let team1 = await cache.fetchCustomExpire(`vrml/Teams/teamIDs/${teamName1.toLowerCase()}`, async (teamName) => {
    let response = await axios({
      method: "GET",
      url: `${base_url}/EchoArena/Teams/Search`,
      params: {
        name: teamName
      }
    })
    return response.data
  }, teamName1, ONE_DAY * 7);
  let team2 = await cache.fetchCustomExpire(`vrml/Teams/teamIDs/${teamName2.toLowerCase()}`, async (teamName) => {
    let response = await axios({
      method: "GET",
      url: `${base_url}/EchoArena/Teams/Search`,
      params: {
        name: teamName
      }
    })
    return response.data
  }, teamName2, ONE_DAY * 7);
  return
  let response = await axios({
    method: "GET",
    url: `${base_url}/Teams/${team1[0].teamID}/${team2[0].teamID}/`
  })
  return response.data;
}

module.exports = {

  async getCurrentSeasonCache() {
    let ONE_DAY = (24 * (60 * (60 * (60 * 1000 /* 1 Second */) /* 1 Minute */) /* 1 hour */) /* 1 Day */);
    let seasons = await cache.fetchCustomExpire(`vrml/seasons`, getSeasons, 'notNeeded', ONE_DAY * 30);
    return seasons[seasons.length - 1];
  },

  async searchTeamNameCache(teamName) {
    let ONE_DAY = (24 * (60 * (60 * (60 * 1000 /* 1 Second */) /* 1 Minute */) /* 1 hour */) /* 1 Day */);
    let data = await cache.fetchCustomExpire(`vrml/Teams/teamSearches/${teamName.toLowerCase()}`, getTeamID, teamName, ONE_DAY * 7);
    return data;
  },

  async getTeamInfoCache(teamName) {
    let ONE_DAY = (24 * (60 * (60 * (60 * 1000 /* 1 Second */) /* 1 Minute */) /* 1 hour */) /* 1 Day */);

    let data = await cache.fetchCustomExpire(`vrml/Teams/teamSearches/${teamName.toLowerCase()}`, getTeamID, teamName, ONE_DAY * 7);

    if (data[0] == undefined) return "Invalid🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚";
    data = await cache.fetch(`vrml/Teams/${data[0].id}/Info`, getTeamInfo, data[0].id)
    return data;
  },

  async getTeamInfoIDCache(id) {
    let ONE_DAY = (24 * (60 * (60 * (60 * 1000 /* 1 Second */) /* 1 Minute */) /* 1 hour */) /* 1 Day */);
    data = await cache.fetch(`vrml/Teams/${id}/Info`, getTeamInfo, id)
    return data;
  },

  async compareTeamsCache(teamName1, teamName2) {
    let data = await cache.fetchTwoArgs(`vrml/Comparisons/${teamName1.toLowerCase()}-${teamName2.toLowerCase()}`, compareTeams, teamName1, teamName2);
    return data;
  },

  async getTeamPlayersCache(teamID) {
    let data = await cache.fetch(`vrml/Teams/${teamID}/Players`, getTeamPlayers, teamID);
    return data;
  },

  async getPlayerAvatarCache(playerName) {
    let ONE_DAY = (24 * (60 * (60 * (60 * 1000 /* 1 Second */) /* 1 Minute */) /* 1 hour */) /* 1 Day */);
    let url = "Invalid🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚";
    let data = await cache.fetchCustomExpire(`vrml/playerData/${playerName}`, findPlayer, playerName, ONE_DAY * 7);
    if (data[0] != undefined) url = `https://www.vrmasterleague.com/${data[0].image}`;
    return url;
  },

  async getPlayerIDCache(playerName) {
    let ONE_DAY = (24 * (60 * (60 * (60 * 1000 /* 1 Second */) /* 1 Minute */) /* 1 hour */) /* 1 Day */)
    let data = await cache.fetchCustomExpire(`vrml/playerData/${playername}`, findPlayer, playerName, ONE_DAY * 7);
    return data[0].id;
  },
  
  async getTeamsCache() {
    let data = await cache.fetch("vrml/teams", getTeams)
    return data
  },

  async getPlayerTeamCache(playerName) {
    let data = await cache.fetch("vrml/teams", getTeams)
    let teamName = "Invalid🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚";
    data.players.forEach(player => {
      console.log(player.playerName);
      if(player.playerName == playerName) return player.teamNameFull;
    })
    return teamName;
  },


  async getTeamMatchesCache(historic, teamID) {
    let data;
    if (historic) {
      data = cache.fetch(`vrml/Teams/${teamID}/HistoricMatches`, getTeamHistoricMatches, teamID);
    } else {
      data = cache.fetch(`vrml/Teams/${teamID}/UpcomingMatches`, getTeamUpcomingMatches, teamID);
    }

    return data;
  }
}