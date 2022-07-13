import {Component} from "./baseComponent.js";
import {validate} from "../util/validation.js"
import {projectState} from "../state/projectState.js"

// task of this class: => import form element to (app)
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
    titleInpurElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        super("project-input", "app", true, "user-input")
        // select inputs from (selectedElement)
        this.titleInpurElement = this.selectedElement.querySelector("#title") as HTMLInputElement;
        this.descriptionInputElement = this.selectedElement.querySelector("#description") as HTMLInputElement;
        this.peopleInputElement = this.selectedElement.querySelector("#people") as HTMLInputElement;

        this.configure();
    }

    // do things when we (submit) form
    configure = () => {
        this.selectedElement.addEventListener("submit",this.submitHandler)        
    }

    renderContent = () => {}

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
            // put this three data to (ProjectState class) and store them with addProject
            projectState?.addProject(title,description,people);
            this.cleareInput();
        }
    }

    private cleareInput() {
        this.titleInpurElement.value = ""
        this.descriptionInputElement.value = ""
        this.peopleInputElement.value = ""
    }
}