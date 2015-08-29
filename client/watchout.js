// start slingin' some d3 here.

//make board here
var boardOptions = {
  height: 500,
  width: 700,
  numEnemies: 10,
  turnTime: 1000
}

var enemyOptions = {
  color: 'black',
  radius: 20,
  path: "M 0 20 L 0 8 L 20 0 L 8 0 L 0 -20 L 0 -8 L -20 0 L -8 0 L 0 20 z"
}

var rotationOptions = {
  from: '0',
  to: '360',
  repeatCount: 'indefinite',
  attributeName: 'transform',
  attributeType: 'XML',
  type: 'rotate',
  duration: '1s'
}

var player = {
  y: boardOptions.height/2,
  x: boardOptions.width/2,
  color: 'blue',
  height: 20,
  width: 20,
  radius: 20
};

var board = d3.select("body").append("svg")
  .attr("height", boardOptions.height)
  .attr("width", boardOptions.width)
  .style("padding", player.radius + "px")
  .style("border", "5px solid black")

//add enemies
var enemies = [];
for (var i = 0; i < boardOptions.numEnemies; i++) {
  enemies.push({x: Math.random() * boardOptions.width, y: Math.random() * boardOptions.height});
}

var enemyNodes = d3.select("svg").selectAll("image").data(enemies)
  .enter().append("image")
  .attr("class", "enemy")
  .attr("y", function(d) {return d.y;} )
  .attr("x", function(d) {return d.x;} )
  .attr("r", enemyOptions.radius)
  .attr("height", enemyOptions.radius * 2)
  .attr("width", enemyOptions.radius * 2) 
  .attr("xlink:href", "shuriken-two-128.png")


// d3.select("svg").selectAll('.enemy').append("animateTransform")
//   .attr("attributeName", rotationOptions.attributeName)
//   .attr("attributeType", rotationOptions.attributeType)
//   .attr('type', 'rotate', rotationOptions.type)
//   .attr('from', rotationOptions.from)
//   .attr('to', rotationOptions.to)
//   .attr('dur', rotationOptions.duration)
//   .attr('repeatCount', rotationOptions.repeatCount)

//add player
var playerNode = d3.select("svg").append("circle")
  .attr("class", "player")
  .attr("cy", player.y )
  .attr("cx", player.x )
  .attr("r", player.radius)
  .attr("fill", player.color);

//move enemies
var enemyMove = function() {
  enemyNodes.transition().duration(boardOptions.turnTime)
    .attr("y", function(d) {return Math.random() * boardOptions.height})
    .attr("x", function(d) {return Math.random() * boardOptions.width})
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
      var eR = enemy.attr("r");
      var eX = enemy.attr("x") + eR;
      var eY = enemy.attr("y") + eR;
      if (Math.sqrt(Math.pow(pX-eX,2)+Math.pow(pY-eY,2)) < (+pR)+(+eR)) {
        updateHighScore();
        updateScore(0);
        collided = true;
        console.log("crash");
        updateCollisions();
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
  if (!collided) {
    score = score !== undefined ? score : d3.select('.current').select('span').text();
    d3.select('.current').select('span').text(+score+1);
  }
}

var updateHighScore = function() {
  var highScore = +(d3.select('.high').select('span').text());
  var score = +(d3.select('.current').select('span').text());
  if (highScore < score) {
    d3.select('.high').select('span').text(score);
  }
}
setInterval(updateScore, 100);
var playerSelected = false;

playerNode.on("mousedown", function() {playerSelected = true;});
d3.select("body").on("mouseup", function() {playerSelected = false;});
d3.select("body").on("mousemove", function() {
  if (playerSelected) {
    var coord = d3.mouse(this.getElementsByTagName('svg')[0]);
    var x, y;
    //keep player from going off board
    x = coord[0] < 0 ? 0 : coord[0];
    x = coord[0] > boardOptions.width ? boardOptions.width: coord[0];
    y = coord[1] < 0 ? 0 : coord[1];
    y = coord[1] > boardOptions.height ? boardOptions.height: coord[1];
    
    playerNode
      .attr("cx", x)
      .attr("cy", y)
  }
});


// var playerMove = function(event) {
//   if (playerSelected) {
//     playerNode.transition().duration(10)
//       .attr("cx", event.clientX)
//       .attr("cy", event.clientY)
//   }
// }
// setInterval(playerMove, 10);

