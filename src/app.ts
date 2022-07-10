// task of this class: => import form element to (app)
class ProjectInput{
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    formElement: HTMLFormElement;
    titleInpurElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

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
        this.formElement.id = "user-input";
        // select inputs from (formElement)
        this.titleInpurElement = this.formElement.querySelector("#title") as HTMLInputElement;
        this.descriptionInputElement = this.formElement.querySelector("#decription") as HTMLInputElement;
        this.peopleInputElement = this.formElement.querySelector("#people") as HTMLInputElement;

        this.configure();
        this.attach();
    }

    private submitHandler = (e: Event) => {
        e.preventDefault();
        console.log(this.titleInpurElement.value)
    }

    // do things when we (submit) form
    private configure = () => {
        this.formElement.addEventListener("submit",this.submitHandler)        
    }
    
    // attach (form) to (app) 
    private attach = () => {
        this.hostElement.insertAdjacentElement("afterbegin",this.formElement)
    }

}

const projectInput = new ProjectInput();