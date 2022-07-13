import {Component} from "./baseComponent";
import { Draggable } from "../modules/drag&drop";
import {Project} from "../modules/project"

// single product
// implements :=> to use interface in classes
export class SingleProject extends Component<HTMLUListElement,HTMLLIElement> implements Draggable{
    // use this class to extends all data in the project
    private project: Project;

    get persons() {
        if(this.project.people === 1) {
            return "1 person "; 
        }else {
            return this.project.people + " persons "
        }
    }

    constructor(hostId:string, project: Project) {
        super("single-project", hostId,false,project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    dragStartHandler = (event: DragEvent): void =>  {
        // setData(2 input)=> (1): type of data ___ (2): value of data
        event.dataTransfer!.setData("text/plain", this.project.id);
        event.dataTransfer!.effectAllowed = "move";
    }

    dragEndHandler = (_: DragEvent): void => {
        console.log("dragged")
    }

    configure() {
        this.selectedElement.addEventListener("dragstart", this.dragStartHandler)
        this.selectedElement.addEventListener("dragend", this.dragEndHandler)
    }

    renderContent() {
        this.selectedElement.querySelector("h2")!.textContent = this.project.title;
        // we use the (persons) getter like normal property and dont use parentheses
        this.selectedElement.querySelector("h3")!.textContent = this.persons + "assigned";
        this.selectedElement.querySelector("p")!.textContent = this.project.description;
    }
}