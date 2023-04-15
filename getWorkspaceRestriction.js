export const getWorkspaceRestriction = () => {
    let mainArea = document.getElementById('workspace')
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