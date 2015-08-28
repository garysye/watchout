// start slingin' some d3 here.

//make board here
var boardOptions = {
  height: 500,
  width: 700,
  numEnemies: 10,
  turnTime: 1000
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


//move enemies
var enemyMove = function() {
  enemyNodes.transition().duration(boardOptions.turnTime)
    .attr("cy", function(d) {return Math.random() * boardOptions.height})
    .attr("cx", function(d) {return Math.random() * boardOptions.width})
}

var gameTurn = function() {
  enemyMove();
}

setInterval(gameTurn, boardOptions.turnTime);


//collision detection

var collided = false;

var collisionDetection = function() {
  //store player variables
  if (!collided) {
    var pX = playerNode.attr("cx");
    var pY = playerNode.attr("cy");
    var pR = playerNode.attr("r"); 

    //iterate through every enemy
    enemyNodes[0].forEach(function(enemyDOM) {
      enemy = d3.select(enemyDOM);
      var eX = enemy.attr("cx");
      var eY = enemy.attr("cy");
      var eR = enemy.attr("r");
      if (Math.sqrt(Math.pow(pX-eX,2)+Math.pow(pY-eY,2)) < (+pR)+(+eR)) {
        collided = true;
        console.log("crash");
        updateCollisions();
        updateHighScore();
        updateScore(0);
        //gives player small invulnerability before trying again
        setTimeout(function() {
          collided = false;
        }, boardOptions.turnTime);
      }
    });
  }
}

var updateCollisions = function() {
  var collisionCount = d3.select('.collisions').select('span').text();
  d3.select('.collisions').select('span').text(+collisionCount+1);
}
setInterval(collisionDetection, 10);

var updateScore = function(score) {
  score = score !== undefined ? score : d3.select('.current').select('span').text();
  d3.select('.current').select('span').text(+score+1);
}

var updateHighScore = function() {
  var highScore = +(d3.select('.high').select('span').text());
  var score = +(d3.select('.current').select('span').text());
  if (highScore < score) {
    d3.select('.high').select('span').text(score);
  }
}
setInterval(updateScore, 100);
