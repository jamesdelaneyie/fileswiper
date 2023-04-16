export const getDropZoneCenters = () => {
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
      console.log(location.id)
      //if the location is the trash then set the range as 250
      if(location.id === 'trash') {
        centerPoints.push({x: locationCenterX, y: locationCenterY - 200, range: 150})
      } else if (location.id === 'skip') {
        centerPoints.push({x: locationCenterX - 100, y: locationCenterY, range: 0})
      } else; {
        centerPoints.push({x: locationCenterX, y: locationCenterY})
      }
    })
    return centerPoints
}