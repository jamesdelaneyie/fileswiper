import interact from "interactjs";
import { log } from "./logging.js";

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

        //set data-x and data-y attributes to 0
        currentFile.setAttribute('data-x', 0)
        currentFile.setAttribute('data-y', 0)

        //let files = document.getElementById("files");
        files.appendChild(currentFile);


        
        let position = {x : 0, y : 0}

        function dragMoveListener (event) {
                var target = event.target

                //console.log(event)
                //if the element is over a dropzone and the pointer is up, then drop the element into the dropzone
                if(event.dropzone) {
                  log('dropping file', 'moving')
                }

                //console.log(event.dx, event.dy)

                var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
                var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
              
                target.setAttribute('data-x', x)
                target.setAttribute('data-y', y)

                position.x += event.dx
                position.y += event.dy

                //console.log(position.x, position.y)

                //set the transform-origin to the x, y coordinates of the mouse's location relative to the element
                //event.target.style.transformOrigin = `${event.clientX - event.target.getBoundingClientRect().x}px ${event.clientY - event.target.getBoundingClientRect().y}px`

                event.target.style.cursor = 'grabbing'
          
                //event.target.style.transform = `translate(${position.x}px, ${position.y}px)`

                //make the element get smaller the further it is dragged
                let scale = 1 - (Math.abs(position.x)) / 450
                event.target.style.transform = `translate(${position.x}px, ${position.y}px)`// scale(${scale})`
              }
              
        const dropIntoFolder = (event) => {
          console.log('drop into folder')
        }

        //add a mouse up listener to the current file
        currentFile.addEventListener('mouseup', function(){
          //currentFile.setCapture();
          log('mouse up', 'interacting')
        })

        currentFile.addEventListener('mousedown', function(){
          //document.releaseCapture();
          log('mouse down', 'interacting')
        })

        window.addEventListener('mouseup', function(){
          log('outside window mouse up', 'interacting')
        })

        function getRestriction(x, y, element) {
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
          let elementWidth = elementTag.getBoundingClientRect().width * 1.5
          let elementHeight = elementTag.getBoundingClientRect().height * 1.5
          
          // Calculate the maximum distance from the center of the circle that the element can be moved
          let maxDistance = radius - Math.sqrt(Math.pow(elementWidth, 2) + Math.pow(elementHeight, 2)) / 2
          
          // Calculate the maximum rectangle size based on the maximum allowed distance from the center of the circle
          let maxWidth = maxDistance * 2
          let maxHeight = maxDistance * 2
          let maxX = centerX - maxWidth / 2
          let maxY = centerY - maxHeight / 2
          
          return {
            x: maxX,
            y: maxY,
            width: maxWidth,
            height: maxHeight
          }
        }
        

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
                    restriction: function(x, y, element) {
                      return getRestriction(x, y, element)
                    },
                    endOnly: true
                  }), 
                  interact.modifiers.snap({
                    targets: [
                      {x: 750, y: 360},
                    ], 
                    relativePoints: [
                      {x: 0.5, y: 0.5}
                    ],
                    range: 70,
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
                //let dropTarget = document.querySelector('.drop-target')
                //onsole.log(window.isOverDrop)
                //console.log(dropTarget)
                //if(window.isOverDrop && dropTarget) {
                  //console.log('drop into folder')
                  /*interact('#current-file').unset();
                  document.getElementById('current-file').classList.add('dropping-file')
                  
                  let dropTargetX = dropTarget.getBoundingClientRect().x
                  let dropTargetY = dropTarget.getBoundingClientRect().y
                  let dropTargetWidth = dropTarget.getBoundingClientRect().width
                  let dropTargetHeight = dropTarget.getBoundingClientRect().height
                  let dropTargetCenterX = dropTargetX + (dropTargetWidth / 2)
                  let dropTargetCenterY = dropTargetY + (dropTargetHeight / 2)
                  //let currentFileScale = document.getElementById('current-file').style.transform
                  //let currentFileScaleValue = parseFloat(currentFileScale.split('scale(')[1].split(')')[0])
                  let screenWidth = window.innerWidth
                  let screenHeight = window.innerHeight
                  dropTargetCenterX = dropTargetCenterX - (screenWidth / 2)
                  dropTargetCenterY = dropTargetCenterY - (screenHeight / 2) + 60
                  document.getElementById('current-file').style.transform = 'translate('+dropTargetCenterX+'px, '+dropTargetCenterY+'px)'// scale('+currentFileScaleValue+')'

                  let filename = document.getElementById('current-file-name').innerText;
                  let location = dropTarget.getAttribute("data-folder-location");

                  if(location == "skip") {
                    console.log('skip file')
                    setTimeout(() => {
                      //move the current file down by 60px and fade it out
                      document.getElementById('current-file').style.transform = 'translate('+dropTargetCenterX+'px, '+dropTargetCenterY+'px) translateY(-100px)'// scale('+currentFileScaleValue+') '
                      document.getElementById('current-file').style.opacity = '0'

                    }, 500);

                  } else {
                    window.fileswiper.fileDropped({filename: filename, location: location});

                    //add a dropping class to the current file 
                    document.getElementById('current-file').classList.add('dropping-file')

                    //remove the current-file id from the current file
                    document.getElementById('current-file').removeAttribute('id')
                    
                    //position = { x: 0, y: 0 }

                    //get the current file with the dropping-file class
                    let fileBeingDropped = document.querySelector('.dropping-file')

                    //remove drop-target class from the drop target
                    document.querySelector('.drop-target').classList.remove('drop-target')

                    setTimeout(() => {
                      //if the current file exists 
                      if(fileBeingDropped) {
                        //move the current file down by 60px and fade it out
                        fileBeingDropped.style.transform = 'translate('+dropTargetCenterX+'px, '+dropTargetCenterY+'px) translateY(100px)'// scale('+currentFileScaleValue+')'
                        fileBeingDropped.style.opacity = '0'
                      }
                      

                    }, 200);

                    setTimeout(() => {
                      //if the current file exists 
                      if(fileBeingDropped) {
                        //move the current file down by 60px and fade it out
                        fileBeingDropped.remove()
                      }
                      
                    }, 400);

                    setTimeout(() => {
                      let rootFolder = JSON.parse(localStorage.getItem('root-folder'));
                      window.fileswiper.sendRootFolder(rootFolder);
                      console.log('file dropped')
                      
                    }, 600)

                  }*/
                //}
              }).on('dragstart', function(){
                //position = {x: 0, y: 0}
                log('dragstart', 'interacting')
              }).on('draginertiastart', function (event) {
                log('draginertiastart', 'interacting')
              })

}