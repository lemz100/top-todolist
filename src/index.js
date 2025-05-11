import createTask from './models/todo.js';
import createProject from './models/projects.js';
import { saveProjects, loadProjects, clearStorage, deleteProject } from './data/storageHandler.js';
import ProjectsManager from './ui-comp/myProjects.js';
import './styles.css';

ProjectsManager();