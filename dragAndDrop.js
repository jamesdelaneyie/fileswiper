export const handleDragStart = (e) => {

    

    e.target.style.opacity = "0.1";
    e.target.style.boxShadow = "none";
    e.target.style.dropShadow = "none";
    e.target.style.cursor = "move";
    e.target.style.filter = "drop-shadow(0 0 0 #000000)";


    console.log('drag start')
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target);
    e.dataTransfer.setDragImage(e.target, 0, 0);
    //set drag opacity


    
}

export const handleDragEnd = (e, files, rootFolderSave) => {
    console.log('drag end')

    e.target.style.opacity = "1";
    e.target.style.boxShadow = "none";
    e.target.style.dropShadow = "none";
    e.target.style.cursor = "move";
    e.target.style.filter = "drop-shadow(0 0 0 #000000)";

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