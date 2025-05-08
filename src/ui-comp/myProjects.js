import { addProjectToStorage, saveProjects, loadProjects, clearStorage, deleteProject } from '../data/storageHandler.js';
import createProject from '../models/projects.js';
import ProjectPage from './projectPage.js';

function ProjectsManager () {
    const container = document.querySelector('.main-box-page');
    if(container.innerHTML!==""){
        container.innerHTML = "";
    }
    // Page Header Styling
    const pageHeader = document.createElement('div');
    const phHeader1 = document.createElement('h1');
    const phHeader2 = document.createElement('h2');
    phHeader1.textContent = "Your Projects";
    phHeader2.textContent = "Select a Project below:";
    pageHeader.classList.add('page-header');
    pageHeader.append(phHeader1, phHeader2);
    container.appendChild(pageHeader);

    // Content Wrapper Styling
    const contentWrapper = document.createElement('div');
    const navBar = document.createElement('div');
    const projectWrapper = document.createElement('div');
    contentWrapper.classList.add('content-wrapper');

    // Navigation Bar DOM Manipulation
    navBar.classList.add('navbar');
    const addProjectButton = document.createElement("button");
    const deleteProjectButton = document.createElement("button");
    addProjectButton.id = "addProjBtn";
    deleteProjectButton.id = "deleteProjBtn";
    addProjectButton.textContent = "Add Project";
    deleteProjectButton.textContent = "Delete Project";
    // Navigation bar - button event listeners.
    addProjectButton.addEventListener("click", () => {
        console.log("clicked");
        // Dynamic Elements
        const addProjDialog = document.createElement("dialog");
        const addProjForm = document.createElement("form");
        const closeDialog = document.createElement("button");
        const formH2 = document.createElement("h2");
        const formInputsDiv = document.createElement("div");
        const projectNameLabel = document.createElement("label");
        const projectNameInput = document.createElement("input");
        const submitBtn = document.createElement("button");

        // Element attributes.
        addProjDialog.id = "add-proj-dialog";
        addProjForm.method = "dialog";
        closeDialog.id = "close-dialog";
        closeDialog.textContent = "X";
        formH2.textContent = "Add new Project:";
        formInputsDiv.classList.add("formInputs");
        const labelText = document.createTextNode("Project Name:");
        projectNameLabel.append(labelText);
        projectNameInput.type = "text";
        projectNameInput.name = "project-name";
        projectNameInput.required = true;
        submitBtn.type = "submit";
        submitBtn.textContent = "Add Project";

        // Button listeners.
        addProjForm.addEventListener("submit", e => {
            e.preventDefault();
            let newProject = createProject(projectNameInput.value);
            addProjectToStorage(newProject);
            alert("Project Added!");
            addProjDialog.close();
            projectWrapper.innerHTML = "";
            const updatedProjects = loadProjects();
            updateProjectsPanel(updatedProjects, projectWrapper);
        });
        closeDialog.addEventListener("click", () => {
            addProjDialog.close();
        });
        
        projectNameLabel.append(projectNameInput);
        formInputsDiv.append(projectNameLabel);
        addProjForm.append(closeDialog, formH2, formInputsDiv, submitBtn);
        addProjDialog.append(addProjForm);
        container.append(addProjDialog);
        addProjDialog.show();
    })
    deleteProjectButton.addEventListener("click", () => {
        const deleteProjectName = prompt("Enter the name of the project you want to delete: ");
        if(!deleteProjectName) return;

        let projects = loadProjects();
        let projectExists = projects.some(p => p.name === deleteProjectName);
        
        if(!projectExists) {
            alert("Project not found.");
            return;
        }
        if(confirm(`Are you sure you would like to delete "${deleteProjectName}"?`)) {
            deleteProject(deleteProjectName);
            alert("Project Deleted.");
            projectWrapper.innerHTML = "";
            const updatedProjects = loadProjects();
            updateProjectsPanel(updatedProjects, projectWrapper);
        }
    })
    navBar.append(addProjectButton, deleteProjectButton);
    contentWrapper.append(navBar);
    
    // Project Wrapper Styling
    projectWrapper.classList.add('project-wrapper');
    
    // Rendering the projects into project wrapper.
    let projects = loadProjects();
    if (!projects || projects.length === 0) {
        console.log("Needs a default project");
        const defaultProject = createProject("Default Project");
        saveProjects([defaultProject]);
        projects = loadProjects();
    }

    // Render project panel
    updateProjectsPanel(projects, projectWrapper);
    contentWrapper.append(projectWrapper);
    container.append(contentWrapper);  
}

// Update projects
function updateProjectsPanel (projects, projectWrapper){
    projects.map((project) => {
    const projectBtn = document.createElement("button");
    projectBtn.classList.add("project-btn");
    const projectBtnName = document.createElement("h1");
    const projectBtnTaskCount = document.createElement("p");
    projectBtnName.textContent = project.name;
    projectBtnTaskCount.textContent = (() => {
        let s = "task";
        let sPlural = "s";
        let taskCount = project.taskList.length;
    
        if (taskCount === 0) {
            return "No tasks in this project - Add some!";
        } else if (taskCount === 1) {
            return taskCount + " " + s + " left in this project";
        } else {
            return taskCount + " " + s + sPlural + " left in this project";
        }
    })();
    projectBtn.append(projectBtnName, projectBtnTaskCount);
    projectBtn.addEventListener("click", () => {
        ProjectPage(project);
    })
    
    projectWrapper.append(projectBtn);
})
}

export default ProjectsManager;