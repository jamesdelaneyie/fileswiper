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
        updateSavedFolders(folderPath);
        addFolderToDom(folderPath);
    })



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

        console.log('update file list')
        files = updateFileList(filesList);

    });

    

    


    

    

    window.fileswiper.sendPreviewImage((event, image) => {
        console.log('recieving preview image')
        console.log(image)
        let currentFilePreview = document.querySelector("#current-file #current-file-preview");
        currentFilePreview.src = image.image;
        //the max width and height of the preview is 150px
        // if the image is wider than it is tall, set the width to 150px and scale the height accordingly
        let currentFile = document.querySelector("#current-file")
        if(image.width > image.height) {
            //currentFilePreview.style.width = "150px";
            //currentFilePreview.style.height = "auto";
        } else {
            //currentFilePreview.style.height = "150px";
            //currentFilePreview.style.width = "auto";
        }

        //console.log(image.width)
        //console.log(image.height)
    })

    
    

    /*
          /*const numberOfFilesInStack = 3
      for(let i = 0; i < numberOfFilesInStack; i++) {
        let file = document.createElement("li");
        file.classList.add("ui-button", "absolute", "bg-white","border-slate-300","w-60","h-80","z-50","border-2","rounded","cursor-grab", "text-center", "hover:cursor-grabbing");
        // rotate the file at a random angle between -5 and 5 degrees
        let randomAngle = Math.floor(Math.random() * 10) - 5;
        file.style.transform = `rotate(${randomAngle}deg)`;
        //add file to the stack
        files.appendChild(file);
      }*/


};

func();
