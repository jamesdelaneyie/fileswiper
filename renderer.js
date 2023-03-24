"strict mode"

let folderBeingChanged = null;

const func = async () => {

	let response = await window.versions.files();
	let currentFileName = document.getElementById("current-file-name");
	let firstFile = response[0];
	currentFileName.innerText = firstFile;
    

	let nextItems = document.getElementsByClassName("next-file");
	for (let i = 0; i < nextItems.length; i++) {
		const nextItem = nextItems[i];
		const nextItemSpan = nextItem.getElementsByTagName("span")[0];
		nextItemSpan.innerText = response[i + 1];
	}

	function handleDragStart(e) {
        //this.classList.add("dragging");
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
    }

    window.versions.folderLocation((event, location) => {
        let locationText = location.split("/");
        locationText = locationText[locationText.length - 1];
        folderBeingChanged.innerText = locationText;
        folderBeingChanged.setAttribute("data-folder-location", location);
        //console.log(location);
    })


};

func();
