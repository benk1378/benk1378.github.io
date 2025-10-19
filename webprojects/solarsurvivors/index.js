class Game {
    constructor() {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");

        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
        this.canvas.style.position = "absolute";
        this.canvas.style.background = "#000000";
        this.canvas.style.width = "50%";
        this.canvas.style.height = "100%";
        this.canvas.style.top = "0%";
        this.canvas.style.left = "25%";
        
        document.body.appendChild(this.canvas);

        this.stars = new Array(250).fill(null);
        for(let i = 0; i < this.stars.length; i++) {
            this.stars[i] = new Star();
        }

        this.entities = new Array(100).fill(null);
        this.entityCount = 0;

        this.projectiles = new Array(100).fill(null);
        this.projectileCount = 0;

        this.particles = new Array(100).fill(null);
        this.particleCount = 0;
    }

    addEntity(toAdd) {
        if(this.entityCount < this.entities.length - 1) {
            this.entities[this.entityCount] = toAdd;
            this.entityCount += 1;
        }
    }
    removeEntity(num) {
        if (num >= 0 && num < this.entities.length) {
            this.entities[num] = null;
            for (let i = num; i < this.entityCount; i++) {
                this.entities[i] = this.entities[i+1];
            }
            this.entityCount -= 1;
        }
    }
    addParticle(toAdd) {
        if (this.particleCount < this.particles.length - 1) {
            this.particles[this.particleCount] = toAdd;
            this.particleCount += 1;
        }
    }
    removeParticle(num) {
        if (num >= 0 && num < this.particles.length) {
            this.particles[num] = null;
            for (let i = num; i < this.particles.length - 1; i++) {
                if (this.particles[i + 1] != null) {
                    this.particles[i] = this.particles[i + 1];
                }
                else {
                    break;
                }
            }
            this.particleCount -= 1;
        }
    }
    addProjectile(toAdd) {
        if (this.projectileCount < this.projectiles.length - 1) {
            this.projectiles[this.projectileCount] = toAdd;
            this.projectileCount += 1;
        }
    }
    removeProjectile(num) {
        if (num >= 0 && num < this.projectiles.length) {
            this.projectiles[num] = null;
            for (let i = num; i < this.projectileCount; i++) {
                this.projectiles[i] = this.projectiles[i + 1];
            }
            this.projectileCount -= 1;
        }
    }

    update() {
        for (let i = 0; i < this.stars.length; i++) {
            this.stars[i].update();
        }

        for (let i = 0; i < this.entityCount; i++) {
            this.entities[i].update();
            if (this.entities[i].dead) {
                this.removeEntity(i);
                i -= 1;
            }
        }

        for (let i = 0; i < this.projectileCount; i++) {
            this.projectiles[i].update(this.entities, this.entityCount);
            if (this.projectiles[i].dead) {
                this.removeProjectile(i);
                i -= 1;
            }
        }

        for (let i = 0; i < this.particleCount; i++) {
            this.particles[i].update();
            if (this.particles[i].dead) {
                this.removeParticle(i);
            }
        }
    }

    render() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for(let i = 0; i < this.stars.length; i++) {
            this.stars[i].render(this.context);
        }

        for(let i = 0; i < this.entityCount; i++) {
            this.entities[i].render(this.context);
        }

        for (let i = 0; i < this.projectileCount; i++) {
            this.projectiles[i].render(this.context);
        }

        for (let i = 0; i < this.particleCount; i++) {
            this.particles[i].render(this.context);
        }
    }
}

class Entity {
    constructor(pos, width, height, color) {
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.color = color;

        this.dead = false;
    }

    update() {

    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos[0] + this.width / 2, this.pos[1] + this.height / 2, this.width / 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class Star extends Entity {
    constructor() {
        let radius = Math.floor(Math.random() * 2) + 1;
        radius *= WIDTH/512;
        let alpha = Math.random() / 1.5;
        super([Math.floor(Math.random() * WIDTH), Math.floor(Math.random() * HEIGHT)], radius, radius, "rgba(255, 255, 255, " + alpha + ")");
    }

    update() {
        let random = Math.floor(Math.random() * 10);
        if(random === 0) {
            random = Math.floor(Math.random() * 2);
            if(random === 0) random = -1;
            //random /= 2048.0;
            this.pos[Math.floor(Math.random() * 2)] += random;
        }
    }
}

class Sun extends Entity {
    constructor(data) {
        let radius = WIDTH/32;
        super([(WIDTH / 2) - radius, (HEIGHT / 2) - radius], radius * 2, radius * 2, "#ff7700");
        
        this.data = data;

        this.maxPlanets = 100;
        this.planets = new Array(this.maxPlanets).fill(null);
        this.planetNum = 0;

        this.health = 10;
        this.attackSpeed = data;

        this.delta = 0;

        this.xp = 0;
        this.levelReq = 5;

        this.mousePos = [null, null];
        document.body.addEventListener("mousemove", this.onMouseMove.bind(this));
    }

    onMouseMove(e) {
        this.mousePos = [e.offsetX, e.offsetY];
    }

    addXP(toAdd) {
        this.xp += toAdd;
        if (this.xp >= this.levelReq) {
            levelUp();
            /*if (this.attackSpeed - 100 >= 100) {
                this.attackSpeed -= 100;
            }*/
            
            this.levelReq *= 1.25;
            this.xp = 0;
        }
    }

    act() {
        if (this.mousePos[0] != null) {
            let canvasRect = game.canvas.getBoundingClientRect();
            let adjustedMousePos = [(this.mousePos[0] / canvasRect.width) * WIDTH, (this.mousePos[1] / canvasRect.height) * HEIGHT];

            let radius = WIDTH / 64;

            game.addProjectile(new Projectile([10, adjustedMousePos], [(this.pos[0] + this.width/2) - radius, (this.pos[1] + this.height/2) - radius], radius * 2, radius * 2, "#ff3500"));
        }
    }

    damage(toDamage) {
        this.health -= toDamage;
        if (this.health <= 0) {
            this.dead = true;
        }
    }

    addPlanet(toAdd) {
        if(this.planetNum < this.maxPlanets) {
            this.planets[this.planetNum] = toAdd;
            this.planetNum += 1;
        }
    }

    update() {
        for(let i = 0; i < this.planetNum; i++) {
            let planet = this.planets[i];
            let center = [this.pos[0] + this.width/2, this.pos[1] + this.height/2];

            planet.angle += (Math.PI/30) / Math.pow(4, planet.distance-1);
            if(planet.angle >= 360) planet.angle = 0;
            planet.pos = [center[0] + (Math.cos(planet.angle) * ((WIDTH / 15) * planet.distance)) - (planet.width / 2), center[1] + (Math.sin(planet.angle) * ((HEIGHT / 20) * planet.distance)) - (planet.height / 2)];
        }

        if (this.data != null) {
            this.delta += delta;
            if (this.delta > this.attackSpeed) {
                this.act();
                this.delta = 0;
            }
        }
    }

    render(ctx) {
        let percent = ((this.xp / this.levelReq) * 2) - 0.5;

        ctx.beginPath();
        ctx.arc(this.pos[0] + this.width / 2, this.pos[1] + this.height / 2, this.width / 2, Math.PI * -0.5, Math.PI * percent, false);
        ctx.lineWidth = WIDTH / 64;
        ctx.strokeStyle = "#ff3500";
        ctx.stroke();

        super.render(ctx);

        for(let i = 0; i < this.planetNum; i++) {
            this.planets[i].render(ctx);
        }
    }
}

class Planet extends Entity {
    constructor(data, distance) {
        let radius = WIDTH / 96;
        const PLANET_COLORS = ["#007ce5", "#00e57c", "#ffb900", "#00e5e5"];
        super([radius*-4,radius*-4], radius*2, radius*2, PLANET_COLORS[Math.floor(Math.random() * PLANET_COLORS.length)]);

        this.distance = distance;
        this.angle = 0;
        this.data = data;
    }
}

class Enemy extends Entity {
    constructor(data, width, height, color) {
        let pos = Math.floor(Math.random() * 4);
        let offset = 5;
        switch (pos) {
            case 0:
                pos = [-1 * offset * width, Math.floor(Math.random() * HEIGHT)];
                break;
            case 1:
                pos = [WIDTH + (offset * width), Math.floor(Math.random() * HEIGHT)];
                break;
            case 2:
                pos = [Math.floor(Math.random() * WIDTH), -1 * offset * height];
                break;
            case 3:
                pos = [Math.floor(Math.random() * WIDTH), HEIGHT + (offset * height)];
                break;
            default:
                break;
        }

        super(pos, width, height, color);
        this.health = data;
        this.data = data;

        this.dir = [0, 0];
        this.iframes = 0;
    }

    damage(toDamage) {
        if (this.iframes <= 0) {
            this.health -= toDamage;
            if (this.health <= 0) {
                sun.addXP(1);
                this.dead = true;
            }
            this.iframes = 6;
            game.addParticle(new NumberParticle(toDamage, [this.pos[0], this.pos[1]], "#eeeeee"));
        }
    }

    update() {
        if (this.iframes > 0) {
            this.iframes -= 1;
        }

        let speed = 5;
        let components = [(sun.pos[0] + sun.width / 2) - (this.pos[0] + this.width / 2), (sun.pos[1] + sun.height / 2) - (this.pos[1] + this.height / 2)];
        let magnitude = Math.sqrt(Math.pow(components[0], 2) + Math.pow(components[1], 2));

        this.dir = [(components[0] / magnitude), (components[1] / magnitude)];

        if (sun.dead) {
            this.dir[0] *= -1;
            this.dir[1] *= -1;
            speed *= 2;
        }

        this.pos[0] += this.dir[0] * speed;
        this.pos[1] += this.dir[1] * speed;

        if (!(sun.dead)) {
            if (magnitude < (sun.width / 2) + (this.width / 2)) {
                sun.damage(1);
                this.dead = true;
            }

            for (let i = 0; i < sun.planetNum; i++) {
                let planet = sun.planets[i];
                if (doesCollide([this.pos[0], this.pos[1], this.width, this.height], [planet.pos[0], planet.pos[1], planet.width, planet.height])) {
                    this.damage(planet.data);
                }
            }
        }
        else {
            if (!doesCollide([this.pos[0], this.pos[1], this.width, this.height], [0, 0, WIDTH, HEIGHT])) {
                this.dead = true;
            }
        }
    }

    render(ctx) {
        ctx.beginPath();
        let center = [(this.pos[0] + this.width / 2) - (this.dir[0] * this.width / 2), (this.pos[1] + this.height / 2) - (this.dir[1] * this.height / 2)];
        let offsets = [(this.dir[1] * (this.height / -2)), (this.dir[0] * (this.width / 2))];
        ctx.moveTo(center[0] + offsets[0], center[1] + offsets[1]);
        ctx.lineTo(center[0] - offsets[0], center[1] - offsets[1]);
        ctx.lineTo(center[0] + (this.dir[0] * (this.width * 1.2)), center[1] + (this.dir[1] * (this.height * 1.2)));
        ctx.closePath();

        if (this.iframes > 0) {
            ctx.fillStyle = "#ffffff";
        }
        else {
            ctx.fillStyle = this.color;
        }
        ctx.fill();

        //ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        //ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height);
    }
}

class Projectile extends Entity {
    constructor(data, pos, width, height, color) {
        super(pos, width, height, color);
        this.data = data;

        this.dir = null;
    }

    update(entities, entityCount) {
        if (this.data === null) {
            return;
        }
        if (!doesCollide([this.pos[0], this.pos[1], this.width, this.height], [0, 0, WIDTH, HEIGHT])) {
            this.dead = true;
            return;
        }

        if (this.dir != null) {
            let speed = 20;
            this.pos[0] += speed * this.dir[0];
            this.pos[1] += speed * this.dir[1];
        }
        else {
            let target = this.data[1];

            let components = [target[0] - (this.pos[0] + this.width / 2), target[1] - (this.pos[1] + this.height / 2)];
            let magnitude = Math.sqrt(Math.pow(components[0], 2) + Math.pow(components[1], 2));

            this.dir = [(components[0] / magnitude), (components[1] / magnitude)];
        }
        
        for (let i = 0; i < entityCount; i++) {
            let entity = entities[i];
            if (entity != sun && doesCollide([this.pos[0], this.pos[1], this.width, this.height], [entity.pos[0], entity.pos[1], entity.width, entity.height])) {
                entity.damage(this.data[0]);
                this.dead = true;
                break;
            }
        }

        /*if (magnitude < this.width / 4) {
            this.dead = true;
        }*/
    }
    
    render(ctx) {
        super.render(ctx);
    }
}

class NumberParticle extends Entity {
    constructor(number, pos, color) {
        super(pos, null, null, color);
        this.number = number;
        this.timer = 0;
    }

    update() {
        this.pos[1] -= HEIGHT / 2048;
        this.timer += 1;
        if (this.timer > FPS/2) {
            this.dead = true;
        }
    }

    render(ctx) {
        ctx.font = WIDTH/(32 + this.timer) + "px arial";
        ctx.fillStyle = this.color;
        ctx.fillText(this.number + "", this.pos[0], this.pos[1]);
    }
}

function doesCollide(rect1, rect2) { 
    return !(rect1[0] > rect2[0] + rect2[2] || rect1[1] > rect2[1] + rect2[3] || rect1[0] + rect1[2] < rect2[0] || rect1[1] + rect1[3] < rect2[1]);
}

const WIDTH = 4096;
const HEIGHT = 4096;

let game = new Game();
let sun = new Sun(1000);

sun.dead = true;

function getScreen() {
    let toReturn = document.createElement("div");
    toReturn.style.position = "absolute";
    toReturn.style.width = "50%";
    toReturn.style.height = "100%";
    toReturn.style.top = "0%";
    toReturn.style.left = "25%";
    return toReturn;
}

let mainScreen = getScreen();
/*let mainScreen = document.createElement("div");
mainScreen.style.position = "absolute";
mainScreen.style.width = "50%";
mainScreen.style.height = "100%";
mainScreen.style.top = "0%";
mainScreen.style.left = "25%";*/
//mainScreen.style.background = "rgba(255, 255, 0, 0.1)";

let settingsScreen = getScreen();

let levelUpScreen = getScreen();
levelUpScreen.style.background = "rgba(0, 0, 0, 0.5)";

function getButton(top, left, width, height, label, callback) {
    let toReturn = document.createElement("button");
    toReturn.style.position = "absolute";
    toReturn.style.top = top;
    toReturn.style.left = left;
    toReturn.style.width = width;
    toReturn.style.height = height;
    toReturn.textContent = label;
    toReturn.addEventListener("mouseup", callback);
    return toReturn;
}

let newGameButton = getButton("47.5%", "42%", "16%", "5%", "New Game", function (e) {
    sun = new Sun(1000);
    game.addEntity(sun);
    document.body.removeChild(mainScreen);
    paused = false;
});
let settingsButton = getButton("55.5%", "42%", "16%", "5%", "Settings", function (e) {
    document.body.removeChild(mainScreen);
    document.body.appendChild(settingsScreen);
});
let title = document.createElement("div");
title.style.position = "absolute";
title.style.top = "25%";
title.style.left = "32.5%";
title.style.width = "35%";
title.style.height = "16%";
title.textContent = "Solar Survivors";
title.style.color = "#ffffff";
title.style.font = "48px arial";
title.style.textAlign = "center";
//title.style.background = "#ff0000";

let backButton = getButton("10%", "10%", "16%", "5%", "<- Back", function (e) {
    document.body.removeChild(settingsScreen);
    document.body.appendChild(mainScreen);
});

let tempButtons = new Array(3);
for (let i = 0; i < tempButtons.length; i++) {
    tempButtons[i] = getButton("20%", ((i * 30) + 7.5) + "%", "25%", "60%", "Attack Speed Up", function (e) {
        if (sun.attackSpeed - 100 >= 100) {
            sun.attackSpeed -= 100;
        }

        document.body.removeChild(levelUpScreen);
        paused = false;
    });
}

mainScreen.appendChild(newGameButton);
mainScreen.appendChild(settingsButton);
mainScreen.appendChild(title);

settingsScreen.appendChild(backButton);

for (let i = 0; i < tempButtons.length; i++) {
    levelUpScreen.appendChild(tempButtons[i]);
}

document.body.addEventListener("keydown", function (e) {
    switch (e.key) {
        case " ":
            let planet = new Planet(1, Math.floor(Math.random() * 4) + 1);
            planet.angle = (Math.random() * 10);
            sun.addPlanet(planet);
            break;
        case "p":
            paused = !paused;
            break;
        default:
            break;
    }
});

function levelUp() {
    paused = true;
    document.body.appendChild(levelUpScreen);
}

const FPS = 60;
let delta = 1000 / FPS;

let timeElapsed = 0;

let spawnBonus = 1;

let reset = false;
let paused = true;

function update() {
    if (!paused) {
        timeElapsed += delta;
    }

    if (!paused && Math.floor(timeElapsed % 1000) === 0) {
        let spawnAmount = Math.floor(Math.random() * 2) + spawnBonus;
        for (let i = 0; i < spawnAmount; i++) {
            let size = Math.pow(2, Math.floor(Math.random() * 3) + 4);
            game.addEntity(new Enemy(Math.floor(Math.random() * 10) + 1, WIDTH / size, HEIGHT / size, "#ff0000", sun));
        }
        document.getElementById("test_text").textContent = "spawnBonus: " + spawnBonus;
    }
    if (timeElapsed > 12000) {
        spawnBonus += 1;
        timeElapsed = 0;
    }

    if (!paused) {
        game.update();
    }
    game.render();

    if (sun.dead && game.entityCount <= 0) {
        if (!reset) {
            spawnBonus = 1;
            document.body.appendChild(mainScreen);
            reset = true;
            paused = true;
        }
    }
    else if(reset) {
        reset = false;
    }
}

setInterval(update, delta)