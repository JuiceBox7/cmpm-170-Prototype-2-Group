title = "SHOOTY SHOOTER";

description = `
[Tap] Turn, 
Change angle
`;

characters = [
  `
 lllyl
bbblyl
bbblyl
bbblyl
bbblyl
 lllyl
`,
  `
 lllyl
 bbbyl
 bbbyl
 bbbyl
 bbbyl
 lllyl
`,
  `
 lllyl
  bbbl
  bbbl
  bbbl
  bbbl
 lllyl
`,
  `
l bb l
ll  ll 
llllll
 llll
`,
  `
  bb
ll  ll 
llllll
 llll
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
  viewSize: { x: 100, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  isDrawingParticleFront: true,
  isDrawingScoreFront: true,
  seed: 9,
  //seed: 200,
};

/** @type {{x: number, vx: number, y: number, vy:number, mn:number, mn2:number, isFiringLeft:boolean , pos: Vector, angle: number, va: number, ticks: number, fireTicks: number}} */
let player;
/** @type {{x: number, eyeVx: number, y: number, eyeVy: number, mn: number}} */
let enemy;
/** @type {{x: number, isPower: boolean}[]} */
let dots;
/** @typedef {{pos: Vector, vel: Vector}} Shot */
/** @type {Shot[]} */
let shots;
let powerTicks;
let animTicks;
let multiplier;
let nextEnemyTicks;
let scrOfs;
let spin = 0;
let angle;
let stars;
const playerX = 20;

function update() {
  if (!ticks) {
    player = {
      x: 50,
      vx: 1,
      y: 50,
      vy: 1,
      mn: 0,
      mn2: 0,
      isFiringLeft: true,
      pos: vec(50, 50),
      angle: 180,
      va: 1,
      ticks: 0,
      fireTicks: 0,
    };
    enemy = { x: 100, eyeVx: 0, y: 30, eyeVy: 0, mn: 0 };
    multiplier = 0;
    shots = [];
    scrOfs = 0;
    addDots();
    powerTicks = animTicks = 0;
    angle = 0;
    stars = times(50, (_) => ({ dist: rnd(10, 70), angle: rnd(PI * 2) }));
  }

  color("light_black");
  const sp = vec();
  stars.forEach((s) => {
    sp.set(50, 50).addWithAngle(s.angle - angle, s.dist);
    box(sp, 1);
  });

  let scr = 0;
  const pa = (floor(player.angle) * PI) / 4;
  let pc = vec(player.pos);
  console.log("Player x: " + player.vx + "\nPlayer y: " + player.vy);
  player.fireTicks--;
  if (player.fireTicks < 0) {
    play("hit");
    times(1, (i) => {
      shots.push({
        pos: vec(pc),
        vel: vec(3 * sqrt(difficulty)).rotate(pa + i),
      });
    });
    player.fireTicks = 9 / sqrt(difficulty);
  }

  console.log("angle: " + player.angle);
  if (input.isJustReleased) {
    play("select");
    // ignoring start of game input
    if (player.angle == 180) {
      player.angle += 360;
      spin = 0;
      // setting up subsequent rotations
    } else {
      player.angle += 90;
      if(spin != 4){
        spin += 1;
      } else {
        spin = 1;
      }
    }
    player.fireTicks = 9 / sqrt(difficulty);
  }

  animTicks += difficulty;
  color("black");
  text(`x${multiplier}`, 3, 9);
  if (input.isJustPressed) {
    player.angle = floor(player.angle);
    player.mn += 1;
    const offset = player.isFiringLeft ? -5 : 5;
    if (player.mn % 4 == 0) {
      player.vx = 1;
      player.vy = 1;
      player.mn2 = 1;
    } else if (player.mn % 4 == 1) {
      player.vx = -1;
      player.vy = 1;
      player.mn2 = 0;
    } else if (player.mn % 4 == 2) {
      player.vx = -1;
      player.vy = -1;
      player.mn2 = 1;
    } else if (player.mn % 4 == 3) {
      player.vx = 1;
      player.vy = -1;
      player.mn2 = 0;
    }
  }

  scrOfs += scr;
  if (scrOfs > multiplier * 100) {
    play("coin");
    multiplier++;
  }

  if (player.mn2 == 0) {
    //player.x += player.vx * 0.5 * difficulty;
  } else if (player.mn2 == 1) {
    //player.y += player.vy * 0.5 * difficulty;
  }
  // wrapping around
  if (player.x < -3) {
   // player.x = 103;
  } else if (player.x > 103) {
    //player.x = -3;
  }
  if (player.y < -3) {
    //player.y = 55;
  } else if (player.y > 55) {
    //player.y = -3;
  }
  //color("blue");
  rect(0, 23, 100, 1);
  rect(0, 25, 100, 1);
  rect(0, 34, 100, 1);
  rect(0, 36, 100, 1);
  //color("yellow");

  // shots.forEach((b) => {
  //   b.pos.x = player.x;
  //   b.pos.y = player.y;
  //   //color("yellow");
  //   box(b.pos, 2);
  // });
  shots.forEach((s) => {
    s.pos.add(s.vel);
    s.pos.x -= scr;
    color("cyan");
    bar(s.pos, 3, 3, s.vel.angle);
  });
  //const fireInterval = ceil(300 / sqrt(difficulty));
  //const fireRepeatInterval = ceil(36 / sqrt(difficulty));

  const ai = floor(animTicks / 7) % 4;
  color("black");
  char(addWithCharCode("a", ai === 3 ? 1 : ai), player.x, player.y, {
    // @ts-ignore
    rotation: spin
  });

  /*char(addWithCharCode("a", c.color), cp, {
      rotation: c.angle + (c.phase < 1 ? 2 : 0),
    });*/
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
  if (player.x - enemy.x <= player.y - enemy.y) {
    if (enemy.x > player.x + 1) {
      enemy.x -= 0.6;
      enemy.mn = 1;
    } else if (enemy.x < player.x - 1) {
      enemy.x += 0.6;
      enemy.mn = 1;
    } else {
      if (enemy.y > player.y) {
        enemy.y -= 0.6;
        enemy.mn = 0;
      } else if (enemy.y < player.y) {
        enemy.y += 0.6;
        enemy.mn = 0;
      }
    }
  } else {
    if (enemy.y > player.y + 1) {
      enemy.y -= 0.6;
      enemy.mn = 0;
    } else if (enemy.y < player.y - 1) {
      enemy.y += 0.6;
      enemy.mn = 0;
    } else if (enemy.x > player.x) {
      enemy.x -= 0.6;
      enemy.mn = 1;
    } else if (enemy.x < player.x) {
      enemy.x += 0.6;
      enemy.mn = 1;
    }
  }

  const evx = -1;
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

  //color("red");
  const c = char(
    enemy.eyeVx !== 0 ? "h" : addWithCharCode("d", floor(animTicks / 7) % 2),
    enemy.x,
    enemy.y

    //{
    // @ts-ignore
    //mirror: { x: evx },
    //}
  )
  const enemyIsCollidingWithMainChar = c.isColliding.char.a;
  if (enemyIsCollidingWithMainChar) {
    play("explosion");
    end();
  }

  const enemyIsCollidingWithShot = c.isColliding.rect.cyan
  if (enemyIsCollidingWithShot) {
    play("synth");
    enemy = { x: 100, eyeVx: 0, y: 30, eyeVy: 0, mn: 0 };
  }

  remove(shots, (s) => {
    color("cyan");
    const shot = bar(s.pos, 3, 3, s.vel.angle)
    const shotIsCollidingWithEnemy = shot.isColliding.char.h || shot.isColliding.char.d;
    return shotIsCollidingWithEnemy || !s.pos.isInRect(-3, -3, 106, 106);
  });

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
