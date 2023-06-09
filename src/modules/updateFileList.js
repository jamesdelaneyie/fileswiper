import { createCurrentFile } from "./createCurrentFile.js";

export const updateFileList = (fileList) => {

    //console.log(fileList);

    let totalNumberOfFiles = fileList.length;
    let totalNumberOfFilesElement = document.getElementById("total-number-of-files");
    totalNumberOfFilesElement.innerText = totalNumberOfFiles + ' files';

    if(fileList.length > 0) {
        
        let numberOfFilesInStack = document.querySelectorAll("#current-file").length;
        for(let i = (numberOfFilesInStack); i < totalNumberOfFiles; i++) {
            createCurrentFile(fileList[i]);
        }
        
    }

    if(fileList.length === 0) {
       
        let congratsDiv = document.getElementsByClassName("congrats")[0];
        if(!congratsDiv) {

            let congratsDiv = document.createElement("div");
            congratsDiv.classList.add("congrats");
            let congratsIcon = document.createElement("span");
            congratsIcon.classList.add("congrats-icon");
            congratsIcon.innerText = "🎉";
            congratsDiv.appendChild(congratsIcon);

            let congratsText = document.createElement("span");
            congratsText.classList.add("congrats-text", "text-slate-600", "mt-5", "block");
            congratsText.innerText = "Folder Empty! No more files.";
            congratsDiv.appendChild(congratsText);

            let files = document.getElementById("files");
            files.appendChild(congratsDiv);
        }
    } else {
        let congratsDiv = document.getElementsByClassName("congrats")[0];
        if(congratsDiv) {
            congratsDiv.remove();
        }
    }

    return fileList;

}
