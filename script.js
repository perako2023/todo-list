'use strict';
let taskOnEdit = null;

const taskBox = document.querySelector('[data-task-box]'),
  taskInput = document.querySelector('[data-task-input]');

const taskData = new Map(JSON.parse(localStorage.getItem('taskData')));
/* ||
  new Map([
    ["task-1", { text: "my todo 1", done: false }],
    ["task-2", { text: "my todo 2", done: false }],
    ["task-3", { text: "my todo 3", done: false }],
    ["task-4", { text: "my todo 4", done: false }],
    ["task-5", { text: "my todo 5", done: false }],
  ]); */

init(); // call init on load

function init() {
  taskBox.innerHTML = ''; // clear task-box
  let taskHTML = '';
  for (const [key] of taskData) {
    taskHTML += taskTemplate(key);
  }
  addTask(taskHTML);
}

taskInput.addEventListener('keyup', (e) => {
  const inputValue = taskInput.value.trim();
  if (e.key === 'Enter' && inputValue !== '') {
    if (taskOnEdit != null) {
      taskInput.value = ''; // Clear the input field
      taskData.set(taskOnEdit.id, {
        ...taskData.get(taskOnEdit.id),
        text: inputValue,
      });
      taskOnEdit.querySelector('p').textContent = inputValue;
      taskOnEdit.querySelector('p').style.textDecoration = 'line-through';
      taskOnEdit = null;
      return;
    }
    taskInput.value = ''; // Clear the input field
    const taskID = `task-${Date.now()}`;
    taskData.set(taskID, { text: inputValue, done: false }); // add data
    addTask(taskTemplate(taskID));
  }
});

taskBox.addEventListener('click', (e) => {
  const targetTask = e.target.closest('.task');
  if (targetTask && e.target.parentElement.classList.value != 'task-controls') {
    toggleDone(targetTask.id);
  }

  /* task control conditions */
  if (e.target.parentElement.classList.contains('task-controls')) {
    switch (e.target.classList.value) {
      case 'task-edit-btn':
        taskInput.value = targetTask.querySelector('p').textContent;
        targetTask.querySelector('p').textContent = '...editing';
        targetTask.querySelector('p').style.textDecoration =
          'underline overline';
        taskOnEdit = targetTask;
        taskInput.focus();
        taskInput.putCursorAtEnd;
        break;
      case 'task-remove-btn':
        taskData.delete(targetTask.id);
        targetTask.remove();
        break;
    }
  }
});

// save taskData to localStorage on unload
window.addEventListener('unload', () => {
  localStorage.setItem('taskData', JSON.stringify([...taskData]));
});

function addTask(task) {
  taskBox.insertAdjacentHTML('beforeend', task); // append the task element to the task-box using insertAdjacentHTML
}

function taskTemplate(taskKey) {
  const { text, done } = taskData.get(taskKey),
    doneClass = done ? 'done' : '';
  return `<li id="${taskKey}" class="task select ${doneClass}">
            <div class="task-content">
              <p>${text}</p>
              <div class="task-controls">
                <button class="task-edit-btn">&#9998;</button>
                <button class="task-remove-btn">&#10006;</button>
              </div>
            </div>
          </li>`;
}

function toggleDone(taskID) {
  let task = document.querySelector(`#${taskID}`),
    isTaskDone = task.classList.toggle('done');
  taskData.set(taskID, { ...taskData.get(taskID), done: isTaskDone });
}
