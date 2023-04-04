export const createCurrentFile = () => {
        let currentFile = document.createElement("li");
        currentFile.setAttribute("id", "current-file");
        currentFile.classList.add("ui-button","bg-white","border-slate-300","w-60","h-80","z-50","border-2","rounded","relative","text-center","hover:cursor-move");
        let currentFilePreviewImage = document.createElement("img");
        currentFilePreviewImage.setAttribute("id", "current-file-preview");
        //add to current file
        currentFile.appendChild(currentFilePreviewImage);
        let currentFileTextTitle = document.createElement("span");
        currentFileTextTitle.setAttribute("id", "current-file-name");
        currentFile.appendChild(currentFileTextTitle);
        //add to files
        let files = document.getElementById("files");
        files.appendChild(currentFile);
}