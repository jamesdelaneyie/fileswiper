setTimeout(function(){
    document.body.style.backgroundColor = "white";
    const childElement = document.body.children[0];
    childElement.style.width = "100%";
    childElement.style.height = "100%";
    childElement.style.objectFit = "cover";
}, 10);