title = "PAKU PAKU";

description = `
[Tap] Turn
`;

characters = [
  `
  llll
 lll
lll
lll
 lll
  llll
`,
  `
  lll
 lllll
lll
lll
 lllll
  lll
`,
  `
  ll
 llll
llllll
llllll
 llll
  ll
`,
  `
  lllll
  l l l
 lllllll
lllllllll
`,
  `
  lll
 l l l
 llll
 llll
 llll
 l l
`,
  `
ll
ll
`,
  `
 ll
llll
llll
 ll
`,
  `
  l l



`,
];

options = {
  theme: "dark",
  viewSize: { x: 100, y: 50 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 9,
};

/** @type {{x: number, vx: number, y: number, vy:number, mn:number, mn2:number}} */
let player;
/** @type {{x: number, eyeVx: number, y: number, eyeVy: number, mn: number}} */
let enemy;
/** @type {{x: number, isPower: boolean}[]} */
let dots;
let powerTicks;
let animTicks;
let multiplier;

function update() {
  if (!ticks) {
    player = { x: 40, vx: 1, y:30, vy:1, mn:0, mn2:0};
    enemy = { x: 100, eyeVx: 0, y:30, eyeVy: 0, mn:0};
    multiplier = 0;
    addDots();
    powerTicks = animTicks = 0;
  }
  animTicks += difficulty;
  color("black");
  text(`x${multiplier}`, 3, 9);
  if (input.isJustPressed) {
    player.mn+=1
    if(player.mn%4==0){
        player.vx =1;
        player.vy =1;
        player.mn2=1
    }else if(player.mn%4==1){
        player.vx=-1
        player.vy=1
        player.mn2=0
    }else if(player.mn%4==2){
        player.vx=-1
        player.vy=-1
        player.mn2=1
    }else if(player.mn%4==3){
        player.vx=1
        player.vy=-1
        player.mn2=0
    }
  }
  if(player.mn2==0){
    player.x += player.vx * 0.5 * difficulty;
  }
  else if(player.mn2==1){
  player.y += player.vy * 0.5 * difficulty;
  }
  if (player.x < -3) {
    player.x = 103;
  } else if (player.x > 103) {
    player.x = -3;
  }
  if (player.y < -3) {
    player.y = 55;
  } else if (player.y > 55) {
    player.y = -3;
  }
  color("blue");
  rect(0, 23, 100, 1);
  rect(0, 25, 100, 1);
  rect(0, 34, 100, 1);
  rect(0, 36, 100, 1);
  color("green");
  const ai = floor(animTicks / 7) % 4;
  char(addWithCharCode("a", ai === 3 ? 1 : ai), player.x, player.y, {
    // @ts-ignore
    mirror: { x: player.vx },
  });
  remove(dots, (d) => {
    color(
      d.isPower && floor(animTicks / 7) % 2 === 0 ? "transparent" : "yellow"
    );
    const c = char(d.isPower ? "g" : "f", d.x, 30).isColliding.char;
    if (c.a || c.b || c.c) {
      if (d.isPower) {
        play("jump");
        if (enemy.eyeVx === 0) {
          powerTicks = 120;
        }
      } else {
        play("hit");
      }
      addScore(multiplier);
      return true;
    }
  });
      if((player.x - enemy.x) <= (player.y-enemy.y)){
      if(enemy.x>player.x+1){
      enemy.x-=.6
      enemy.mn=1
      }else if(enemy.x<player.x-1){
          enemy.x+=.6
          enemy.mn=1
      }else{
        if(enemy.y>player.y){
          enemy.y-=.6
          enemy.mn=0
      }else if(enemy.y<player.y){
          enemy.y+=.6
          enemy.mn=0
      }
      } 
    }else{
      if(enemy.y>player.y+1){
        enemy.y-=.6
        enemy.mn=0
    }else if(enemy.y<player.y-1){
        enemy.y+=.6
        enemy.mn=0
    }else if(enemy.x>player.x){
      enemy.x-=.6
      enemy.mn=1
      }else if(enemy.x<player.x){
          enemy.x+=.6
          enemy.mn=1
    }
  }
    

  const evx=-1
  /*const evx =
    enemy.eyeVx !== 0
      ? enemy.eyeVx
      : (player.x > enemy.x ? 1 : -1) * (powerTicks > 0 ? -1 : 1);
  enemy.x = clamp(
    enemy.x +
      evx *
        (powerTicks > 0 ? 0.25 : enemy.eyeVx !== 0 ? 0.75 : 0.55) *
        difficulty,
    0,
    100
  );*/

  color(
      "red"
  );
  const c = char(
    enemy.eyeVx !== 0 ? "h" : addWithCharCode("d", floor(animTicks / 7) % 2),
    enemy.x,
    enemy.y
    
    //{
      // @ts-ignore
      //mirror: { x: evx },
    //}
  ).isColliding.char;
    if(c.a){
        play("explosion")
        end()
    }
  powerTicks -= difficulty;
  if (dots.length === 0) {
    play("coin");
    addDots();
  }
}

function addDots() {
  let pi = player.x > 50 ? rndi(1, 6) : rndi(10, 15);
  dots = times(16, (i) => ({ x: i * 6 + 5, isPower: i === pi }));
  multiplier++;
}
