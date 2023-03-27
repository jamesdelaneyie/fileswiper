"strict mode"

let folderBeingChanged = null;

const func = async () => {



	let response = await window.versions.files();
    //remove .DS_Store from the array
    response = response.filter(item => item !== ".DS_Store");
    //remove .localized from the array
    response = response.filter(item => item !== ".localized");

	let currentFileName = document.getElementById("current-file-name");
	let firstFile = response[0];
	currentFileName.innerText = firstFile;
    

	let nextItems = document.getElementsByClassName("next-file");
	for (let i = 0; i < nextItems.length; i++) {
		const nextItem = nextItems[i];
		const nextItemSpan = nextItem.getElementsByTagName("span")[0];
		nextItemSpan.innerText = response[i + 1];
	}


    let localLocations = JSON.parse(localStorage.getItem("locations"));
    if(localLocations !== null) {

        const radius = 260;
        const centerX = 450;
        const centerY = 290;
        const distanceBetweenDivs = 3;

        for (let i = 0; i < localLocations.length; i++) {
            
            let locationDiv = document.createElement("div");
            
            const angle = (Math.PI * 2 / localLocations.length - 1.5) * i; 
            const x = Math.round(centerX + (radius + distanceBetweenDivs * i) * Math.cos(angle)); 
            const y = Math.round(centerY + (radius + distanceBetweenDivs * i) * Math.sin(angle)); 
            locationDiv.style.position = 'absolute';
            locationDiv.style.left = x + 'px';
            locationDiv.style.top = y + 'px';
            locationDiv.setAttribute("data-folder-location", localLocations[i].location);
            locationDiv.classList.add("location", "bg-white", "border-3", "border-slate-300", "p-10", "h-40", "w-40", "rounded-full", "border", "flex", "items-center", "justify-center", "hover:cursor-pointer")
            locationDiv.innerText = localLocations[i].locationText;
            let locationsDiv = document.getElementById("locations");
            locationsDiv.appendChild(locationDiv);
        };

        console.log("local locations", localLocations)
    }




	function handleDragStart(e) {
        //this.classList.add("dragging");
		this.style.opacity = "0.1";
        this.style.boxShadow = "none";
        this.style.dropShadow = "none";
        this.style.cursor = "move";
        this.style.filter = "drop-shadow(0 0 0 #000000)";
        //console.log(this.style)
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

	let items = document.querySelectorAll("#files li");
	items.forEach(function (item) {
		item.addEventListener("dragstart", handleDragStart);
		item.addEventListener("dragend", handleDragEnd);
	});

    let undoButton = document.getElementById("undo");
    undoButton.addEventListener("click", () => {
        window.versions.undo();
    })

    let quitButton = document.getElementById("quit");
    quitButton.addEventListener("click", () => {
        window.versions.quit();
    })

    let addFolder = document.getElementById("add-folder");
    addFolder.addEventListener("click", () => {
        window.versions.openDialog();
    })

    let skipArea = document.getElementById("skip");
    skipArea.addEventListener("dragover", (e) => {
        e.preventDefault();
    })


    let locations = document.getElementsByClassName("location");
    for (let i = 0; i < locations.length; i++) {
        const location = locations[i];
        location.addEventListener("dragover", (e) => {
            e.preventDefault();
        })
        location.addEventListener("click", (e) => {
            window.versions.openDialog();
            folderBeingChanged = e.target;
        })
        location.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.target.remove();
            //remove this location from local storage
            let localLocations = JSON.parse(localStorage.getItem("locations"));
            let location = e.target.getAttribute("data-folder-location");
            let locationText = e.target.innerText;
            let newLocations = localLocations.filter(item => item.location !== location);
            localStorage.setItem("locations", JSON.stringify(newLocations));

        })
    }

    let folderSelect = document.getElementById("folder-select");
    folderSelect.addEventListener("click", () => {
        window.versions.openRootDialog();
    })

    window.versions.selectRootFolder((event, locationAndFiles) => {
        if(typeof locationAndFiles.location === "undefined") {
            return;
        }
        let locationText = locationAndFiles.location.split("/");
        locationText = locationText[locationText.length - 1];
        let rootFolder = document.getElementById("current-file");
        rootFolder.setAttribute('data-content', locationText);

        files = locationAndFiles.files.filter(item => item !== ".DS_Store");
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
        //add location to local storage
        let locations = JSON.parse(localStorage.getItem("locations"));
        if(locations === null) {
            locations = [];
        }
        locations.push({location: location, locationText: locationText});
        localStorage.setItem("locations", JSON.stringify(locations));

        if (folderBeingChanged === null) {
            let div = document.createElement("div");
            div.setAttribute("data-folder-location", location);
            div.innerText = locationText;
            div.classList.add("location");
            div.classList.add("location", "bg-white", "border-3", "border-slate-300", "p-10", "h-40", "w-40", "rounded-full", "border", "flex", "items-center", "justify-center", "hover:cursor-pointer")
            let locationParent = document.getElementById("locations");
            div.addEventListener("click", (e) => {
                window.versions.openDialog();
                folderBeingChanged = e.target;
            })
            div.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                e.target.remove();
            })
            locationParent.appendChild(div);
            return;
        }
        folderBeingChanged.innerText = locationText;
        folderBeingChanged.setAttribute("data-folder-location", location);
        folderBeingChanged = null;
    })


};

func();
