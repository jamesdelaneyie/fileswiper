import interact from "interactjs";
import { dragMoveListener } from "./dragMoveListener.js";
import { getDropZoneCenters } from "./getDropZoneCenters.js";
import { getWorkspaceRestriction } from "./getWorkspaceRestriction.js";


export const createCurrentFile = (file) => {

        let files = document.getElementById("files");

        let currentFile = document.createElement("li");
        currentFile.setAttribute("id", "current-file");
        currentFile.classList.add("ui-button","file", "absolute","w-60","h-80","z-50","cursor-grab", "text-center", "hover:cursor-grabbing");
        
        let currentFileWrapper = document.createElement("div");
        currentFileWrapper.setAttribute("id", "current-file-wrapper");
        currentFile.appendChild(currentFileWrapper);

        let currentFilePreviewImage = document.createElement("img");
        currentFilePreviewImage.setAttribute("id", "current-file-preview");
        currentFilePreviewImage.setAttribute("src", file.thumbnail);
        currentFileWrapper.appendChild(currentFilePreviewImage);

        currentFile.setAttribute('data-full-width', file.width)
        currentFile.setAttribute('data-full-height', file.height)
        
        let currentFileTextTitle = document.createElement("span");
        currentFileTextTitle.setAttribute("id", "current-file-name");
        currentFileTextTitle.innerText = file.name;
        currentFileWrapper.appendChild(currentFileTextTitle);

        let currentFileTypeText = document.createElement("span");
        currentFileTypeText.setAttribute("id", "current-file-type");
        currentFileTypeText.innerText = file.name.split(".").pop();
        currentFileTypeText.classList.add(file.name.split(".").pop().toLowerCase());
        currentFile.appendChild(currentFileTypeText);

        let currentFileSizeText = document.createElement("span");
        currentFileSizeText.setAttribute("id", "current-file-size");

        let currentFileSizeInBytes = file.size;
        let currentFileSizeInKilobytes = currentFileSizeInBytes / 1000;
        let currentFileSizeInMegabytes = currentFileSizeInKilobytes / 1000;
        if (currentFileSizeInMegabytes > 1) {
            currentFileSizeText.innerText = currentFileSizeInMegabytes.toFixed(2) + " MB";
        } else if (currentFileSizeInKilobytes > 1) {
            currentFileSizeText.innerText = currentFileSizeInKilobytes.toFixed(3) + " KB";
        } else {
            currentFileSizeText.innerText = currentFileSizeInBytes + " B";
        }
        currentFile.appendChild(currentFileSizeText);


        //if this is the last file in the list, add a class to it
        let randomAngle = Math.floor(Math.random() * 10) - 5;
        currentFile.style.transform = `rotate(${randomAngle}deg)`;

        currentFile.setAttribute('data-x', 0)
        currentFile.setAttribute('data-y', 0)

        //give this file a random classname so that it can be targeted by interactjs
        let randomClassName = Math.random().toString(36).substring(7);
        //remove any numbers from the classname
        randomClassName = randomClassName.replace(/[0-9]/g, '');
        currentFile.classList.add(randomClassName);

        //let files = document.getElementById("files");
        files.appendChild(currentFile);

        const interactableFile = interact(`.${randomClassName}`)

        const dragMoveListenerWrapper = (randomClassName, event) => {
            dragMoveListener(interactSettings, randomClassName, event)
        }

        const interactSettings = {
          inertia: {
            resistance: 10,
            smoothEndDuration: 100,
          },
          cursorChecker () {
            return 'grab'
          },
          modifiers: [
            interact.modifiers.restrict({
              restriction: getWorkspaceRestriction(),
              endOnly: true
            }), 
            interact.modifiers.snap({
              targets: getDropZoneCenters(), 
              relativePoints: [
                {x: 0.5, y: 0.5}
              ],
              range: 150,
              endOnly: true,
            })
          ],
          listeners: {
            start (event) {
              event.target.classList.add('dragging')
              let filebeingDragged = document.querySelector(`.${randomClassName}`)
              let fileWidth = filebeingDragged.getBoundingClientRect().width
              let fileHeight = filebeingDragged.getBoundingClientRect().height
              let mouseX = event.clientX
              let mouseY = event.clientY
              let fileX = filebeingDragged.getBoundingClientRect().x
              let fileY = filebeingDragged.getBoundingClientRect().y
              let transformOriginX = ((mouseX - fileX) / fileWidth) * 100
              let transformOriginY = ((mouseY - fileY) / fileHeight) * 100
              filebeingDragged.style.transformOrigin = `${transformOriginX}% ${transformOriginY}%`
            },
            move (event) {
              dragMoveListenerWrapper(randomClassName, event)
            },
            end (event) {
              event.target.classList.remove('dragging')
            }

          }
        }

        interactableFile.draggable(interactSettings)

        let doubleTapped = false;
        interactableFile.on('doubletap', (event) => {
          if(doubleTapped == false) {
            interactableFile.draggable(false)
            event.target.classList.add('double-tapped')
            event.target.style.width = event.target.getAttribute('data-full-width') + "px";
            event.target.style.height = event.target.getAttribute('data-full-height') + "px";
            files.style.zIndex = 500;
            doubleTapped = true;
          } else {
            interactableFile.draggable(interactSettings)
            event.target.classList.remove('double-tapped')
            event.target.style.zIndex = 50;
            event.target.style.width = '';
            event.target.style.height = '';
            doubleTapped = false;
            files.style.zIndex = 100;
          }
        })
}