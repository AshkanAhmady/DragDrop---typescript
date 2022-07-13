import { Component } from "./baseComponent";
// single product
// implements :=> to use interface in classes
export class SingleProject extends Component {
    constructor(hostId, project) {
        super("single-project", hostId, false, project.id);
        this.dragStartHandler = (event) => {
            // setData(2 input)=> (1): type of data ___ (2): value of data
            event.dataTransfer.setData("text/plain", this.project.id);
            event.dataTransfer.effectAllowed = "move";
        };
        this.dragEndHandler = (_) => {
            console.log("dragged");
        };
        this.project = project;
        this.configure();
        this.renderContent();
    }
    get persons() {
        if (this.project.people === 1) {
            return "1 person ";
        }
        else {
            return this.project.people + " persons ";
        }
    }
    configure() {
        this.selectedElement.addEventListener("dragstart", this.dragStartHandler);
        this.selectedElement.addEventListener("dragend", this.dragEndHandler);
    }
    renderContent() {
        this.selectedElement.querySelector("h2").textContent = this.project.title;
        // we use the (persons) getter like normal property and dont use parentheses
        this.selectedElement.querySelector("h3").textContent = this.persons + "assigned";
        this.selectedElement.querySelector("p").textContent = this.project.description;
    }
}
