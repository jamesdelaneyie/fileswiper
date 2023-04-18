import { addFolderToDom } from "./modules/addFolderToDom.js";
import { updateFileList } from "./modules/updateFileList.js";
import { createTrash } from "./modules/createTrash.js";
import { updateSavedFolders } from "./modules/updateSavedFolders.js";

import interact from "interactjs";

const func = async () => {

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

    //current URL of the app
    const currentURL = window.location.href;
    //add the current URL in a div to the DOM
    const currentURLDiv = document.createElement("div");
    currentURLDiv.setAttribute("id", "currentURL");
    currentURLDiv.innerText = currentURL;
    //document.body.appendChild(currentURLDiv);


    // Handling dragging files / folder into the app
    document.addEventListener('drop', (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        //get the x, y coordinates of the drop
        let x = event.clientX;
        let y = event.clientY;

        //if the x,y is inside a circle with the height and width of the #workspace main element
        //then add the class to the element
        let workspace = document.getElementById("workspace");
        let workspaceX = workspace.getBoundingClientRect().x;
        let workspaceY = workspace.getBoundingClientRect().y;
        let workspaceWidth = workspace.getBoundingClientRect().width;
        let workspaceHeight = workspace.getBoundingClientRect().height;
        let workspaceCenterX = workspaceX + (workspaceWidth / 2);
        let workspaceCenterY = workspaceY + (workspaceHeight / 2);
        let workspaceRadius = Math.min(workspaceWidth, workspaceHeight) / 2;
        let distance = Math.sqrt(Math.pow(x - workspaceCenterX, 2) + Math.pow(y - workspaceCenterY, 2));

        //if the distance is less than the radius then add the class
        if(distance < workspaceRadius) {
            console.log('inside the circle')
            let pathArr = [];
            for (const f of event.dataTransfer.files) {
                if(f.type == "") {
                    window.fileswiper.sendRootFolder(f.path);
                }
            }
        } else {
            console.log('outside the circle')
            let pathArr = [];
            for (const f of event.dataTransfer.files) {
                if(f.type == "") {
                    let numberOfFolders = document.querySelectorAll(".location").length;
                    if(numberOfFolders <= maxNumberOfFolders) {
                        addFolderToDom(f.path);
                        updateSavedFolders(f.path);
                    }
                    pathArr.push(f.path);
                }
            }
            console.log(pathArr);
        }
    });

    // Dragover event for dragging files / folder into the app
    document.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('dragover');
        //if event.target is inside the background-circle div then add the class
    });

    // Keydown event for the backspace key
    document.addEventListener('keydown', (e) => {
        if(e.key == "Backspace") {
            //get the last file in the file list
            let lastFile = document.querySelector("#files li:last-child");
            //add the auto-move class to the last file
            lastFile.classList.add("auto-move");
            //move last file to the center of the trash element
            let trash = document.getElementById("trash");
            let trashX = trash.getBoundingClientRect().x;
            let trashY = trash.getBoundingClientRect().y;
            let trashWidth = trash.getBoundingClientRect().width;
            let trashHeight = trash.getBoundingClientRect().height;
            let trashCenterX = trashX + (trashWidth / 2);
            let trashCenterY = trashY + (trashHeight / 2);
            //move the last file to the center of the trash element with transform
            //this needs to be calculated as a move from the current x,y position of the last file
            //to the center of the trash element
            let lastFileX = lastFile.getBoundingClientRect().x;
            let lastFileY = lastFile.getBoundingClientRect().y;
            let lastFileWidth = lastFile.getBoundingClientRect().width;
            let lastFileHeight = lastFile.getBoundingClientRect().height;
            let lastFileCenterX = lastFileX + (lastFileWidth / 2);
            let lastFileCenterY = lastFileY + (lastFileHeight / 2);
            let translateX = trashCenterX - lastFileCenterX;
            let translateY = trashCenterY - lastFileCenterY;
            lastFile.style.transform = `translate(${translateX}px, ${translateY}px)`;
            let filename = lastFile.querySelector("#current-file-name").innerHTML;
            let location = 'trash'
            window.fileswiper.fileDropped({filename: filename, location: location});

        }
    });

    //console.log('checker')

    // Get the config from local storage and send it to the main process
    // This sets the window size and position on startup to the last used
    const config = JSON.parse(localStorage.getItem('config'));
    if(config !== null) {
        if(window.fileswiper) {
            window.fileswiper.sendConfig(config);
        }
    } else {
        let introScreen = document.getElementById("intro-screen");
        introScreen.style.display = "block";
    }

    //check if valid JSON
    function isValidJSON(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    let rootFolder = null;
    if(window.fileswiper) {
        rootFolder = JSON.parse(localStorage.getItem('root-folder'));
    }
    let rootFolderSave = localStorage.getItem('root-folder');

    if(isValidJSON(rootFolderSave)) {
        let rootFolder = JSON.parse(rootFolderSave);
        if(rootFolder !== null) {
            if(window.fileswiper) {
                window.fileswiper.sendRootFolder(rootFolder);
            }
        
        }
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


    /*
    
    WEBSOCKETS 
    
    const ws = new WebSocket('ws://192.168.1.4:8080');

    ws.onopen = function () {
        console.log('Connected to websocket server');
    };

    //alert('hello!')

    ws.onmessage = function (message) {



        let data = JSON.parse(message.data);
        if(!data.location) {
            if(window.fileswiper) {            
                let img = document.createElement("img");
                img.src = data;
                img.classList.add("qr-code");
                document.body.appendChild(img);
            }
        } else {
            localStorage.setItem("root-folder", JSON.stringify(data.location));
            
            let locationText = data.location.split("/");
                locationText = locationText[locationText.length - 1];
    
            let currentFolderName = document.getElementById("current-folder-name");
                currentFolderName.textContent = locationText;
    
            let sortBy = data.sortBy;
            
            let sortByText = document.getElementById("sort-by-text");
                sortByText.textContent = sortBy;
    
                updateFileList(data.files);
    

        }


       
        //console.log(data.files);
    };*/

    //if this window is not an electron app
    //then add the class to the body
    if(!window.fileswiper) {
        console.log('Web app')
    }

    // Receive the config on quit from the main process
    // Save it to local storage
    if(window.fileswiper) {
        window.fileswiper.receiveConfig((event, config) => {
            localStorage.setItem("config", JSON.stringify(config));
        })
    }



    // Load the last folders used by the user    
    const listOfFolders = JSON.parse(localStorage.getItem("locations"));
    const maxNumberOfFolders = 8;
    //if list of folders is not null, add the folders to the DOM
    if(Array.isArray(listOfFolders)) {
        for (const folder of listOfFolders) {
            // Add the folders used by the user to the DOM
            if (listOfFolders.indexOf(folder) <= maxNumberOfFolders) {
                addFolderToDom(folder);
            }
        }
    } else {
        console.log('No folders found in local storage')
    }

    // Handle the addition of a new folder to the DOM
    // Add it to the local storage for the user
    if(window.fileswiper) {
        window.fileswiper.addNewFolder((event, folderPath) => {
            //console.log('New folder added: ' + folderPath)
            let numberOfFolders = document.querySelectorAll(".location").length;
            if(numberOfFolders <= maxNumberOfFolders) {
                addFolderToDom(folderPath);
                updateSavedFolders(folderPath);
            }
        })
    }


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
    if(window.fileswiper) {
        window.fileswiper.selectRootFolder((event, locationAndFiles) => {

            console.log(locationAndFiles)

            localStorage.setItem("root-folder", JSON.stringify(locationAndFiles.location));
            
            let locationText = locationAndFiles.location.split("/");
                locationText = locationText[locationText.length - 1];

            let currentFolderName = document.getElementById("current-folder-name");
                currentFolderName.textContent = locationText;

            let sortBy = locationAndFiles.sortBy;
            
            let sortByText = document.getElementById("sort-by-text");
                sortByText.textContent = sortBy;

            let filesList = locationAndFiles.files;

            let files = document.getElementById("files");
            if(locationAndFiles.location !== rootFolder) {
                while (files.firstChild) {
                    files.removeChild(files.firstChild);
                }
            }
            

            updateFileList(filesList);

        });
    }



};

func();
