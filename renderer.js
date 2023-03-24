"strict mode"

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




    function updateFileList() {
        
    }
};

func();
