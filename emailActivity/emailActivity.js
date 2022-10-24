import { LightningElement, api } from 'lwc';

export default class EmailActivity extends LightningElement {
    @api email;
    @api toggleDetails;
    openModal = false;
    emailFields = {};

    get subject(){
        return this.email.Subject;
    }

    get emailId(){
        return this.email.Id;
    }

    get toggleEmailId(){
        return 'email'+this.email.Id;
    }
    get contactName(){
        return this.email.ContactName;
    }

    get contactURL(){
        return '/'+this.email.ContactId;
    }
    
    get emailURL(){
        return '/'+this.email.Id;
    }

    get leadURL(){
        return '/'+this.email.WhoId;
    }

    get company(){
        return this.email.LeadCompany;
    }

    get description(){
        return this.email.LeadDescription;
    }

    get dueDate(){
        return this.email.ActivityDate;
    }

    get fromAddress(){
        return this.email.FromAddress;
    }

    get toAddress(){
        return this.email.ToAddress;
    }

    get textBody(){
        return this.email.TextBody;
    }

    get fromName(){
        return this.email.FromName;
    }

    get hours(){
        if(this.email.CreatedDate){
            const date = new Date(this.email.CreatedDate);
            const minutes = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
            return date.getHours()+':'+minutes+'';
        }        
        return;
    }

    get date(){
        if(this.email.CreatedDate){
            const date = new Date(this.email.CreatedDate);
            const month = date.getMonth() < 9 ? '0'+(date.getMonth()+1) : date.getMonth(date.getMonth()+1);
            return date.getDate()+'.'+month;
        }        
        return;
    }

    handleDelete(){
        this.closeDropdownOnAction();
        this.openModal = true;
        this.emailFields.delete = true;
    } 

    hideModalBox(){
        this.openModal = false;
        this.emailFields.delete = false;
        this.emailFields.edit = false;
    }

    updateRecord(event){
        event.preventDefault();
        if(this.emailFields.delete){
            const deleteEvent = new CustomEvent("delete",{detail: this.email.Id});
            this.dispatchEvent(deleteEvent);
        }
    }

    closeOpenDropdown(event){
        var callClass = this.template.querySelector('[data-dropdown-id="'+this.email.Id+'"]');
        if(callClass.className.includes('slds-is-open')) // if section is open
            callClass.className = 'slds-dropdown-trigger slds-dropdown-trigger_click'; //set class to close 
        else
            callClass.className = 'slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open'; //set class to be open
    }

    closeDropdownOnAction(){
        var callClass = this.template.querySelector('[data-dropdown-id="'+this.email.Id+'"]');
        callClass.className = 'slds-dropdown-trigger slds-dropdown-trigger_click';
    }
    
}