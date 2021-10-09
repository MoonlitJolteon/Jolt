const axios = require("axios");
const cache = require("./cache")

BASE_URL = "https://api.vrmasterleague.com"

 async function findPlayer(playerName) {
    let response = await axios({
      method: "GET",
      url: `${BASE_URL}/EchoArena/Players/Search`,
      params: {
        name: playerName
      }
    })
    return response.data;
  }

  async function getTeams() {
    let response = await axios({
      method: "GET",
      url: `${BASE_URL}/EchoArena/Players/`
    })
    return response.data;
  }

  async function getTeamID(teamName) {
    let response = await axios({
      method: "GET",
      url: `${BASE_URL}/EchoArena/Teams/Search`,
      params: {
        name: teamName
      }
    })
    return response.data
  }

  async function getTeamInfo(teamID) {
    let response = await axios({
      method: "GET",
      url: `${BASE_URL}/Teams/${teamID}`
    })
    return response.data
  }

  async function getTeamPlayers(teamID) {
    let response = await axios({
      method: "GET",
      url: `${BASE_URL}/Teams/${teamID}/Players/`
    })
    return response.data;
  }

  async function getTeamHistoricMatches(teamID) {
    let response = await axios({
      method: "GET",
      url: `${BASE_URL}/Teams/${teamID}/Matches/History`
    });

    return response.data
  }

  async function getTeamUpcomingMatches(teamID) {
    let response = await axios({
      method: "GET",
      url: `${BASE_URL}/Teams/${teamID}/Matches/Upcoming`
    });

    return response.data
  }

  async function compareTeams(teamName1, teamName2) {
    let ONE_DAY = (24 * (60 * (60 * (60 * 1000 /* 1 Second */) /* 1 Minute */) /* 1 hour */) /* 1 Day */);
    let team1 = await cache.fetchCustomExpire(`vrml/Teams/teamIDs/${teamName1.toLowerCase()}`, async (teamName) => {
      let response = await axios({
        method: "GET",
        url: `${BASE_URL}/EchoArena/Teams/Search`,
        params: {
          name: teamName
        }
      })
      return response.data
    }, teamName1, ONE_DAY * 7);
    let team2 = await cache.fetchCustomExpire(`vrml/Teams/teamIDs/${teamName2.toLowerCase()}`, async (teamName) => {
      let response = await axios({
        method: "GET",
        url: `${BASE_URL}/EchoArena/Teams/Search`,
        params: {
          name: teamName
        }
      })
      return response.data
    }, teamName2, ONE_DAY * 7);

    let response = await axios({
      method: "GET",
      url: `${BASE_URL}/Teams/${team1[0].id}/${team2[0].id}/`
    })

    return response.data;
  }

  async function getPlayer(playerName) {
    let ONE_DAY = (24 * (60 * (60 * (60 * 1000 /* 1 Second */) /* 1 Minute */) /* 1 hour */) /* 1 Day */);

    let player = await cache.fetchCustomExpire(`vrml/playerData/${playerName}`, async (playerName) => {
      let response = await axios({
        method: "GET",
        url: `${BASE_URL}/EchoArena/Players/Search`,
        params: {
          name: playerName
        }
      }).catch(e => {
        console.error(e)
        return { data: null }
      })
      return response.data;
    }, playerName, ONE_DAY * 7);
    if (player[0] == undefined) return;

    let response = await axios({
      method: "GET",
      url: `${BASE_URL}/Players/${player[0].id}`
    })
    return response.data;
  }

module.exports = {
  async getTeamInfoCache(teamName) {
    let ONE_DAY = (24 * (60 * (60 * (60 * 1000 /* 1 Second */) /* 1 Minute */) /* 1 hour */) /* 1 Day */);

    let data = await cache.fetchCustomExpire(`vrml/Teams/teamIDs/${teamName.toLowerCase()}`, getTeamID, teamName, ONE_DAY * 7);

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
    let data = await cache.fetchTwoArgs(`vrml/Comparisons/${teamName1.toLowerCase()}-${teamName2.toLowerCase()}`, this.compareTeams, teamName1, teamName2);
    return data;
  },

  async getTeamPlayersCache(teamID) {
    let data = await cache.fetch(`vrml/Teams/${teamID}/Players`, getTeamPlayers, teamID);
    return data;
  },

  async getPlayerCache(playerName) {
    let ONE_DAY = (24 * (60 * (60 * (60 * 1000 /* 1 Second */) /* 1 Minute */) /* 1 hour */) /* 1 Day */);
    let data = await cache.fetchCustomExpire(`vrml/detailedPlayerData/${playerName}`, getPlayer, playerName, ONE_DAY);
    if (data.id == undefined) data = "Invalid🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚";
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
    let ONE_DAY = (24 * (60 * (60 * (60 * 1000 /* 1 Second */) /* 1 Minute */) /* 1 hour */) /* 1 Day */);
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
    data.forEach(team => {
      team.players.forEach(player => {
        if (player.name == playerName) {
          teamName = team.name;
        }
      })
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