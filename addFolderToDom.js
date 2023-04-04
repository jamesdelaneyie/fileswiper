export const addFolderToDom = (location) => {
    let locationParent = document.getElementById("locations");
    let div = document.createElement("div");
    div.setAttribute("data-folder-location", location);
    let locationText = location.split("/").pop();
    div.innerText = locationText;
    div.classList.add(
      "location",
      "ui-button",
      "bg-white",
      "border-3",
      "border-slate-300",
      "p-10",
      "h-40",
      "w-40",
      "rounded-full",
      "border",
      "flex",
      "items-center",
      "justify-center",
      "hover:cursor-pointer"
    );
    div.setAttribute("draggable", true);
    // Add Event Listeners
    // Left click
    div.addEventListener("click", (e) => {
      window.versions.openDialog();
    });
    // Right click
    div.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.target.remove();
      let localLocations = JSON.parse(localStorage.getItem("locations"));
      let location = e.target.getAttribute("data-folder-location");
      let newLocations = localLocations.filter((item) => item !== location);
      localStorage.setItem("locations", JSON.stringify(newLocations));
    });
    locationParent.appendChild(div);
  };
  