function addElement(type,name,parent,width,height,depth,textureMap) {
    let success = false;
    let element = document.createElement("div");
    element.style.width = width;
    element.style.height = height;
    if (document.getElementById(name) == null) {
        element.id = name;
        success = true
    } else {
        console.log("Error");
    }
    if (type == "cube") {
        element.innerHTML = `
        <div class="top face"></div>
        <div class="left face"></div>
        <div class="right face"></div>
        <div class="front face"></div>
        <div class="back face"></div>
        <div class="bottom face"></div>
        `;
        let faces = element.querySelectorAll(".face");
        if (textureMap.lenght == 6) {
            faces.forEach((actualFace, index) => {
                actualFace.style.backgroundImage = `${textureMap[index]}`;
            })
        }

        faces[0].style.width = `${width}px`;
        faces[0].style.height = `${depth}px`;

        faces[1].style.width = `${depth}px`;
        faces[1].style.height = `${height}px`;
        faces[1].style.transform = `rotateX(90deg) rotateZ(90deg)`;

        faces[2].style.width = `${depth}px`;
        faces[2].style.height = `${height}px`;
        faces[2].style.transform = `rotateX(90deg) rotateZ(90deg)`;

        faces[3].style.width = `${width}px`;
        faces[3].style.height = `${height}px`;
        faces[3].style.transform = `translateY(${depth}px) rotateX(90deg)`;

        faces[4].style.width = `${width}px`;
        faces[4].style.height = `${height}px`;
        faces[4].style.transform = `rotateX(90deg) rotateY(180deg)`;

        faces[5].style.width = `${width}px`;
        faces[5].style.height = `${depth}px`;
    }

    parent.appendChild(element)
}

let textures = [
    "assets/map/wall.png",
    "assets/map/wall.png",
    "assets/map/wall.png",
    "assets/map/wall.png",
    "assets/map/wall.png",
    "assets/map/wall.png"
]
addElement("cube","teste",camera,100,50,75,textures)
let teste = document.getElementById("teste")
teste.style.transform = "translateX(600px) translateY(500px) translateZ(0px)"