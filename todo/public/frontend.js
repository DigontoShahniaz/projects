
function init() {
  let todosInfo = document.getElementById('todosInfo');
  todosInfo.innerHTML = 'Loading todo items, please wait.... ';

  loadTodos();
}

async function loadTodos() {
  try {
    let response = await fetch('/todos/');
    if (!response.ok) {
      throw new Error('Failed to load todos');
    }
    let todos = await response.json();
    showTodos(todos);
  } catch (error) {
    console.error('Error loading todos:', error);
    let todosInfo = document.getElementById('todosInfo');
    todosInfo.innerHTML = `Error: ${error.message}`;
  }
}

function createTodoItem(todo) {
  let li = document.createElement('li');
  li.setAttribute('id', todo._id);

  let textSpan = document.createElement('span');
  textSpan.textContent = todo.text;
  li.appendChild(textSpan);

  let buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex'; 
  buttonContainer.style.gap = '10px';   

  let button1 = document.createElement('button');
  button1.textContent = 'Edit';
  button1.onclick = function() { editTodo(todo._id, todo.text); };
  buttonContainer.appendChild(button1);

  let button2 = document.createElement('button');
  button2.textContent = 'Delete';
  button2.onclick = function() { removeTodo(todo._id); };
  buttonContainer.appendChild(button2);

  li.appendChild(buttonContainer);

  return li;
}

function showTodos(todos) {
  let todosList = document.getElementById('todosList');
  let todosInfo = document.getElementById('todosInfo');

  todosList.innerHTML = ''; 

  if (todos.length === 0) {
    todosInfo.innerHTML = 'No todo items';
  } else {
    todos.forEach(todo => {
      let li = createTodoItem(todo);
      todosList.appendChild(li);
    });
  }
  todosInfo.innerHTML = '';
}

async function addTodo() {
  let newTodo = document.getElementById('newTodo');
  let data = {'text': newTodo.value};

  try {
    let response = await fetch('/todos/', {
      method: 'POST',
      headers: {'Content-Type': 'Application/json'},
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to add todo');
    }

    let todo = await response.json();
    let todosList = document.getElementById('todosList');
    let li = createTodoItem(todo);
    todosList.appendChild(li);

    let todosInfo = document.getElementById('todosInfo');
    todosInfo.innerHTML = '';
    newTodo.value = '';
  } catch (error) {
    console.error('Error adding todo:', error);
    let todosInfo = document.getElementById('todosInfo');
    todosInfo.innerHTML = `Error: ${error.message}`;
  }
}

async function removeTodo(id) {
  try {
    let response = await fetch('/todos/' + id, {method: 'DELETE'});
    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }

    let li = document.getElementById(id);
    li.remove();

    let todosList = document.getElementById('todosList');
    if (!todosList.hasChildNodes()) {
      let todosInfo = document.getElementById('todosInfo');
      todosInfo.innerHTML = 'No items';
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
    let todosInfo = document.getElementById('todosInfo');
    todosInfo.innerHTML = `Error: ${error.message}`;
  }
}

let editId = null;

function editTodo(id, text) {
  let newTodo = document.getElementById('newTodo');
  newTodo.value = text;

  let button = document.querySelector('button');
  button.textContent = 'Save';
  button.onclick = function() { saveTodo(id); };
  editId = id;
}

async function saveTodo(id) {
  let newTodo = document.getElementById('newTodo');
  let data = {'text': newTodo.value};

  try {
    let response = await fetch('/todos/' + id, {
      method: 'PUT',
      headers: {'Content-Type': 'Application/json'},
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to save todo');
    }

    let todo = await response.json();
    let existingItem = document.getElementById(id);
    let item = createTodoItem(todo);
    existingItem.replaceWith(item);

    let todosInfo = document.getElementById('todosInfo');
    todosInfo.innerHTML = '';

    let button = document.querySelector('button');
    button.textContent = 'Add';
    button.onclick = addTodo;

    newTodo.value = '';
  } catch (error) {
    console.error('Error saving todo:', error);
    let todosInfo = document.getElementById('todosInfo');
    todosInfo.innerHTML = `Error: ${error.message}`;
  }
}
