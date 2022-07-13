// the element that we can drag it: => (singleProject)
export interface Draggable{
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void
}

// the spaces that we can drag in it:=> (activeProject && finishedProje space)
export interface DragTarget{
    dragOverHandler(event: DragEvent): void
    dropHandler(event: DragEvent): void
    dragLeaveHandler(event: DragEvent): void
}