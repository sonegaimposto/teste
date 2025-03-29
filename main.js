// DECLARAR VARIAVEIS
const camera = document.getElementById("camera");
var rotate = 0;
var x = 250;
var y = 150;
var z = -500;
const acceptedkeys = ["KeyW", "KeyA", "KeyS", "KeyD"];
var keys = [];
var mouseX = 0;
var mouseY = 0;
var speed = 1.5;





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





const playerCode = setInterval(() => {
    if (mouseX > 130 || mouseX < -130) {
        rotate -= mouseX/400;
        rotate = rotate > 360 ? 0 : rotate;
        rotate = rotate < 0 ? 360 : rotate;
    }

    let moving = false;
    let radians = rotate * (Math.PI / 180);

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

    if (x > 15 || x < 22) {
        console.log("fora da sala")
    }

    camera.style.transform = `perspective(1000px) translateY(${y}px) translateZ(1000px) rotateX(90deg) rotateZ(${rotate}deg) translate(${-(x)}px, ${z}px)`;

    if (moving) {
        camera.style.animation = "moving-animation 0.7s infinite"
    } else {
        camera.style.animation = ""
    }
}, 10);