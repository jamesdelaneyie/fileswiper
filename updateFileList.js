import { filesToIgnore } from "./filesToIgnore.js";
import { createCurrentFile } from "./createCurrentFile.js";

export const updateFileList = (fileList) => {

    //console.log(files);

    //filter out files that we don't want to show
    fileList = fileList.filter(item => !filesToIgnore.includes(item));

    if(fileList.length > 0) {
        //createCurrentFile()
    }
    
    let currentFile = fileList[0]
    let currentFileName = document.getElementById("current-file-name");
   //let currentFilePreview = document.getElementById("current-file-preview");
    currentFileName.innerText = currentFile;
    //currentFilePreview.src = currentFile;

    let nextItems = document.getElementsByClassName("next-file");
    for (let i = 0; i < nextItems.length; i++) {
        const nextItem = nextItems[i];
        const nextItemSpan = nextItem.getElementsByTagName("span")[0];
        nextItemSpan.innerText = fileList[i + 1];
        //if there is no next file then hide the next item
        if(fileList[i + 1] === undefined) {
            //console.log('no next file')
            nextItem.style.display = "none";
        }
    }

    if(fileList.length === 0) {
        // create a div with the congrats emoji
        //remove the current file name
        let currentFileName = document.getElementById("current-file");
        currentFileName.remove();

        let congratsDiv = document.createElement("div");
        congratsDiv.classList.add("congrats");
        let congratsIcon = document.createElement("span");
        congratsIcon.classList.add("congrats-icon");
        congratsIcon.innerText = "🎉";
        congratsDiv.appendChild(congratsIcon);

        let congratsText = document.createElement("span");
        congratsText.classList.add("congrats-text");
        congratsText.innerText = "You've finished all the files in this folder!";
        congratsDiv.appendChild(congratsText);

        let files = document.getElementById("files");
        files.appendChild(congratsDiv);
    } else {
        //remove the congrats div
        let congratsDiv = document.getElementsByClassName("congrats")[0];
        if(congratsDiv) {
            congratsDiv.remove();
        }
    }

    return fileList;

    //console.log(files)

    //let currentFilePreview = document.getElementById("current-file-preview");
    //encode the path to make it work with atom://
    //firstFile = encodeURIComponent(firstFile);
    //let fullPath = 'file://' + locationAndFiles.location + '/' + firstFile;
    //currentFilePreview.src = fullPath
}
