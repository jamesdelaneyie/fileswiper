import { handleDragStart } from "./dragAndDrop.js";
import { handleDragEnd } from "./dragAndDrop.js";


export const createCurrentFile = () => {
        let currentFile = document.createElement("li");
        currentFile.setAttribute("id", "current-file");
        currentFile.setAttribute("draggable", "true");
        currentFile.classList.add("ui-button","bg-white","border-slate-300","w-60","h-80","z-50","border-2","rounded","relative","text-center","hover:cursor-move");
        
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
                console.log(item)
                item.addEventListener("dragstart", handleDragStart);
                item.addEventListener("dragend", handleDragEnd);
                }
        );

}