import { addFolderToDom } from "./addFolderToDom.js";
import { updateFileList } from "./updateFileList.js";


const func = async () => {

    let files = [];

    // Get the root folder from local storage and send it to the main process
    let rootFolderSave = JSON.parse(localStorage.getItem("root-folder"));
    window.versions.sendRootFolder(rootFolderSave);	


    // Add the folders to the DOM from local storage
    let localLocations = JSON.parse(localStorage.getItem("locations"));
    if(localLocations !== null) {
        for(let i = 0; i < localLocations.length; i++) {
            addFolderToDom(localLocations[i]);
        }
    }

	function handleDragStart(e) {
		this.style.opacity = "0.1";
        this.style.boxShadow = "none";
        this.style.dropShadow = "none";
        this.style.cursor = "move";
        this.style.filter = "drop-shadow(0 0 0 #000000)";

        console.log(files)
	}

	function handleDragEnd(e) {
		this.style.opacity = "1";
        this.style.boxShadow = "none";
        this.style.dropShadow = "none";
        this.style.cursor = "move";
        this.style.filter = "drop-shadow(0 0 0 #000000)";

        let filename = e.target.innerText;
        
        let dropTarget = document.elementFromPoint(e.clientX, e.clientY);
        let location = dropTarget.getAttribute("data-folder-location");

        console.log(filename, dropTarget, location)

        if(location === "skip") {
            files.shift();

            files = updateFileList(files);
            
        }
        if(location) {
            
            window.versions.fileDropped({filename: filename, location: location});

            files.shift();

            files = updateFileList(files);

        }
        

	}


    //
    // Event handlers
    // 

    // Drag events for files
	let items = document.querySelectorAll("#files li");
	items.forEach(function (item) {
		item.addEventListener("dragstart", handleDragStart);
		item.addEventListener("dragend", handleDragEnd);
	});

    // Undo button
    let undoButton = document.getElementById("undo");
    undoButton.addEventListener("click", () => {
        window.versions.undo();
    })

    // Quit button
    let quitButton = document.getElementById("quit");
    quitButton.addEventListener("click", () => {
        window.versions.quit();
    })

    // Add folder button
    let addFolder = document.getElementById("add-folder");
    addFolder.addEventListener("click", () => {
        window.versions.openDialog();
    })

    // Skip Button / Skip Area
    let skipArea = document.getElementById("skip");
    skipArea.addEventListener("dragover", (e) => {
        e.preventDefault();
    })

    // Select root folder
    let folderSelect = document.getElementById("folder-select");
    folderSelect.addEventListener("click", () => {
        window.versions.openRootDialog();
    })

    // Save the config to local storage
    window.versions.sendConfig((event, config) => {
        localStorage.setItem("config", JSON.stringify(config));
    })
    

    // Handle the root folder selection
    window.versions.selectRootFolder((event, locationAndFiles) => {

        if(typeof locationAndFiles.location === "undefined") {
            return;
        }

        let locationText = locationAndFiles.location.split("/");
        locationText = locationText[locationText.length - 1];

        let rootFolder = document.getElementById("current-file");
        rootFolder.setAttribute('data-content', locationText);

        localStorage.setItem("root-folder", JSON.stringify(locationAndFiles.location));

        let filesList = locationAndFiles.files;

        console.log(filesList)

        files = updateFileList(filesList);

        console.log(files)


    });


    window.versions.sendPreviewImage((event, image) => {
        let currentFilePreview = document.getElementById("current-file-preview");
        currentFilePreview.src = image;
    })

    window.versions.sendDocImage((event, image) => {
        //console.log(image)
        //create new webview element and set the src to the image
        let webview = document.createElement("webview");
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
        preview.appendChild(webview);
    })

    
    // Handle the addition of a folder from the OpenDialog
    window.versions.folderLocation((event, location) => {
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
