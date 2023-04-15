import { addFolderToDom } from "./addFolderToDom.js";
import { updateFileList } from "./updateFileList.js";
import { createTrash } from "./createTrash.js";
import { updateSavedFolders } from "./updateSavedFolders.js";

import interact from "interactjs";

const func = async () => {

    let files = [];

    // Quit App button
    const quitButton = document.getElementById("quit");
    quitButton.addEventListener("click", () => {
        window.fileswiper.quit();
    })


    // Undo button
    const undoButton = document.getElementById("undo");
    undoButton.addEventListener("click", () => {
        window.fileswiper.undo();
    })


    // Add new folder bucket button
    const addFolder = document.getElementById("add-folder");
    addFolder.addEventListener("click", () => {
        window.fileswiper.openFolderDialog();
    })


    // Select new root folder for swiping
    const folderSelect = document.getElementById("folder-select");
    folderSelect.addEventListener("click", () => {
        window.fileswiper.openRootFolderDialog();
    })


    // Get the config from local storage and send it to the main process
    // This sets the window size and position on startup to the last used
    const config = JSON.parse(localStorage.getItem('config'));
    if(config !== null) {
        window.fileswiper.sendConfig(config);
    } else {
        let introScreen = document.getElementById("intro-screen");
        introScreen.style.display = "block";
    }

    let rootFolder = JSON.parse(localStorage.getItem('root-folder'));
    if(rootFolder !== null) {
        window.fileswiper.sendRootFolder(rootFolder);
    }

    let timeoutId = null;

    // Save the window size and position to local storage
    window.addEventListener('resize', () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            let config = {
                width: window.innerWidth,
                height: window.innerHeight,
                x: window.screenX,
                y: window.screenY
            };
            localStorage.setItem("config", JSON.stringify(config));
        }, 250);
    });

    window.addEventListener('move', () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            let config = {
                width: window.innerWidth,
                height: window.innerHeight,
                x: window.screenX,
                y: window.screenY
            };
            localStorage.setItem("config", JSON.stringify(config));
        }, 250);
    });

    
    // Receive the config on quit from the main process
    // Save it to local storage
    window.fileswiper.receiveConfig((event, config) => {
        localStorage.setItem("config", JSON.stringify(config));
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

    // Handle the addition of a new folder to the DOM
    // Add it to the local storage for the user
    window.fileswiper.addNewFolder((event, folderPath) => {
        console.log('New folder added: ' + folderPath)
        updateSavedFolders(folderPath);
        addFolderToDom(folderPath);
    })


    // Add the trash can to the DOM
    let trash = createTrash();
    const main = document.querySelector("body");
    main.appendChild(trash);



    // Interact.js set as dropzone
    interact.dynamicDrop(true);
    interact('.location').dropzone({
        overlap: 0.01,
        ondragenter: function (event) {
            if(document.querySelector('.drop-target')) {
                document.querySelector('.drop-target').classList.remove('drop-target')
            }
            event.target.classList.add('drop-target')
        }, 
        ondragleave: function (event) {
            setTimeout(() => {
                event.target.classList.remove('drop-target')
            }, 500)
        }
    }).on('dropactivate', function (event) {
        event.target.classList.add('drop-active')
    }).on('dropdeactivate', function (event) {
        event.target.classList.remove('drop-active')
    })




    
    
    // Handle the root folder selection
    window.fileswiper.selectRootFolder((event, locationAndFiles) => {

        localStorage.setItem("root-folder", JSON.stringify(locationAndFiles.location));
        
        let locationText = locationAndFiles.location.split("/");
            locationText = locationText[locationText.length - 1];

        let currentFolderName = document.getElementById("current-folder-name");
            currentFolderName.textContent = locationText;

        let sortBy = locationAndFiles.sortBy;
        
        let sortByText = document.getElementById("sort-by-text");
            sortByText.textContent = sortBy;

        let filesList = locationAndFiles.files;

        updateFileList(filesList);

    });



};

func();
