// DECLARAR VARIAVEIS
const camera = document.getElementById("camera");
var rotate = 0;
var x = 700;
var y = 150;
var z = -1000;
const acceptedkeys = ["KeyW", "KeyA", "KeyS", "KeyD"];
var keys = [];
var mouseX = 0;
var mouseY = 0;
var speed = 1.5;
var playerPosition = "room"
const door = document.getElementsByClassName("door");
var canInteractDoor = false;





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
    // ROTATE
    let rotating = false;
    if (mouseX > 130 || mouseX < -130) {
        rotate -= mouseX/400;
        rotate = rotate > 360 ? 0 : rotate;
        rotate = rotate < 0 ? 360 : rotate;
        rotating = true;
    }

    let moving = false;
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

    // UPDATE CAMERA
    if (moving || rotating) {
        camera.style.transform = `perspective(1000px) translateY(${y}px) translateZ(1000px) rotateX(90deg) rotateZ(${rotate}deg) translate(${-(x)}px, ${z}px)`;
    }
    // MOVING ANIMATION
    if (moving) {
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
    if (x > 500 && x < 625 && z > -1000 && z < -825) {
        console.log("caninteractdoor")
    }
    
}, 14);
camera.style.transform = `perspective(1000px) translateY(${y}px) translateZ(1000px) rotateX(90deg) rotateZ(${rotate}deg) translate(${-(x)}px, ${z}px)`;










// AUDIOS
const ambience = new Audio("assets/audio/ambience.mp3");
ambience.volume = 0.2;