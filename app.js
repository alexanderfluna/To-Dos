// ****** DOM Elements **********
const form = document.querySelector(".to-do-form");
const alert = document.querySelector(".alert");
const to_do = document.getElementById("to-do");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".to-do-container");
const list = document.querySelector(".to-do-list");
const clearBtn = document.querySelector(".clear-btn");

// edit option
let editElement;
let editFlag = false;
let editID = "";

// ****** Event Listeners **********
form.addEventListener("submit", addItem); // submit form

clearBtn.addEventListener("click", clearItems); // clear list

window.addEventListener("DOMContentLoaded", setupItems); // display items onload

// ****** Functions **********

// add item
function addItem(e) {
  e.preventDefault(); // prevents form from submitting

  const value = to_do.value; // Stores the user's input

  const id = new Date().getTime().toString(); // creates unique id for every input

  // if the input is not empty and the user is not in edit mode
  if (value !== "" && !editFlag) {

    // create an element in the DOM with the to-do item
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("to-do-item");
    element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;

    // add event listener to edit button
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    // add event listener to delete button;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);

    list.appendChild(element); // append to-do to the list

    displayAlert("item added to the list", "success"); // display alert
    
    container.classList.add("show-container"); // show container of to-dos
    
    addToLocalStorage(id, value); // add item to local storage
    
    setBackToDefault(); // set back to default

    // if the input is not empty and the user is in edit mode
  } else if (value !== "" && editFlag) {

    editElement.innerHTML = value;
    displayAlert("value changed", "success");

    // edit  local storage
    editLocalStorage(editID, value);
    setBackToDefault();

    // if the input is empty, display an alert
  } else {
    displayAlert("please enter value", "danger");
  }
}

// display alert
function displayAlert(text, action) {
  alert.textContent = text; // text
  alert.classList.add(`alert-${action}`); // color

  // remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// clear items
function clearItems() {
  const items = document.querySelectorAll(".to-do-item"); // grab all to-do items

  // remove every item in the list
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }

  container.classList.remove("show-container"); // hide the container of to-dos
  displayAlert("empty list", "danger"); // display alert
  setBackToDefault(); // set back to default
  localStorage.removeItem("list"); // remove the list from the local storage
}

// delete item
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement; // grab the to-do item
  const id = element.dataset.id; // grab the item's id

  list.removeChild(element); // remove the element from the list of to-dos

  // If the list is empty, hide the container
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger"); // display alert
  setBackToDefault(); // set back to default
  removeFromLocalStorage(id);  // remove id from local storage
}

// edit item
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement; // grab the to-do item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  to_do.value = editElement.innerHTML;
  editFlag = true; // switch to edit mode
  editID = element.dataset.id; // grab the to-do item's id
  submitBtn.textContent = "edit"; // change to text
}

// set page back to default
function setBackToDefault() {
  to_do.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

// ****** Local storage **********

// add to local storage
function addToLocalStorage(id, value) {
  const to_do = { id, value }; // tuple of id and value
  let items = getLocalStorage(); // grab items from local storage
  items.push(to_do); // push to-do item into items
  localStorage.setItem("list", JSON.stringify(items)); // store the list in local storage as JSON
}

// get from local storage
function getLocalStorage() {
  // return list from local storage 
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

// remove from local storage
function removeFromLocalStorage(id) {
  let items = getLocalStorage(); // grab items from local storage

  // iterate through items, only returning those that do not have the id
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });

  localStorage.setItem("list", JSON.stringify(items)); // store the list in local storage as JSON
}

// edit local storage
function editLocalStorage(id, value) {
  let items = getLocalStorage(); // grab items from local storage

  // iterate through items until you find the matching id
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value; // change the value of that item
    }
    return item;
  });

  localStorage.setItem("list", JSON.stringify(items)); // store the list in local storage as JSON
}

// ****** Setup Items **********

// show container
function setupItems() {
  let items = getLocalStorage(); // grab items from local storage

  // If the list is not empty, create a new element in the DOM and show the container
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}

// create list item in the DOM
function createListItem(id, value) {
  const element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("to-do-item");
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
  
  // add event listener to edit button
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  // add event listener to delete button;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);

  list.appendChild(element); // append article to the list
}