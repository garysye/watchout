// start slingin' some d3 here.

//make board here
var boardOptions = {
  height: 500,
  width: 700,
  numEnemies: 10
}

var enemyOptions = {
  color: 'red',
  radius: 20
}

var board = d3.select("body").append("svg")
  .attr("height", boardOptions.height)
  .attr("width", boardOptions.width);

//add enemies
var enemies = [];
for (var i = 0; i < boardOptions.numEnemies; i++) {
  enemies.push({x: Math.random() * boardOptions.width, y: Math.random() * boardOptions.height});
}

var enemyNodes = d3.select("svg").selectAll("circle").data(enemies)
  .enter().append("circle")
  .attr("class", "enemy")
  .attr("cy", function(d) {return d.y;} )
  .attr("cx", function(d) {return d.x;} )
  .attr("r", enemyOptions.radius)
  .attr("fill", enemyOptions.color);

//add player
var player = {
  y: boardOptions.height/2,
  x: boardOptions.width/2,
  color: 'blue',
  height: 20,
  width: 20,
  radius: 20
};

var playerNode = d3.select("svg").append("circle")
  .attr("class", "player")
  .attr("cy", player.y )
  .attr("cx", player.x )
  .attr("r", player.radius)
  .attr("fill", player.color);
