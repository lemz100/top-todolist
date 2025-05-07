import { format, parse } from 'date-fns';

// To-do task functionality.

function createTask (title, description, inputDate, priority) {
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

        // Update status variable
        markDone() {
            this.status = 'Done';
        },
        // Add item to checklist
        addChecklistTask(item) {
            this.checkList.push({task: item, done: false});
        },
        // Delete item from checklist
        deleteCheckListTask(index) {
            if(index > -1){
                this.checkList.splice(index, 1);
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