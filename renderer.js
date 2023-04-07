import { addFolderToDom } from "./addFolderToDom.js";
import { updateFileList } from "./updateFileList.js";
import { createTrash } from "./createTrash.js";
import { updateSavedFolders } from "./updateSavedFolders.js";

const func = async () => {

     // Quit button
     let quitButton = document.getElementById("quit");
     quitButton.addEventListener("click", () => {
         window.fileswiper.quit();
     })

    // Load the last folders used by the user    
    const listOfFolders = JSON.parse(localStorage.getItem("locations"));
    //if list of folders is not null, add the folders to the DOM
    if(Array.isArray(listOfFolders)) {
        for(let i = 0; i < listOfFolders.length; i++) {
            // Add the folders used by the user to the DOM
            addFolderToDom(listOfFolders[i]);
        }
    } else {
        console.log('No folders found in local storage')
    }

    let trash = createTrash();
    let main = document.querySelector("main");
    main.appendChild(trash);
    

    // Handle the root folder selection
    window.fileswiper.selectRootFolder((event, locationAndFiles) => {
            
        localStorage.setItem("root-folder", JSON.stringify(locationAndFiles.location));
        
        let locationText = locationAndFiles.location.split("/");
            locationText = locationText[locationText.length - 1];

        let currentFolderName = document.getElementById("current-folder-name");
            currentFolderName.textContent = locationText;

        let filesList = locationAndFiles.files;

        console.log('update file list')
        files = updateFileList(filesList);

    });

    // Add folder button
    let addFolder = document.getElementById("add-folder");
    addFolder.addEventListener("click", () => {
        window.fileswiper.openDialog();
    })



    //
    // Event handlers
    // 
    /*
    // Undo button
    let undoButton = document.getElementById("undo");
    undoButton.addEventListener("click", () => {
        window.fileswiper.undo();
    })*/

    // Skip Button / Skip Area
    /*let skipArea = document.getElementById("skip");
    skipArea.addEventListener("dragover", (e) => {
        e.preventDefault();
    })*/

    // Select root folder
    let folderSelect = document.getElementById("folder-select");
    folderSelect.addEventListener("click", () => {
        window.fileswiper.openRootDialog();
    })

    // Save the config to local storage
    window.fileswiper.sendConfig((event, config) => {
        localStorage.setItem("config", JSON.stringify(config));
    })
    

    


    window.fileswiper.sendPreviewImage((event, image) => {
        let webview = document.getElementById("current-file").querySelector("webview");
        if(webview !== null) {
            webview.remove();
        }
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

    window.fileswiper.sendDocImage((event, image) => {
        //if there is already a webview, remove it
        let webview = document.getElementById("current-file").querySelector("webview");
        if(webview !== null) {
            webview.remove();
        }
        let imageElement = document.getElementById("current-file").querySelector("img");
        if(imageElement !== null) {
            imageElement.remove();
        }
        webview = document.createElement("webview");
        let fullPath = 'file://' + image;
        webview.setAttribute("src", fullPath);
        webview.setAttribute("nodeintegration", "true");
        webview.setAttribute("plugins", "true");
        webview.setAttribute("allowpopups", "true");
        webview.setAttribute("webpreferences", "allowRunningInsecureContent");
        webview.setAttribute("webpreferences", "allowDisplayingInsecureContent");
        let preview = document.getElementById("current-file");
        preview.appendChild(webview);
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
