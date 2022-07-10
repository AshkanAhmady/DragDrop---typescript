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
        this.descriptionInputElement = this.formElement.querySelector("#description") as HTMLInputElement;
        this.peopleInputElement = this.formElement.querySelector("#people") as HTMLInputElement;

        this.configure();
        this.attach();
    }

    // type of this method is (tuple OR void)
    private gatherUserInput = (): [string,string, number] | void => {
        const enteredTitle = this.titleInpurElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;
        
        if (
            enteredTitle.trim().length === 0 || 
            enteredDescription.trim().length === 0 || 
            enteredPeople.trim().length === 0
        ) {
           alert("input is invalid, please try again!");
           return;     
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople]
        }
    }

    private submitHandler = (e: Event) =>  {
        e.preventDefault();
        const userInput = this.gatherUserInput();
        // check for tuple => tuple is an array
        if(Array.isArray(userInput)) {
            const [title,description, people] = userInput;
            console.log(title, description, people);
            this.cleareInput()
        }
    }

    private cleareInput() {
        this.titleInpurElement.value = ""
        this.descriptionInputElement.value = ""
        this.peopleInputElement.value = ""
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