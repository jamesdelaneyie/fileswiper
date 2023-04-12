import { createCurrentFile } from "./createCurrentFile.js";

export const updateFileList = (fileList) => {

    //console.log(fileList);

    let totalNumberOfFiles = fileList.length;
    let totalNumberOfFilesElement = document.getElementById("total-number-of-files");
    totalNumberOfFilesElement.innerText = totalNumberOfFiles;

    if(fileList.length > 0) {

        let introScreen = document.getElementById("intro-screen");
        introScreen.style.display = "none";
        
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
        currentFileName.classList.add("absolute", "bottom-0", "text-slate-700", "w-full", "left-0", "text-xxs", "bg-white", "p-3")

        // get the file extension
        currentFileType.innerText = currentFile.split(".").pop(); 

        // get the file size
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
       
        let currentFileName = document.getElementById("current-file");
        if(currentFileName) {
            currentFileName.remove();
        }
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
            congratsText.innerText = "This folder has no files! Pick another folder below.";
            congratsDiv.appendChild(congratsText);

            let files = document.getElementById("files");
            files.appendChild(congratsDiv);
        }
    } else {
        //remove the congrats div
        let congratsDiv = document.getElementsByClassName("congrats")[0];
        if(congratsDiv) {
            congratsDiv.remove();
        }
    }

    return fileList;

}
