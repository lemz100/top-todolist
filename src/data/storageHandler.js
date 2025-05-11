import createTask from "../models/todo";
import createProject from "../models/projects";

const STORAGE_KEY = 'projects';

// Adding a single project to storage
export function addProjectToStorage(newProject) {
    const existingProjects = loadProjects(); 
    existingProjects.push(newProject);       
    saveProjects(existingProjects);          
}

// Deleting a single project from storage
export function deleteProject(projectName) {
    const projects = loadProjects(); 
    const updated = projects.filter(project => project.name !== projectName); // Remove matching
    saveProjects(updated); 
}

// Saving projects to storage.
export function saveProjects(projects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

// Loading projects from storage.
export function loadProjects() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {return []; };
    const rawProjects = JSON.parse(data);
    return rawProjects.map(reAttachMethodsToProject);
}

export function clearStorage() {
    localStorage.removeItem(STORAGE_KEY);
}

export function reAttachMethodsToTask(taskData) {
    const task = createTask(taskData.title, taskData.description, taskData.dueDate, taskData.priority, taskData.projectId);
    task.status = taskData.status;
    task.notes = taskData.notes;
    task.id = taskData.id;
    task.checkList = taskData.checkList || [];

    // Return re-attached object
    return task;
}

export function reAttachMethodsToProject(projectData) {
    const project = createProject(projectData.name);
    project.id = projectData.id;
    project.taskList = projectData.taskList.map(reAttachMethodsToTask);
    return project;
}