import createTask from "./todo";

function createProject(name = '') {
    return {
        name,
        taskList: [],
        id: crypto.randomUUID(),

    addTaskToProject(task) {
        task.projectId = this.id;
        this.taskList.push(task);
    },
    deleteTaskFromProject(index) {
        if(index > -1){
            this.taskList.splice(index, 1);
        }
    },
    sortTasksByPriority(pref = '') {
        const prefOptions = ["ascending", "descending"];
        if(!prefOptions.includes(pref)){
            return;
        }
        let sortList = [];
        // Get high priority tasks
        const highPriorityTasks = this.taskList.filter((task) => task.priority === "high");
        const medPriorityTasks = this.taskList.filter((task) => task.priority === "medium");
        const lowPriorityTasks = this.taskList.filter((task) => task.priority === "low");
        
        if(pref === prefOptions[0]){
            sortList = [...highPriorityTasks, ...medPriorityTasks, ...lowPriorityTasks];
        } else if(pref === prefOptions[1]){
            sortList = [...lowPriorityTasks, ...medPriorityTasks, ...highPriorityTasks];
        }
        this.taskList = sortList;
    }
    }
}

export default createProject;