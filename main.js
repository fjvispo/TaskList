const taskListDiv = document.getElementById("tasks");
const noTasksDiv = document.getElementById('noTasks');
const formInputs = document.querySelectorAll('[class*="-input"]');
const inputTag = formInputs[3].value;
const formOptionsWrapper = document.getElementById('form-options-wrapper');
const submitButton = document.getElementById("new-task-submit");
const deleteAllButton = document.getElementById("deleteAll");
const deleteTaskButton = document.getElementsByClassName("delete");
const todayCounter = document.getElementById("today-counter");
var clearInputButtons = Array.from(document.getElementsByClassName("clear-field"));
const todayDate = new Date().toISOString().split('T')[0];

// CALENDAR //
const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long'
};

document.getElementById("today-date").innerText = new Date().toLocaleDateString('en-AR', options)

// FUNCTIONS //
const getTasks = ($date, $tag) => {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  if (tasks !== null) {
    switch (true) {
      case $date == undefined && $tag == undefined:
        tasks;
        break;
      case $date !== undefined && $tag == undefined:
        tasks = tasks.filter(function (task) {
          return task.data.dueDate == $date;
        });
        break;
      case $date == undefined && $tag !== undefined:
        tasks = tasks.filter(function (task) {
          return task.data.tag == $tag;
        });
        break;
      case $date !== undefined && $tag !== undefined:
        tasks = tasks.filter(function (task) {
          return task.data.dueDate == $date && task.data.tag == $tag;
        });
    };
    return tasks;
  } else {
    return [];
  };
};

const updateTodayCounter = () => {
  let tasksCounter = getTasks(new Date().toISOString().split('T')[0]).length;
  return todayCounter.innerText = tasksCounter;
}

// TODO - Manage tags | add color select
const getTags = () => {
  let tags = JSON.parse(localStorage.getItem("tags"))
  if (tags !== null) {
    return tags;
  } else {
    return [];
  };
};

const clearTags = () => {
  localStorage.setItem('tags', "[]");
  return 'tags Cleared';
};

var tags = getTags()

const checkTag = () => {
  return tags.includes(inputTag)
};

const saveNewTag = () => {
  tags.push();
  localStorage.setItem('tags', JSON.stringify(tags));
};

// TODO : validate form
const validateForm = () => {
  let hasText = formInputs[0].value.length;
  
  return hasText !== 0 
};

const createTaskCard = (task) => {
  // create taskCard
  const taskCard = document.createElement ("div");
  taskCard.classList.add("taskWrapper");
  // insert taskCard HTML
  taskCard.innerHTML = `
    <div id="${task.id}" class="task ${task.status}">
      <div class="content">
          <div class="text">${task.data.text}</div>
          <div id="dueDate">
            <span class="date">${task.data.dueDate}</span>
            <span class="date">${task.data.dueTime}</span>
          </div>  
          <span class="tag">${task.data.tag}</span>
          <div id="taskActions" class="actions" style="display: flex; align-items: center;">
            <button class="edit">Edit</button>
            <button class="delete" 
              onclick="this.parentNode.parentNode.parentNode.style.width = '55%'"
              onblur="this.parentNode.parentNode.parentNode.style.width = '100%'"
            >Delete</button>
          </div>
      </div>
    </div>
    <div id="actionValidation" class="validation">
      <span class="text">Are you sure? it's permanent.</span>
      <div id="validationYes"
        onclick="deleteTask(this.parentNode.previousElementSibling.id)"
        onmouseenter="
          this.parentNode.style.background = 'crimson'; 
          this.children[0].style.display = 'none';
          this.children[1].style.display = 'block';
          this.children[1].classList.add('rotate')"
        onmouseleave="this.parentNode.style.background = 'var(--darker)';
          this.children[0].style.display = 'block';
          this.children[1].style.display = 'none';
          this.children[1].classList.remove('rotate')"
      >
        <p>yes</p>
        <span class="material-icons delete">delete</span>
      </div>
      <button id="validationNo" onmouseover="cancelDeleteEnter(this) onmouseleave=""cancelDeleteLeave(this)
        >No</button>
    </div>  
  `
  return taskCard
}

const populateTaskList = ($date, $tag) => {
  taskListDiv.innerHTML = '';
  let tasks = getTasks($date, $tag);
  if (tasks.length !== 0) {
    noTasksDiv.style.display = 'none';
    tasks.forEach((task) => {
      let taskCard = createTaskCard(task);
      taskListDiv.prepend(taskCard);
    });
  } else {
    taskListDiv.innerHTML = `        
      <div id="noTasks">
        <div class="noTasks">Still no tasks planned</div>
        <div class="noTasks"></div>
        <div class="noTasks"></div>
      </div>`;
  };
};

populateTaskList();
updateTodayCounter();

const resetForm = () => {
  formInputs.forEach(field => {
    field.value = "";
    setPlaceholderStatus(field);
    if (field.classList.contains('due-date-input') || field.classList.contains('due-time-input')) {
      field._flatpickr.clear();
    }
  });
};

clearInputButtons.forEach(button => {
  button.addEventListener('click', function() {
    let buttonIndex = clearInputButtons.map(e => e.id).indexOf(this.id);
    if (this.id === 'clearDateInput' || this.id === 'clearTimeInput') {
      formInputs[buttonIndex]._flatpickr.clear();
    }
    formInputs[buttonIndex].value = '';
  })
});

function toggleOptions() {
  let display = getComputedStyle(formOptionsWrapper).display;
  let toggle = document.getElementById('options-toggle');
  switch (display) {
    case 'none': case '':
      formOptionsWrapper.classList.toggle('form-options-wrapper-active');
      toggle.innerText = 'close';
      toggle.classList.toggle('options-toggle-active');
      break;
    case 'block':
      formOptionsWrapper.classList.toggle('form-options-wrapper-active');
      toggle.classList.toggle('options-toggle-active');
      toggle.innerText = 'tune';
      break;
  }
};

const setDueDateValue = () => {
  if (!formInputs[1].value) {
    return dueDate = todayDate;
  } else {
    return dueDate = formInputs[1].value;
  }
};

const setDueTimeValue = () => {
  if (!formInputs[2].value) {
    return dueTime = 'anytime';
  } else {
    return dueDate = formInputs[2].value;
  }
};

const setTagValue = () => {
  if (!formInputs[3].value) {
    return tagValue = 'untagged';
  } else {
    return tagValue = formInputs[3].value;
  }
};

// NEW TASK - FORM SUBMIT
submitButton.addEventListener('click', function() {
  validateForm();
  console.log(validateForm());

  let newTaskData = {
    'id': Date.now(),
    'status': 'planned',
    'data': {
      'text': formInputs[0].innerText,
      'dueDate': setDueDateValue(),
      'dueTime': setDueTimeValue(),
      'tag': setTagValue(),
      'note': formInputs[4].innerText
    }
  }
  let tasks = getTasks();
  tasks.push(newTaskData);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskListDiv.innerHTML = '';
  populateTaskList();
  resetForm();
  updateTodayCounter();
});

deleteAllButton.addEventListener('click', function() {
  localStorage.setItem("tasks", "[]");
  populateTaskList()
});

function deleteTask(elemId) {
  let taskToDelete = document.getElementById(elemId).parentNode;
  let updatedList = getTasks().filter(task => task.id != elemId);
  localStorage.setItem("tasks", JSON.stringify(updatedList));
  taskToDelete.style.width = '0px';
  setTimeout(shrinkRow, 300);
  function shrinkRow() {taskToDelete.style.height = '0px'};
  // setTimeout(deleteRow, 500);
  function deleteRow() {taskToDelete.remove()}
  updateTodayCounter();
};

function cancelDeleteEnter(elem) {
  elem.style.opacity = '0';
};

function cancelDeleteLeave(elem) {
  elem.style.opacity = '100';
};

function addNote(elem) {
  let hasUserText = elem.getAttribute('status');
  switch (hasUserText) {
    case 'default':
      elem.innerText = '';
      elem.style.color = 'var(--light)';
      elem.setAttribute('status','edited');
      break;
    case 'edited':
      break;
  }
};

function switchTab(elem) {
  let tab = document.getElementById(elem);
  let activeTab = document.querySelector("#tab-bar > .active");
  let date = new Date();
  let today = date.toISOString().split('T')[0];
  date.setDate(date.getDate() + 1);
  let tomorrow = date.toISOString().split('T')[0];
  
  if (tab !== activeTab) {
    activeTab.classList.toggle('active');
    tab.classList.add('active');
    switch (elem) {
      case 'today-tasks':
        populateTaskList(today);
        break;
      case 'tomorrow-tasks':
        populateTaskList(tomorrow);
        break;
      case 'all-tasks':
        populateTaskList();
        break;
    };
  };
}

function setPlaceholderStatus(elem) {
  const element = elem.id
  if (elem.value === '' || elem.innerText === '') {
    switch (element) {
      case 'tag-input':
        elem.placeholder = 'Add a tag';
        break;
      case 'new-task-input':
        if (todayCounter.innerText == 0) {
          elem.placeholder = 'Start planning your day!';
        } else {
          elem.placeholder = 'Enter new task';
        };  
        break;
      case 'due-date-input':
        elem.className = "due-date-input";
        // elem.type = "text";
        break;
      case 'due-time-input':
        elem.className = "due-time-input";
        // elem.type = "text";
        break;
      case 'description-input':
        elem.style.color = "var(--grey)";
        elem.innerText = 'Add a note';
        elem.setAttribute('status', 'default');
        break;
    }
  }
};