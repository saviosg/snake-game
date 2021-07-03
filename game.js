window.onload = function(){
const cell_size = 16;
const void_size = 4;
const edge_size = 4;
const margin_size = 5;
const border_size = margin_size + 1;

usable_length = (length) => length - ((edge_size+border_size) * 2);
usable_width = () => usable_length(window.innerWidth);
usable_height = () => usable_length(window.innerHeight);

calc_canvas_length = (cells) => (Math.floor(cells) * (cell_size+void_size)) - void_size;
calc_cells = (length) => {
  if (usable_length(length) >= calc_canvas_length(20)) {
    return 20;
  }
  return Math.floor((usable_length(length) + void_size) / (cell_size + void_size));
};
vertical_cells = calc_cells(window.innerHeight); 
horizontal_cells = calc_cells(window.innerWidth);

screen_width = calc_canvas_length(horizontal_cells) + (edge_size*2);
screen_height = calc_canvas_length(vertical_cells) + (edge_size*2);
const canvas = document.createElement('CANVAS');

canvas.setAttribute('id', 'canvas');
canvas.setAttribute('width', screen_width);
canvas.setAttribute('height', screen_height);
document.body.appendChild(canvas);

let ctx = canvas.getContext('2d');

let hammer = new Hammer(canvas);

hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

hammer.on('pan', (event) => {
    if (dir_lock) return;
    if(event.direction === Hammer.DIRECTION_LEFT && direction != 2) {
        direction = 0;
    }
    else if(event.direction === Hammer.DIRECTION_UP && direction != 3) {
        direction = 1;
   }
    else if(event.direction === Hammer.DIRECTION_RIGHT && direction != 0) {
        direction = 2;
   }
    else if(event.direction === Hammer.DIRECTION_DOWN && direction != 1) {
        direction = 3;
  }
  dir_lock = 1;
});

let framerate = Math.floor(1000 / 60);
let snake_speed = Math.floor(1000 / 10);
let snake = [{x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}];
let direction = 3;
let timer = 0;
let count = 0;
let snake_timer = 0;
let dir_lock = 0;
let obstacles = [];
let food = [{x: 46, y: 33}, {x: 45, y: 34}, {x: 39, y: 29}];

document.addEventListener('keydown', function(event) {
    if (dir_lock) return;
    if(event.keyCode == 37 && direction != 2) {
        direction = 0;
        dir_lock = 1;
    }
    else if(event.keyCode == 38 && direction != 3) {
        direction = 1;
        dir_lock = 1;
   }
    else if(event.keyCode == 39 && direction != 0) {
        direction = 2;
        dir_lock = 1;
   }
    else if(event.keyCode == 40 && direction != 1) {
        direction = 3;
        dir_lock = 1;
  }
});

setInterval(() => {
  setTimeout(() => { food.shift();}, Math.floor(Math.random() * (5000 - 2000) + 2000));
  food.push({x: Math.floor(Math.random() * horizontal_cells - 1), y: Math.floor(Math.random() * vertical_cells -1)});
}, 5000);

function snake_collision() {
  switch (direction) {
    case 0:
      if (typeof snake.find(element => {
        if ((element.x == (snake[0].x - 1)) && element.y == snake[0].y) {
          console.log('collision detected');
          ctx.fillText('GAME OVER', 10, 50);
          return 1;
        };
      }) != 'undefined') {
        game = () => 0;
        return;
      }
      break;
    case 1:
      if (typeof snake.find(element => {
        if (element.x == snake[0].x && element.y == snake[0].y -1) {
          console.log('collision detected');
          ctx.fillText('GAME OVER', 10, 50);
          return 1;
        };
      }) != 'undefined') {
        game = () => 0;
        return;
      }      
      break;
    case 2:
      if (typeof snake.find(element => {
        if ((element.x == (snake[0].x + 1)) && element.y == snake[0].y) {
          console.log('collision detected');
          ctx.fillText('GAME OVER', 10, 50);
          return 1;
        };
      }) != 'undefined') {
        game = () => 0;
        return;
      }      
      break;
    case 3:
      if (typeof snake.find(element => {
        if (element.x == snake[0].x && element.y == snake[0].y + 1) {
          console.log('collision detected');
          ctx.fillText('GAME OVER', 10, 50);
          return 1;
        };
      }) != 'undefined') {
        game = () => 0;
        return;
      }           
      break;      
  }   
}

ctx.font = '48px sans-serif';

function snake_food() {
  snake.find(segment => {
    return food.find((element, index) => {
      if (segment.x == element.x && segment.y == element.y) {
        food.splice(index, 1);
        add_head();
        //move_snake();
        return 1;
      }
    });
  });
}

function move_snake() {
  switch (direction) {
    case 0:
      snake.unshift({x: snake[0].x -1, y: snake[0].y});
      snake.pop();
      dir_lock = 0;
      break;
    case 1:
      snake.unshift({x: snake[0].x, y: snake[0].y -1});    
      snake.pop();
      dir_lock = 0;
      break;
    case 2:
      snake.unshift({x: snake[0].x + 1, y: snake[0].y});  
      snake.pop();
      dir_lock = 0;
      break;
    case 3: 
      snake.unshift({x: snake[0].x, y: snake[0].y + 1});
      snake.pop();
      dir_lock = 0;
      break;
  }
}

function add_head() {
switch (direction) {
    case 0:
      snake.unshift({x: snake[0].x -1, y: snake[0].y});
      break;
    case 1:
      snake.unshift({x: snake[0].x, y: snake[0].y -1});    
      break;
    case 2:
      snake.unshift({x: snake[0].x + 1, y: snake[0].y});  
      break;
    case 3: 
      snake.unshift({x: snake[0].x, y: snake[0].y + 1});
      break;
  }
}

function game(time) {
  if (timer == 0) timer = time;
  if (time - timer <= framerate) {
    window.requestAnimationFrame(game);
  }
  else {
    timer = time;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (snake_timer == 0) snake_timer = time;
    if (time - snake_timer > snake_speed) {
      snake_collision();
      move_snake();
      snake_food();
      snake_timer = time;
    }

    let acc = 0;
    
    ctx.fillStyle = 'green';
    snake.forEach((seg, index) => {ctx.fillRect(seg.x * cell_size + (seg.x) * void_size + edge_size, seg.y * cell_size + (seg.y) * void_size + edge_size, cell_size, cell_size) });
    
    ctx.fillStyle = 'red';
    food.forEach((seg, index) => {ctx.fillRect(seg.x * cell_size + (seg.x) * void_size + edge_size, seg.y * cell_size + (seg.y) * void_size + edge_size, cell_size, cell_size) });    
    window.requestAnimationFrame(game);    
  }
}

window.requestAnimationFrame(game);


}
