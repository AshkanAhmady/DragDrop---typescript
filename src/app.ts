// task of this class: => import form element to (app)
class ProjectInput{
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    formElement: HTMLFormElement;

    constructor() {
        //  ! => for say to typescript, this EL is not null
        // as => for say, this element what exactually is
        this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement;
        this.hostElement = document.getElementById("app")! as HTMLDivElement;
        // get form inside of (template element)
        const importedNode = document.importNode(
            // this content is the form
            // true => for deep copy of nested elements
            this.templateElement.content, true
        );
        this.formElement = importedNode.firstElementChild as HTMLFormElement;
        // attach (form) to (app) 
        this.hostElement.insertAdjacentElement("afterbegin",this.formElement)
    }

}

const projectInput = new ProjectInput();