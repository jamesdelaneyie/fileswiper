export const handleDragStart = (e) => {
    /*this.style.opacity = "0.1";
    this.style.boxShadow = "none";
    this.style.dropShadow = "none";
    this.style.cursor = "move";
    this.style.filter = "drop-shadow(0 0 0 #000000)";*/

    console.log('drag start')
    e.dataTransfer.effectAllowed = "move";

    //move the ghost image to the top left corner
    
}

export const handleDragEnd = (e, files, rootFolderSave) => {
    console.log('drag end')
    /*this.style.opacity = "1";
    this.style.boxShadow = "none";
    this.style.dropShadow = "none";
    this.style.cursor = "move";
    this.style.filter = "drop-shadow(0 0 0 #000000)";*/

    let filename = e.target.innerText;
    
    let dropTarget = document.elementFromPoint(e.clientX, e.clientY);
    let location = dropTarget.getAttribute("data-folder-location");

    console.log(filename, dropTarget, location)

    /*if(location === rootFolderSave) {
        console.log('same location')
        return
    }

    if(location === "skip") {
        files.shift();

        files = updateFileList(files);
        
    }
    if(location) {
        
        window.fileswiper.fileDropped({filename: filename, location: location});

        files.shift();

        files = updateFileList(files);

    }*/
    
}