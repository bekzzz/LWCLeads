import { LightningElement, api } from 'lwc';

export default class CallActivity extends LightningElement {
    @api call;
    @api toggleDetails;
    openModal = false;
    callFields = {};

    get subject(){
        return this.call.Subject;
    }

    get callId(){
        return this.call.Id;
    }

    get toggleCallId(){
        return 'call'+this.call.Id;
    }
    get contactName(){
        return this.call.ContactName;
    }

    get contactURL(){
        return '/'+this.call.ContactId;
    }
    
    get callURL(){
        return '/'+this.call.Id;
    }

    get leadURL(){
        return '/'+this.call.WhoId;
    }

    get company(){
        return this.call.LeadCompany;
    }

    get description(){
        return this.call.Description;
    }

    get dueDate(){
         if(this.call.ActivityDate){
            const date = new Date(this.call.ActivityDate);
            const month = date.getMonth() < 9 ? '0'+(date.getMonth()+1) : date.getMonth(date.getMonth()+1);
            return date.getDate()+'.'+month;
        }
        return ;
    }

    handleEdit(event){
        event.preventDefault();
        this.closeDropdownOnAction();
        this.openModal = true;
        this.callFields.edit = true;
        this.callFields.fields = [  {label : 'Subject',name: 'Subject' , type: 'text', value: this.subject, text: true},
                                    {label : 'Due Date',name: 'ActivityDate' , type: 'date', value: this.call.ActivityDate, text: true},
                                    {label : 'Status',name: 'Status' , type: 'text', value: this.call.Status, picklist: true, options: [{label: 'Open', value: 'Open'},{label: 'Completed', value: 'Completed'}]},
                                    {label : 'Comments',name: 'Description', type: 'text', value: this.call.Description, textarea: true}
            ];
    }

    handleDelete(){
        this.closeDropdownOnAction();
        this.openModal = true;
        this.callFields.delete = true;
    } 

    hideModalBox(){
        this.openModal = false;
        this.callFields.delete = false;
        this.callFields.edit = false;
    }

    updateRecord(event){
        event.preventDefault();
        if(this.callFields.delete){
            const deleteEvent = new CustomEvent("delete",{detail: this.call.Id});
            this.dispatchEvent(deleteEvent);
        }
        if(this.callFields.edit){
            const record = event.detail;
            record.Id = this.call.Id;
            const updateEvent = new CustomEvent('update', {detail: record})
            this.dispatchEvent(updateEvent);
        }
    }

    closeOpenDropdown(event){
        var callClass = this.template.querySelector('[data-dropdown-id="'+this.call.Id+'"]');
        if(callClass.className.includes('slds-is-open')) // if section is open
            callClass.className = 'slds-dropdown-trigger slds-dropdown-trigger_click'; //set class to close 
        else
            callClass.className = 'slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open'; //set class to be open
    }

    closeDropdownOnAction(){
        var callClass = this.template.querySelector('[data-dropdown-id="'+this.call.Id+'"]');
        callClass.className = 'slds-dropdown-trigger slds-dropdown-trigger_click';
    }
}