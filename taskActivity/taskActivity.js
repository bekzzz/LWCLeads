import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class TaskActivity extends NavigationMixin(LightningElement) {
    @api task;
    @api toggleDetails;
    openModal = false;
    taskFields = {};

    get subject(){
        return this.task.Subject;
    }

    get taskId(){
        return this.task.Id;
    }

    get toggleTaskId(){
        return 'task'+this.task.Id;
    }
    get contactName(){
        return this.task.ContactName;
    }

    get contactURL(){
        return '/'+this.task.ContactId;
    }
    
    get taskURL(){
        return '/'+this.task.Id;
    }

    get leadURL(){
        return '/'+this.task.WhoId;
    }

    get company(){
        return this.task.LeadCompany;
    }

    get description(){
        return this.task.Description;
    }

    get dueDate(){
        if(this.task.ActivityDate){
            const date = new Date(this.task.ActivityDate);
            //CTC-SD Code change to get month name
            const month = date.toLocaleString('en-us', { month: 'short' });
            return date.getDate()+' '+month;
        }
        return ;
    }

    get isOverdue(){
        if(this.task.ActivityDate && this.task.Status == 'Open')
            return new Date(this.task.ActivityDate) > new Date() ? false : true;  
        else
            return false;

    }

    handleEdit(event){
        event.preventDefault();
        this.closeDropdownOnAction();
        this.openModal = true;
        this.taskFields.edit = true;
        this.taskFields.fields = [  {label : 'Subject',name: 'Subject' , type: 'text', value: this.subject, text: true},
                                    {label : 'Due Date',name: 'ActivityDate' , type: 'date', value: this.task.ActivityDate, text: true},
                                    {label : 'Status',name: 'Status' , type: 'text', value: this.task.Status, picklist: true, options: [{label: 'Open', value: 'Open'},{label: 'Completed', value: 'Completed'}]},
                                    {label : 'Comments',name: 'Description', type: 'text', value: this.task.Description, textarea: true}
            ];
    }

    handleDelete(){
        this.closeDropdownOnAction();
        this.openModal = true;
        this.taskFields.delete = true;
    }

    hideModalBox(){
        this.openModal = false;
        this.taskFields.delete = false;
        this.taskFields.edit = false;
    }

    updateRecord(event){
        event.preventDefault();
        if(this.taskFields.delete){
            const deleteEvent = new CustomEvent("delete",{detail: this.task.Id});
            this.dispatchEvent(deleteEvent);
        }
        if(this.taskFields.edit){
            const record = event.detail;
            record.Id = this.task.Id;
            const updateEvent = new CustomEvent('update', {detail: record})
            this.dispatchEvent(updateEvent);
        }
    }

    closeOpenDropdown(event){
        var taskClass = this.template.querySelector('[data-dropdown-id="'+this.task.Id+'"]');
        if(taskClass.className.includes('slds-is-open')) // if section is open
            taskClass.className = 'slds-dropdown-trigger slds-dropdown-trigger_click'; //set class to close 
        else
            taskClass.className = 'slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open'; //set class to be open
    }

    closeDropdownOnAction(){
        var taskClass = this.template.querySelector('[data-dropdown-id="'+this.task.Id+'"]');
        taskClass.className = 'slds-dropdown-trigger slds-dropdown-trigger_click';
    }
}