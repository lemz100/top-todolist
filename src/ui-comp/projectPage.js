import createTask from '../models/todo.js';
import { loadProjects, saveProjects } from '../data/storageHandler.js';
import ProjectsManager from './myProjects.js';

const taskInfoDialog = document.querySelector("#task-info-dialog");
const taskInfoDialogForm = taskInfoDialog.querySelector("form");
const closeInfoDialog = taskInfoDialogForm.querySelector("#close-dialog");
const addChecklistItemBtn = taskInfoDialogForm.querySelector("#addChecklistItem");
const deleteChecklistItemBtn = taskInfoDialogForm.querySelector("#deleteChecklistItem");
const checklistInput = taskInfoDialogForm.querySelector("#checklist-input");
let currentTask = null;
let currentTaskWrapper = null;

taskInfoDialogForm.addEventListener("submit", handleTaskInfoSubmit);
closeInfoDialog.addEventListener("click", () => {
        taskInfoDialog.close();
});

let tempChecklist = [];
addChecklistItemBtn.addEventListener("click", () => {
    if (checklistInput.value) {
        tempChecklist.push({ task: checklistInput.value});

        const checklistList = taskInfoDialogForm.querySelector("#checklistItems");
        const itemElem = document.createElement("li");
        itemElem.textContent = checklistInput.value;
        checklistList.append(itemElem);

        checklistInput.value = "";
    }
});
deleteChecklistItemBtn.addEventListener("click", () => {
    const value = checklistInput.value.trim();
    if(value){
        tempChecklist = tempChecklist.filter(item => item.task !== value);
        const checklistList = taskInfoDialogForm.querySelector("#checklistItems");
        checklistList.innerHTML = "";
        tempChecklist.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item.task;
            checklistList.appendChild(li);
        });
    }
    checklistInput.value = "";
});

function ProjectPage (project) {
    const container = document.querySelector(".main-box-page");
    if(container.innerHTML!==""){
        container.innerHTML = "";
    }
    
    const pageHeaderDiv = document.createElement("div");
    pageHeaderDiv.classList.add("page-header");
    const tasksWrapperDiv = document.createElement("div");
    tasksWrapperDiv.classList.add("tasks-wrapper");
    const optionsBarDiv = document.createElement("div");
    optionsBarDiv.classList.add("options-bar");

    // Page Header
    const phH1 = document.createElement("h1");
    const phH2 = document.createElement("h2");
    phH1.textContent = project.name;
    phH2.textContent = "Tasks:";
    pageHeaderDiv.append(phH1, phH2);
    container.append(pageHeaderDiv);

    // Tasks Wrapper
    // Checks if no tasks in tasklist.
    if(project.taskList.length === 0){
        if(tasksWrapperDiv.innerHTML !== "") {
            tasksWrapperDiv.innerHTML = "";
        }
        const addTaskH1Div = document.createElement("div");
        addTaskH1Div.id = "notasks-header-wrapper";
        const addTaskH1 = document.createElement("h1");
        addTaskH1.textContent = "Add a task here using the buttons below!";
        addTaskH1.id = "notasks-header";
        addTaskH1Div.appendChild(addTaskH1);
        tasksWrapperDiv.appendChild(addTaskH1Div);
    } else {
        // Populates task wrapper with helper function.
        populateTaskWrapper(project.taskList, tasksWrapperDiv);
    }
    container.append(tasksWrapperDiv);

    // Options Bar
    const returnButton = document.createElement("button");
    returnButton.textContent = "Go Back";
    returnButton.addEventListener("click", ProjectsManager);
    const addTaskButton = document.createElement("button");
    addTaskButton.id = "add-task-btn";
    addTaskButton.textContent = "Add New Task";
    addTaskButton.addEventListener("click", () => showTaskDialog(project, tasksWrapperDiv));
    const deleteTaskButton = document.createElement("button");
    deleteTaskButton.id = "delete-task-btn";
    deleteTaskButton.textContent = "Delete Task";
    deleteTaskButton.addEventListener("click", () => {
        const deleteTaskName = prompt("Enter the name of the task you would like to delete here: ");
        if(!deleteTaskName) return;
        if(confirm(`Are you sure you want to delete "${deleteTaskName}"?`)) {
            const newTaskList = project.taskList.filter((task) => {
                return task.title.toLowerCase() !== deleteTaskName.toLowerCase();
            });
            project.taskList = newTaskList;
            const allProjects = loadProjects();
            const updatedProjects = allProjects.map(p => p.name === project.name ? project : p);
            saveProjects(updatedProjects);
            populateTaskWrapper(project.taskList, tasksWrapperDiv);
        }
    })
    optionsBarDiv.append(returnButton, addTaskButton, deleteTaskButton);
    container.append(optionsBarDiv);
}

function populateTaskWrapper(listOfTasks, taskWrapper) {
    if(taskWrapper.innerHTML!==""){
        taskWrapper.innerHTML = "";
    }

    // Sorts tasks in the wrapper
    listOfTasks.sort((task1, task2) => {
        // Checks if task is complete - moves task to the lowest in the list.
        if (task1.status === "Completed" && task2.status !== "Completed") return 1;
        if (task2.status === "Completed" && task1.status !== "Completed") return -1;    
        
        // Compares & sorts by priority first.
        const priorityOrder = { high: 0, medium: 1, low: 2};
        // Checks if task 1 and 2 priorities are not the same.
        if(priorityOrder[task1.priority] !== priorityOrder[task2.priority]) {
            return priorityOrder[task1.priority] - priorityOrder[task2.priority];
        }
        // If priorities are the same, sort by date.
        const date1 = new Date(task1.dueDate.split('-').reverse().join('-'));
        const date2 = new Date(task2.dueDate.split('-').reverse().join('-'));
        return date1 - date2;
    });

    listOfTasks.map((task) => {
        // Task Card Div
        const taskCardDiv = document.createElement("div");
        taskCardDiv.classList.add("task-card");

        // Task Left Div
        const taskLeftDiv = document.createElement("div");
        taskLeftDiv.classList.add("task-left-content");
        const taskTitle = document.createElement("h2");
        taskTitle.textContent = task.title;
        const taskPriority = document.createElement("p");
        // Priority: + priority with first letter capitalized. E.g. - 'High'.
        taskPriority.textContent = "Priority: " + (task.priority.charAt(0).toUpperCase() + task.priority.slice(1));
        switch(task.priority){
            case 'high':
                taskCardDiv.style.backgroundColor = "rgba(106, 0, 0, 0.804)";
                break;
            case 'medium':
                taskCardDiv.style.backgroundColor = "rgb(162, 106, 2)";
                break;
            case 'low':
                taskCardDiv.style.backgroundColor = "rgb(2, 121, 0)";
        }
        taskLeftDiv.append(taskTitle, taskPriority);

        // Task Center Div
        const taskCenterDiv = document.createElement("div");
        taskCenterDiv.classList.add("task-center-content");
        const taskDueDate = document.createElement("h2");
        taskDueDate.textContent = "Due: " + task.dueDate;
        const taskDescription = document.createElement("p");
        taskDescription.textContent = "Description: " + task.description;
        taskCenterDiv.append(taskDueDate, taskDescription);

        // Task Right Div
        const taskRightDiv = document.createElement("div");
        taskRightDiv.classList.add("task-right-content");
        const taskInfoBtn = document.createElement("button");
        taskInfoBtn.id = "task-infobtn";
        taskInfoBtn.textContent = "Click here for more info and to manage this task";
        taskInfoBtn.addEventListener("click", () => {
            showTaskInfoDialog(task, taskWrapper);
        })
        if(task.status === "Completed"){
            console.log("complete!");
            taskCardDiv.classList.add("completed");
        }
        taskRightDiv.append(taskInfoBtn); 
        taskCardDiv.append(taskLeftDiv, taskCenterDiv, taskRightDiv);
        taskWrapper.append(taskCardDiv);
    })
}

// Add Task Dialog Handler.
function showTaskDialog(project, tasksWrapperDiv) {
    const addTaskDialog = document.querySelector("#add-task-dialog");
    const addTaskDialogForm = addTaskDialog.querySelector("form");
    const dialogCloseBtn = addTaskDialog.querySelector("#close-dialog");

    const tdateInput = addTaskDialogForm.querySelector("#input-date");
    tdateInput.setAttribute("min", getTodayDateForInput());
    tdateInput.setAttribute("value", getTodayDateForInput());

    // Clone button to prevent event listeners stacking.
    const newCloseBtn = dialogCloseBtn.cloneNode(true);
    dialogCloseBtn.parentNode.replaceChild(newCloseBtn, dialogCloseBtn);
    newCloseBtn.addEventListener("click", () => {
        console.log("add tasks dialog closed");
        addTaskDialog.close();
    });
    
    // Clone button to prevent event listeners stacking.
    const newForm = addTaskDialogForm.cloneNode(true);
    addTaskDialogForm.parentNode.replaceChild(newForm, addTaskDialogForm);
    newForm.addEventListener("submit", e => {
        e.preventDefault();
        let taskName = newForm.querySelector("#task-name");
        let taskDesc = newForm.querySelector("#task-desc");
        let dateInput = newForm.querySelector("#input-date");
        let tpDd = newForm.querySelector("select");
        let date = processDateInput(dateInput.value);
        let newTask = createTask(taskName.value, taskDesc.value, date, tpDd.value, project.id);
        project.addTaskToProject(newTask);

        const allProjects = loadProjects();
        const updatedProjects = allProjects.map(p => {
            if (p.id === project.id) {
                p.taskList = [...project.taskList];
                return p;
            }
            return p;
        });
        saveProjects(updatedProjects);
        tasksWrapperDiv.innerHTML = "";
        populateTaskWrapper(project.taskList, tasksWrapperDiv);
        addTaskDialogForm.reset();
        addTaskDialog.close();
    })
    addTaskDialog.showModal();
}

function handleTaskInfoSubmit(e) {
    e.preventDefault();
    const task = currentTask;
    const taskWrapper = currentTaskWrapper;
    console.log(task);
    console.log(taskWrapper);
    if(!task || !taskWrapper) return;
    const fieldset1 = taskInfoDialogForm.querySelector("#main-info");
    const fieldset2 = taskInfoDialogForm.querySelector("#second-info");
    const fieldset3 = taskInfoDialogForm.querySelector("#third-info");    
    
    const titleInput = fieldset1.querySelector("label #task-title");
    const dateInput = fieldset1.querySelector("label #task-duedate");
    const priorInput = fieldset1.querySelector("label #task-priority-dd");
    const descInput = fieldset2.querySelector(".task-desc-container textarea");
    const notesInput = fieldset3.querySelector("label #task-notes");

    task.title = titleInput.value.trim();
    task.dueDate = processDateInput(dateInput.value);
    task.priority = priorInput.value;
    task.description = descInput.value.trim();
    task.notes = notesInput.value.trim();

    const statusRadioButtons = document.querySelectorAll('input[name="status"]');
    statusRadioButtons.forEach(radio => {
    if (radio.checked) {
      if (radio.id === "status-1") task.markNotStarted();
      else if (radio.id === "status-2") task.markStarted();
      else if (radio.id === "status-3") task.markCompleted();
    }
    });
    
    task.checkList = [...tempChecklist];
    const allProjects = loadProjects();
    const project = allProjects.find(p => p.id === task.projectId);
    if (project) {
        const taskIndex = project.taskList.findIndex(t => t.id === task.id);
        if (taskIndex !== -1) {
            project.taskList[taskIndex] = task;
    }

    saveProjects(allProjects);
    populateTaskWrapper(project.taskList, taskWrapper);
    alert("Task Updated!");
  }

  taskInfoDialog.close();
}

function showTaskInfoDialog(task, taskWrapper) {
    currentTask = task;
    currentTaskWrapper = taskWrapper;
    tempChecklist = [...task.checkList];
    
    const fieldset1 = taskInfoDialogForm.querySelector("#main-info");
    const fieldset2 = taskInfoDialogForm.querySelector("#second-info");
    const fieldset3 = taskInfoDialogForm.querySelector("#third-info");

    const titleInput = fieldset1.querySelector("label #task-title");
    const dateInput = fieldset1.querySelector("label #task-duedate");
    const priorInput = fieldset1.querySelector("label #task-priority-dd");

    titleInput.value = currentTask.title;
    dateInput.value = currentTask.dueDate.split('-').reverse().join('-');
    priorInput.value = currentTask.priority;

    const descInput = fieldset2.querySelector(".task-desc-container textarea");
    descInput.value = currentTask.description;

    const checklistItemsList = fieldset2.querySelector("#checklistItems");
    checklistItemsList.innerHTML = "";
    let taskChecklistList = currentTask.checkList;
    taskChecklistList.forEach((item) => {
        const clItem = document.createElement("li");
        clItem.textContent = item.task;
        checklistItemsList.append(clItem);
    });

    const statusInput = (task) => {
        const statusMap = {
            "Not Started": "#status-1",
            "Started": "#status-2",
            "Completed": "#status-3"
        };
    
        const selector = statusMap[task.status];
        const input = selector ? fieldset3.querySelector(selector) : null;
        if (input) input.checked = true;
        return input;
    }
    statusInput(task);
    const notesInput = fieldset3.querySelector("label #task-notes");
    notesInput.value = task.notes;

    taskInfoDialog.showModal();
}

// Function to process and return date in dd-MM-yyyy form.
function processDateInput (date){
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
}

// Function to retrieve today's date as a string.
function getTodayDateForInput() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

export default ProjectPage;