var snake = {
  direction : 119,
  body : [[20,20],[20,19],[20,18]],
  food : [],
};


function changeDirection(){
}

function renderBoard() {
  var $container = $('#container');

  //drawing board
  for(var x = 1; x < 41; x++) {
    for(var y = 1; y < 41; y++) {
      $container.append('<div class="grid x" id="' +
        x + '_' + y + '"></div>');
    }
  }
}

function renderSnake() {
  // remove old snake
  $('.snake').removeClass('snake');

  // draw new snake
  snake.body.forEach(function(entry){
    var x = entry[0];
    var y = entry[1];

    var id = x + '_' + y;
    $('#' + id).addClass('snake');

  });
}

function move(){
  var body = snake.body;
  var newPosition;

  switch (snake.direction) {
    //up
    case 119 :
      newPosition = [body[0][0] - 1, body[0][1]];
      break;
    //right
    case 100 :
      newPosition = [body[0][0], body[0][1] + 1];
      break;
    //down
    case 115 :
      newPosition = [body[0][0] + 1, body[0][1]];
      break;
    //left
    case 97 :
      newPosition = [body[0][0], body[0][1] - 1];
      break;
  }
  snake.body = [newPosition, ...body];

  if (!snake.ateFood) {
    snake.body.pop();
  } else {
    snake.ateFood = false;
  }

}

function gameOver(snake){
  //shallow copy
  var snakeBody = snake.body.slice(0);
  var snakeHead = snakeBody[0];

  var outsideOfTheBoard =  snakeHead[0] > 40  ||  snakeHead[0] < 1 ||
            snakeHead[1] > 40  ||  snakeHead[1] < 1;

  //remove head to compare if head bitten any parts of the body (same position)
  var removedHead = snakeBody.shift();

  return  outsideOfTheBoard || occupiedBySnake(snakeBody, removedHead);
}

// comparing arrays stringified b/c [1,2] == [1,2] returns false if they are not the same obj
function occupiedBySnake(snakeBody, target) {
  var result = snakeBody.some((bodyPart) => {
    return JSON.stringify(bodyPart) == JSON.stringify(target);
  });

  return result;
}

function correctInput(event) {
  return [119, 100, 115, 97].includes(event.which);
}

function changeDirection(event) {
  snake.direction = event.which;
}

function sameDirection(event) {
  return snake.direction == event.which;
}

function oppositeDirection(event) {
  key = event.which;
  switch (key) {
    case 119 : return snake.direction == 115;
    case 115 : return snake.direction == 119;
    case 97  : return snake.direction == 100;
    case 100 : return snake.direction == 97;
   }
}

function moveSnake(){
  move();
  console.log(ateFood());
  if(ateFood()){
    snake.ateFood = true;
    eatFood();
    renderFood();
  }

  renderSnake();
}


function moveLoop(){
  var moveInterval = setInterval(function(){

      document.onkeypress = function() {
        if (!correctInput(event) || sameDirection(event) || oppositeDirection(event)) {
          return;
        }
        changeDirection(event);
        clearInterval(moveInterval);
        moveSnake();
        moveLoop();
      };

      if (gameOver(snake)) {
        clearInterval(moveInterval);
        return;
      }

      moveSnake();


    }, 250);
}

function getRandomOneToForty() {
  return Math.floor((Math.random() * 40) + 1);
}

function getRandomFieldId() {
  let x = getRandomOneToForty();
  let y = getRandomOneToForty();
  return [x,y];
}

function renderFood() {

  let id = getRandomFieldId();
  while(occupiedBySnake(snake.body, id)) {
    id = getRandomFieldId();
  }

  snake.food = id;
  id = `${id[0]}_${id[1]}`;
  $('#' + id).addClass('food');
}

function eatFood(){
  $('.food').removeClass('food');
}

function ateFood(){
  return JSON.stringify(snake.body[0]) == JSON.stringify(snake.food);
}

$(document).ready(function() {
  renderBoard();
  renderSnake();
  renderFood();
  moveLoop();

});








