//importing modules
import express from "express"
import path from "path"
import exphbs from "express-handlebars"

// Express server's instance
const app = express();

const PORT = process.env.PORT || 3000;

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static("images"));

app.get("/stats/withTeam", (req, res) => {
    res.render("statsLayout", {
        "name": "MoonlitJolteon",
        "avatarSource": "https://www.vrmasterleague.com//images/logos/users/35da6bcc-ac42-44a4-8560-27ecc4a4a091.png",
        "teamExists": true,
        "logoSource": "https://www.vrmasterleague.com//images/logos/teams/262c0846-9f88-4472-ad9e-f038c214442a.png",
        "teamName": "Nani Reforged",
        "score": {
            "mmr": true,
            "score": "1100"
        },
        "teamWL": "5-0-7",
        "username": "MoonlitJolteon",
        "division": "https://www.vrmasterleague.com//images/div_silver_1_40.png",
        "panel": "style=\"background: #b3b3b3d1 !important;\"",
        "background": "style=\"border-color: #b3b3b3 !important; background-color: #444444 !important;\"",
        "country": "us",
        "playerStats": {
            "Level": "50",
            "Goals": "302",
            "Points": "723",
            "Two-Pointers": "209",
            "Three-Pointers": "93",
            "Estimated-Height": "1.84 m (6' 0\")",
            "Dominant-Hand": "Right (16% left handed)",
            "Plays-Inverted": "Non-Inverted(2% inverted)",
            "Play-Time": "26.2 hr",
            "Games": "319",
            "Wins": "182",
            "Assists": "152",
            "Shots-Taken": "685",
            "Saves": "182",
            "Stuns": "2913",
            "Steals": "258",
            "Possesion-Time": "4.4 hr",
            "Late-Joins": "None",
            "Early-Quits": "None",
            "Win-Rate": "57.05%",
            "Win-Rate-Last-Fifty--Games": "66%",
            "Goal-Percentage": "44.1%",
            "Goal-Avg": "0.95",
            "Point-Avg": "2.27",
            "Shot-Attempts-Avg": "2.15",
            "Save-Avg": "0.57",
            "Stun-Avg": "9.13",
            "Steal-Avg": "0.81",
            "Assist-Avg": "0.48",
            "Three-Pointer-Ratio": "31%",
            "Avg-Speed": "4.9 m/s",
            "Avg-Throw-Speed": "9.4 m/s",
            "Backboard-Rate": "71.9%",
            "Avg-Goal-Speed": "13.0 m/s",
            "Avg-Goal-Angle": "38.5°",
            "Avg-Goal-Distance": "6.5 m"
        }
    }
    );
});
app.get("/stats/withoutTeam", (req, res) => {
    res.render("statsLayout", {
        "name": "MoonlitJolteon",
        "avatarSource": "https://www.vrmasterleague.com//images/logos/users/35da6bcc-ac42-44a4-8560-27ecc4a4a091.png",
        "teamExists": false,
        "logoSource": "https://www.vrmasterleague.com//images/logos/teams/262c0846-9f88-4472-ad9e-f038c214442a.png",
        "teamName": "Nani Reforged",
        "score": {
            "mmr": true,
            "score": "1100"
        },
        "teamWL": "5-0-7",
        "username": "MoonlitJolteon",
        "division": "https://www.vrmasterleague.com//images/div_silver_1_40.png",
        "panel": "style=\"background: #b3b3b3d1 !important;\"",
        "background": "style=\"border-color: #b3b3b3 !important; background-color: #444444 !important;\"",
        "country": "us",
        "playerStats": {
            "Level": "50",
            "Goals": "302",
            "Points": "723",
            "Two-Pointers": "209",
            "Three-Pointers": "93",
            "Estimated-Height": "1.84 m (6' 0\")",
            "Dominant-Hand": "Right (16% left handed)",
            "Plays-Inverted": "Non-Inverted(2% inverted)",
            "Play-Time": "26.2 hr",
            "Games": "319",
            "Wins": "182",
            "Assists": "152",
            "Shots-Taken": "685",
            "Saves": "182",
            "Stuns": "2913",
            "Steals": "258",
            "Possesion-Time": "4.4 hr",
            "Late-Joins": "None",
            "Early-Quits": "None",
            "Win-Rate": "57.05%",
            "Win-Rate-Last-Fifty--Games": "66%",
            "Goal-Percentage": "44.1%",
            "Goal-Avg": "0.95",
            "Point-Avg": "2.27",
            "Shot-Attempts-Avg": "2.15",
            "Save-Avg": "0.57",
            "Stun-Avg": "9.13",
            "Steal-Avg": "0.81",
            "Assist-Avg": "0.48",
            "Three-Pointer-Ratio": "31%",
            "Avg-Speed": "4.9 m/s",
            "Avg-Throw-Speed": "9.4 m/s",
            "Backboard-Rate": "71.9%",
            "Avg-Goal-Speed": "13.0 m/s",
            "Avg-Goal-Angle": "38.5°",
            "Avg-Goal-Distance": "6.5 m"
        }
    }
    );
});
app.get("/upcoming", (req, res) => {
    res.render("teamUpcomingMatches", {
        "logoSource": "https://www.vrmasterleague.com//images/logos/teams/262c0846-9f88-4472-ad9e-f038c214442a.png",
        "teamName": "Nani Reforged",
        "score": {
            "mmr": true,
            "score": "1100"
        },
        "teamWL": "5-0-7",
        "divisionURL": "https://www.vrmasterleague.com//images/div_silver_1_40.png",
        "division": "Silver 1",
        "panel": "style=\"background: #b3b3b3d1 !important;\"",
        "background": "style=\"border-color: #b3b3b3 !important; background-color: #444444 !important;\"",
        "matches": [
            {
                "teams": {
                    "homeTeam": "Derfs",
                    "awayTeam": "Nani Reforged"
                },
                "scheduled": false,
                "scheduledText": "not-scheduled",
                "match": {
                    "id": "8smYeh7ylXaiGN0OMYjcqw2",
                    "homeTeam": {
                        "id": "tIEsJ1Sa9gmQSJxgOBsogw2",
                        "name": "Derfs",
                        "logo": "/images/logos/teams/f23b01c7-9e61-41e2-99b6-81aaa2f18fed.png",
                        "regionID": "cgq81KqhuZCnkrMnkt_vTw2",
                        "region": "America West"
                    },
                    "awayTeam": {
                        "id": "5pWkAiNpqnXEimET88jUNg2",
                        "name": "Nani Reforged",
                        "logo": "/images/logos/teams/262c0846-9f88-4472-ad9e-f038c214442a.png",
                        "regionID": "BEllLIXSWM8ZfE4uuRbmCQ2",
                        "region": "America East"
                    },
                    "castingInfo": {
                        "channel": null,
                        "casterID": null,
                        "caster": null,
                        "coCasterID": null,
                        "coCaster": null,
                        "cameramanID": null,
                        "cameraman": null,
                        "postGameInterviewID": null,
                        "postGameInterview": null
                    },
                    "homeBetCount": 0,
                    "awayBetCount": 1,
                    "castUpvotes": 3,
                    "currentUserVotedTeamID": null,
                    "currentUserUpvotedCast": false,
                    "dateScheduled": "2021-09-20 13:00"
                },
                "date": "Sep 20",
                "time": "09:00AM"
            },
            {
                "teams": {
                    "homeTeam": "Immersion",
                    "awayTeam": "Nani Reforged"
                },
                "scheduled": true,
                "scheduledText": "scheduled",
                "match": {
                    "id": "uK0zbHgfnqFZiB51QBEP0w2",
                    "homeTeam": {
                        "id": "vgtJYXL9aiDKgG5H1QaHdg2",
                        "name": "Immersion",
                        "logo": "/images/logos/teams/fb6d852b-560d-4156-ae24-16b643fc9965.png",
                        "regionID": "BEllLIXSWM8ZfE4uuRbmCQ2",
                        "region": "America East"
                    },
                    "awayTeam": {
                        "id": "5pWkAiNpqnXEimET88jUNg2",
                        "name": "Nani Reforged",
                        "logo": "/images/logos/teams/262c0846-9f88-4472-ad9e-f038c214442a.png",
                        "regionID": "BEllLIXSWM8ZfE4uuRbmCQ2",
                        "region": "America East"
                    },
                    "castingInfo": {
                        "channel": null,
                        "casterID": null,
                        "caster": null,
                        "coCasterID": null,
                        "coCaster": null,
                        "cameramanID": null,
                        "cameraman": null,
                        "postGameInterviewID": null,
                        "postGameInterview": null
                    },
                    "homeBetCount": 1,
                    "awayBetCount": 2,
                    "castUpvotes": 9,
                    "currentUserVotedTeamID": null,
                    "currentUserUpvotedCast": false,
                    "dateScheduled": "2021-09-24 00:00"
                },
                "date": "Sep 23",
                "time": "8:00PM"
            },
            {
                "teams": {
                    "homeTeam": "Immersion",
                    "awayTeam": "Nani Reforged"
                },
                "scheduled": true,
                "scheduledText": "scheduled",
                "match": {
                    "id": "uK0zbHgfnqFZiB51QBEP0w2",
                    "homeTeam": {
                        "id": "vgtJYXL9aiDKgG5H1QaHdg2",
                        "name": "Immersion",
                        "logo": "/images/logos/teams/fb6d852b-560d-4156-ae24-16b643fc9965.png",
                        "regionID": "BEllLIXSWM8ZfE4uuRbmCQ2",
                        "region": "America East"
                    },
                    "awayTeam": {
                        "id": "5pWkAiNpqnXEimET88jUNg2",
                        "name": "Nani Reforged",
                        "logo": "/images/logos/teams/262c0846-9f88-4472-ad9e-f038c214442a.png",
                        "regionID": "BEllLIXSWM8ZfE4uuRbmCQ2",
                        "region": "America East"
                    },
                    "castingInfo": {
                        "channel": null,
                        "casterID": null,
                        "caster": null,
                        "coCasterID": null,
                        "coCaster": null,
                        "cameramanID": null,
                        "cameraman": null,
                        "postGameInterviewID": null,
                        "postGameInterview": null
                    },
                    "homeBetCount": 1,
                    "awayBetCount": 2,
                    "castUpvotes": null,
                    "currentUserVotedTeamID": null,
                    "currentUserUpvotedCast": false,
                    "dateScheduled": "2021-09-24 00:00"
                },
                "date": "Sep 23",
                "time": "8:00PM"
            }
        ],
        "rank": 232
    })
})

// Listening
app.listen(PORT, () => console.log(`Server started running on PORT ${PORT}`));