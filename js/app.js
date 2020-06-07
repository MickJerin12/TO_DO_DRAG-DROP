const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");
const item = document.getElementById("item");
const check = document.querySelector(".check");

const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const Line_THROUGH = "lineThrough";

var placeholder = document.createElement("div");
placeholder.className = "placeholder";

let LIST, id, dragged, over;

let data = localStorage.getItem("TODO");

if (data) {
  LIST = JSON.parse(data);
  id = LIST.length;
  loadList(LIST);
} else {
  LIST = [];
  id = 0;
}

function loadList(array) {
  array.forEach((item) => addToDo(item.name, item.id, item.done, item.trash));
}

function loadList1(array) {
  LIST = [];
  array.forEach((item, i) => {
    LIST.push({
      name: item.name,
      id: i,
      done: item.done,
      trash: item.trash,
    });
    addToDo(item.name, i, item.done, item.trash);
  });
}

clear.addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});

const options = { weekday: "long", month: "short", day: "numeric" };
const today = new Date();

dateElement.innerHTML = today.toLocaleDateString("en-US", options);

function addToDo(toDo, id, done, trash) {
  if (trash) return;

  const DONE = done ? CHECK : UNCHECK;
  const LINE = done ? Line_THROUGH : "";

  const item = `<div data-id="${id}" draggable="true" id="item">
                <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                <p class="text ${LINE}">${toDo}</P>
                <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                </div>`;
  const position = "beforeend";

  list.insertAdjacentHTML(position, item);
}

document.addEventListener("keyup", (event) => {
  if (event.keyCode == 13) {
    const toDo = input.value;

    if (toDo) {
      addToDo(toDo, id, false, false);
      LIST.push({
        name: toDo,
        id: id,
        done: false,
        trash: false,
      });

      localStorage.setItem("TODO", JSON.stringify(list));
      id++;
    }
    input.value = "";
  }
});

function completeToDo(element) {
  element.classList.toggle(CHECK);
  element.classList.toggle(UNCHECK);
  element.parentNode.querySelector(".text").classList.toggle(Line_THROUGH);

  LIST[element.id].done = LIST[element.id].done ? false : true;
}

function removeToDo(element) {
  element.parentNode.parentNode.removeChild(element.parentNode);
  LIST[element.id].trash = true;
}

list.addEventListener("click", (event) => {
  const element = event.target;
  const elementJob = element.attributes.job.value;

  if (elementJob === "complete") {
    completeToDo(element);
  } else if (elementJob == "delete") {
    removeToDo(element);
  }

  localStorage.setItem("TODO", JSON.stringify(LIST));
});

list.addEventListener("dragstart", (event) => {
  dragged = event.target;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/html", dragged);
});

list.addEventListener("dragend", () => {
  dragged.style.display = "block";
  dragged.parentNode.removeChild(placeholder);
  var data = LIST;
  var from = Number(dragged.dataset.id);
  var to = Number(over.dataset.id);
  if (from < to) to--;
  data.splice(to, 0, data.splice(from, 1)[0]);
  LIST = data;
  list.innerHTML = "";
  loadList1(LIST);
});

list.addEventListener("dragover", (e) => {
  e.preventDefault();
  dragged.setAttribute("style", "display: none !important");
  if (
    e.target.parentNode.className === "" &&
    e.target.className !== "placeholder"
  ) {
    over = e.target;
    e.target.parentNode.insertBefore(placeholder, e.target);
  }
});
