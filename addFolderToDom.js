export const addFolderToDom = (location) => {
    let locationParent = document.getElementById("locations");
    let div = document.createElement("li");
    div.setAttribute("data-folder-location", location);
    div.classList.add(
      "location",
      "ui-button",
      "bg-white",
      "border-3",
      "border-slate-300",
      "p-10",
      "text-sm",
      "h-40",
      "w-40",
      "rounded-full",
      "text-center",
      "border",
      "flex",
      "items-center",
      "justify-center",
      "hover:cursor-pointer"
    );

    let innerDiv = document.createElement("div");
    innerDiv.setAttribute("class", "text-center");
    
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 50 50");
    svg.setAttribute("class", "fill-slate-400 w-9 inline");
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M 5 4 C 3.3550302 4 2 5.3550302 2 7 L 2 16 L 2 18 L 2 43 C 2 44.64497 3.3550302 46 5 46 L 45 46 C 46.64497 46 48 44.64497 48 43 L 48 19 L 48 16 L 48 11 C 48 9.3550302 46.64497 8 45 8 L 18 8 C 18.08657 8 17.96899 8.000364 17.724609 7.71875 C 17.480227 7.437136 17.179419 6.9699412 16.865234 6.46875 C 16.55105 5.9675588 16.221777 5.4327899 15.806641 4.9628906 C 15.391504 4.4929914 14.818754 4 14 4 L 5 4 z M 5 6 L 14 6 C 13.93925 6 14.06114 6.00701 14.308594 6.2871094 C 14.556051 6.5672101 14.857231 7.0324412 15.169922 7.53125 C 15.482613 8.0300588 15.806429 8.562864 16.212891 9.03125 C 16.619352 9.499636 17.178927 10 18 10 L 45 10 C 45.56503 10 46 10.43497 46 11 L 46 13.1875 C 45.685108 13.07394 45.351843 13 45 13 L 5 13 C 4.6481575 13 4.3148915 13.07394 4 13.1875 L 4 7 C 4 6.4349698 4.4349698 6 5 6 z M 5 15 L 45 15 C 45.56503 15 46 15.43497 46 16 L 46 19 L 46 43 C 46 43.56503 45.56503 44 45 44 L 5 44 C 4.4349698 44 4 43.56503 4 43 L 4 18 L 4 16 C 4 15.43497 4.4349698 15 5 15 z");
    svg.appendChild(path);
    innerDiv.appendChild(svg);
    
    console.log(location)

    let locationText = location.split("/").pop();
    let locationTextDiv = document.createElement("span");
    locationTextDiv.innerText = locationText;
    locationTextDiv.classList.add("text-slate-500", "text-sm");
    innerDiv.appendChild(locationTextDiv);
    div.appendChild(innerDiv);

    // Add Event Listeners
    // Left click
    div.addEventListener("click", (e) => {
      //window.versions.openDialog();
    });
    
    // Right click
    div.addEventListener("contextmenu", (e) => {
      e.target.classList.add("removing");
      e.preventDefault();
      let localLocations = JSON.parse(localStorage.getItem("locations"));
      let location = e.target.getAttribute("data-folder-location");
      let newLocations = localLocations.filter((item) => item !== location);
      localStorage.setItem("locations", JSON.stringify(newLocations));
      setTimeout(() => {
        e.target.remove();
      }, 100);
    });
    locationParent.appendChild(div);
  };
  