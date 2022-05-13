const taskListDiv = document.getElementById("tasks");
const noTasksDiv = document.getElementById('noTasks');
const formInputs = document.querySelectorAll("form input");
const submitButton = document.getElementById("new-task-submit");
const deleteAllButton = document.getElementById("deleteAll");

const getTasks = () => {  
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  if (tasks !== null) {
    return tasks;
  } else {
    return [];
  }
};

const populateTaskList = () => {
  let tasks = getTasks();
  if (tasks.length !== 0) {
    noTasksDiv.style.display = 'none';
    tasks.forEach((task, i) => {
      // create taskCard
      const taskCard = document.createElement ("div");
      taskCard.classList.add("task");
      taskCard.setAttribute("taskId", task.id);
      // insert taskCard HTML
      console.log(task.data.text)
      console.log(task.data.dueDate)
      console.log(task.data.tag)
      taskCard.innerHTML = `
        <div class="content">
            <div class="text">${task.data.text}</div>
            <div class="date">${task.data.dueDate}</div>
            <div class="tag">${task.data.tag}</div>
        </div>
        <div id="taskActions" class="actions" style="display: flex; align-items: center;">
          <button class="edit" onclick="editTask(this)">Edit</button>
          <button class="delete onclick="deleteTask(this)"">Delete</button>
        </div>  
      `
      taskListDiv.prepend(taskCard);
    });
  } else {
    taskListDiv.innerHTML = `        
      <div id="noTasks">
        <div class="noTasks">There are no tasks yet</div>
        <div class="noTasks">Enter a new task and start planning!</div>
      </div>`;
  };
};

var taskList = populateTaskList();

const resetForm = () => {
  formInputs.forEach(field => {
    field.value = "";
    setPlaceholderStatus(field);
  })
};

const validateForm = () => {
  let hasText = formInputs[0].value;
  let hasDate = formInputs[1].value;
  let hasTag = formInputs[2].value;

  console.log('--->', hasText);
  console.log('--->', hasDate );
  console.log('--->', hasTag );

  return hasText;
};

submitButton.addEventListener('click', function() {
  validateForm();
  let newTaskData = {
    'id': Date.now(),
    'status': 'planned',
    'data': {
      'text': document.getElementById("new-task-input").value,
      'dueDate': document.getElementById("due-date-input").value,
      'tag': document.getElementById("tag-input").value,
    }
  }
  let tasks = getTasks();
  tasks.push(newTaskData);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskListDiv.innerHTML = '';
  populateTaskList();
  resetForm();
}); 

deleteAllButton.addEventListener('click', function() {
  localStorage.setItem("tasks", "[]");
  populateTaskList()
});

function setPlaceholderStatus(elem) {
  const element = elem.id
  if (elem.value === '') {
    switch (element) {
      case 'tag-input':
        elem.placeholder = 'Add a tag'
        break
      case 'new-task-input':
        elem.placeholder = 'Enter new task'
        break
      case 'due-date-input':
        elem.className="due-date-input"
        elem.type="text"
        break
    }
  }
};