import { addFolderToDom } from "./addFolderToDom.js";
import { createCurrentFile } from "./createCurrentFile.js";
import { updateFileList } from "./updateFileList.js";
import { handleDragStart } from "./dragAndDrop.js";
import { handleDragEnd } from "./dragAndDrop.js";

const func = async () => {

    let files = [];

    // Load the last folders used by the user    
    let listOfFolders = JSON.parse(localStorage.getItem("locations"));
    if(listOfFolders !== null) {
        for(let i = 0; i < listOfFolders.length; i++) {
            // Add the folders used by the user to the DOM
            addFolderToDom(listOfFolders[i]);
        }
    }

    //
    // Event handlers
    // 

    // Drag events for files
	/*let items = document.querySelectorAll("#files li");
	items.forEach(function (item) {
		item.addEventListener("dragstart", handleDragStart);
		item.addEventListener("dragend", handleDragEnd);
	});

    // Undo button
    let undoButton = document.getElementById("undo");
    undoButton.addEventListener("click", () => {
        window.fileswiper.undo();
    })*/

    // Quit button
    let quitButton = document.getElementById("quit");
    quitButton.addEventListener("click", () => {
        window.fileswiper.quit();
    })

    // Add folder button
    /*let addFolder = document.getElementById("add-folder");
    addFolder.addEventListener("click", () => {
        window.fileswiper.openDialog();
    })

    // Skip Button / Skip Area
    let skipArea = document.getElementById("skip");
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
    

    // Handle the root folder selection
    window.fileswiper.selectRootFolder((event, locationAndFiles) => {

        //console.log(locationAndFiles)

        if(typeof locationAndFiles.location === "undefined") {
            return;
        }

        //remove the intro screen
        let introScreen = document.getElementById("intro-screen");
        introScreen.style.display = "none";

        let filesList = locationAndFiles.files;

        //console.log(filesList)
        files = updateFileList(filesList);

        if(filesList.length > 0) {
            //createCurrentFile()

            let locationText = locationAndFiles.location.split("/");
            locationText = locationText[locationText.length - 1];

            let rootFolder = document.getElementById("current-file");
            //rootFolder.setAttribute('data-content', locationText);
        }

        

        localStorage.setItem("root-folder", JSON.stringify(locationAndFiles.location));

        //console.log(files)


    });


    window.fileswiper.sendPreviewImage((event, image) => {
        let currentFilePreview = document.getElementById("current-file-preview");
        currentFilePreview.src = image;
    })

    window.fileswiper.sendDocImage((event, image) => {
        //console.log(image)
        //create new webview element and set the src to the image
        /*let webview = document.createElement("webview");
        //get the root folder location
        let rootFolderSave = JSON.parse(localStorage.getItem("root-folder"));
        let fullPath = 'file://' + rootFolderSave + '/' + image;
        webview.setAttribute("src", fullPath);
        webview.setAttribute("style", "width: 100%; height: 100%;");
        webview.setAttribute("nodeintegration", "true");
        webview.setAttribute("plugins", "true");
        webview.setAttribute("allowpopups", "true");
        webview.setAttribute("webpreferences", "allowRunningInsecureContent");
        webview.setAttribute("webpreferences", "allowDisplayingInsecureContent");
        //add the webview to the dom
        let preview = document.getElementById("files");
        preview.appendChild(webview);*/
    })

    
    // Handle the addition of a new folder to the DOM
    // Add it to the local storage for the user
    window.fileswiper.folderLocation((event, location) => {
        if(typeof location === "undefined") {
            return;
        }
        let locationText = location.split("/");
        locationText = locationText[locationText.length - 1];
        let locations = JSON.parse(localStorage.getItem("locations"));
        if(locations === null) {
            locations = [];
        }
        locations.push(location);
        localStorage.setItem("locations", JSON.stringify(locations));

        addFolderToDom(location, locationText);
    })


};

func();
