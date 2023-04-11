import interact from "interactjs";

export const createCurrentFile = () => {
        let currentFile = document.createElement("li");
        currentFile.setAttribute("id", "current-file");
        currentFile.setAttribute("draggable", "true");
        currentFile.classList.add("ui-button","bg-white","border-slate-300","w-60","h-80","z-50","border-2","rounded","relative","cursor-grab", "text-center", "hover:cursor-grabbing");
        
        let currentFilePreviewImage = document.createElement("img");
        currentFilePreviewImage.setAttribute("id", "current-file-preview");
        currentFile.appendChild(currentFilePreviewImage);

        let currentFileTextTitle = document.createElement("span");
        currentFileTextTitle.setAttribute("id", "current-file-name");
        currentFile.appendChild(currentFileTextTitle);

        let files = document.getElementById("files");
        files.appendChild(currentFile);

        //set the position of the current file
        let position = { x: 0, y: 0 }

        function dragMoveListener (event) {
                var target = event.target
                // keep the dragged position in the data-x/data-y attributes
                var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
                var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
              
                // translate the element
                //target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
              
                // update the posiion attributes
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
                  dropTargetCenterY = dropTargetCenterY - (screenHeight / 2)
                  document.getElementById('current-file').style.transform = 'translate('+dropTargetCenterX+'px, '+dropTargetCenterY+'px) scale('+currentFileScaleValue+')'

                  let filename = document.getElementById('current-file-name').innerText;
                  let location = dropTarget.getAttribute("data-folder-location");

                  window.fileswiper.fileDropped({filename: filename, location: location});

                  setTimeout(() => {
                    //move the current file down by 60px and fade it out
                    document.getElementById('current-file').style.transform = 'translate('+dropTargetCenterX+'px, '+dropTargetCenterY+'px) scale('+currentFileScaleValue+') translateY(100px)'
                    document.getElementById('current-file').style.opacity = '0'

                  }, 1000);
                }

              })

}