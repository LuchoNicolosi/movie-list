//Selectores

const form = document.forms.todos;
const input = form.elements.todo;
const list = document.querySelector(".todos-list");
const clear = document.querySelector(".delete-all");

//renderTodos

const renderTodos = (todos) => {
  const todosListHTML = todos
    .map(
      (todo, index) =>
        `
        <li data-id="${index}">
            <span>${todo.text}</span>
            <button type="button"></button>
        </li>
      `
    )
    .join("");
  list.innerHTML = todosListHTML;

  clear.style.display =
    todos.filter((todo, index) => todo).length > 1 ? "block" : "none";
};

//localStorage
const saveInLocalStorage = (todos) => {
  localStorage.setItem("todos", JSON.stringify(todos));
};
let state = JSON.parse(localStorage.getItem("todos")) || [];

//handlers
const addTodo = (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text.length === 0) {
    form.classList.add("error");
    return;
  }

  form.classList.remove("error");
  state = [...state, { text }];

  renderTodos(state);
  saveInLocalStorage(state);
  input.value = "";
};

const editTodo = ({ target }) => {
  if (target.nodeName !== "SPAN") {
    return;
  }

  const id = parseInt(target.parentNode.dataset.id); //Obtener la posicion en el Array del TODO
  const currentText = state[id].text; //Obtener que tiene escrito el span
  const input = document.createElement("input"); //Creo un input
  input.type = "text"; //Al input le digo que sea type="text"
  input.value = ""; //Y el valor del input va ser el Span actual!!!!

  const handlerEdit = (evento) => {
    const text = evento.target.value;
    evento.stopPropagation();
    if (text !== currentText) {
      state = state.map((todo, index) => {
        if (index === id) {
          return {
            ...todo,
            text,
          };
        }
        return todo;
      });
      saveInLocalStorage(state);
      renderTodos(state);
    }
    evento.target.display = "";
    evento.target.removeEventListener("change", handlerEdit);
  };

  input.addEventListener("change", handlerEdit);

  target.parentNode.append(input); //El input que creamos lo inserta en el li, y lo mete al final
  input.focus();
};

const deleteTodo = ({ target }) => {
  if (target.nodeName !== "BUTTON") {
    return;
  }

  const id = parseInt(target.parentNode.dataset.id);
  const text = target.previousElementSibling.innerText;

  if (window.confirm(`Ya viste ${text}?`)) {
    state = state.filter((todo, index) => index !== id);
  }

  renderTodos(state);
  saveInLocalStorage(state);
};

const deleteAll = () => {
  if (window.confirm("Ya viste todas las pelis?")) {
    state = state.filter((todo, index) => !todo);
  }

  renderTodos(state);
  saveInLocalStorage(state);
};

//init
const init = () => {
  renderTodos(state);
  form.addEventListener("submit", addTodo);
  list.addEventListener("click", deleteTodo);
  list.addEventListener("dblclick", editTodo);
  clear.addEventListener("click", deleteAll);
};
init();
