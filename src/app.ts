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

// Project Type
enum ProjectStatus {
    Active,
    Finished
}

class Project{
    constructor(
        public id: number, 
        public title: string, 
        public description: string, 
        public people: number, 
        public status: ProjectStatus
    ) {}
}

// listener type
type Listener = (items: Project[]) => void;

// task of this class: => managing state of projects
class ProjecstState{
    // array of functions
    private listeners: Listener[] = [];
    private projects: Project[] = [];
    // to get this class with this (instance) in another classes
    private static instance: ProjecstState;

    private constructor() {

    }

    // create istance of classe and store that in instance property
    static getInstance() {
        if(this.instance) {
            return this.instance
        }
        this.instance = new ProjecstState();
        return this.instance;
    }

    addListener(listenerFn: Listener) {
        this.listeners.push(listenerFn)
    }

    // push the nuew project to projects array of object
    addProject(title: string, description: string, numOfPeople: number) {
        // use (Project) class to set the type of values of object of project
        const newProject = new Project(Date.now(),title,description,numOfPeople,ProjectStatus.Active)
        this.projects.push(newProject);
        for (const listenerFn of this.listeners) {
            // return copy of the array to listener
            // because we need the ojects and if we dont copy and change this objects
            // the object changes everywer
            listenerFn(this.projects.slice())
        }
    }
}

// create instance of (ProjectState class) with this static method
// ProjectState is the instance of (ProjectState class)
const projectState = ProjecstState.getInstance();

// task of this class: => import list of projects to (app)
class ProjectList{
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    sectionElement: HTMLElement;
    // the type of the data must be Project type
    assignedProjects: Project[];

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
        this.assignedProjects = []


        // register (listener) of ProjectState in here
        // put all data in the (projects array) to assignedProjects
        projectState.addListener((projects: Project[]) => {
            // relevantProject if projects that filtered by type of this class (active | finished)
            const relevantProject = projects.filter((prj) => {
                if(this.type === "active") {
                    return prj.status === ProjectStatus.Active
                }
                return prj.status === ProjectStatus.Finished
            })
            this.assignedProjects = relevantProject;
            this.renderProjects();
        })

        this.attach()
        this.renderContent()
    }

    private renderProjects() {
        // the (UlElement) that is in the (section) element
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        // after any add project, we should empty the ul to stop duplicate
        listEl.innerHTML = "";
        // put the all data in the (assignedProject) to liElement and put that to ULElement 
        // that is in the sectionElement
        for(const projectItem of this.assignedProjects) {
            const listItem = document.createElement("li");
            // show the title of the project in th (Li) element
            listItem.textContent = projectItem.title;
            listEl.appendChild(listItem);
        }
    }

    private renderContent() {
        const listId = `${this.type}-projects-list`;
        this.sectionElement.querySelector("ul")!.id = listId;
        this.sectionElement.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECT";
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