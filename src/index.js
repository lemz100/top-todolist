import createTask from './models/todo.js';
import createProject from './models/projects.js';
import { saveProjects, loadProjects, clearStorage } from './data/storageHandler.js';


const tasks = [
    createTask("Grocery Shopping", "Buy vegetables and fruits", "08-05-2025", "Medium"),
    createTask("Workout", "Leg day at the gym", "06-05-2025", "High"),
    createTask("Read Book", "Finish chapter 5", "10-05-2025", "Low"),
    createTask("Pay Bills", "Electricity and internet", "07-05-2025", "High"),
    createTask("Clean Room", "Vacuum and organize desk", "09-05-2025", "Medium"),
    createTask("Call Mum", "Check in with mum", "06-05-2025", "Low"),
    createTask("Finish Assignment", "Complete coding exercise", "08-05-2025", "High"),
    createTask("Plan Weekend", "Decide what to do Saturday", "10-05-2025", "Medium")
];
const project1 = createProject("Today");
tasks.forEach((task) => {
    project1.addTaskToProject(task);
});
console.log(project1);