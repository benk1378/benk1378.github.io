class ClickableObject {
    constructor(images, pos, size, offset=[0,0], click_size=size) {
        this.images = images;
        this.pos = pos;
        this.size = size;
        this.offset = offset;
        this.click_size = click_size;

        this.to_draw = 0;
        this.playing = false;

        document.body.addEventListener("mousedown", this.on_mouse_down.bind(this));
    }

    on_mouse_down(event) {
        if(event.pageX >= this.pos[0] + this.offset[0] && event.pageX < this.pos[0] + this.offset[0] + this.click_size[0] && 
           event.pageY >= this.pos[1] + this.offset[1] && event.pageY < this.pos[1] + this.offset[1] + this.click_size[1]) {
            this.playing = true;
        }
    }

    draw_image(ctx, debug=false) {
        if(this.playing) {
            this.to_draw += 1;

            if(this.to_draw >= this.images.length) {
                this.playing = false;
                this.to_draw = 0;
            }
        }
        
        if(debug) {
            ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
            ctx.fillRect(this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.click_size[0], this.click_size[1]);
        }

        let image = this.images[this.to_draw];
        ctx.drawImage(image, this.pos[0], this.pos[1], this.size[0], this.size[1]);
    }
}


DEBUG = false;

//  frame number, width, height, path
const SPRITE_DATA = [
    [15, 300, 400, "assets/sprites/pink/pink_squeeze"],
    [15, 200, 300, "assets/sprites/giraffe/giraffe_squeeze"],
    [30, 200, 200, "assets/sprites/elephant/elephant_squeeze"],
    [45, 250, 300, "assets/sprites/lizard/lizard_wiggle"],
    [30, 300, 300, "assets/sprites/jesus/jesus_slap"],
    [35, 300, 300, "assets/sprites/dolphin/dolphin_jump"]
];


let sprites = new Array(SPRITE_DATA.length);

for (let sprite = 0; sprite < sprites.length; sprite++) {
    let to_append = new Array(SPRITE_DATA[sprite][0]);
    for(let i = 0; i < to_append.length; i++) {
        to_append[i] = new Image(SPRITE_DATA[sprite][1], SPRITE_DATA[sprite][2]);
        to_append[i].src = SPRITE_DATA[sprite][3];
    
        if(i < 10) {
            to_append[i].src += "0";
        }
    
        to_append[i].src += i + ".png";
    }
    sprites[sprite] = to_append;
}

let objects = new Array(SPRITE_DATA.length);

//  images, pos, size, offset, click size
objects[0] = new ClickableObject(sprites[0], [86, 136], [190, 225], [63, 165], [70, 55]);
objects[1] = new ClickableObject(sprites[1], [200, 185], [100, 130], [35, 52], [28, 38]);
objects[2] = new ClickableObject(sprites[2], [85, 150], [100, 130], [32, 50], [32, 30]);
objects[3] = new ClickableObject(sprites[3], [220, 235], [100, 130], [40, 80], [60, 60]);
objects[4] = new ClickableObject(sprites[4], [140, 390], [190, 190], [40, 40], [105, 110]);
objects[5] = new ClickableObject(sprites[5], [155, 470], [190, 190], [10, 98], [155, 65]);


let bg_img = new Image(1240, 640);
bg_img.src = "assets/background.jpg";

let ctx = document.getElementById("canvas_container").getContext("2d");

let button = document.getElementById("debug_button");
button.innerText = "Toggle Debug Mode";
button.addEventListener("click", function () {
    DEBUG = !DEBUG;
});

function update() {
    ctx.drawImage(bg_img, 16, 16, bg_img.width, bg_img.height);

    for (let i = 0; i < objects.length; i++) {
        objects[i].draw_image(ctx, DEBUG);
    }
}

setInterval(update, 20);
