import createTask from '../models/todo.js';
import createProject from '../models/projects.js';
import { loadProjects, saveProjects } from '../data/storageHandler.js';
import ProjectsManager from './myProjects.js';

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
    addTaskButton.addEventListener("click", () => addTaskDialogMethod(project, tasksWrapperDiv));
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
        const taskTitle = document.createElement("h1");
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
            // TO IMPLEMENT.
        })
        
        taskRightDiv.append(taskInfoBtn); 
        taskCardDiv.append(taskLeftDiv, taskCenterDiv, taskRightDiv);
        taskWrapper.append(taskCardDiv);
    })
}

// Task Dialog Handler.
function addTaskDialogMethod(project, tasksWrapperDiv) {
    const addTaskDialog = document.createElement("dialog");
    addTaskDialog.id = "add-task-dialog";
    const dialogH3 = document.createElement("h3");
    dialogH3.textContent = "Enter New Task Details Below:";
    const dialogCloseBtn = document.createElement("button");
    dialogCloseBtn.id = "close-dialog";
    dialogCloseBtn.textContent = "X";
    dialogCloseBtn.addEventListener("click", () => {
        addTaskDialog.close();
    });
    addTaskDialog.append(dialogH3, dialogCloseBtn);


    const addTaskDialogForm = document.createElement("form");
    addTaskDialogForm.method = "dialog";

    // Task Name Label + Input DOM
    const tnLabel = document.createElement("label");
    tnLabel.for = "task-name";
    tnLabel.textContent = "Task Name:";
    const tnInput = document.createElement("input");
    tnInput.type = "text";
    tnInput.name = "task-name";
    tnInput.required = true;

    // Task description Label + Input DOM
    const tdLabel = document.createElement("label");
    tdLabel.for = "task-desc";
    tdLabel.textContent = "Task Description:";
    const tdInput = document.createElement("textarea");
    tdInput.name = "task-desc";
    tdInput.placeholder = "Enter your task description here...";
    tdInput.required = true;

    // Task Due Date Label + Input DOM
    const tdateLabel = document.createElement("label");
    tdateLabel.for = "input-date";
    tdateLabel.textContent = "Task Due Date:";
    const tdateInput = document.createElement("input");
    tdateInput.type = "date";
    tdateInput.name = "input-date";
    tdateInput.min = getTodayDateForInput();
    tdateInput.value = getTodayDateForInput();
    tdateInput.required = true;

    // Task Priority Label + Input DOM
    const tpLabel = document.createElement("label");
    tpLabel.for = "task-priority";
    tpLabel.textContent = "Task Priority:";
    const tpDropDown = document.createElement("select");
    tpDropDown.name = "task-priority";
    let priorities = ["High", "Medium", "Low"];
    priorities.forEach((priority) => {
        const option = document.createElement("option");
        option.value = priority.toLowerCase();
        option.textContent = priority;
        tpDropDown.append(option);
    })

    // Submit Task Button DOM
    const taskSubmitBtn = document.createElement("button");
    taskSubmitBtn.type = "submit";
    taskSubmitBtn.textContent = "Submit New Task";
    addTaskDialogForm.addEventListener("submit", e => {
        e.preventDefault();
        console.log("submittedd");
        // Processes date input to dd-MM-yyyy format as required.
        let date = processDateInput(tdateInput.value);
        let newTask = createTask(tnInput.value, tdInput.value, date, tpDropDown.value);
        project.addTaskToProject(newTask);
        
        const allProjects = loadProjects();
        const updatedProjects = allProjects.map(p => {
            if(p.name === project.name){
                return project;
            }
            return p;
        });
        saveProjects(updatedProjects);
        tasksWrapperDiv.innerHTML = "";
        populateTaskWrapper(project.taskList, tasksWrapperDiv);
        alert("Task added!");
        addTaskDialogForm.reset();
        addTaskDialog.close();
    })
    addTaskDialogForm.append(tnLabel, tnInput, tdLabel, tdInput, tdateLabel, tdateInput, tpLabel, tpDropDown, taskSubmitBtn);
    addTaskDialog.append(addTaskDialogForm);
    document.body.appendChild(addTaskDialog);
    addTaskDialog.showModal();
}

// Function to process and return date in dd-MM-yyyy form.
function processDateInput (date){
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
}

function addTaskInfoDialog(task, taskWrapper){
    // TO IMPLEMENT LATER FOR TASKINFOBTN EVENT LISTENER.
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