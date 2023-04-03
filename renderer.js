"strict mode"

let folderBeingChanged = null;

const func = async () => {


    // Add a folder to the DOM with event listeners
    addFolderToDom = (location) => {
        let locationParent = document.getElementById("locations");
        let div = document.createElement("div");
        div.setAttribute("data-folder-location", location);
        let locationText = location.split("/").pop();
        div.innerText = locationText;
        div.classList.add("location");
        div.classList.add("location", "bg-white", "border-3", "border-slate-300", "p-10", "h-40", "w-40", "rounded-full", "border", "flex", "items-center", "justify-center", "hover:cursor-pointer")
        // Add Event Listeners
        // Left click
        div.addEventListener("click", (e) => {
            window.versions.openDialog();
            folderBeingChanged = e.target;
        })
        // Right click
        div.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.target.remove();
            let localLocations = JSON.parse(localStorage.getItem("locations"));
            let location = e.target.getAttribute("data-folder-location");
            let newLocations = localLocations.filter(item => item !== location);
            localStorage.setItem("locations", JSON.stringify(newLocations));
        })
        locationParent.appendChild(div);
    }

    //get the root folder from local storage
    //let rootFolder = localStorage.getItem("root-folder");
    //send the root folder to the main process
    //let response = await window.versions.files(rootFolder);


	let response = await window.versions.files();
    //remove .DS_Store from the array
    response = response.filter(item => item !== ".DS_Store");
    //remove .localized from the array
    response = response.filter(item => item !== ".localized");

	let currentFileName = document.getElementById("current-file-name");
	let firstFile = response[0];
	currentFileName.innerText = firstFile;

    // Add an image to Current File
    //

	let nextItems = document.getElementsByClassName("next-file");
	for (let i = 0; i < nextItems.length; i++) {
		const nextItem = nextItems[i];
		const nextItemSpan = nextItem.getElementsByTagName("span")[0];
		nextItemSpan.innerText = response[i + 1];
	}

    let localLocations = JSON.parse(localStorage.getItem("locations"));
    if(localLocations !== null) {
        for(let i = 0; i < localLocations.length; i++) {
            addFolderToDom(localLocations[i]);
        }
    }


    // Load the locations from local storage and add them to the DOM
    /*let localLocations = JSON.parse(localStorage.getItem("locations"));
    if(localLocations !== null) {

        const radius = 340;
        const centerX = 260;
        const centerY = 260;
        const distanceBetweenDivs = 0;

        for (let i = 0; i < localLocations.length; i++) {
            
            let locationDiv = document.createElement("div");
            
            const angle = (Math.PI * 2) / (localLocations.length) - 1 * i - Math.PI / 2;
            const x = Math.round(
                centerX + radius * Math.cos(angle) - distanceBetweenDivs / 2
            );
            const y = Math.round(
                centerY + radius * Math.sin(angle) - distanceBetweenDivs / 2
            );
            locationDiv.style.position = "absolute";
            locationDiv.style.left = x + "px";
            locationDiv.style.top = y + "px";
            locationDiv.setAttribute(
                "data-folder-location",
                localLocations[i]
            );
            locationDiv.classList.add(
                "location",
                "bg-white",
                "border-3",
                "border-slate-300",
                "p-10",
                "h-40",
                "w-40",
                "rounded-full",
                "border",
                "flex",
                "items-center",
                "justify-center",
                "hover:cursor-pointer"
            );
            //get everything after the last slash
            let locationText = localLocations[i].split("/").pop();
            locationDiv.innerText = locationText;
            let locationsDiv = document.getElementById("locations");
            locationsDiv.appendChild(locationDiv);
        };
    }*/





	function handleDragStart(e) {
		this.style.opacity = "0.1";
        this.style.boxShadow = "none";
        this.style.dropShadow = "none";
        this.style.cursor = "move";
        this.style.filter = "drop-shadow(0 0 0 #000000)";
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


        if(location === "skip") {
            response.shift();

            let currentFileName = document.getElementById("current-file-name");
            let firstFile = response[0];
            currentFileName.innerText = firstFile;

            let nextItems = document.getElementsByClassName("next-file");
            for (let i = 0; i < nextItems.length; i++) {
                const nextItem = nextItems[i];
                const nextItemSpan = nextItem.getElementsByTagName("span")[0];
                nextItemSpan.innerText = response[i + 1];
            }

            return;
            
        }
        if(location) {
            window.versions.fileDropped({filename: filename, location: location});

            response.shift();

            let currentFileName = document.getElementById("current-file-name");
            let firstFile = response[0];
            currentFileName.innerText = firstFile;



            let nextItems = document.getElementsByClassName("next-file");
            for (let i = 0; i < nextItems.length; i++) {
                const nextItem = nextItems[i];
                const nextItemSpan = nextItem.getElementsByTagName("span")[0];
                nextItemSpan.innerText = response[i + 1];
            }
        }
        

	}


    //**// Event handlers
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
        console.log(locationText)
        locationText = locationText[locationText.length - 1];
        let rootFolder = document.getElementById("current-file");
        rootFolder.setAttribute('data-content', locationText);

        let rootFolderSave = JSON.parse(localStorage.getItem("root-folder"));
        if(rootFolderSave) {
            rootFolderSave.location = locationAndFiles.location;
            rootFolderSave.locationText = locationText;
            localStorage.setItem("root-folder", JSON.stringify(rootFolderSave));
        } else {
            localStorage.setItem("root-folder", JSON.stringify({location: locationAndFiles.location, locationText: locationText}));
        }

        let files = locationAndFiles.files;
        // remove .DS_Store and .localized
        files = files.filter(item => item !== ".DS_Store");
        files = files.filter(item => item !== ".localized");

        let currentFileName = document.getElementById("current-file-name");
        let firstFile = files[0];
        currentFileName.innerText = firstFile;
        

        let nextItems = document.getElementsByClassName("next-file");
        for (let i = 0; i < nextItems.length; i++) {
            const nextItem = nextItems[i];
            const nextItemSpan = nextItem.getElementsByTagName("span")[0];
            nextItemSpan.innerText = files[i + 1];
        }
    });

    

    

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

        if (folderBeingChanged === null) {

            addFolderToDom(location, locationText);
            return;

        }
        folderBeingChanged.innerText = locationText;
        folderBeingChanged.setAttribute("data-folder-location", location);
        folderBeingChanged = null;
    })


};

func();
