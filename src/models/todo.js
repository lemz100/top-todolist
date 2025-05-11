import { format, parse } from 'date-fns';

// To-do task functionality.

function createTask (title, description, inputDate, priority, projectId) {
    const parsedDate = parse(inputDate, 'dd-MM-yyyy', new Date()); // input must match format
    const formattedDate = format(parsedDate, 'dd-MM-yyyy'); // ensures consistency
    
    return {
        title,
        description,
        dueDate: formattedDate,
        priority: priority.toLowerCase(), 
        status: 'Not Started',
        checkList: [],
        notes: '',
        id: crypto.randomUUID(),
        projectId,

        // Update status variable
        markCompleted() {
            this.status = 'Completed';
        },
        markStarted() {
            this.status = 'Started';
        },
        markNotStarted() {
            this.status = "Not Started";
        },
        // Add item to checklist
        addChecklistTask(item) {
            this.checkList.push({task: item, done: false});
        },
        markChecklistTaskDone(item) {
            const taskItem = this.checkList.find(task => task.task === item);
            if (taskItem) {
                taskItem.done = true;
            }
        },
        // Update task notes
        updateNotes(newNotes) {
            this.notes = newNotes;
        },
        // Update task description
        updateDesc(newDesc) {
            this.description = newDesc;
        }
    };
}

export default createTask;