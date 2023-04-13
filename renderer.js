import { addFolderToDom } from "./addFolderToDom.js";
import { updateFileList } from "./updateFileList.js";
import { createTrash } from "./createTrash.js";
import { updateSavedFolders } from "./updateSavedFolders.js";

import interact from "interactjs";

const func = async () => {

    let files = [];

     // Quit button
     const quitButton = document.getElementById("quit");
     quitButton.addEventListener("click", () => {
         window.fileswiper.quit();
     })

    // Load the last folders used by the user    
    const listOfFolders = JSON.parse(localStorage.getItem("locations"));
    //if list of folders is not null, add the folders to the DOM
    if(Array.isArray(listOfFolders)) {
        for (const folder of listOfFolders) {
            // Add the folders used by the user to the DOM
            addFolderToDom(folder);
        }
    } else {
        console.log('No folders found in local storage')
    }


    window.isOverDrop = false;

    // Interact.js set as dropzone
    interact('.location').dropzone({
        overlap: 0.01,
        ondragenter: function (event) {
            if(document.querySelector('.drop-target')) {
                document.querySelector('.drop-target').classList.remove('drop-target')
            }
            //window.isOverDrop = true;
            event.target.classList.add('drop-target')
            //console.log('isOverDrop = true')
        }, 
        ondragleave: function (event) {
            setTimeout(() => {
                event.target.classList.remove('drop-target')
                //window.isOverDrop = false;
                //console.log('isOverDrop = false')
            }, 500)
        }
    }).on('dropactivate', function (event) {
        event.target.classList.add('drop-active')
        //event.target.classList.remove('drop-target')
    }).on('dropdeactivate', function (event) {
        event.target.classList.remove('drop-active')
        //event.target.classList.remove('drop-target')
    })




    let trash = createTrash();
    const main = document.querySelector("main");
    main.appendChild(trash);
    
    // Handle the root folder selection
    window.fileswiper.selectRootFolder((event, locationAndFiles) => {

        let sortBy = locationAndFiles.sortBy;
        let sortByText = document.getElementById("sort-by-text");
        sortByText.textContent = sortBy;

        localStorage.setItem("root-folder", JSON.stringify(locationAndFiles.location));
        
        let locationText = locationAndFiles.location.split("/");
            locationText = locationText[locationText.length - 1];

        let currentFolderName = document.getElementById("current-folder-name");
            currentFolderName.textContent = locationText;

        let filesList = locationAndFiles.files;

        //console.log('update file list')
        files = updateFileList(filesList);

    });

    // Add folder button
    const addFolder = document.getElementById("add-folder");
    addFolder.addEventListener("click", () => {
        window.fileswiper.openDialog();
    })

    const undoButton = document.getElementById("undo");
    undoButton.addEventListener("click", () => {
        window.fileswiper.undo();
    })


    // Select root folder
    let folderSelect = document.getElementById("folder-select");
    folderSelect.addEventListener("click", () => {
        window.fileswiper.openRootDialog();
    })

    // Save the config to local storage
    window.fileswiper.sendConfig((event, config) => {
        if(typeof config === "undefined") {
            let introScreen = document.getElementById("intro-screen");
            introScreen.style.display = "block";
        } else {
            localStorage.setItem("config", JSON.stringify(config));
        }
        
    })


    window.fileswiper.sendPreviewImage((event, image) => {
        let imageElement = document.getElementById("current-file").querySelector("img");
        if(imageElement === null) {
            imageElement = document.createElement("img");
            imageElement.setAttribute("id", "current-file-preview");
            let preview = document.getElementById("current-file");
            preview.appendChild(imageElement);
        }
        let currentFilePreview = document.getElementById("current-file-preview");
        currentFilePreview.src = image;
    })

    
    // Handle the addition of a new folder to the DOM
    // Add it to the local storage for the user
    window.fileswiper.folderLocation((event, location) => {
        if(typeof location === "undefined") {
            return;
        }
        updateSavedFolders(location);
        addFolderToDom(location);
    })


};

func();
