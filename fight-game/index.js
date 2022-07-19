const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// Taille du canvas
canvas.width = 1024;
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

//BACKGROUND
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

//SHOP
const shop = new Sprite({
  position: {
    x: 600,
    y: 130,
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
});
// Class to set properties of our heroes, the height, the color, gravity etc...

//Premier héro => Player
const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
});

// Deuxième héro => Enemy
const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
});

const keys = {
  q: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  z: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

// Fonction pour détécter les collisions => un peu complexe mais en gros ça vérifie si l'épée est en train de toucher l'autre joueur

decreaseTimer();

//Fonction pour animer le canva => Rejoue la fonction a chaque frame => remplis le canvas de noir pour supprimer l'image précédente des héros, on joue la méthode update pour bouger l'emplacement des personnages
function animate() {
  // ANIMATION
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player.update();
  enemy.update();

  // Player mouvement
  player.velocity.x = 0;
  if (keys.q.pressed && player.lastKey === "q") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
  }

  // Enemy Mouvement
  enemy.velocity.x = 0;
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  }

  // DETECT COLISIONS
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  // END GAME BASED ON HEALTH
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}
animate();

// QUAND ON APPUIE SUR LA TOUCHE
window.addEventListener("keydown", (event) => {
  // PLAYER
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "q":
      keys.q.pressed = true;
      player.lastKey = "q";
      break;
    case "z":
      player.velocity.y = -15;
      break;
    case " ":
      player.attack();
      break;
    // ENEMY
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -15;
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
});

// QUAND ON RELACHE LA TOUCHE
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "q":
      keys.q.pressed = false;
      break;
    case "z":
      keys.z.pressed = false;
      break;
  }
  // Enemy
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
  }
});
