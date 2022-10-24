import { LightningElement, api } from 'lwc';

export default class EventActivity extends LightningElement {
    @api event;
    @api toggleDetails;
    openModal = false;
    eventFields = {};

    get subject(){
        return this.event.Subject;
    }

    get eventId(){
        return this.event.Id;
    }

    get toggleEventId(){
        return 'event'+this.event.Id;
    }
    get contactName(){
        return this.event.ContactName;
    }

    get contactURL(){
        return '/'+this.event.ContactId;
    }
    
    get eventURL(){
        return '/'+this.event.Id;
    }

    get leadURL(){
        return '/'+this.event.WhoId;
    }

    get company(){
        return this.event.LeadCompany;
    }

    get description(){
        return this.event.Description;
    }

    get dueDate(){
        return this.event.ActivityDate;
    }

    get location(){
        return this.event.Location;
    }

    get hours(){
        if(this.event.StartDateTime){
            const date = new Date(this.event.StartDateTime);
            const minutes = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
         return date.getHours()+':'+minutes;
        }
        return ;   
    }

    get date(){
        if(this.event.StartDateTime){
            const date = new Date(this.event.StartDateTime);
            const month = date.getMonth() < 9 ? '0'+(date.getMonth()+1) : date.getMonth(date.getMonth()+1);
         return date.getDate()+'.'+month;
        }
        return ;   
    }

    get startTime(){
        if(this.event.StartDateTime){
            const date = new Date(this.event.StartDateTime);
            const minutes = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
         return date.getDate()+'.'+(date.getMonth()+1)+'.'+date.getFullYear()+', '+date.getHours()+':'+minutes;
        }
        return ;    
    }

    get endTime(){
        if(this.event.EndDateTime){
            const date = new Date(this.event.EndDateTime);
            const minutes = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
         return date.getDate()+'.'+(date.getMonth()+1)+'.'+date.getFullYear()+', '+date.getHours()+':'+minutes;
        }
        return ;    
    }

    handleEdit(event){
        event.preventDefault();
        this.closeDropdownOnAction();
        this.openModal = true;
        this.eventFields.edit = true;
        this.eventFields.fields = [  {label : 'Subject',name: 'Subject' , type: 'text', value: this.subject, text: true},
                                    {label : 'Location',name: 'Location' , type: 'text', value: this.event.Location, text: true},
                                    {label : 'Start time',name: 'StartDateTime' , type: 'datetime', value: this.event.StartDateTime, text: true},
                                    {label : 'End time',name: 'EndDateTime' , type: 'datetime', value: this.event.EndDateTime, text: true},
                                    {label : 'Description',name: 'Description', type: 'text', value: this.event.Description, textarea: true}
            ];
    }

    handleDelete(){
        this.closeDropdownOnAction();
        this.openModal = true;
        this.eventFields.delete = true;
    }

    hideModalBox(){
        this.openModal = false;
        this.eventFields.delete = false;
        this.eventFields.edit = false;
    }

    updateRecord(event){
        event.preventDefault();
        if(this.eventFields.delete){
            const deleteEvent = new CustomEvent("delete",{detail: this.event.Id});
            this.dispatchEvent(deleteEvent);
        }
        if(this.eventFields.edit){
            const record = event.detail;
            record.Id = this.event.Id;
            const updateEvent = new CustomEvent('update', {detail: record})
            this.dispatchEvent(updateEvent);
        }
    }

    closeOpenDropdown(event){
        var eventClass = this.template.querySelector('[data-dropdown-id="'+this.event.Id+'"]');
        if(eventClass.className.includes('slds-is-open')) // if section is open
            eventClass.className = 'slds-dropdown-trigger slds-dropdown-trigger_click'; //set class to close 
        else
            eventClass.className = 'slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open'; //set class to be open
    }

    closeDropdownOnAction(){
        var eventClass = this.template.querySelector('[data-dropdown-id="'+this.event.Id+'"]');
        eventClass.className = 'slds-dropdown-trigger slds-dropdown-trigger_click';
    }
}