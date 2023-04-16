export const updateSavedFolders = (location) => {
    let locations = JSON.parse(localStorage.getItem("locations"));
    if(locations === null) {
        locations = [];
    }
    locations.push(location);
    localStorage.setItem("locations", JSON.stringify(locations));
}       