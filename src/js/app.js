document.body.style.background = 'url(src/imgs/body-background2.jpg) no-repeat';
document.body.style.backgroundSize = 'cover';

function Title() {
    this.title = document.createElement('h1');
    const title = this.title;
    title.innerHTML = 'Mario Race';
    title.style.color = 'white';
    title.style.justifySelf = 'center';

    document.body.appendChild(title);
}
const title = new Title();

const mainGame = document.createElement('main');
document.body.appendChild(mainGame);

function GameArea(mainGame) {
    this.area = document.createElement('section');
    const area = this.area;
    area.style.position = 'relative';
    area.style.justifySelf = 'center';
    area.style.display = 'flex';
    area.style.flexFlow = 'row nowrap';
    area.style.width = '95%';
    area.style.height = '500px';
    area.style.backgroundColor = 'gray';
    area.style.border = '10px solid';
    area.style.borderColor = 'red blue';
    area.style.overflow = 'hidden';

    mainGame.appendChild(area);
}
const gameArea = new GameArea(mainGame);

function Roads(gameArea ,space, img) {  
    this.road = document.createElement('div');
    const road = this.road;
    road.style.position = 'relative';
    road.style.justifyContent = 'space-around';
    road.style.background = `url(src/imgs/${img}) no-repeat`;
    road.style.backgroundSize = '100% 500px';
    road.style.height = '500px';
    road.style.width = '25%';
    road.style.left = `${space}%`;
    
    gameArea.area.appendChild(road);
}

const rightRoad = new Roads(gameArea, 0, 'mario-background1.webp'),
    leftRoad = new Roads(gameArea, 50, 'mario-background2.png');

Roads.prototype.getStyle = function (p) {
    return window.getComputedStyle(this.road)[p];
};
const getWidthRoad = leftRoad.getStyle('width'),
    roadWidth = parseFloat(getWidthRoad);

function Lines(gameArea, spaceTop, spaceLeft) {
    this.line = document.createElement('div');
    const line = this.line;
    line.style.position = 'relative';
    line.style.top = `${spaceTop}px`;
    line.style.left = `${spaceLeft}%`;
    line.style.display = 'block';
    line.style.justifySelf = 'center';
    line.style.backgroundColor = 'yellow';
    line.style.height = '80px';
    line.style.width = '1%';
    
    gameArea.area.appendChild(line);   
    
    let pos = spaceTop,
        intervalId;

    this.animate = () => {   
        intervalId = setInterval(() => {
            if(pos == 550) pos = -50;      
            else pos+= 2;
                 line.style.top = `${pos}px`;   
        }, 1);    
    };

    this.stop = () => clearInterval(intervalId);
}

const spaceTop = 183.3, spaceLeft = -1;

const line = new Lines(gameArea, 0, 0);

line.animate();

function Audio(som) {
    this.audio = document.createElement('audio');
    const audio = this.audio;
    audio.src = `${som}`;
    audio.type = 'audio/mpeg';
    audio.preload = 'auto';

    this.play = () => audio.play();
    this.pause = () => audio.pause();

    document.body.appendChild(audio);
}

const audioPagina2 = new Audio('src/audios/11a_Overworld.mp3');
const dead = new Audio('src/audios/28_Player_Down.mp3');

document.body.addEventListener('mousemove', () => {
    
});

let gameON = true;
let moveMin = roadWidth;
let moveMax = roadWidth * 2.8;

function Mario(gameArea) {
    this.mario = document.createElement('img');
    
    const mario = this.mario;

    mario.src = 'src/imgs/mario.png';
    mario.style.position = 'absolute';
    mario.style.top = '400px';
    mario.style.left = '440px';
    mario.style.width = '60px';
    mario.style.height = '66px';
    mario.style.border = 'none';
    mario.style.backgroundColor = 'red';

    gameArea.area.appendChild(mario);

    const passo = 10;


    let keys = [];   
    let move = mario.offsetLeft;

    document.addEventListener('keydown', (e => { 
        if(!gameON) return;

        audioPagina2.play();
        
        if(keys.indexOf(e.key) == -1) keys[keys.length] = e.key;
        
        for(let key of keys) {
            if(key == 'ArrowRight') move += passo;
            if(key == 'ArrowLeft') move -= passo;
        }

        if(move <= moveMin) move = moveMin;
        if(move >= moveMax) move = moveMax;
        
        this.mario.style.left = `${move}px`;       
    }));

    document.addEventListener('keyup', (e => {
        if(!gameON) return;
        keys.splice(keys.indexOf(e.key), 1)
    }));

    let touchInterval;
    let currentDirection = null;

    document.addEventListener('touchstart', e => { 
        if(!gameON) return;
       
        let touchX = e.touches[0].clientX,
            screenWidth = window.innerWidth;

        audioPagina2.play();

        currentDirection = touchX < screenWidth / 2 ? 'left' : 'right';

        if(touchInterval) clearInterval(touchInterval);

        touchInterval = setInterval(() => {
            if(currentDirection === 'left') {
                move -= passo;
            } else {
                move += passo;
            };
    
            if(move <= moveMin) move = moveMin;
            if(move >= moveMax) move = moveMax;
            
            mario.style.left = `${move}px`;
        }, 50);
    });

    document.addEventListener('touchmove', e => {
        if(!gameON || !touchInterval) return;

        let touchX = e.touches[0].clientX,
            screenWidth = window.innerWidth;

        currentDirection = touchX < screenWidth ? 'left' : 'right';
    });

    document.addEventListener('thouchend', e => {
        clearInterval(touchInterval);
        touchInterval = null;
        currentDirection = null;
    });

    this.stop = () => clearInterval(touchInterval);
};

const mario = new Mario(gameArea);

let enemyMin = 0;
let enemyMax = 0;

function Enemies(gameArea, img, vel, color) {
    this.enemy = document.createElement('img');

    const enemy = this.enemy;

    enemyMin = roadWidth;
    enemyMax = roadWidth * 2.7;
    let left = Math.floor(Math.random() * (enemyMax - enemyMin)) + enemyMin;
     
    enemy.src = `src/imgs/${img}.png`;
    enemy.style.position = 'absolute';
    enemy.style.top = '-50px';
    enemy.style.left = `${left}px`;
    enemy.style.width = '60px';
    enemy.style.height = '66px';
    enemy.style.border = 'none';
    enemy.style.backgroundColor = `${color}`
  
    let pos = 0;
    let intervalId;
    
    this.animate = () => {
        intervalId = setInterval(() => {
            if(pos >= 550) {
                pos = -50;
                let left = Math.floor(Math.random() * (enemyMax - enemyMin)) + enemyMin;
                if(left > enemyMax) left -= marioWidth * 2;
                if(left < enemyMin) left += marioWidth * 2;
                enemy.style.left = `${left}px`;
            } 
            else {
                pos += vel;        
                enemy.style.top = `${pos}px`;
            };
        }, 10)           
    };
    console.log('Mario moveMin: ', moveMin, 'Mario moveMax: ', moveMax, 
        'Enemy moveMin: ', enemyMin, 'Enemy moveMax: ', enemyMax)

    this.stop = () => clearInterval(intervalId);

    gameArea.area.appendChild(enemy);
};

const goomba = new Enemies(gameArea, 'goomba', 1.2, 'chocolate');
const koopa = new Enemies(gameArea, 'koopa', 1.6, 'forestgreen');
const boo = new Enemies(gameArea, 'boo', 2, 'ghostwhite');

goomba.animate();
koopa.animate();
boo.animate();

function Score() {
    this.score = document.createElement('span');
    const score = this.score;
    score.style.position = 'absolute';
    score.style.color = 'yellow';
    score.style.fontSize = '20px'
    score.style.top = '10px';
    score.style.right = '50px'
    score.innerHTML = 0;

    this.increase = () => {
        let pos = 0;
        intervalId = setInterval(() => {
            pos++
            score.innerHTML = `Score: ${pos}`;
        }, 1000);
    };
    
    this.stop = () => clearInterval(intervalId);

    document.body.appendChild(score);
};

const score = new Score();
score.increase();

function collision(elementA, elementB) {
    const a = elementA.getBoundingClientRect(),
          b = elementB.getBoundingClientRect();
    
    const horizontal = a.left < b.right 
        && b.left < a.right;
    const vertical = a.top < b.bottom 
        && b.top < a.bottom;
    return horizontal && vertical;
};

const checkCollision = setInterval(() => {
    if(collision(mario.mario, goomba.enemy) ||
       collision(mario.mario, koopa.enemy) ||
       collision(mario.mario, boo.enemy)){

        line.stop();
        goomba.stop();
        koopa.stop();
        boo.stop();
        mario.stop();
        score.stop();
        audioPagina2.pause();
        dead.play();
        gameON = false;
        clearInterval(checkCollision);
        
        setInterval(() => {
            location.reload();
        }, 2900);
       };
}, 50);

function mediaQuery(media800, media600, media450) {
    if(media800.matches) {

        rightRoad.road.style.background = 'none';
        leftRoad.road.style.background = 'none';

        moveMin = 0;
        moveMax = gameArea.area.clientWidth - mario.mario.offsetWidth;

        enemyMin = 0;
        enemyMax = gameArea.area.clientWidth - mario.mario.offsetWidth;     
    } 
    else if(media600.matches) {
        mario.mario.style.width = '53px';
        mario.mario.style.height = '58px';

        goomba.enemy.style.width = '53px';
        goomba.enemy.style.height = '58px';
        koopa.enemy.style.width = '53px';
        koopa.enemy.style.height = '58px';
        boo.enemy.style.width = '53px';
        boo.enemy.style.height = '58px';
    } 
    else if(media450.matches) {
        mario.mario.style.width = '38px';
        mario.mario.style.height = '43px';

        goomba.enemy.style.width = '38px';
        goomba.enemy.style.height = '43px';
        koopa.enemy.style.width = '38px';
        koopa.enemy.style.height = '43px';
        boo.enemy.style.width = '38px';
        boo.enemy.style.height = '43px';
    } 
    else {
        mario.mario.style.width = '60px';
        mario.mario.style.height = '66px';

        goomba.enemy.style.width = '60px';
        goomba.enemy.style.height = '66px';
        koopa.enemy.style.width = '60px';
        koopa.enemy.style.height = '66px';
        boo.enemy.style.width = '60px';
        boo.enemy.style.height = '66px';

        rightRoad.road.style.background = 'url(src/imgs/mario-background1.webp) no-repeat';
        leftRoad.road.style.background = 'url(src/imgs/mario-background2.png) no-repeat';
        rightRoad.road.style.backgroundSize = '100% 500px';
        leftRoad.road.style.backgroundSize = '100% 500px';

        moveMin = roadWidth;
        moveMax = roadWidth * 2.7;
    }
}

const media800 = window.matchMedia("(max-width: 800px)");
const media600 = window.matchMedia("(max-width: 600px)");
const media450 = window.matchMedia("(max-width: 450px)")


window.addEventListener('load', () => {
    mediaQuery(media800, media600, media450);
});

mediaQuery(media800, media600, media450);



media.addEventListener('change', () => {
    mediaQuery(media800, media600, media450);
});



