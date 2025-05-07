import createTask from '../models/todo.js';
import createProject from '../models/projects.js';
import { loadProjects } from '../data/storageHandler.js';

function ProjectPage (project) {
    const container = document.querySelector(".main-box-page");
    if(container.innerHTML!==""){
        container.innerHTML = "";
    }
    
    // Implement functionality where tasks aren't in array
    // Implement functionality to populate wrapper with tasks.
    // Implement functionality to add dialog to show task management options.
    // High priority = rgba(106, 0, 0, 0.804)
    //

}   

export default ProjectPage;