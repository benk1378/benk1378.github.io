class GridSystem {
    constructor(tile_grid, entity_grid) {
        this.tile_grid = tile_grid;
        this.entity_grid = entity_grid;

        this.background = this.get_context("100%", "100%", "#3f3f74", ["0%", "0%"]);
        this.game = this.get_context("50%", "98%", "#222034", ["23.5%", "1%"]);
        this.left_panel = this.get_context("22.5%", "98%", "#222034", ["0.5%", "1%"]);
        this.right_panel = this.get_context("25%", "48.5%", "#222034", ["74%", "1%"]);
        this.corner_panel = this.get_context("25%", "48.5%", "#222034", ["74%", "50.5%"]);

        //image_size = this.game.canvas.width / this.tile_grid.length;

        this.toDraw = 0;
        this.delta = 0;

        this.mousePos = [-1, -1];

        this.game.canvas.addEventListener("mouseup", this.on_mouse_up.bind(this));
        this.game.canvas.addEventListener("mousemove", this.on_mouse_move.bind(this));
        this.game.canvas.addEventListener("mouseleave", this.on_mouse_leave.bind(this));
    }

    on_mouse_up(event) {

    }
    on_mouse_move(event) {
        let canvasRect = this.game.canvas.getBoundingClientRect();

        this.mousePos = [Math.trunc(((event.offsetX / canvasRect.width) * this.game.canvas.width) / imageSize),
        Math.trunc(((event.offsetY / canvasRect.height) * this.game.canvas.height) / imageSize)];

        if (this.mousePos[0] >= GRID_SIZE || this.mousePos[1] >= GRID_SIZE || this.mousePos[0] < 0 || this.mousePos[1] < 0) {
            this.mousePos = [-1, -1];
        }

        document.getElementById("test_text").textContent = this.mousePos;
    }
    on_mouse_leave(event) {
        this.mousePos = [-1, -1];
    }

    get_game_context() {
        return this.game;
    }

    get_context(w, h, color = "#111", pos = ["0px", "0px"], transparent=false) {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.style.position = "absolute";
        this.canvas.style.background = color;
        if (transparent) {
            this.canvas.style.backgroundColor = "transparent";
        }
        this.canvas.style.left = pos[0];
        this.canvas.style.top = pos[1];
        this.canvas.style.width = w;
        this.canvas.style.height = h;

        document.body.appendChild(this.canvas);

        let rect = this.canvas.getBoundingClientRect();

        this.canvas.width = rect.width * 4;
        this.canvas.height = rect.height * 4;

        return this.context;
    }

    update(delta) {
        this.delta += delta;
        if (this.delta >= 500) {
            this.delta = 0;

            if (this.toDraw === 0) {
                this.toDraw = 1;
            }
            else {
                this.toDraw = 0;
            }
        }
    }

    render() {
        let rect = this.game.canvas.getBoundingClientRect();
        this.game.canvas.width = rect.width * 4;
        this.game.canvas.height = rect.height * 4;
        rect = this.left_panel.canvas.getBoundingClientRect();
        this.left_panel.canvas.width = rect.width * 4;
        this.left_panel.canvas.height = rect.height * 4;
        rect = this.right_panel.canvas.getBoundingClientRect();
        this.right_panel.canvas.width = rect.width * 4;
        this.right_panel.canvas.height = rect.height * 4;
        rect = this.corner_panel.canvas.getBoundingClientRect();
        this.corner_panel.canvas.width = rect.width * 4;
        this.corner_panel.canvas.height = rect.height * 4;


        this.game.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);

        if (this.game.canvas.width < this.game.canvas.height) {
            imageSize = this.game.canvas.width / GRID_SIZE;
        }
        else {
            imageSize = this.game.canvas.height / GRID_SIZE;
        }

        //let image_size = this.game.canvas.width / this.tile_grid.length;
        for (let row = 0; row < this.tile_grid.length; row++) {
            for (let col = 0; col < this.tile_grid[0].length; col++) {
                let tile = this.tile_grid[row][col];
                if (tile === null) continue;

                this.game.drawImage(tile.sprites[0], (col * imageSize), (row * imageSize), imageSize, imageSize);
            }
        }
        for (let row = 0; row < this.entity_grid.length; row++) {
            for (let col = 0; col < this.entity_grid[0].length; col++) {
                let entity = this.entity_grid[row][col];
                if (entity === null) continue;

                this.game.drawImage(entity.getSprite(this.toDraw), (col * imageSize), (row * imageSize), imageSize, imageSize);
            }
        }

        this.right_panel.clearRect(0, 0, this.right_panel.canvas.width, this.right_panel.canvas.height);

        if (this.mousePos[0] >= 0 && this.mousePos[1] >= 0) {
            this.game.fillStyle = "rgba(255, 255, 255, 0.2)";
            this.game.fillRect(this.mousePos[0] * imageSize, this.mousePos[1] * imageSize, imageSize, imageSize);

            let hovered = this.entity_grid[this.mousePos[1]][this.mousePos[0]]; 
            if (hovered != null) {
                let width = this.right_panel.canvas.width;
                let height = this.right_panel.canvas.height;
                let avg = (width + height) / 2;
                let maxWidth = (width / 1.025);

                this.right_panel.letterSpacing = "0px";

                let x = (width / 64);

                let drawPos = (height/10);

                this.right_panel.font = (avg/5) + "px pixelFont";
                this.right_panel.fillStyle = hovered.team.getColor("1.0");
                this.right_panel.fillText(hovered.data.name, x, drawPos, maxWidth);

                drawPos += (height/16);
                this.right_panel.font = (avg/10) + "px pixelFont";
                this.right_panel.fillStyle = "#5b6ee1";
                let typeString = "";
                for (let i = 0; i < hovered.data.types.length; i++) {
                    if (typeString != "") typeString += ", ";
                    typeString += hovered.data.types[i]; 
                }
                this.right_panel.fillText(typeString, x, drawPos, maxWidth);

                drawPos += (height/22);
                let lines = hovered.data.lore.split("\n");
                for (let i = 0; i < lines.length; i++) {
                    this.right_panel.font = (avg/18) + "px pixelFont";
                    this.right_panel.fillStyle = "#3f3f74";
                    this.right_panel.fillText(lines[i], x, drawPos + ((height/30) * i), maxWidth);
                }

                this.right_panel.font = (avg/10) + "px pixelFont";
                this.right_panel.fillStyle = "#5b6ee1";

                let x2 = (width / 2.25);

                drawPos += (height/7);
                this.right_panel.fillText("Health: " + hovered.health + "/" + hovered.data.max_health, x, drawPos, maxWidth);
                //this.right_panel.fillText(hovered.health + "/" + hovered.data.max_health, x2, drawPos, maxWidth);

                if (!hovered.peaceful) {
                    drawPos += (height/16);
                    this.right_panel.fillText("Damage: " + hovered.attackDamage, x, drawPos, maxWidth);
                    //this.right_panel.fillText(hovered.attackDamage, x2, drawPos, maxWidth);
                }
                drawPos += (height / 16);
                this.right_panel.fillText("Range: " + hovered.range, x, drawPos, maxWidth);
                //this.right_panel.fillText(hovered.range, x2, drawPos, maxWidth);
                if (hovered.radius > 0) {
                    drawPos += (height / 16);
                    this.right_panel.fillText("Radius: " + hovered.radius, x, drawPos, maxWidth);
                    //this.right_panel.fillText(hovered.radius, x2, drawPos, maxWidth);
                }

                if (hovered.immobile) {
                    drawPos += (height / 8);
                    this.right_panel.fillText("Immobile", x, drawPos, maxWidth);
                }

                //this.game.fillStyle = "rgba(0, 255, 0, 0.1)";
                for (let i = 0; i < hovered.posInRange.length; i++) {
                    //let p = (hovered.range * 2) + 1;
                    if (hovered.posInRange[i] != null) {
                        this.game.fillStyle = hovered.team.getColor("0.2");
                        this.game.fillRect(hovered.posInRange[i][0] * imageSize, hovered.posInRange[i][1] * imageSize, imageSize, imageSize);
                        //this.right_panel.fillText("[" + hovered.posInRange[i][0] + ", " + hovered.posInRange[i][1] + "]", 5 + (45 * (i%p)), 175 + (10 * ((i/p) | 0)), 40);
                    }
                }
            }
            else {
                hovered = this.tile_grid[this.mousePos[1]][this.mousePos[0]];
                if (hovered != null) {
                    let width = this.right_panel.canvas.width;
                    let height = this.right_panel.canvas.height;
                    let avg = (width + height) / 2;
                    let maxWidth = (width / 1.025);

                    let x = (width / 64);

                    let drawPos = (height / 10);

                    this.right_panel.letterSpacing = "0px";

                    this.right_panel.font = (avg/5) + "px pixelFont";
                    this.right_panel.fillStyle = "#3f3f74";
                    this.right_panel.fillText(hovered.data.name, x, drawPos, maxWidth);
                    
                    let lines = hovered.data.lore.split("\n");

                    drawPos += (height / 22);
                    for (let i = 0; i < lines.length; i++) {
                        this.right_panel.font = (avg/18) + "px pixelFont";
                        this.right_panel.fillStyle = "#3f3f74";
                        this.right_panel.fillText(lines[i], x, drawPos + ((height / 30) * i), maxWidth);
                    }
                }
            }
        }

        this.corner_panel.clearRect(0, 0, this.corner_panel.canvas.width, this.corner_panel.canvas.height);

        let width = this.corner_panel.canvas.width;
        let height = this.corner_panel.canvas.height;
        let iconSize = (width / 8);

        let toDraw = 0;
        if (paused) toDraw = 1;
        this.corner_panel.drawImage(ui_sprites[toDraw], (width / 64), (height / 64), iconSize, iconSize);

        let startPos = height/8;
        for (let i = 0; i <= MAX_SPEED; i++) {
            this.corner_panel.drawImage(ui_sprites[3], (width / 128), startPos * (i + 1), iconSize, iconSize);
            if (i < MAX_SPEED) {
                this.corner_panel.drawImage(ui_sprites[2], (width / 128), startPos * (i + 1.5), iconSize, iconSize);
            }
        }
        this.corner_panel.drawImage(ui_sprites[4], (width / 128), startPos + ((height / 8) * (MAX_SPEED - turnSpeed)), iconSize, iconSize);
    }
}
class Entity {
    constructor(grid, tile_grid, data, pos, team) {
        this.grid = grid;
        this.tile_grid = tile_grid;
        this.pos = pos;
        this.team = team;

        this.data = data;
        this.health = data.max_health;
        this.attackDamage = data.atk_dmg;
        this.range = data.range;
        this.radius = data.radius;
        this.immobile = data.immobile;
        this.peaceful = data.peaceful;

        this.turnNumber = 0;

        let temp = this.range * 2 + 1;
        this.posInRange = new Array((temp * temp)).fill(null);

        this.dead = false;

        this.grid[this.pos[1]][this.pos[0]] = this;

        this.updateRange();
    }

    act() {
        let spawned = false;
        if (this.data.toSpawn != null && this.turnNumber % this.data.toSpawn[0].cooldown < 1) {
            let closestSpawnPos = null;
            for (let i = 0; i < this.posInRange.length; i++) {
                let pos = this.posInRange[i];
                if (pos != null && this.is_walkable(pos)) {
                    let offset = [pos[0] - this.pos[0], pos[1] - this.pos[1]];
                    if (closestSpawnPos === null || (Math.abs(offset[0]) + Math.abs(offset[1]) < Math.abs(closestSpawnPos[0]) + Math.abs(closestSpawnPos[1]))) {
                        closestSpawnPos = offset;
                    }
                }
            }
            if (closestSpawnPos != null) {
                this.spawn(closestSpawnPos);
                spawned = true;
            }
        }

        let attacked = false;
        let closestEnemyOffset = null;
        if (!spawned && !(this.peaceful)) {
            for (let i = 0; i < this.posInRange.length; i++) {
                let pos = this.posInRange[i];
                if (pos != null && this.grid[pos[1]][pos[0]] != null && this.grid[pos[1]][pos[0]].team != this.team) {
                    let offset = [pos[0] - this.pos[0], pos[1] - this.pos[1]];
                    if (closestEnemyOffset === null || (Math.abs(offset[0]) + Math.abs(offset[1]) < Math.abs(closestEnemyOffset[0]) + Math.abs(closestEnemyOffset[1]))) {
                        closestEnemyOffset = offset;
                    }
                }
            }

            if (closestEnemyOffset != null) {
                this.attack(closestEnemyOffset);
                attacked = true;
            }
        }

        if(!spawned && !attacked && !(this.immobile)) {
            closestEnemyOffset = null;
            for (let row = 0; row < this.grid.length; row++) {
                for (let col = 0; col < this.grid[0].length; col++) {
                    if (col === this.pos[0] && row === this.pos[1]) continue;
                    let pos = [col, row];
                    if (this.grid[pos[1]][pos[0]] != null && this.grid[pos[1]][pos[0]].team != this.team) {
                        let offset = [pos[0] - this.pos[0], pos[1] - this.pos[1]];
                        if (closestEnemyOffset === null || (Math.abs(offset[0]) + Math.abs(offset[1]) < Math.abs(closestEnemyOffset[0]) + Math.abs(closestEnemyOffset[1]))) {
                            closestEnemyOffset = offset;
                        }
                    }
                }
            }
            if (closestEnemyOffset != null) {
                if(closestEnemyOffset[0] != 0) {
                    let toMoveX = 1;
                    if (closestEnemyOffset[0] < 0) toMoveX = -1;
                    let moved = this.move([toMoveX, 0]);
                    if (!moved) {
                        let toMoveY = 1;
                        if (closestEnemyOffset[1] < 0) toMoveY = -1;
                        this.move([0, toMoveY]);
                    }
                }
                else {
                    let toMoveY = 1;
                    if (closestEnemyOffset[1] < 0) toMoveY = -1;
                    let moved = this.move([0, toMoveY]);
                    if (!moved) {
                        let toMoveX = 1;
                        if (closestEnemyOffset[0] < 0) toMoveX = -1;
                        this.move([toMoveX, 0]);
                    }
                }
            }
        }

        this.turnNumber += 1;
    }

    spawn(toSpawn) {
        if (toSpawn[0] === 0 && toSpawn[1] === 0) return;

        createEntity(this.data.toSpawn[0].number, [this.pos[0] + toSpawn[0], this.pos[1] + toSpawn[1]], this.team);
    }

    getSprite(toGet) {
        if (toGet < 0 || toGet >= this.data.sprites.length) return null;

        return this.data.sprites[toGet];
    }

    damage(toDamage) {
        this.health -= toDamage;
        if (this.health <= 0) {
            this.dead = true;
        }
    }

    attack(toAttack) {
        //if (this.dead) return;

        if (toAttack[0] === 0 && toAttack[1] === 0) return false;

        let attackPos = [this.pos[0] + toAttack[0], this.pos[1] + toAttack[1]];
        if (attackPos[0] >= 0 && attackPos[0] < this.tile_grid[0].length && attackPos[1] >= 0 && attackPos[1] < this.tile_grid.length) {
            /*if (this.tile_grid[attackPos[1]][attackPos[0]] > 0) {
                this.tile_grid[attackPos[1]][attackPos[0]] -= 1;
            }*/
            if (this.grid[attackPos[1]][attackPos[0]] != null) {
                this.grid[attackPos[1]][attackPos[0]].damage(this.attackDamage);
            }
            addParticle(0, attackPos);
            return true;
        }

        return false;
    }

    is_walkable(pos) {
        return (pos[0] === this.pos[0] && pos[1] === this.pos[1]) || (this.tile_grid[pos[1]][pos[0]].walkable && this.grid[pos[1]][pos[0]] === null);
    }

    move(toMove) {
        //if (this.dead) return false;

        if (toMove[0] != 0) {
            while (true) {
                if (this.pos[0] + toMove[0] < 0 || this.pos[0] + toMove[0] >= this.grid[0].length || !(this.is_walkable([this.pos[0] + toMove[0],this.pos[1]]))) {
                    if (toMove[0] > 0) {
                        toMove[0] -= 1;
                    }
                    else {
                        toMove[0] += 1;
                    }
                }
                else {
                    break;
                }
            }
        }

        if (toMove[1] != 0) {
            while (true) {
                if (this.pos[1] + toMove[1] < 0 || this.pos[1] + toMove[1] >= this.grid.length || !(this.is_walkable([this.pos[0], this.pos[1] + toMove[1]]))) {
                    if (toMove[1] > 0) {
                        toMove[1] -= 1;
                    }
                    else {
                        toMove[1] += 1;
                    }
                }
                else {
                    break;
                }
            }
        }

        if (toMove[0] != 0 || toMove[1] != 0) {
            this.grid[this.pos[1]][this.pos[0]] = null;

            this.pos[0] += toMove[0];
            this.pos[1] += toMove[1];
            this.grid[this.pos[1]][this.pos[0]] = this;

            this.updateRange();

            return true;
        }
        else {
            return false;
        }
    }

    updateRange() {
        this.posInRange.fill(null);

        let squareSize = (this.range * 2) + 1;
        for (let i = 0; i < squareSize; i++) {
            for (let j = 0; j < squareSize; j++) {
                let offsetX = i - this.range;
                let offsetY = j - this.range;
                if (offsetX === 0 && offsetY === 0) continue;

                let indices = [this.pos[0] + offsetX, this.pos[1] + offsetY];
                if (Math.abs(offsetX) + Math.abs(offsetY) <= this.range &&
                    indices[0] >= 0 && indices[0] < this.tile_grid[0].length &&
                    indices[1] >= 0 && indices[1] < this.tile_grid.length) {
                    this.posInRange[j + (i * squareSize)] = [indices[0], indices[1]];
                }
            }
        }
    }
}
class Spawner extends Entity {
    constructor(grid, tile_grid, data, pos, team) {
        super(grid, tile_grid, data, pos, team);
    }
}
class SpawnData {
    constructor(number, cooldown) {
        this.number = number;
        this.cooldown = cooldown;
    }
}
class Particle {
    constructor(images, pos) {
        this.images = images;
        this.pos = pos;

        this.delta = 0;

        this.currentFrame = 0;
        this.ended = false;
    }

    update(delta) {
        if (this.ended) return;

        this.delta += delta;

        if (this.delta >= 100) {
            this.currentFrame += 1;
            this.delta = 0;
            if (this.currentFrame >= this.images.length) this.ended = true;
        }
    }

    draw(ctx) {
        if (this.ended) return;

        //let image_size = 32;
        ctx.drawImage(this.images[this.currentFrame], this.pos[0] * imageSize, this.pos[1] * imageSize, imageSize, imageSize);
    }
}

class Team {
    constructor(number, name, color) {
        this.number = number;
        this.name = name;
        this.color = color;
    }
    getColor(alpha) {
        return this.color + alpha + ")";
    }
}
class EntityData {
    constructor(name, lore, types, immobile=true, peaceful=true, max_health=1, atk_dmg=0, range=0, radius=0, toSpawn=null, sprites=null) {
        this.name = name;
        this.lore = lore;
        this.types = types;
        this.max_health = max_health;
        this.atk_dmg = atk_dmg;
        this.range = range;
        this.radius = radius;
        this.immobile = immobile;
        this.peaceful = peaceful;
        this.toSpawn = toSpawn;
        this.sprites = sprites;
    }
}
class TileData {
    constructor(name, walkable, lore, sprites=null) {
        this.name = name;
        this.walkable = walkable;
        this.lore = lore;
        this.sprites = sprites;
        this.data = this;
    }
}

let pixelFont = new FontFace("pixelFont", "url(assets/fonts/ThaleahFat.ttf)");

pixelFont.load().then(() => {
    document.fonts.add(pixelFont);
});

let teams = new Array(2);

teams[0] = new Team(0, "Friend", "rgba(106, 190, 48, ");
teams[1] = new Team(1, "Foe", "rgba(217, 87, 99, ");

const TILE_SOURCES = ["empty", "ground", "rock"];
const ENTITY_SOURCES = ["castle", "lumberjack", "tree", "twig"];
const PARTICLE_SOURCES = ["slash"];
const UI_SOURCES = ["pause", "play", "line", "dot", "big_dot"];

let tile_datas = new Array(TILE_SOURCES.length);
let entity_datas = new Array(ENTITY_SOURCES.length);
let particle_sprites = new Array(PARTICLE_SOURCES.length);
let ui_sprites = new Array(UI_SOURCES.length);

entity_datas[0] = new EntityData("Castle", "These trees will do anything\nto protect themselves from\nhumans.", ["Royal", "Strong"], true, true, 10, 1, 1, 0, [new SpawnData(1, 4)]);
entity_datas[1] = new EntityData("Lumberjack", "A humble lumberjack, loves to\nchop wood. Kind of surprised\nyou needed to know that.", ["Strong"], false, false, 10, 5, 1, 1);
entity_datas[2] = new EntityData("Cursed Tree", "These trees will do anything\nto protect themselves from\nhumans.", ["Wood"], true, true, 2, 1, 3, 0, [new SpawnData(3, 1)]);
entity_datas[3] = new EntityData("Cursed Twig", "These angry little twigs have a\nvendetta against anything\nbigger than them.", ["Wood"], false, false, 1, 1, 1, 0);

tile_datas[0] = new TileData("Nothing", false, "...except a long way down");
tile_datas[1] = new TileData("Ground", true, "Nice, walkable ground for\nfriends and foes alike.");
tile_datas[2] = new TileData("Rock", false, "A massive boulder, unbreakable\nby even the strongest weakling.");

for (let i = 0; i < TILE_SOURCES.length; i++) {
    let temp = new Array(1);
    temp[0] = new Image(256, 256);
    temp[0].src = "assets/sprites/" + TILE_SOURCES[i] + ".png";

    tile_datas[i].sprites = temp;
}
for (let i = 0; i < ENTITY_SOURCES.length; i++) {
    let temp = new Array(2);
    for (let j = 0; j < temp.length; j++) {
        temp[j] = new Image(256, 256);
        temp[j].src = "assets/sprites/animations/" + ENTITY_SOURCES[i] + "/" + ENTITY_SOURCES[i] + (j+1) + ".png";
    }
    entity_datas[i].sprites = temp;
}
for (let i = 0; i < PARTICLE_SOURCES.length; i++) {
    let temp = new Array(6);
    for (let j = 0; j < temp.length; j++) {
        temp[j] = new Image(256, 256);
        temp[j].src = "assets/sprites/animations/" + PARTICLE_SOURCES[i] + "/" + PARTICLE_SOURCES[i] + (j + 1) + ".png";
    }

    particle_sprites[i] = temp;
}
for (let i = 0; i < UI_SOURCES.length; i++) {
    let temp = new Image(256, 256);
    temp.src = "assets/ui/" + UI_SOURCES[i] + ".png";

    ui_sprites[i] = temp;
}

let takeTurn = false;

let mainGrid = new GridSystem(null, null);

let GRID_SIZE = 14;
let imageSize;

let tileGrid;
let entityGrid;

let particles;
let entities;

let particleNum;
let entityNum;

function createEntity(num, pos, team) {
    if (num >= entity_datas.length || pos[0] >= entityGrid[0].length || pos[1] >= entityGrid.length || entityGrid[pos[1]][pos[0]] != null) return null;

    if (entityNum[team.number] < entities[team.number].length) {
        entities[team.number][entityNum[team.number]] = new Entity(entityGrid, tileGrid, entity_datas[num], pos, team);
        entityNum[team.number] += 1;
    }
}
function removeEntity(teamNum, num) {
    let entity = entities[teamNum][num];
    entityGrid[entity.pos[1]][entity.pos[0]] = null;
    entities[teamNum][num] = null;
    for (let i = num; i < entityNum[teamNum] - 1; i++) {
        entities[teamNum][i] = entities[teamNum][i + 1];
    }
    entityNum[teamNum] -= 1;
    //return entity;
}
function addParticle(num, pos) {
    if (num >= particle_sprites.length || particleNum >= particles.length) return;

    particles[particleNum] = new Particle(particle_sprites[num], pos);
    particleNum += 1;
}
function removeParticle(num) {
    if (num < 0 || num >= particles.length) return;

    particles[num] = null;
    for (let i = num + 1; i < particles.length; i++) {
        if (particles[i] != null) {
            particles[i - 1] = particles[i];
            particles[i] = null;
        }
        else {
            break;
        }
    }
    particleNum -= 1;
}

const FPS = 120;
let delta = 1000 / FPS;

let timeElapsed = 0;
let turnNumber;

const MAX_SPEED = 3;
let turnSpeed = 0;
let paused = true;

setGridSize(GRID_SIZE);

function setGridSize(toSet) {
    GRID_SIZE = toSet;
    imageSize = mainGrid.game.canvas.width / GRID_SIZE;

    particles = new Array(GRID_SIZE * GRID_SIZE * 4);
    entities = new Array(teams.length).fill(null).map(() => new Array(GRID_SIZE * GRID_SIZE));

    tileGrid = new Array(GRID_SIZE).fill(null).map(() => new Array(GRID_SIZE).fill(null));
    entityGrid = new Array(GRID_SIZE).fill(null).map(() => new Array(GRID_SIZE).fill(null));

    entityNum = new Array(teams.length).fill(0);
    particleNum = 0;

    mainGrid.tile_grid = tileGrid;
    mainGrid.entity_grid = entityGrid;

    turnNumber = 0;

    for (let col = 0; col < tileGrid[0].length; col++) {
        for (let row = 0; row < tileGrid.length; row++) {
            let toSet = tile_datas[1];

            if (col === 0 || col === tileGrid[0].length - 1 || row === 0 || row === tileGrid.length - 1) {
                toSet = tile_datas[2];
            }

            tileGrid[row][col] = toSet;
        }
    }

    createEntity(0, [1, 1], teams[0]);
    createEntity(2, [GRID_SIZE-2, GRID_SIZE-2], teams[1]);
}

document.body.addEventListener("keydown", function (e) {
    switch (e.key) {
        case " ":
            paused = !paused;
            break;
        case "ArrowRight":
            takeTurn = true;
            break;
        case "ArrowUp":
            if (turnSpeed + 1 <= MAX_SPEED) {
                turnSpeed += 1;
            }
            break;
        case "ArrowDown":
            if (turnSpeed - 1 >= 0) {
                turnSpeed -= 1;
            }
            break;
        case ",":
            setGridSize(GRID_SIZE - 1);
            break;
        case ".":
            setGridSize(GRID_SIZE + 1);
            break;
        default:
            break;
    }
});

function update() {
    if (paused) {
        timeElapsed = 0;
    }
    else {
        timeElapsed += delta;
    }
    
    if (timeElapsed >= 500 / Math.pow(4, turnSpeed)) {
        takeTurn = true;
        timeElapsed = 0;
    }

    //  first friends act, then foes act
    /*for (let i = 0; i < entity_num.length; i++) {
        let entities = new Array(entity_num[i]);

        let currentNum = 0;

        for (let row = 0; row < entity_grid.length; row++) {
            for (let col = 0; col < entity_grid[0].length; col++) {
                let entity = entity_grid[row][col];
                if (entity === null || entity.team.number != i) continue;

                entities[currentNum] = entity_grid[row][col];
                currentNum++;
            }
        }
        for (let i = 0; i < entities.length; i++) {
            let entity = entities[i];
            if (entity === null) continue;

            if (entity.dead) {
                entity_grid[entity.pos[1]][entity.pos[0]] = null;
                entity_num[entity.team.number] -= 1;
            }
            else if (takeTurn) {
                entity.act();
            }
        }
    }*/

    /*let entities = new Array(entity_num[0] + entity_num[1]);

    let currentNum = 0;

    for (let row = 0; row < entity_grid.length; row++) {
        for (let col = 0; col < entity_grid[0].length; col++) {
            let entity = entity_grid[row][col];
            if (entity === null) continue;

            entities[currentNum] = entity_grid[row][col];
            currentNum++;
        }
    }*/
    if (takeTurn) {
        for (let team = 0; team < entityNum.length; team++) {
            let tempEntityNum = entityNum[team];

            for (let i = 0; i < tempEntityNum; i++) {
                let entity = entities[team][i];
                if (entity === null) continue;

                entity.act(turnNumber);
            }
        }
        for (let team = 0; team < entityNum.length; team++) {
            for (let i = 0; i < entityNum[team]; i++) {
                let entity = entities[team][i];
                if (entity === null) continue;

                if (entity.dead) {
                    removeEntity(team, i);
                }
            }
        }
    }


    mainGrid.update(delta);
    mainGrid.render();

    for (let i = 0; i < particleNum; i++) {
        if (particles[i].ended) {
            removeParticle(i);
        }
        else {
            particles[i].update(delta);
            particles[i].draw(mainGrid.get_game_context());
        }
    }

    if (takeTurn) {
        turnNumber += 1;

        /*if (turnNumber % 1 === 0) {
            let summonPos;
            let tries = 0;
            do {
                summonPos = [Math.floor(Math.random() * (GRID_SIZE - 2)) + 1, Math.floor(Math.random() * (GRID_SIZE - 2)) + 1];
                tries += 1;
            } while ((!(tile_grid[summonPos[1]][summonPos[0]].walkable) || entity_grid[summonPos[1]][summonPos[0]] != null) && tries < GRID_SIZE * GRID_SIZE);
            if (tries < GRID_SIZE * GRID_SIZE) {
                let rand = Math.floor(Math.random() * entity_datas.length);
                let team = teams[0];
                if (rand > 0) team = teams[1];
                //createEntity(rand, [summonPos[0], summonPos[1]], team);
            }
        }*/

        takeTurn = false;
    }
}

setInterval(update, delta);