const { log } = console;
//---------------------------------------------------------------------------------------------
//! MOVE ONE BOX
const boxOne = document.querySelector(".box.box-one");

let x = 0,
  y = 0,
  dragStartX,
  dragStartY,
  pointerDownX,
  pointerDownY;

boxOne.addEventListener("mousedown", (event) => {
  dragStartX = x;
  dragStartY = y;
  pointerDownX = event.pageX;
  pointerDownY = event.pageY;

  //this === window
  this.addEventListener("mousemove", onmousemove);
  this.addEventListener("mouseup", onmouseup);
});

function onmousemove(event) {
  //how much boxOne was moved
  const moveX = event.pageX - pointerDownX;
  const moveY = event.pageY - pointerDownY;
  x = dragStartX + moveX;
  y = dragStartY + moveY;
  //position boxOne
  boxOne.setAttribute("style", `left: ${x}px; top: ${y}px`);
}

function onmouseup() {
  log(this);
  // remove move & up events
  //this === window
  this.removeEventListener("mousemove", onmousemove);
  this.removeEventListener("mouseup", onmouseup);
}

// To start dragging, I first add a mousedown event listener.
// When triggered, I then add listeners for mousemove and mouseup.
// In onmousemove is where I calculate and set the element's position.
// In onmouseup, I remove mousemove and mouseup listeners to stop dragging.
// This works just fine for a single element.
// Metafizzy plugins are designed to handle multiple instances on the same page.

//---------------------------------------------------------------------------------------------
//! MOVE MULTIPLE BOXES
// One way to approach this is to wrap up the draggable code into its own big function and
// call that for each element.
//---------------------------------------------------------------------------------------------
//! handleEvent
// But I like to use classes with prototype to handle multiple instances of the same behavior.

// Now I need to add an event listener within the Box class functions. But there is a problem.
// I want to use this to reference the instance of the Box class within the event handler functions.
// But functions added with addEventListener will reference the bound element as THIS, not the
// function or object.

//---------------------------------------------------------------------------------------------
// Back to the Box class add the handleEvent method to cooridate which event method to trigger.
// Then I can add this as the event listener.

// Within the handleEvent method .this refers to listener object not element
const listener = {
  greeting: "Hi",
  handleEvent: function (event) {
    // You can specify handleEvent logic by using event.type
    if (event.type === "mousemove") {
      log("Mouse moved");
    }
    if (event.type === "mousedown") {
      log("Mouse button was pressed");
    }
    if (event.type === "mouseup") {
      log("Mouse button was unpressed");
    }
  },
};

//---------------------------------------------------------------------------------------------
//! USING handleEvent
const boxes = document.querySelectorAll(".container .box");
//Box class
class Box {
  constructor(element) {
    this.element = element;
    this.x = 0;
    this.y = 0;

    // add this as event listener, trigger handleEvent
    this.element.addEventListener("mousedown", this);
  }
}
// Shorted version can use vs switch statement
Box.prototype.handleEvent = function (event) {
  const method = "on" + event.type; // 'onmousedown' for example
  //call the method if there;
  if (this[method]) {
    this[method](event);
  }
};

Box.prototype.onmousedown = function (event) {
  this.dragStartX = this.x;
  this.dragStartY = this.y;
  this.pointerDownX = event.pageX;
  this.pointerDownY = event.pageY;
  log(event); // MouseEvent {isTrusted: true, screenX: 93, screenY: 420, clientX: 93, clientY: 353}
  log(this); // <div class="box"></div>
  window.addEventListener("mousemove", this);
  window.addEventListener("mouseup", this);
};

Box.prototype.onmousemove = function (event) {
  //how much boxOne was moved
  const moveX = event.pageX - this.pointerDownX;
  const moveY = event.pageY - this.pointerDownY;
  this.x = this.dragStartX + moveX;
  this.y = this.dragStartY + moveY;
  //position boxOne
  this.element.setAttribute("style", `left: ${this.x}px; top: ${this.y}px`);
};

Box.prototype.onmouseup = function () {
  window.removeEventListener("mousemove", this);
  window.removeEventListener("mouseup", this);
};

boxes.forEach(function (element, index) {
  window["box" + (index + 1)] = new Box(element);
});
//---------------------------------------------------------------------------------------------
//! bind() this
// The Function.prototype.bind() method lets you specify the value that should be used as this for
// all calls to a given function.
// Using bind() has an additional benefit in that you can add multiple event listeners for the same
// event name.
// But, because bind() returns a new function, you will need to keep track of that function if you
// want to remove it later.
//---------------------------------------------------------------------------------------------
//! USING bind this
const circles = document.querySelectorAll(".container .circle");

class Circle {
  constructor(element) {
    this.element = element;
    this.x = 0;
    this.y = 0;

    //this.onmousedown(event) - can be placed here instead of prototype adding
    //this.onmousemove(event) - can be placed here instead of prototype adding
    //this.onmouseup(event) - can be placed here instead of prototype adding

    // bind self for event handlers
    this.mousedownHandler = this.onmousedown.bind(this);
    this.mousemoveHandler = this.onmousemove.bind(this);
    this.mouseupHandler = this.onmouseup.bind(this);

    this.element.addEventListener("mousedown", this.mousedownHandler);
  }
}

Circle.prototype.onmousedown = function (event) {
  this.dragStartX = this.x;
  this.dragStartY = this.y;
  this.pointerDownX = event.pageX;
  this.pointerDownY = event.pageY;

  log(event);
  log(this);

  window.addEventListener("mousemove", this.mousemoveHandler);
  window.addEventListener("mouseup", this.mouseupHandler);
};

Circle.prototype.onmousemove = function (event) {
  const moveX = event.pageX - this.pointerDownX;
  const moveY = event.pageY - this.pointerDownY;
  this.x = this.dragStartX + moveX;
  this.y = this.dragStartY + moveY;
  //position boxOne
  this.element.setAttribute("style", `left: ${this.x}px; top: ${this.y}px`);
};

Circle.prototype.onmouseup = function () {
  window.removeEventListener("mousemove", this.mousemoveHandler);
  window.removeEventListener("mouseup", this.mouseupHandler);
};

circles.forEach(function (element, index) {
  window[`circle${index + 1}`] = new Circle(element);
});
//---------------------------------------------------------------------------------------------
//! USING arrow functions
// With the new ES6 hotness, you can specify this using arrow functions.
// Within an arrow function, this will refer to the enclosing object.

const triangles = document.querySelectorAll(".container .triangle");

class Triangle {
  constructor(element) {
    this.element = element;
    this.x = 0;
    this.y = 0;
    // event listeners, with arrow functions
    this.onmousedown = (event) => {
      this.dragStartX = this.x;
      this.dragStartY = this.y;
      this.pointerDownX = event.pageX;
      this.pointerDownY = event.pageY;

      log(event.type);
      log(this)

      window.addEventListener("mousemove", this.onmousemove);
      window.addEventListener("mouseup", this.onmouseup);
    };

    this.onmousemove = (event) => {
      const moveX = event.pageX - this.pointerDownX;
      const moveY = event.pageY - this.pointerDownY;
      this.x = this.dragStartX + moveX;
      this.y = this.dragStartY + moveY;
            log(event.type);
            log(this);
      //position boxOne
      this.element.setAttribute("style", `left: ${this.x}px; top: ${this.y}px`);
    };

    this.onmouseup = () => {
      window.removeEventListener("mousemove", this.onmousemove);
      window.removeEventListener("mouseup", this.onmouseup);
    };
    
    // add event listener
    this.element.addEventListener("mousedown", this.onmousedown);
  }
}

triangles.forEach((element, index) => {
  window[`triangle${index + 1}`] = new Triangle(element);
});

//Personally, I'm not a fan of the arrow function technique for this scenario. It puts the method code inside another function, rather than outside on prototype. But I'm including it for completeness.

// Each technique has its own pros and cons. handleEvent has served me well over the years, but I'm 
// finding that I run into event name conflicts with big plugins like Flickity. So I'm starting to 
// use out bind() a bit more. But then I miss the elegance of adding just this and not having to deal with extra event handler functions. Arrow functions, meanwhile, are just not for me.