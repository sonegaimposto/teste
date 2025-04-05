// DECLARAR VARIAVEIS
const camera = document.getElementById("camera");
const hand = document.getElementById("hand");
const flashlight = document.getElementById("flashlight");
var rotate = 0;
var lean = 0;
var x = 700;
var y = 150;
var z = -1000;
const acceptedkeys = ["KeyW", "KeyA", "KeyS", "KeyD"];
var keys = [];
var mouseX = 0;
var mouseY = 0;
var speed = 1.5;
var freeMove = true;

var playerPosition = "room";

const door = {
    "element": document.getElementById("door"),
    "shadow": document.getElementById("doorshadow"),
    "doorButton": document.getElementById("doorbutton"),
    "canInteract": false,
    "interacting": false,
    "isOpen": true,
    "inCooldown": false,
    "flashlightIsON": false,
    "flashlightCooldown": false
}

const duct = {
    "element": document.getElementById("duct"),
    "shadows": [
        document.getElementById("ductshadows").children[0],
        document.getElementById("ductshadows").children[1],
        document.getElementById("ductshadows").children[2],
        document.getElementById("ductshadows").children[3],
        document.getElementById("ductshadows").children[4],
        document.getElementById("ductshadows").children[5],
        document.getElementById("ductshadows").children[6],
        document.getElementById("ductshadows").children[7],
        document.getElementById("ductshadows").children[8]
    ],
    "canInteract": false,
    "interacting": false,
    "flashlightIsON": false,
    "flashlightCooldown": false
}

const frontWindow = {
    "element": document.getElementById("window"),
    "shadow": document.getElementById("windowshadow"),
    "windowButton": document.getElementById("windowbutton"),
    "canInteract": false,
    "interacting": false,
    "lightsIsON": false,
    "lightsCooldown": false
}

const corridors = {
    "wall1": document.getElementById("corridors").children[0],
    "wall2": document.getElementById("corridors").children[1],
    "wall3": document.getElementById("corridors").children[2],
    "wall4": document.getElementById("corridors").children[3],
    "wall5": document.getElementById("corridors").children[4],
}





// LISTA DE TECLAS SENDO PRESSIONADAS SIMULTANEAMENTE
document.addEventListener("keydown", (event) => {
    if (acceptedkeys.includes(event.code) && keys.includes(event.code) == false) {
        keys.push(event.code);
    }
});
document.addEventListener("keyup", (event) => {
    if (keys.includes(event.code)) {
        keys.splice(keys.indexOf(event.code),1);
    }
});
// MOUSE DETECTION
document.addEventListener("mousemove", (event) => {
    mouseX = event.screenX - (window.innerWidth/2);
    mouseY = event.screenY - (window.innerHeight/2);
})


// PLAYER CODE
const playerCode = setInterval(() => {

    let moving = false;
    if (freeMove) {
        // Virar a camera
        if (mouseX > 120 || mouseX < -120) {
            rotate -= mouseX/600;
            rotate = rotate > 360 ? 0 : rotate;
            rotate = rotate < 0 ? 360 : rotate;
        }

        
        let radians = rotate * (Math.PI / 180);

        // Andar
        if (keys.includes("KeyW")) {
            x -= Math.sin(radians) * (speed * 1.5);
            z += Math.cos(radians) * (speed * 1.5);
            moving = true;
        };
        if (keys.includes("KeyA")) {
            radians = (rotate + 90) * (Math.PI / 180);
            x -= Math.sin(radians) * speed;
            z += Math.cos(radians) * speed;
            moving = true;
        };
        if (keys.includes("KeyS")) {
            radians = (rotate + 180) * (Math.PI / 180);
            x -= Math.sin(radians) * 1;
            z += Math.cos(radians) * 1;
            moving = true;
        };
        if (keys.includes("KeyD")) {
            radians = (rotate - 90) * (Math.PI / 180);
            x -= Math.sin(radians) * speed;
            z += Math.cos(radians) * speed;
            moving = true;
        };
    }

    // UPDATE CAMERA
    camera.style.transform = `perspective(1000px) translateY(${y}px) translateZ(1000px) rotateX(90deg) rotateY(${lean}deg) rotateZ(${rotate}deg) translate(${-(x)}px, ${z}px)`;

    // Animação de andar
    if (moving && freeMove) {
        camera.style.animation = "moving-animation 0.7s infinite"
    } else {
        camera.style.animation = ""
    }

    // Colisão da sala
    if (playerPosition == "room") {
        if (x < 470) {
            x = 470;
        } else if (x > 875) {
            x = 875;
        }
        if (z > -490) {
            z = -490;
        } else if (z < -1175) {
            z = -1175;
        }
    }
    // Hitbox pra interagir com a porta 
    if (x > 500 && x < 625 && z > -1050 && z < -800) {
        door.canInteract = true;
    } else {
        door.canInteract = false;
    }
    // Hitbox pra interagir com o duto 
    if (x > 700 && x < 875 && z > -875 && z < -600) {
        duct.canInteract = true;
    } else {
        duct.canInteract = false;
    }
    // Hitbox pra interagir com a luz da janela 
    if (x > 700 && x < 875 && z > -750 && z < -490) {
        frontWindow.canInteract = true;
    } else {
        frontWindow.canInteract = false;
    }
    
}, 10);
camera.style.transform = `perspective(1000px) translateY(${y}px) translateZ(1000px) rotateX(90deg) rotateY(${lean}deg) rotateZ(${rotate}deg) translate(${-(x)}px, ${z}px)`;










// AUDIOS
const sounds = {
    "ambience": new Audio("assets/audio/ambience.mp3"),
    "doorsound": new Audio("assets/audio/doorsound.mp3"),
    "alarm": new Audio("assets/audio/alarm.mp3"),
    "animatronicdoor": new Audio("assets/audio/animatronicinthedoor.mp3"),
    "flashlight": new Audio("assets/audio/flashlightbutton.mp3"),
    "windowlight": new Audio("assets/audio/windowlight.mp3"),
}
sounds.ambience.volume = 0.2;
sounds.ambience.loop = true;
sounds.doorsound.volume = 1;
sounds.alarm.volume = 1;
sounds.alarm.loop = true;
sounds.animatronicdoor.volume = 1;
sounds.flashlight.volume = 1;
sounds.windowlight.volume = 1;
sounds.windowlight.loop = true;





// DOOR SYSTEM
door.doorButton.addEventListener("click", event => {

    if (door.canInteract && !door.interacting) {
        
        // ANIMAÇÃO
        door.interacting = true;
        freeMove = false;
        camera.style.transition = "0.5s";
        x = 575;
        y = 140;
        z = -920;
        rotate = 110;
        setTimeout(() => {
            hand.style.bottom = "0px";
            hand.classList = "pointing";
            flashlight.style.bottom = "-150px";
            document.addEventListener("keydown", exitDoorButton);
            flashlight.addEventListener("click", doorFlashlight);
            hand.addEventListener("click", closeDoor);
        }, 600);


        // Evento de sair da porta
        let exitDoorButton = function (event) {
            if (event.code == "KeyS") {
                x = 595;
                y = 150;
                z = -910;
                rotate = 90;
                hand.style.bottom = "-600px";
                hand.classList = "";
                flashlight.style.bottom = "-600px";
                setTimeout(() => {
                    door.interacting = false;
                    freeMove = true;
                    camera.style.transition = "0s";
                    document.removeEventListener("keydown", exitDoorButton);
                    flashlight.removeEventListener("click", doorFlashlight);
                    hand.removeEventListener("click", closeDoor);
                }, 700);
            }
        };


        // Evento de ligar a lanterna
        let doorFlashlight = function (event) {
            if (!door.flashlightCooldown) {

                //lanterna
                door.flashlightCooldown = true;
                door.flashlightIsON = true;
                flashlight.style.animation = "flashlight-click 0.3s";
                sounds.flashlight.play();
                //bloquear eventos
                document.removeEventListener("keydown", exitDoorButton);
                hand.removeEventListener("click", closeDoor);

                //luz
                door.shadow.style.opacity = 0.3;
                corridors.wall2.classList.remove("shadowed");
                corridors.wall3.classList.remove("shadowed");
                setTimeout(() => {
                    door.flashlightIsON = false;
                    door.shadow.style.opacity = 0.95;
                    corridors.wall2.classList.add("shadowed");
                    corridors.wall3.classList.add("shadowed");
                }, 150);

                //ativar eventos e resetar animação depois da animação acabar
                setTimeout(() => {
                    flashlight.style.animation = "";
                    document.addEventListener("keydown", exitDoorButton);
                    hand.addEventListener("click", closeDoor);
                }, 300);

                //cooldown
                setTimeout(() => {
                    door.flashlightCooldown = false;
                }, 3000);
            }
        };


        // Evento de fechar a porta
        let closeDoor = function (event) {
            if (door.isOpen && !door.inCooldown) {
                //porta
                door.isOpen = false;
                door.inCooldown = true;
                door.element.classList = "closed";
                door.doorButton.classList = "on";
                sounds.doorsound.play();

                //animação mao
                hand.classList = "punching";
                hand.style.animation = "punch-button 0.8s";

                //bloquear eventos
                document.removeEventListener("keydown", exitDoorButton);
                flashlight.removeEventListener("click", doorFlashlight);

                //ativar evento de sair depois da animação da mao
                setTimeout(() => {
                    hand.classList = "pointing";
                }, 600)
                setTimeout(() => {
                    hand.style.animation = "";
                    document.addEventListener("keydown", exitDoorButton);
                }, 1000)
                
                //abrir a porta dps de 5 segundos
                setTimeout(() => {
                    door.isOpen = true;
                    door.element.classList = "open";
                    door.doorButton.classList = "off";
                    sounds.doorsound.play();
                    if (door.interacting) {
                        flashlight.addEventListener("click", doorFlashlight);
                    }
                }, 5000);

                //cooldown porta
                setTimeout(() => {
                    door.inCooldown = false
                }, 8000)
            }
        };

    }
})





// DUCT SYSTEM
duct.element.addEventListener("click", event => {

    if (duct.canInteract && !duct.interacting) {

        // ANIMAÇÃO
        duct.interacting = true;
        freeMove = false;
        camera.style.transition = "0.5s";
        x = 825;
        y = 80;
        z = -775;
        rotate = 290;
        lean = 20;
        setTimeout(() => {
            flashlight.style.bottom = "-150px";
            document.addEventListener("keydown", exitDuct);
            flashlight.addEventListener("click", ductFlashlight);
        }, 600);


        // Evento de sair do duto
        let exitDuct = function (event) {
            if (event.code == "KeyS") {
                x = 750;
                y = 150;
                z = -700;
                rotate = 270;
                lean = 0;
                flashlight.style.bottom = "-600px";
                setTimeout(() => {
                    duct.interacting = false;
                    freeMove = true;
                    camera.style.transition = "0s";
                    document.removeEventListener("keydown", exitDuct);
                    flashlight.removeEventListener("click", ductFlashlight);
                }, 700);
            }
        };


        // Evento de ligar a lanterna
        let ductFlashlight = function (event) {
            if (!duct.flashlightCooldown) {

                //lanterna
                duct.flashlightCooldown = true;
                duct.flashlightIsON = true;
                flashlight.style.animation = "flashlight-click 0.3s";
                sounds.flashlight.play();
                //bloquear eventos
                document.removeEventListener("keydown", exitDuct);

                //luz
                duct.shadows.forEach((element, index) => {
                    if (index < 4) {
                        element.style.opacity = 0;
                    } else {
                        element.style.opacity = 0.25
                    }
                })
                setTimeout(() => {
                    duct.flashlightIsON = false;
                    duct.shadows.forEach((element) => {
                        element.style.opacity = 0.6;
                    })
                }, 150);

                //ativar eventos e resetar animação depois da animação acabar
                setTimeout(() => {
                    flashlight.style.animation = "";
                    document.addEventListener("keydown", exitDuct);
                }, 300);

                //cooldown
                setTimeout(() => {
                    duct.flashlightCooldown = false;
                }, 3000);
            }
        };

    }
})





// WINDOW SYSTEM
frontWindow.windowButton.addEventListener("click", event => {

    if (frontWindow.canInteract) {

        // ANIMAÇÃO
        frontWindow.interacting = true;
        freeMove = false;
        camera.style.transition = "0.5s";
        x = 875;
        z = -625;
        rotate = 370;
        setTimeout(() => {
            hand.style.bottom = "0px";
            hand.classList = "pointing";
            document.addEventListener("keydown", exitWindow);
            hand.addEventListener("click", windowLights);
        }, 600);


        // Evento de sair do duto
        let exitWindow = function (event) {
            if (event.code == "KeyS") {
                x = 860;
                z = -675;
                rotate = 380;
                hand.style.bottom = "-600px";
                hand.classList = "";
                setTimeout(() => {
                    frontWindow.interacting = false;
                    freeMove = true;
                    camera.style.transition = "0s";
                    document.removeEventListener("keydown", exitWindow);
                    hand.removeEventListener("click", windowLights);
                    rotate = 20;
                }, 700);
            }
        };


        // Evento de ligar as luzes
        let windowLights = function (event) {
            if (!frontWindow.lightsCooldown && !frontWindow.lightsIsON) {

                //janela
                frontWindow.lightsCooldown = true;
                frontWindow.lightsIsON = true;
                sounds.windowlight.play();

                //animação luz piscando
                let loop = function() {
                    setTimeout(() => {
                        if (Math.floor(Math.random() * 4 + 1) == 4) {
                            frontWindow.shadow.style.opacity = 0.95;
                            corridors.wall1.classList.remove("shadowed");
                            corridors.wall2.classList.remove("shadowed");
                        } else {
                            frontWindow.shadow.style.opacity = 0.2;
                            corridors.wall1.classList.add("shadowed");
                            corridors.wall2.classList.add("shadowed");
                        }
                        if (frontWindow.lightsIsON) {
                            loop();
                        } else {
                            frontWindow.shadow.style.opacity = 0.95;
                            corridors.wall1.classList.add("shadowed");
                            corridors.wall2.classList.add("shadowed");
                        }
                    }, 25);
                }
                loop();
                setTimeout(() => {
                    frontWindow.lightsIsON = false;
                    frontWindow.shadow.style.opacity = 0.95;
                    corridors.wall1.classList.add("shadowed");
                    corridors.wall2.classList.add("shadowed");
                    sounds.windowlight.pause();
                }, 5000);

                //animação mao
                hand.classList = "punching";
                hand.style.animation = "punch-button 0.8s";

                //bloquear eventos
                document.removeEventListener("keydown", exitWindow);

                //ativar evento de sair depois da animação da mao
                setTimeout(() => {
                    hand.classList = "pointing";
                }, 600);
                setTimeout(() => {
                    hand.style.animation = "";
                    document.addEventListener("keydown", exitWindow);
                }, 1000);

                //cooldown
                setTimeout(() => {
                    frontWindow.lightsCooldown = false;
                }, 10000);
            }
        };

    }
})





sounds.ambience.play();