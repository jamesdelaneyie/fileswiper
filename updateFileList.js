import { createCurrentFile } from "./createCurrentFile.js";

export const updateFileList = (fileList) => {

    //console.log(fileList);

    let totalNumberOfFiles = fileList.length;
    let totalNumberOfFilesElement = document.getElementById("total-number-of-files");
    totalNumberOfFilesElement.innerText = totalNumberOfFiles + ' files';

    if(fileList.length > 0) {
        
        let currentFile = fileList[0].name
        let currentFileName = document.getElementById("current-file-name");
        let currentFileType = document.getElementById("current-file-type");
        let currentFileSize = document.getElementById("current-file-size");
        
        if(currentFileName === null) {
            createCurrentFile();
            currentFileName = document.getElementById("current-file-name");
            currentFileType = document.getElementById("current-file-type");
            currentFileSize = document.getElementById("current-file-size");
        }

        currentFileName.innerText = currentFile;
        currentFileType.innerText = currentFile.split(".").pop(); 
        currentFileType.classList.add(currentFileType.innerText.toLowerCase());

        let currentFileSizeInBytes = fileList[0].size;
        let currentFileSizeInKilobytes = currentFileSizeInBytes / 1000;
        let currentFileSizeInMegabytes = currentFileSizeInKilobytes / 1000;
        if (currentFileSizeInMegabytes > 1) {
            currentFileSize.innerText = currentFileSizeInMegabytes.toFixed(2) + " MB";
        } else {
            currentFileSize.innerText = currentFileSizeInKilobytes.toFixed(2) + " KB";
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
