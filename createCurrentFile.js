import interact from "interactjs";
import { log } from "./logging.js";

export const createCurrentFile = () => {


  let files = document.getElementById("files");

        let currentFile = document.createElement("li");
        currentFile.setAttribute("id", "current-file");
        currentFile.classList.add("ui-button","absolute","bg-white","border-slate-300","w-60","h-80","z-50","border-2","rounded","cursor-grab", "text-center", "hover:cursor-grabbing");
        
        let currentFileWrapper = document.createElement("div");
        currentFileWrapper.setAttribute("id", "current-file-wrapper");
        currentFile.appendChild(currentFileWrapper);

        let currentFilePreviewImage = document.createElement("img");
        currentFilePreviewImage.setAttribute("id", "current-file-preview");
        currentFileWrapper.appendChild(currentFilePreviewImage);

        let currentFileTextTitle = document.createElement("span");
        currentFileTextTitle.setAttribute("id", "current-file-name");
        currentFileWrapper.appendChild(currentFileTextTitle);

        let currentFileTypeText = document.createElement("span");
        currentFileTypeText.setAttribute("id", "current-file-type");
        currentFile.appendChild(currentFileTypeText);

        let currentFileSizeText = document.createElement("span");
        currentFileSizeText.setAttribute("id", "current-file-size");
        currentFile.appendChild(currentFileSizeText);

        //set data-x and data-y attributes to 0
        currentFile.setAttribute('data-x', 0)
        currentFile.setAttribute('data-y', 0)

        //let files = document.getElementById("files");
        files.appendChild(currentFile);
        
        let position = {x : 0, y : 0}

        function dragMoveListener (event) {
                var target = event.target

                if(event.dropzone) {
                  if(document.querySelector('.drop-target')) {
                    interact('#current-file').unset();
                    document.getElementById('current-file').classList.add('dropping-file')
                    //remove the currentfile id from the current file
                    document.getElementById('current-file').removeAttribute('id')
                    let dropTarget = document.querySelector('.drop-target')
                    let dropTargetX = dropTarget.getBoundingClientRect().x
                    let dropTargetY = dropTarget.getBoundingClientRect().y
                    let dropTargetWidth = dropTarget.getBoundingClientRect().width
                    let dropTargetHeight = dropTarget.getBoundingClientRect().height
                    let dropTargetCenterX = dropTargetX + (dropTargetWidth / 2)
                    let dropTargetCenterY = dropTargetY + (dropTargetHeight / 2)
                    let currentFileScale = document.querySelector('.dropping-file').style.transform
                    let currentFileScaleValue = parseFloat(currentFileScale.split('scale(')[1].split(')')[0])
                    let screenWidth = window.innerWidth
                    let screenHeight = window.innerHeight
                    dropTargetCenterX = dropTargetCenterX - (screenWidth / 2)
                    dropTargetCenterY = dropTargetCenterY - (screenHeight / 2) + 60
                    document.querySelector('.dropping-file').style.transform = 'translate('+dropTargetCenterX+'px, '+dropTargetCenterY+'px) translateY(100px) scale('+currentFileScaleValue+')'
                    
                    let fileBeingDroppedRef = document.querySelector('.dropping-file')
                    //add a unique randomized class to the file being dropped
                    let randomClass = Math.random().toString(36).substring(7);
                    //ensure there are no numbers in the class name
                    randomClass = randomClass.replace(/[0-9]/g, '');
                    fileBeingDroppedRef.classList.add(randomClass)
                    
                    let fileBeingDropped = document.querySelector('.'+randomClass)
                    let preFinal = 'translate('+dropTargetCenterX+'px, '+dropTargetCenterY+'px) translateY(-118px) rotate(30deg) scale(0.25)'
                    let finalTransform = 'translate('+dropTargetCenterX+'px, '+dropTargetCenterY+'px) translateY(-75px) rotate(120deg) scale(0.25)'
                    
                    let filename = document.getElementById('current-file-name').innerText;
                    let location = dropTarget.getAttribute("data-folder-location");

                    window.fileswiper.fileDropped({filename: filename, location: location});

                    setTimeout(() => {
                      fileBeingDropped.style.transform = preFinal
                      
                      let rootFolder = JSON.parse(localStorage.getItem('root-folder'));
                      window.fileswiper.sendRootFolder(rootFolder);
                    }, 200);

                    setTimeout(() => {
                      fileBeingDropped.style.transform = finalTransform
                      fileBeingDropped.style.opacity = 0
                    }, 800);

                    setTimeout(() => {
                      fileBeingDropped.remove()
                      dropTarget.classList.remove('drop-target')
                    }, 1000)
                  }
                }

                var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
                var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
              
                target.setAttribute('data-x', x)
                target.setAttribute('data-y', y)

                position.x += event.dx
                position.y += event.dy

                event.target.style.cursor = 'grabbing'

                let scale = 1 - (Math.abs(position.x)) / 450
                event.target.style.transform = `translate(${position.x}px, ${position.y}px) scale(${scale})`
              }
              

        //add a mouse up listener to the current file
        currentFile.addEventListener('mouseup', function(){
          log('mouse up', 'interacting')
        })

        currentFile.addEventListener('mousedown', function(){
          log('mouse down', 'interacting')
        })

        window.addEventListener('mouseup', function(){
          log('outside window mouse up', 'interacting')
        })

        function getRestriction() {
          let mainArea = document.getElementById('main-area')
          let mainAreaRect = mainArea.getBoundingClientRect()
          let mainAreaX = mainAreaRect.x
          let mainAreaY = mainAreaRect.y
          let mainAreaWidth = mainAreaRect.width
          let mainAreaHeight = mainAreaRect.height
          
          // Calculate the center and radius of the circle
          let centerX = mainAreaX + mainAreaWidth / 2
          let centerY = mainAreaY + mainAreaHeight / 2
          let radius = Math.min(mainAreaWidth, mainAreaHeight) / 2

          // Calculate the width and height of the element being moved
          let elementTag = document.getElementById('current-file')
          let elementWidth = elementTag.getBoundingClientRect().width * 2
          let elementHeight = elementTag.getBoundingClientRect().height * 2
          
          // Calculate the maximum distance from the center of the circle that the element can be moved
          let maxDistance = radius - Math.sqrt(Math.pow(elementWidth, 2) + Math.pow(elementHeight, 2)) / 2
          
          // Calculate the maximum rectangle size based on the maximum allowed distance from the center of the circle
          let maxWidth = maxDistance * 2
          let maxHeight = maxDistance * 2
          let maxX = centerX - maxWidth / 2
          let maxY = centerY - maxHeight / 2

          console.log(maxX, maxY, maxWidth, maxHeight)
          
          return {
            x: maxX,
            y: maxY,
            width: maxWidth,
            height: maxHeight
          }
        }

        //get the center point of all the .location elements
        let centerPoints = []
        let locations = document.querySelectorAll('.location')
        locations.forEach(location => {
          let locationRect = location.getBoundingClientRect()
          let locationX = locationRect.x
          let locationY = locationRect.y 
          let locationWidth = locationRect.width
          let locationHeight = locationRect.height
          let locationCenterX = locationX + locationWidth / 2
          let locationCenterY = locationY + locationHeight / 2
          //if the location is the trash then set the range as 250
          if(location.id === 'trash') {
            centerPoints.push({x: locationCenterX, y: locationCenterY, range: 150})
          } else {
            centerPoints.push({x: locationCenterX, y: locationCenterY})
          }
        })

        

        interact('#current-file').draggable({
                inertia: {
                  resistance: 10,
                  smoothEndDuration: 100,
                },
                cursorChecker () {
                  return 'grab'
                },
                modifiers: [
                  interact.modifiers.restrict({
                    restriction: getRestriction(),
                    endOnly: true
                  }), 
                  interact.modifiers.snap({
                    targets: centerPoints, 
                    relativePoints: [
                      {x: 0.5, y: 0.5}
                    ],
                    range: 150,
                    endOnly: true,
                  })
                ],
                listeners: {
                  move: dragMoveListener,
                }
              }).on('up', function(){
                log('pointer up', 'interacting')
              }).on('dragend', function(){
                log('dragend', 'interacting')
              }).on('dragstart', function(){
                log('dragstart', 'interacting')
              }).on('draginertiastart', function () {
                log('draginertiastart', 'interacting')
              })

}