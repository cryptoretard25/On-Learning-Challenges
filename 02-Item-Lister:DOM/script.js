const { log } = console;

const form = document.querySelector("#addForm");
const items = document.querySelector("#items");
const filter = document.querySelector("#filter");

//storage handling
let storage = [];
const getStorage = JSON.parse(localStorage.getItem("storage"));

if (getStorage && getStorage.length > 0) {
  storage = getStorage;
  storage.forEach((element) => {
    const li = new DOMParser().parseFromString(element, "text/html");
    items.appendChild(li.firstChild.lastChild.firstChild);
  });
}

// Delete item event
items.addEventListener("click", removeItem);
// Add item event to parent
form.addEventListener("submit", addItem);
// Filter items event
filter.addEventListener("keyup", filterItems);

function filterItems(e) {
  // convert text to lowercase
  const text = e.target.value.toLowerCase();
  // get li's
  const lis = items.getElementsByTagName("li");
  for (li of lis) {
    // get text of item and apply toLowerCase method
    const liTextLower = li.firstChild.textContent.toLowerCase();
    // search matches li text with input text
    // if yes show item, if no hide
    if (liTextLower.indexOf(text) !== -1) {
      log(`${e.target.value} match!`);
      li.style.display = "block";
    } else {
      log(`${e.target.value} NOT match!`);
      li.style.display = "none";
    }
  }
}

function removeItem(e) {
  // run only if clicked item has class #delete
  if (e.target.classList.contains("delete")) {
    // e.target == <button class="btn btn-danger btn-sm float-right delete">X</button>
    const li = e.target.parentElement;
    this.removeChild(li);
    // storage handling
    const indexOf = storage.indexOf(li.outerHTML);
    // check if includes, delete from storage
    if (storage.includes(li.outerHTML)) {
      if (indexOf !== -1) {
        storage.splice(indexOf, 1);
        //update local storage
        localStorage.setItem("storage", JSON.stringify(storage));
      }
    }
    log(storage);
  }
}

function addItem(e) {
  // off default update page when click on submit
  e.preventDefault();
  // get input value
  const text = document.querySelector("#item");
  if (!text.value) {
    alert("Fill the text field!");
    return;
  }
  // create new li element
  const li = document.createElement("li");
  // add className
  li.classList.add("list-group-item");
  //add display style
  li.style.display = "block";
  // create delete button
  const delButton = document.createElement("button");
  // add delete button classes
  // delButton.className = "btn btn-danger btn-sm float-right delete" - does the same
  delButton.classList.add(
    "btn",
    "btn-danger",
    "btn-sm",
    "float-right",
    "delete"
  );
  //add textcontent
  delButton.textContent = "X";
  //append textnode from submit and delButton to li
  li.append(document.createTextNode(text.value), delButton);
  //save li into storage
  storage.push(li.outerHTML);
  //update local storage
  localStorage.setItem("storage", JSON.stringify(storage));
  //add new li to items
  items.appendChild(li);
}

//! MY SOLUTION
/*
function handleLis() {
  const lis = items.children;
  for (let li of lis) {
    const del = li.children;
    del[0].addEventListener("click", removeItem);
  }
}

function removeItem(e) {
  const removed = this.parentElement;
  items.removeChild(removed);
  log(removed);
  log(e.type);
}
*/
