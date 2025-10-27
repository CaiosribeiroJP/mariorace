document.body.style.background = 'url(src/imgs/body-background1.jpg) no-repeat';
document.body.style.backgroundSize = '100% 100vh';
document.body.style.overflow = 'hidden';

const universal = document.querySelectorAll('*');
universal.forEach(el => {
    el.style.userSelect = 'none';
})

function Titulo() {
    this.titulo = document.createElement('h1');

    const titulo = this.titulo;
    titulo.innerHTML = 'Mario Race';
    titulo.style.color = 'red';
    titulo.style.justifySelf = 'center';

    document.body.appendChild(titulo);
}
let titulo = new Titulo();

let main = document.createElement('main');
document.body.appendChild(main);

function Area(main) {
    this.area = document.createElement('section');

    const area = this.area;
    area.style.position = 'relative';
    area.style.justifySelf = 'center';
    area.style.width = '70%';
    area.style.height = '500px';
    area.style.background = 'url(src/imgs/mario-inicial.jpg) no-repeat';
    area.style.backgroundSize = '100% 500px';
    area.style.border = '10px solid';
    area.style.borderColor = 'blue red';
    area.style.overflow = 'hidden';

    main.appendChild(area);
}
let area = new Area(main);

function Button(area) { 
    this.buttonStart = document.createElement('button');
    
    const buttonStart = this.buttonStart;
    buttonStart.innerHTML = 'Start';
    buttonStart.style.fontSize = '30px';
    buttonStart.style.position = 'relative';
    buttonStart.style.cursor = 'pointer';
    buttonStart.style.top = '70%';
    buttonStart.style.left = '35%';
    buttonStart.style.height = '100px';
    buttonStart.style.width = '25%';
    buttonStart.style.justifySelf = 'center';
    buttonStart.style.border = '5px solid transparent';
    buttonStart.style.borderRadius = '50%';
    buttonStart.style.backgroundColor = 'red';
    buttonStart.style.color = 'yellow';
    buttonStart.style.opacity = '1'; 
    
    area.area.appendChild(buttonStart);

    function action() {
        let buttonOpacity = buttonStart.style.opacity;

        setInterval(blink, 1000);

        function blink() {
            if(buttonOpacity == 0.5) buttonStart.style.opacity = 1,
            buttonOpacity = 1;
            else if(buttonOpacity == 1) buttonStart.style.opacity = 0.5,
            buttonOpacity = 0.5;
         }
        
    } action();
      
    function loadPage(url, newScriptSrc) {
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Erro: ${response.status}`);
                return response.text();
            })
            .then(html => {
                const parser = new DOMParser;
                const doc = parser.parseFromString(html, 'text/html');
                const oldBody = document.body;
                const newBody = doc.body;

                if(newBody) oldBody.replaceWith(newBody);
                else console.error('Erro: Novo body não encontrado');
                

                const oldScript = document.querySelector('script.dynamic-script');
                if(oldScript) oldScript.remove();

                const newScript = document.createElement('script');
                newScript.src = newScriptSrc;
                newScript.className = 'dynamic-script';
                newScript.onload = () => console.log(`${newScriptSrc} carregado com sucesso`);
                newScript.onerror = () => console.log(`Erro ao carregar ${newScriptSrc}`);
                document.body.appendChild(newScript);
                
            })
            .catch(error => {console.log(error)});   
    }
    
    buttonStart.addEventListener('click', () => {
        setTimeout(() => {
            (loadPage('./src/app.html', './src/js/app.js'));
        }, 2000);      
    });
    
}
const buttonStart = new Button(area);

function Audio(som) {
    this.audio = document.createElement('audio');
    const audio = this.audio;
    audio.src = `${som}`;
    audio.type = 'audio/mpeg';
    audio.preload = 'auto';
    
    this.play = () => audio.play();

    document.body.appendChild(audio);
}

const audioPagina1 = new Audio('src/audios/Wandering_the_Plains.mp3', 'true', 'true');
const start = new Audio('src/audios/sm64_mario_lets_go.mp3', 'false', 'false');

buttonStart.buttonStart.addEventListener('click', () => {
    start.play();
    audioPagina1.play();
});

function mediaQuery(media) {
    if(media.matches) {
      area.area.style.width = '95%';
      buttonStart.buttonStart.style.fontSize = '25px';
      buttonStart.buttonStart.style.width = '40%';
      buttonStart.buttonStart.style.left = '30%';
    } else {
      area.area.style.width = '70%';
      buttonStart.buttonStart.style.fontSize = '30px';
      buttonStart.buttonStart.style.width = '25%';
      buttonStart.buttonStart.style.left = '35%';
    }
}

media = window.matchMedia("(max-width: 500px)");

mediaQuery(media);

media.addEventListener('change', () => {
    mediaQuery(media);
});
