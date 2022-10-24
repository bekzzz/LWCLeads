import { LightningElement, api, wire,track } from 'lwc';
import { getRecord, deleteRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateActivity from '@salesforce/apex/AccountController.updateActivity';
import deleteCall from '@salesforce/apex/AccountController.deleteCall';
import messagesFromLead from '@salesforce/apex/AccountController.messagesFromLead';
import leadsFromAccount from '@salesforce/apex/AccountController.leadsFromAccount';

export default class ActivitiesOnAccountFromLead extends LightningElement {
    emailMessagesIds = [];
    @track tasks = [];
    @track tasksUpComing = [];
    @track events = [];
    @track eventsUpComing;
    @track calls;
    @track emails;
    hasUpcomingActivity;
    hasCompletedActivities;
    wiredData;
    @api recordId;

    @wire(leadsFromAccount, {id: '$recordId'})
    leadsFromAcc(wireResult){
        this.wiredData = wireResult;
        const {data, error} = wireResult;
            if(data){
                this.tasks = [];
                this.tasksUpComing = [];
                this.events = [];
                this.eventsUpComing = [];
                this.calls = [];
                this.emails = [];
                this.emailMessagesIds = [];
                data.forEach(element => { this.populateAllActivities(element);});
                if(this.emailMessagesIds){
                    messagesFromLead({ids: this.emailMessagesIds}).
                    then(result => {
                        if(result){
                            result.forEach( emailMessage =>{this.emails.push(emailMessage)});
                        }
                        else if(error){
                            console.log(error);
                        }     
                    })
                }
                this.countUpcomingActivities();
            }
    }


    toggleDetails(event){
        var id = event.target.dataset.id;
        var activity = event.target.dataset.activity;
        var taskClass = this.template.querySelector('[data-id="'+activity+id+'"]');
        if(taskClass.className.includes('slds-is-open')) // if section is open
            taskClass.className = 'slds-timeline__item_expandable slds-timeline__item_'+activity; //set class to close 
        else
            taskClass.className = 'slds-timeline__item_expandable slds-timeline__item_'+activity+' slds-is-open'; //set class to be open
    }

    handleSection(event){
        var id = event.target.dataset.id;
        var taskClass = this.template.querySelector('[data-id="'+id+'"]');
        if(taskClass.className.includes('slds-is-open')) // if section is open
            taskClass.className = 'slds-section'; //set class to close 
        else
            taskClass.className = 'slds-section slds-is-open'; //set class to be open
    }

    countUpcomingActivities(){
        if(this.tasksUpComing.length > 0 || this.eventsUpComing.length > 0)
            this.hasUpcomingActivity = true;
        else
            this.hasUpcomingActivity =  false;

        if(this.tasks.length > 0 || this.events.length > 0 || this.calls.length > 0 || this.emails.length > 0)
            this.hasCompletedActivities = true;
        else
            this.hasCompletedActivities = false;
    }

    handleDelete(event){
        deleteCall({id: event.detail})
            .then(result => {
                this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Activity delete with success',
                            variant: 'Success'
                        })
                );
                refreshApex(this.wiredData);
            })
            .catch(error =>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: error.body.message,
                        variant: 'error'                        
                    })
                );
            })
    }

    handleUpdate(event){
        updateActivity({activity: event.detail})
            .then(result => {
                this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Activity updated with success',
                            variant: 'Success'
                        })
                );
                refreshApex(this.wiredData);
            })
            .catch(error =>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating record',
                        message: error.body.message,
                        variant: 'error'                        
                    })
                );
            })
    }

    populateAllActivities(element){
        if(element.Tasks){
            element.Tasks.forEach(task => {
                if(task.TaskSubtype == 'Call'){
                    this.calls.push(this.populateActivityArray(element,task));  
                }
                else{
                    const isEmail = task.Subject;
                    const status = task.Status;               
                    if(!isEmail.startsWith('Email:')){
                        if(status == 'Open' )
                            this.tasksUpComing.push(this.populateActivityArray(element,task)); 
                        else
                            this.tasks.push(this.populateActivityArray(element,task)); 
                    }
                         
                }
            })
        }
        if(element.Events){
            element.Events.forEach(event => {
                const activityDate = new Date(event.StartDateTime);
                const isUpComing = activityDate > new Date() ? true : false;  
                if(isUpComing)
                    this.eventsUpComing.push(this.populateActivityArray(element,event));   
                else
                    this.events.push(this.populateActivityArray(element,event));      
                  
            })
        }

        if(element.EmailMessageRelations){ 
            element.EmailMessageRelations.forEach( emailMessage => {this.emailMessagesIds.push(emailMessage.EmailMessageId)});
        }
    }

    populateActivityArray(element,activity){ 
        var activityObject = Object.assign({}, activity);
        if(element.ContactLU__r){
            activityObject.ContactName = element.ContactLU__r.Name;
            activityObject.ContactId = element.ContactLU__r.Id;
        }
        if(element.Description){
            activityObject.LeadDescription = element.Description;
        }
        activityObject.LeadCompany = element.Company;
        return activityObject; 
    }
}