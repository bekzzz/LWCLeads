import { LightningElement , api} from 'lwc';

export default class ModalView extends LightningElement {
    @api closeModal;
    @api modal;
    @api activityFields;
    recordToUpdate = {};

    closing(event){
        event.preventDefault();
        const closeEvent = new CustomEvent("close",{});
        this.dispatchEvent(closeEvent);
    }

    handleInput(event){
        this.activityFields.fields.forEach(element => {
            if(event.target.label == element.label){
                this.recordToUpdate[element.name] = event.target.value; 
            }
        });
    }

    save(event){
        if(this.recordToUpdate || this.activityFields.delete){
            const saveEvent = new CustomEvent("save",{detail: this.recordToUpdate});
            this.dispatchEvent(saveEvent);
        }
        this.closing(event);
    }
}