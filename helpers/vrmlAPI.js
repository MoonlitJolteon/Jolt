const axios = require("axios");
const cache = require("./cache")

BASE_URL = "https://api.vrmasterleague.com"

module.exports = {
    async findPlayer(playerName) {
        let response = await axios({
            method: "GET",
            url: `${BASE_URL}/EchoArena/Players/Search`,
            params: {
                name: playerName
            }
        })
        return response.data;
    },

    async getTeams() {
        let response = await axios({
            method: "GET",
            url: `${BASE_URL}/EchoArena/Players/`
        })
        return response.data;
    },

    async getTeamID(teamName) {
        let response = await axios({
            method: "GET",
            url: `${BASE_URL}/EchoArena/Teams/Search`,
            params: {
                name: teamName
            }
        })
        return response.data
    },

    async getTeamInfo(teamID) {
        let response = await axios({
            method: "GET",
            url: `${BASE_URL}/Teams/${teamID}`
        })
        return response.data
    },

    async getTeamPlayers(teamID) {
        let response = await axios( {
            method: "GET",
            url: `${BASE_URL}/Teams/${teamID}/Players/`
        })
        return response.data;
    },

    async getTeamHistoricMatches(teamID) {
        let response = await axios({
            method: "GET",
            url : `${BASE_URL}/Teams/${teamID}/Matches/History`
        });

        return response.data
    },

    async getTeamUpcomingMatches(teamID) {
        let response = await axios({
            method: "GET",
            url : `${BASE_URL}/Teams/${teamID}/Matches/Upcoming`
        });

        return response.data
    },
    
    async compareTeams(teamName1, teamName2) {
        let ONE_DAY = (24 * (60* (60 * (60 * 1000 /* 1 Second */) /* 1 Minute */) /* 1 hour */) /* 1 Day */);
        let team1 = await cache.fetchCustomExpire(`Teams/teamIDs/${teamName1.toLowerCase()}`, async (teamName) => {
            let response = await axios({
                method: "GET",
                url: `${BASE_URL}/EchoArena/Teams/Search`,
                params: {
                    name: teamName
                }
            })
            return response.data
        }, teamName1, ONE_DAY * 7);
        let team2 = await cache.fetchCustomExpire(`Teams/teamIDs/${teamName2.toLowerCase()}`, async (teamName) => {
            let response = await axios({
                method: "GET",
                url: `${BASE_URL}/EchoArena/Teams/Search`,
                params: {
                    name: teamName
                }
            })
            return response.data
        }, teamName2, ONE_DAY * 7);

        let response = await axios( {
            method: "GET",
            url: `${BASE_URL}/Teams/${team1[0].id}/${team2[0].id}/`
        })

        return response.data;
    },

    async getPlayer(playerName) {
        let ONE_DAY = (24 * (60* (60 * (60 * 1000 /* 1 Second */) /* 1 Minute */) /* 1 hour */) /* 1 Day */);
        let player = await cache.fetchCustomExpire(`playerData/${playerName}`, async (playerName) => {
            let response = await axios({
                method: "GET",
                url: `${BASE_URL}/EchoArena/Players/Search`,
                params: {
                    name: playerName
                }
            })
            return response.data;
        }, playerName, ONE_DAY * 7);
        
        if(player[0] == undefined) return;

        let response = await axios( {
            method: "GET",
            url: `${BASE_URL}/Players/${player[0].id}`
        })
        return response.data;
    },

    async getTeamInfoCache(teamName) {
        let ONE_DAY = (24 * (60* (60 * (60 * 1000 /* 1 Second */) /* 1 Minute */) /* 1 hour */) /* 1 Day */);
        
        let data = await cache.fetchCustomExpire(`Teams/teamIDs/${teamName.toLowerCase()}`, this.getTeamID, teamName, ONE_DAY * 7);
        
        if(data[0] == undefined) return "Invalid🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚";
        data = await cache.fetch(`Teams/${data[0].id}/Info`, this.getTeamInfo, data[0].id)
        return data;
    },

    async compareTeamsCache(teamName1, teamName2) {
        let data = await cache.fetchTwoArgs(`Comparisons/${teamName1.toLowerCase()}-${teamName2.toLowerCase()}`, this.compareTeams, teamName1, teamName2);
        return data;
    },

    async getTeamPlayersCache(teamID) {
        let data = await cache.fetch(`Teams/${teamID}/Players`, this.getTeamPlayers, teamID);
        return data;
    },
    
    async getPlayerCache(playerName) {
        let ONE_DAY = (24 * (60* (60 * (60 * 1000 /* 1 Second */) /* 1 Minute */) /* 1 hour */) /* 1 Day */);
        let data = await cache.fetchCustomExpire(`detailedPlayerData/${playerName}`, this.getPlayer, playerName, ONE_DAY);
        if(data.id == undefined) data = "Invalid🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚";
        return data;
    },

    async getPlayerAvatarCache(playerName) {
        let ONE_DAY = (24 * (60* (60 * (60 * 1000 /* 1 Second */) /* 1 Minute */) /* 1 hour */) /* 1 Day */);
        let url = "Invalid🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚";
        let data = await cache.fetchCustomExpire(`playerData/${playerName}`, this.findPlayer, playerName,  ONE_DAY * 7);
        if(data[0] != undefined) url = `https://www.vrmasterleague.com/${data[0].image}`;
        return url;
    },

    async getPlayerIDCache(playerName) {
        let ONE_DAY = (24 * (60* (60 * (60 * 1000 /* 1 Second */) /* 1 Minute */) /* 1 hour */) /* 1 Day */);
        let data = await cache.fetchCustomExpire(`playerData/${playername}`, this.findPlayer, playerName, ONE_DAY * 7);
        return data[0].id;
    },

    async getTeamsCache() {
        let data = await cache.fetch("teams", this.getTeams)
        return data
    },

    async getPlayerTeamCache(playerName) {
        let data = await cache.fetch("teams", this.getTeams)
        let teamName = "Invalid🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚";
        data.forEach(team => {
            team.players.forEach(player => {
                if(player.name == playerName) {
                    teamName = team.name;
                }
            })
        })
        return teamName;
    },
    

    async getTeamMatchesCache(historic, teamID) {
        let data;
        if(historic) {
            data = cache.fetch(`Teams/${teamID}/HistoricMatches`, this.getTeamHistoricMatches, teamID);
        } else {
            data = cache.fetch(`Teams/${teamID}/UpcomingMatches`, this.getTeamUpcomingMatches, teamID);
        }
        
        return data;
    }
}