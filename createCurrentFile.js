import interact from "interactjs";

export const createCurrentFile = () => {


  let files = document.getElementById("files");

      const numberOfFilesInStack = 3
      for(let i = 0; i < numberOfFilesInStack; i++) {
        let file = document.createElement("li");
        file.classList.add("ui-button", "absolute", "bg-white","border-slate-300","w-60","h-80","z-50","border-2","rounded","cursor-grab", "text-center", "hover:cursor-grabbing");
        // rotate the file at a random angle between -5 and 5 degrees
        let randomAngle = Math.floor(Math.random() * 10) - 5;
        file.style.transform = `rotate(${randomAngle}deg)`;
        //add file to the stack
        files.appendChild(file);
      }
       

        let currentFile = document.createElement("li");
        currentFile.setAttribute("id", "current-file");
        currentFile.setAttribute("draggable", "true");
        currentFile.classList.add("ui-button","absolute","bg-white","border-slate-300","w-60","h-80","z-50","border-2","rounded","cursor-grab", "text-center", "hover:cursor-grabbing");
        
        let currentFilePreviewImage = document.createElement("img");
        currentFilePreviewImage.setAttribute("id", "current-file-preview");
        currentFile.appendChild(currentFilePreviewImage);

        let currentFileTextTitle = document.createElement("span");
        currentFileTextTitle.setAttribute("id", "current-file-name");
        currentFile.appendChild(currentFileTextTitle);

        let currentFileTypeText = document.createElement("span");
        currentFileTypeText.setAttribute("id", "current-file-type");
        currentFile.appendChild(currentFileTypeText);

        let currentFileSizeText = document.createElement("span");
        currentFileSizeText.setAttribute("id", "current-file-size");
        currentFile.appendChild(currentFileSizeText);

        //let files = document.getElementById("files");
        files.appendChild(currentFile);



        let position = { x: 0, y: 0 }

        function dragMoveListener (event) {
                var target = event.target

                var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
                var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
              
                target.setAttribute('data-x', x)
                target.setAttribute('data-y', y)

                position.x += event.dx
                position.y += event.dy

                event.target.style.cursor = 'grabbing'
          
                event.target.style.transform = `translate(${position.x}px, ${position.y}px)`

                //make the element get smaller the further it is dragged
                let scale = 1 - (Math.abs(position.x) + Math.abs(position.y)) / 750
                event.target.style.transform = `translate(${position.x}px, ${position.y}px) scale(${scale})`
              }
              
              

        interact('#current-file').draggable({
                inertia: true,
                cursorChecker () {
                  return 'grab'
                },
                modifiers: [
                  interact.modifiers.restrictRect({
                    restriction: 'parent',
                    endOnly: true
                  })
                ],
                listeners: {
                  move: dragMoveListener
                }
              }).on('up', function (event) {
                if(window.isOverDrop) {
                  interact('#current-file').unset();
                  document.getElementById('current-file').classList.add('dropping-file')
                  let dropTarget = document.querySelector('.drop-target')
                  let dropTargetX = dropTarget.getBoundingClientRect().x
                  let dropTargetY = dropTarget.getBoundingClientRect().y
                  let dropTargetWidth = dropTarget.getBoundingClientRect().width
                  let dropTargetHeight = dropTarget.getBoundingClientRect().height
                  let dropTargetCenterX = dropTargetX + (dropTargetWidth / 2)
                  let dropTargetCenterY = dropTargetY + (dropTargetHeight / 2)
                  let currentFileScale = document.getElementById('current-file').style.transform
                  let currentFileScaleValue = parseFloat(currentFileScale.split('scale(')[1].split(')')[0])
                  let screenWidth = window.innerWidth
                  let screenHeight = window.innerHeight
                  dropTargetCenterX = dropTargetCenterX - (screenWidth / 2)
                  dropTargetCenterY = dropTargetCenterY - (screenHeight / 2) + 60
                  document.getElementById('current-file').style.transform = 'translate('+dropTargetCenterX+'px, '+dropTargetCenterY+'px) scale('+currentFileScaleValue+')'

                  let filename = document.getElementById('current-file-name').innerText;
                  let location = dropTarget.getAttribute("data-folder-location");

                  if(location == "skip") {
                    console.log('skip file')
                    setTimeout(() => {
                      //move the current file down by 60px and fade it out
                      document.getElementById('current-file').style.transform = 'translate('+dropTargetCenterX+'px, '+dropTargetCenterY+'px) scale('+currentFileScaleValue+') translateY(-100px)'
                      document.getElementById('current-file').style.opacity = '0'

                    }, 500);

                  } else {
                    window.fileswiper.fileDropped({filename: filename, location: location});

                    setTimeout(() => {
                      //move the current file down by 60px and fade it out
                      document.getElementById('current-file').style.transform = 'translate('+dropTargetCenterX+'px, '+dropTargetCenterY+'px) scale('+currentFileScaleValue+') translateY(100px)'
                      document.getElementById('current-file').style.opacity = '0'

                      //remove drop-target class from the drop target
                      document.querySelector('.drop-target').classList.remove('drop-target')

                    }, 1000);

                    setTimeout(() => {
                      //remove the current file
                      document.getElementById('current-file').remove()

                      let rootFolder = JSON.parse(localStorage.getItem('root-folder'));
                      window.fileswiper.sendRootFolder(rootFolder);
                    }, 1500);

                  }

                  
                }

              })

}