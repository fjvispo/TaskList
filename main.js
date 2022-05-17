const taskListDiv = document.getElementById("tasks");
const noTasksDiv = document.getElementById('noTasks');
const formInputs = document.querySelectorAll("form input");
const submitButton = document.getElementById("new-task-submit");
const deleteAllButton = document.getElementById("deleteAll");
const deleteTaskButton = document.getElementsByClassName("delete");

const getTasks = () => {  
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  if (tasks !== null) {
    return tasks;
  } else {
    return [];
  }
};

const createTaskCard = (task) => {
  // create taskCard
  const taskCard = document.createElement ("div");
  taskCard.classList.add("taskWrapper");
  // insert taskCard HTML
  taskCard.innerHTML = `
    <div id="${task.id}" class="task">
      <div class="content">
          <div class="text">${task.id}</div>
          <div id="dueDate">
            <span class="date">${task.data.dueDate}</span>
            <span class="date">${task.data.dueTime}</span>
          </div>  
          <span class="tag">${task.data.tag}</span>
          <div id="taskActions" class="actions" style="display: flex; align-items: center;">
            <button class="edit">Edit</button>
            <button class="delete" 
              onclick="this.parentNode.parentNode.parentNode.style.width = '55%'; this.parentNode.parentNode.parentNode.nextElementSibling.style.background = 'crimson'"
              onblur="this.parentNode.parentNode.parentNode.style.width = '100%'; this.parentNode.parentNode.parentNode.nextElementSibling.style.background = 'var(--darkest)'">Delete</button>
          </div>
      </div>
    </div>
    <div id="actionValidation" class="validation">
      <span class="text">Are you sure? it's permanent.</span>
      <button id="validationYes" onclick="deleteTask(this.parentNode.previousElementSibling.id)" >Yes</button>
      <button id="validationNo" onclick="cancelDelete(this.parentNode.previousElementSibling.id)">No </button>
    </div>  
  `
  return taskCard
}

const populateTaskList = () => {
  let tasks = getTasks();
  if (tasks.length !== 0) {
    noTasksDiv.style.display = 'none';
    tasks.forEach((task) => {
      let taskCard = createTaskCard(task);
      taskListDiv.prepend(taskCard);
    });
  } else {
    taskListDiv.innerHTML = `        
      <div id="noTasks">
        <div class="noTasks"></div>
        <div class="noTasks"></div>
        <div class="noTasks"></div>
      </div>`;
  };
};

populateTaskList();

const resetForm = () => {
  formInputs.forEach(field => {
    field.value = "";
    setPlaceholderStatus(field);
  })
};

const validateForm = () => {
  let hasText = formInputs[0].value;
  let hasDate = formInputs[1].value;
  let hasTime = formInputs[2].value;
  let hasTag = formInputs[3].value;

  // console.log('text --->', hasText);
  // console.log('date --->', hasDate );
  // console.log('time --->', hasTime );
  // console.log('tag  --->', hasTag );

  if (hasText === '') {
    
  }

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
      'dueTime': document.getElementById("due-time-input").value,
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

function deleteTask(elemId) {
  console.log(elemId); 
  let taskToDelete = document.getElementById(elemId).parentNode;
  taskToDelete.remove();
  console.log(taskToDelete); 
  let updatedList = getTasks().filter(task => task.id != elemId);
  localStorage.setItem("tasks", JSON.stringify(updatedList));
  // console.log({elemId})
  // console.log("updated", updatedList)
  // taskListDiv.innerHTML = '';
  // populateTaskList();
}

function cancelDelete(elemId) {
  console.log(elemId); 
  let taskToCancel = document.getElementById(elemId);
  console.log(taskToCancel);
  // taskToCancel.style('width: 100%'); 
}

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
        elem.className = "due-date-input"
        elem.type = "text"
        break;
      case 'due-time-input':
        elem.className = "due-time-input"
        elem.type = "text"
        break;
    }
  }
};