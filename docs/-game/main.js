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
y bb y
yb  by 
llyyll
 lyyl
`,
  `
  bb
yb  by 
llyyll
 lyyl
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
/** @typedef {{pos: Vector, vel: Vector}} Shot */
/** @type {Shot[]} */
let shots;
let powerTicks;
let animTicks;
let nextEnemyTicks;
let scrOfs;
let spin = 0;
let angle;
let stars;
let height;
let width;
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
    shots = [];
    scrOfs = 0;
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
  let pc = player.pos;
  //console.log("Player x: " + player.vx + "\nPlayer y: " + player.vy);
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

  //console.log("angle: " + player.angle);
  if (input.isJustReleased) {
    play("select");
    // ignoring start of game input
    if (player.angle == 180) {
      player.angle += 360;
      spin = 0;
      // setting up subsequent rotations
    } else {
      player.angle += 90;
      if (spin != 4) {
        spin += 1;
      } else {
        spin = 1;
      }
    }
    player.fireTicks = 9 / sqrt(difficulty);
  }

  animTicks += difficulty;
  color("black");
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

  color("black");
  particle(100, 30, 1);
  particle(5, 30, 1);
  particle(5, 50, 1);
  particle(100, 50, 1);
  particle(5, 90, 1);
  particle(50, 100, 1);
  particle(80, 20, 1);
  particle(10, 50, 1);
  particle(50, 10, 1);

  color("red");
  rect(55, 25, 45, 1);
  rect(55, 34, 45, 1);
  rect(45, 1, 1, 45);
  rect(55, 34, 1, 12.5);
  rect(55, 16, 85, 1);
  rect(55, 1, 1, 15);
  rect(55, 45, 50, 1);
  rect(55, 54, 50, 1);
  rect(55, 54, 1, 60);
  rect(45, 54, 1, 60);
  rect(10, 54, 1, 60);
  rect(10, 54, 35, 1);
  rect(10, 1, 1, 45);
  rect(10, 45, 35, 1);

  shots.forEach((s) => {
    s.pos.add(s.vel);
    s.pos.x -= scr;
    color("cyan");
    bar(s.pos, 2, 2, s.vel.angle);
  });

  const ai = floor(animTicks / 7) % 4;
  color("black");
  char(addWithCharCode("a", ai === 3 ? 1 : ai), player.x, player.y, {
    // @ts-ignore
    rotation: spin,
  });

  //console.log("enemy x: " + enemy.x);
  console.log("enemy y: " + enemy.y);

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

  //color("red");
  const c = char(
    enemy.eyeVx !== 0 ? "h" : addWithCharCode("d", floor(animTicks / 7) % 2),
    enemy.x,
    enemy.y

    //{
    // @ts-ignore
    //mirror: { x: evx },
    //}
  );
  const enemyIsCollidingWithMainChar = c.isColliding.char.a;
  if (enemyIsCollidingWithMainChar) {
    play("explosion");
    end();
  }

  const enemyIsCollidingWithShot = c.isColliding.rect.cyan;
  if (enemyIsCollidingWithShot) {
    play("synth");
    let decider = floor(rnd(0, 8));
    if (decider == 0) {
      height = 5;
      width = 30;
      color("yellow");
      particle(5, 30, 10);
    } else if (decider == 1) {
      height = 100;
      width = 30;
      color("yellow");
      particle(100, 30, 10);
    } else if (decider == 2) {
      height = 5;
      width = 50;
      color("yellow");
      particle(5, 50, 10);
    } else if (decider == 3) {
      height = 100;
      width = 50;
      color("yellow");
      particle(100, 50, 10);
    } else if (decider == 4) {
      height = 5;
      width = 90;
      color("yellow");
      particle(5, 90, 10);
    } else if (decider == 5) {
      height = 50;
      width = 100;
      color("yellow");
      particle(50, 100, 10);
    } else if (decider == 6) {
      height = 80;
      width = 20;
      color("yellow");
      particle(80, 20, 10);
    } else if (decider == 7) {
      height = 10;
      width = 50;
      color("yellow");
      particle(10, 50, 10);
    } else {
      height = 50;
      width = 10;
      color("yellow");
      particle(50, 10, 10);
    }
    enemy = { x: height, eyeVx: 0, y: width, eyeVy: 0, mn: 0 };
    addScore(1);
  }

  remove(shots, (s) => {
    color("cyan");
    const shot = bar(s.pos, 2, 2, s.vel.angle);
    const shotIsCollidingWithEnemy =
      shot.isColliding.char.h || shot.isColliding.char.d;
    return shotIsCollidingWithEnemy || !s.pos.isInRect(-3, -3, 106, 106);
  });

  powerTicks -= difficulty;
}
