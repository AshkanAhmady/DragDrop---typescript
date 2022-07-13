import { Component } from "./baseComponent";
import { validate } from "../util/validation";
import { projectState } from "../state/projectState";
// task of this class: => import form element to (app)
export class ProjectInput extends Component {
    constructor() {
        super("project-input", "app", true, "user-input");
        // do things when we (submit) form
        this.configure = () => {
            this.selectedElement.addEventListener("submit", this.submitHandler);
        };
        this.renderContent = () => { };
        // type of this method is (tuple OR void)
        this.gatherUserInput = () => {
            const enteredTitle = this.titleInpurElement.value;
            const enteredDescription = this.descriptionInputElement.value;
            const enteredPeople = this.peopleInputElement.value;
            if (!validate({ value: enteredTitle, required: true }) ||
                !validate({ value: enteredDescription, required: true, minLength: 5 }) ||
                !validate({ value: enteredPeople, required: true, min: 1, max: 10 })) {
                alert("input is invalid, please try again!");
                return;
            }
            else {
                return [enteredTitle, enteredDescription, +enteredPeople];
            }
        };
        this.submitHandler = (e) => {
            e.preventDefault();
            const userInput = this.gatherUserInput();
            // check for tuple => tuple is an array
            if (Array.isArray(userInput)) {
                const [title, description, people] = userInput;
                // put this three data to (ProjectState class) and store them with addProject
                projectState === null || projectState === void 0 ? void 0 : projectState.addProject(title, description, people);
                this.cleareInput();
            }
        };
        // select inputs from (selectedElement)
        this.titleInpurElement = this.selectedElement.querySelector("#title");
        this.descriptionInputElement = this.selectedElement.querySelector("#description");
        this.peopleInputElement = this.selectedElement.querySelector("#people");
        this.configure();
    }
    cleareInput() {
        this.titleInpurElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }
}
