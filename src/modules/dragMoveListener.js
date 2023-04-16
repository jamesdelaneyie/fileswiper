import interact from "interactjs";

export const dragMoveListener = (interactSettings, randomClassName, event) => {

    let filebeingDragged = document.querySelector(`.${randomClassName}`)

    var x = (parseFloat(filebeingDragged.getAttribute('data-x')) || 0) + event.dx
    var y = (parseFloat(filebeingDragged.getAttribute('data-y')) || 0) + event.dy
  
    filebeingDragged.setAttribute('data-x', x)
    filebeingDragged.setAttribute('data-y', y)

    filebeingDragged.style.cursor = 'grabbing'
    
    let scale
    let centerPointOffilebeingDragged = (filebeingDragged.getBoundingClientRect().width / 2) + filebeingDragged.getBoundingClientRect().x
    let minScale = 0.25
    if(centerPointOffilebeingDragged < (window.innerWidth / 2)) {
      scale = 1 - (Math.abs(x)) / 1000
    } else {
      scale = 1 - (Math.abs(x)) / 450
      scale = scale < minScale ? minScale : scale
    }
    

    filebeingDragged.style.transform = `translate(${x}px, ${y}px) scale(${scale})`

    if(event.dropzone) {
      if(document.querySelector('.drop-target')) {

        interact(`.${randomClassName}`).unset()
        
        filebeingDragged.classList.add('dropping-file')
        filebeingDragged.removeAttribute('id')

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
        dropTargetCenterY = dropTargetCenterY - (screenHeight / 2)

        let filename = document.querySelector('.dropping-file #current-file-name').innerText;
        let location = dropTarget.getAttribute("data-folder-location");
        let rootFolder = JSON.parse(localStorage.getItem('root-folder'));

        if(location == 'trash') {
          document.querySelector('.dropping-file').style.transform = 'translate('+dropTargetCenterX+'px, '+(dropTargetCenterY - 50)+'px) scale('+currentFileScaleValue+')'
        } else {
          document.querySelector('.dropping-file').style.transform = 'translate('+dropTargetCenterX+'px, '+dropTargetCenterY+'px) scale('+currentFileScaleValue+')'
        }
        
        let fileBeingDroppedRef = document.querySelector('.dropping-file')
        //add a unique randomized class to the file being dropped
        let randomClass = Math.random().toString(36).substring(7);
        //ensure there are no numbers in the class name
        randomClass = randomClass.replace(/[0-9]/g, '');
        fileBeingDroppedRef.classList.add(randomClass)
        
        let fileBeingDropped = document.querySelector('.'+randomClass)
        let preFinal
        
        if(location == 'trash') {
          preFinal = 'translate('+dropTargetCenterX+'px, '+(dropTargetCenterY)+'px) translateY(-55px) rotate(30deg) scale(0.15)'
          fileBeingDropped.style.borderRadius = '50%'
          fileBeingDropped.style.height = '100px'
          fileBeingDropped.style.width = '100px'
          fileBeingDropped.style.minHeight = '100px'
          fileBeingDropped.style.minWidth = '100px'
        } else {
          preFinal = 'translate('+dropTargetCenterX+'px, '+dropTargetCenterY+'px) translateY(-55px) rotate(30deg) scale(0.15)'
        }
        let finalTransform = 'translate('+dropTargetCenterX+'px, '+dropTargetCenterY+'px) translateY(-20px) rotate(90deg) scale(0.15)'
      

        
        if(location == rootFolder) {
          fileBeingDropped.style.transform = 'translate(0px, 0px) scale(1)'
          fileBeingDropped.setAttribute('data-x', 0)
          fileBeingDropped.setAttribute('data-y', 0)
          dropTarget.classList.add('drop-target-rejected')
          fileBeingDropped.classList.add('rejected')
          setTimeout(() => {
            dropTarget.classList.remove('drop-target')
            dropTarget.classList.remove('drop-target-rejected')
            interact(`.${randomClassName}`).draggable(interactSettings)
          }, 200)
          setTimeout(() => {
            fileBeingDropped.classList.remove('dropping-file')
            fileBeingDropped.classList.remove('rejected')
          }, 1000)
          return;
        }

        window.fileswiper.fileDropped({filename: filename, location: location});

        fileBeingDropped.style.transform = preFinal

        setTimeout(() => {
          window.fileswiper.sendRootFolder(rootFolder);
          dropTarget.classList.remove('drop-target')
          dropTarget.classList.add('drop-target-accepted')
        }, 200);

        setTimeout(() => {
          fileBeingDropped.style.transform = finalTransform
          fileBeingDropped.style.opacity = 0
        }, 700);

        setTimeout(() => {
          //fileBeingDropped.remove()
        }, 1000)
      }
    }

    
  }
