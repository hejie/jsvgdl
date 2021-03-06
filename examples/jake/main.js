/**
 * @fileoverview
 * Draw lines, polygons, circles, etc on the screen.
 * Render text in a certain font to the screen.
 */
var gamejs = require('gamejs');
var draw = require('gamejs/graphics');
var font = require('gamejs/font');
var $v = require('gamejs/math/vectors');


function main() {
   // set resolution & title
   var display = gamejs.display.getSurface();
   gamejs.display.setCaption("Example Draw");

   var square = new gamejs.Rect([10, 10], [10, 10]);
   var other_square = new gamejs.Rect([20, 20], [10, 10]);
   square.velocity = [0, 0];

   // gamejs.graphics.rect(display, '#000000', square);
   var direction = {};
   direction[gamejs.event.K_UP] = [0, -1];
   direction[gamejs.event.K_DOWN] = [0, 1];
   direction[gamejs.event.K_LEFT] = [-1, 0];
   direction[gamejs.event.K_RIGHT] = [1, 0];

   // gamejs.event.onEvent(function (event) {
   //    console.log(event);
   // })

   gamejs.event.onKeyUp(function (event) {
      var delta = direction[event.key];
      if (delta) square.velocity = $v.unit($v.subtract(square.velocity, delta));

   });

   gamejs.event.onKeyDown(function (event) {
      var delta = direction[event.key];
      if (delta) square.velocity = $v.add(square.velocity, delta);
   });

   var collision_color = '#ff0000';

   gamejs.onTick(function () {
      display.clear();
      gamejs.graphics.rect(display, '#000000', square);
      gamejs.graphics.rect(display, collision_color, other_square);  
      if (square.collideRect(other_square)) 
         collision_color = "#00ff00";
      else
         collision_color = '#ff0000';

      square.center = $v.add(square.velocity, square.center);

      // console.log(gamejs.event.get());
   });  

};

// gamejs.ready will call your main function
// once all components and resources are ready.
gamejs.ready(main);
