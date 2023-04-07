import { handleDragStart } from "./dragAndDrop.js";
import { handleDragEnd } from "./dragAndDrop.js";
//import the interactjs library
import interact from "interactjs";

export const createCurrentFile = () => {
        let currentFile = document.createElement("li");
        currentFile.setAttribute("id", "current-file");
        currentFile.setAttribute("draggable", "true");
        currentFile.classList.add("ui-button","bg-white","border-slate-300","w-60","h-80","z-50","border-2","rounded","relative","cursor-grab", "text-center", "hover:cursor-grabbing");
        
        let currentFilePreviewImage = document.createElement("img");
        currentFilePreviewImage.setAttribute("id", "current-file-preview");
        currentFile.appendChild(currentFilePreviewImage);

        let currentFileTextTitle = document.createElement("span");
        currentFileTextTitle.setAttribute("id", "current-file-name");
        currentFile.appendChild(currentFileTextTitle);

        let files = document.getElementById("files");
        files.appendChild(currentFile);

        // Drag events for files
        let items = document.querySelectorAll("#files li");
        items.forEach(function (item) {
                //console.log(item)
                //item.addEventListener("dragstart", handleDragStart);
                //item.addEventListener("dragend", handleDragEnd);
                }
        );

        //set the position of the current file
        let position = { x: 0, y: 0 }

        function dragMoveListener (event) {
                var target = event.target
                // keep the dragged position in the data-x/data-y attributes
                var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
                var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
              
                // translate the element
                //target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
              
                // update the posiion attributes
                target.setAttribute('data-x', x)
                target.setAttribute('data-y', y)

                position.x += event.dx
                    position.y += event.dy


                    event.target.style.cursor = 'grabbing'
              
                    event.target.style.transform =
                      `translate(${position.x}px, ${position.y}px)`

                    //make the element get smaller the further it is dragged
                        let scale = 1 - (Math.abs(position.x) + Math.abs(position.y)) / 1200
                        event.target.style.transform = `translate(${position.x}px, ${position.y}px) scale(${scale})`
              }
              

        interact('#current-file').draggable({
                inertia: true,
                cursorChecker () {
                     return 'grab'
                },
                modifiers: [
                        interact.modifiers.restrictRect({
                          restriction: '.main-area',
                          endOnly: true
                        })
                      ],
                listeners: {
                  start (event) {
                    //console.log(event.type, event.target)
                  },
                  move: dragMoveListener
                }
              })

}