// DECLARAR VARIAVEIS
const camera = document.getElementById("camera");
const hand = document.getElementById("hand");
const flashlight = document.getElementById("flashlight");
var rotate = 0;
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
    camera.style.transform = `perspective(1000px) translateY(${y}px) translateZ(1000px) rotateX(90deg) rotateZ(${rotate}deg) translate(${-(x)}px, ${z}px)`;

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
    
}, 10);
camera.style.transform = `perspective(1000px) translateY(${y}px) translateZ(1000px) rotateX(90deg) rotateZ(${rotate}deg) translate(${-(x)}px, ${z}px)`;










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

    if (door.canInteract && door.interacting == false) {
        
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
                }, 100);


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
                hand.style.animation = "punch-button 1s";

                //bloquear eventos
                document.removeEventListener("keydown", exitDoorButton);
                flashlight.removeEventListener("click", doorFlashlight);

                //ativar evento de sair depois da animação da mao
                setTimeout(() => {
                    hand.classList = "pointing";
                    hand.style.animation = "";
                    document.addEventListener("keydown", exitDoorButton);
                }, 1000)
                
                //abrir a porta dps de 5 segundos
                setTimeout(() => {
                    door.isOpen = true;
                    door.element.classList = "open";
                    door.doorButton.classList = "off";
                    sounds.doorsound.play();
                    flashlight.addEventListener("click", doorFlashlight);
                }, 5000);

                //cooldown porta
                setTimeout(() => {
                    door.inCooldown = false
                }, 8000)
            }
        };

    }
})





sounds.ambience.play();