// DECLARAR VARIAVEIS
const camera = document.getElementById("camera");
const hand = document.getElementById("hand");
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
    "element": document.getElementsByClassName("door"),
    "doorButton": document.getElementById("doorbutton"),
    "canInteract": false,
    "interacting": false,
    "isOpen": true
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
        // ROTATE
        if (mouseX > 130 || mouseX < -130) {
            rotate -= mouseX/400;
            rotate = rotate > 360 ? 0 : rotate;
            rotate = rotate < 0 ? 360 : rotate;
        }

        
        let radians = rotate * (Math.PI / 180);

        // MOVE
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

    // MOVING ANIMATION
    if (moving && freeMove) {
        camera.style.animation = "moving-animation 0.7s infinite"
    } else {
        camera.style.animation = ""
    }

    // ROOM COLISION 
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
    // DOOR 
    if (x > 500 && x < 625 && z > -1000 && z < -800) {
        door.canInteract = true;
    } else {
        door.canInteract = false;
    }
    
}, 15);
camera.style.transform = `perspective(1000px) translateY(${y}px) translateZ(1000px) rotateX(90deg) rotateZ(${rotate}deg) translate(${-(x)}px, ${z}px)`;










// AUDIOS
const ambience = new Audio("assets/audio/ambience.mp3");
ambience.volume = 0.2;





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
        }, 600);

        // SAIR
        let exitDoorButton = function (event) {
            if (event.code == "KeyS") {
                x = 595;
                y = 150;
                z = -910;
                rotate = 90;
                hand.style.bottom = "-500px";
                hand.classList = "";
                setInterval(() => {
                    door.interacting = false;
                    freeMove = true;
                    camera.style.transition = "";
                    document.removeEventListener("keydown", exitDoorButton);
                }, 700);
            }
        };
        document.addEventListener("keydown", exitDoorButton);
    }
})