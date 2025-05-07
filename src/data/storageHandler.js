import createTask from "../models/todo";
import createProject from "../models/projects";

const STORAGE_KEY = 'projects';

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
    const task = createTask(taskData.title, taskData.description, taskData.dueDate, taskData.priority);
    task.status = taskData.status;
    task.checkList = taskData.checkList || [];

    // Return re-attached object
    return task;
}

export function reAttachMethodsToProject(projectData) {
    const project = createProject(projectData.name);
    project.taskList = projectData.taskList.map(reAttachMethodsToTask);
    return project;
}