// this is the Base class for (ProjectList & ProjectInput) to inherit this two class and clean the codes
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    selectedElement: U;

    // select elements dynamicly
    constructor(
        templateId: string, 
        hostElementId: string, 
        // attach chil element in where place of pattenr element
        //true=> afterbegening
        //false=> beforeend
        insertAtStart: boolean,
        newElementId?: string
    ) {
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostElementId)! as T;
        // get form inside of (template element)
        const importedNode = document.importNode(
            // this content is the form
            // true => for deep copy of nested elements
            this.templateElement.content, true
        );
        this.selectedElement = importedNode.firstElementChild as U;
        if(newElementId) {
            // type => (active | finished)
            this.selectedElement.id = newElementId;
        }

        this.attach(insertAtStart);
    }

    abstract configure?(): void;
    abstract renderContent?(): void;

    // attach (section of project list) to (app) 
    private attach = (insertAtStart: boolean) => {
        this.hostElement.insertAdjacentElement(insertAtStart ? "afterbegin" : "beforeend",this.selectedElement)
    }
}