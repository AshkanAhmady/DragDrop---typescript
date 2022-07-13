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
        public id: string, 
        public title: string, 
        public description: string, 
        public people: number, 
        public status: ProjectStatus
    ) {}
}

// listener type
type Listener<T> = (items: T[]) => void;

// maybe we have more than one class and we can use this class to define inheritance
class State<T>{
    // array of functions
    protected listeners: Listener<T>[] = [];

    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn)
    }
}

// task of this class: => managing state of projects
class ProjecstState extends State<Project>{

    private projects: Project[] = [];
    // to get this class with this (instance) in another classes
    private static instance: ProjecstState;

    private constructor() {
        super();
    }

    // create istance of classe and store that in instance property
    static getInstance() {
        if(this.instance) {
            return this.instance
        }
        this.instance = new ProjecstState();
        return this.instance;
    }



    // push the nuew project to projects array of object
    addProject(title: string, description: string, numOfPeople: number) {
        // use (Project) class to set the type of values of object of project
        const newProject = new Project(Date.now().toString(),title,description,numOfPeople,ProjectStatus.Active)
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








// this is the Base class for (ProjectList & ProjectInput) to inherit this two class and clean the codes
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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

// single product
class SingleProject extends Component<HTMLUListElement,HTMLLIElement>{
    // use this class to extends all data in the project
    private project: Project;
    constructor(hostId:string, project: Project) {
        super("single-project", hostId,false,project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    configure() {}

    renderContent() {
        this.selectedElement.querySelector("h2")!.textContent = this.project.title;
        this.selectedElement.querySelector("h3")!.textContent = this.project.people.toString();
        this.selectedElement.querySelector("p")!.textContent = this.project.description;
    }
}
// task of this class: => import list of projects to (app)
class ProjectList extends Component<HTMLDivElement,HTMLElement>{
    // the type of the data must be Project type
    assignedProjects: Project[];

    // we can also define (type) like this
    // private type = "active" | "finished"
    constructor(private type: "active" | "finished") {
        super("project-list", "app", false, `${type}-projects`);
        this.assignedProjects = []

        this.configure();
        this.renderContent()
    }

    configure() {
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
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.selectedElement.querySelector("ul")!.id = listId;
        this.selectedElement.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECT";
    }

    private renderProjects() {
        // the (UlElement) that is in the (section) element
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        // after any add project, we should empty the ul to stop duplicate
        listEl.innerHTML = "";
        // put the all data in the (assignedProject) to (liElement) and put that to ULElement 
        // that is in the selectedElement
        for(const projectItem of this.assignedProjects) {
            // with (singleProject) class we append single project to project list
            new SingleProject(this.selectedElement.querySelector("ul")!.id, projectItem)
            // const listItem = document.createElement("li");
            // // show the title of the project in th (Li) element
            // listItem.textContent = projectItem.title;
            // listEl.appendChild(listItem);
        }
    }
}

// task of this class: => import form element to (app)
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
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

const projectInput = new ProjectInput();

const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");