const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
let dbPath = path.join(__dirname, "./cricketTeam.db");
let db = null;
app.use(express.json());
const initializeDbAndServer = async () => {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  app.listen(3000, () => {
    console.log("server running at http://localhost:3000/");
  });
};

initializeDbAndServer();

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `SELECT * FROM cricket_team;`;
  const players = await db.all(getPlayersQuery);
  response.send(players);
});

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;

  const postPlayers = `INSERT INTO cricket_team (player_name,jersey_number,role)
   values ('${playerName}',${jerseyNumber},'${role}');`;
  await db.run(postPlayers);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const getPlayerQuery = `SELECT * FROM cricket_team where player_id = ${playerId};`;
  let playerDetails = await db.get(getPlayerQuery);
  response.send(playerDetails);
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;

  const updatePlayerQuery = `UPDATE cricket_team
 SET
 player_name = '${playerName}',jersey_number = ${jerseyNumber},role = '${role}' where player_id = ${playerId}`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `DELETE from cricket_team where player_id = ${playerId}`;

  await db.run(deleteQuery);

  response.send("Player Removed");
});

module.exports = app;
