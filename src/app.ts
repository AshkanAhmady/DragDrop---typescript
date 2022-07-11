// validation interface
interface Validatable{
    value: string | number;
    // optional types
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

// form validation function
function validate(validatableInput: Validatable) {
    let isValid= true;
    // if required sets for input of validate function
    if(validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().length !== 0;
    }
    if(validatableInput.minLength != null && typeof validatableInput.value === "string") {
        isValid = isValid && validatableInput.value.trim().length >=validatableInput.minLength;
    }
    if(validatableInput.maxLength != null && typeof validatableInput.value === "string") {
        isValid = isValid && validatableInput.value.trim().length <=validatableInput.maxLength;
    }
    if(validatableInput.min != null && typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value >=validatableInput.min;
    }
    if(validatableInput.max != null && typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value <=validatableInput.max;
    }
    return isValid;
}

// task of this class: => import list of projects to (app)
class ProjectList{
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    sectionElement: HTMLElement;

    // we can also define (type) like this
    // private type = "active" | "finished"
    constructor(private type: "active" | "finished") {
        this.templateElement = document.getElementById("project-list")! as HTMLTemplateElement;
        this.hostElement = document.getElementById("app")! as HTMLDivElement;
        // get form inside of (template element)
        const importedNode = document.importNode(
            // this content is the form
            // true => for deep copy of nested elements
            this.templateElement.content, true
        );
        this.sectionElement = importedNode.firstElementChild as HTMLElement;
        // type => (active | finished)
        this.sectionElement.id = `${this.type}-projects`;

        this.attach()
        this.renderContent()
    }

    private renderContent() {
        const listId = `${this.type}-projects-list`;
        this.sectionElement.querySelector("ul")!.id = listId;
        this.sectionElement.querySelector("h2")!.textContent = this.type.toUpperCase() + "PROJECT";
    }

    // attach (section of project list) to (app) 
    private attach = () => {
        this.hostElement.insertAdjacentElement("beforeend",this.sectionElement)
    }
}

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
            !validate({value: enteredTitle, required: true}) ||
            !validate({value: enteredDescription, required: true, minLength: 5}) ||
            !validate({value: enteredPeople, required: true, min:1, max:10})
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
            this.cleareInput();
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

const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");