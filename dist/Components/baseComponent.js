// this is the Base class for (ProjectList & ProjectInput) to inherit this two class and clean the codes
export class Component {
    // select elements dynamicly
    constructor(templateId, hostElementId, 
    // attach chil element in where place of pattenr element
    //true=> afterbegening
    //false=> beforeend
    insertAtStart, newElementId) {
        // attach (section of project list) to (app) 
        this.attach = (insertAtStart) => {
            this.hostElement.insertAdjacentElement(insertAtStart ? "afterbegin" : "beforeend", this.selectedElement);
        };
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElementId);
        // get form inside of (template element)
        const importedNode = document.importNode(
        // this content is the form
        // true => for deep copy of nested elements
        this.templateElement.content, true);
        this.selectedElement = importedNode.firstElementChild;
        if (newElementId) {
            // type => (active | finished)
            this.selectedElement.id = newElementId;
        }
        this.attach(insertAtStart);
    }
}
