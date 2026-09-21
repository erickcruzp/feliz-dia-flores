const nombreChica = "Azul"; 
document.getElementById('nombre').textContent = nombreChica;

const datosImagenesBase = [
    { src: 'ama.jpg', frase: 'Te amo más de lo que imaginas.' },
    { src: 'amarillo.jpg', frase: 'El amarillo me recuerda a tu sonrisa.' },
    { src: 'feliz.jpg', frase: 'Me haces muy feliz, Azul.' },
    { src: 'flor.jpg', frase: 'Eres la flor más hermosa de mi jardín.' },
    { src: 'griarol.jpg', frase: 'Como un girasol, siempre busco tu luz.' },
    { src: 'qui.jpg', frase: 'Te quiero con todo mi corazón.' },
    { src: 'ro.jpg', frase: 'Eres mi persona favorita.' },
    { src: 'ros.jpg', frase: 'Cada rosa es un te quiero.' },
    { src: 'te.jpg', frase: 'Te dedico este universo entero.' }
];

const datosImagenes = [];
for (let i = 0; i < 3; i++) {
    datosImagenesBase.forEach(d => datosImagenes.push(d));
}

const frasesSuelo = [
    "MI FLOR AMARILLA",
    "BRILLAS TANTO",
    "MI UNIVERSO",
    "TE AMO AZUL",
    "ERES MI LUZ",
    "MI PERSONA FAVORITA",
    "SIEMPRE TÚ",
    "MI GIRASOL",
    "MI LUGAR SEGURO",
    "ERES PERFECTA",
    "FELIZ DÍA"
];

const pantallaInicio = document.getElementById('pantalla-inicio');
const universo = document.getElementById('universo');
const nucleoCentral = document.getElementById('nucleo-central');
const florEstrellas = document.getElementById('flor-estrellas');
const boton = document.getElementById('boton');
const objetos3d = document.getElementById('objetos-3d');
const fraseFlotante = document.getElementById('frase-flotante');
const particulasContainer = document.getElementById('particulas');
const fugacesContainer = document.getElementById('fugaces');
const musica = document.getElementById('musica-fondo');
const botonMusica = document.getElementById('boton-musica');

let camaraX = 0;
let camaraY = 0;
let objetivoX = 0;
let objetivoY = 0;
let velocidadX = 0;
let velocidadY = 0;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let escalaGlobal = 1;

const objetos = [];

function calcularEscala() {
    const ancho = window.innerWidth;
    if (ancho < 600) escalaGlobal = 0.6;
    else if (ancho < 900) escalaGlobal = 0.8;
    else if (ancho < 1400) escalaGlobal = 1;
    else escalaGlobal = 1.2;
}
calcularEscala();
window.addEventListener('resize', calcularEscala);

boton.addEventListener('click', () => {
    pantallaInicio.classList.add('oculto');
    universo.classList.remove('oculto');
    nucleoCentral.classList.remove('oculto');
    florEstrellas.classList.remove('oculto');
    document.getElementById('flor-izquierda').classList.remove('oculto');
    document.getElementById('flor-derecha').classList.remove('oculto');
    document.getElementById('ramo-flores-izq').classList.remove('oculto');
    document.getElementById('ramo-flores-der').classList.remove('oculto');
    
    musica.currentTime = 35;
    musica.volume = 0.5;
    musica.play().catch(error => console.log('Error al reproducir audio:', error));
    
    crearEstrellasFijas();
    crearFlorEstrellas();
    crearFlorSilueta('flor-izquierda', 'loto');
    crearFlorSilueta('flor-derecha', 'cinco');
    crearCorazonParticulas();
    crearCorazonEsquina('ramo-flores-izq');
    crearCorazonEsquina('ramo-flores-der');
    crearUniverso();
    crearParticulas();
    crearFugaces();
    animar();
});

botonMusica.addEventListener('click', () => {
    if (musica.paused) {
        musica.play();
        botonMusica.textContent = '🔊';
    } else {
        musica.pause();
        botonMusica.textContent = '🔇';
    }
});

function crearEstrellasFijas() {
    const contenedor = document.getElementById('estrellas-fijas');
    contenedor.innerHTML = '';
    const cantidad = window.innerWidth < 600 ? 350 : 700;
    for (let i = 0; i < cantidad; i++) {
        const estrella = document.createElement('div');
        estrella.classList.add('estrella-fija');
        const tamano = 1 + Math.random() * 3;
        estrella.style.width = tamano + 'px';
        estrella.style.height = tamano + 'px';
        estrella.style.left = Math.random() * 100 + '%';
        estrella.style.top = Math.random() * 100 + '%';
        estrella.style.animationDelay = Math.random() * 4 + 's';
        estrella.style.animationDuration = (2 + Math.random() * 4) + 's';
        const tipo = Math.random();
        if (tipo > 0.8) {
            estrella.style.background = '#ffd700';
            estrella.style.boxShadow = '0 0 8px #ffd700, 0 0 16px #ffb300';
        } else if (tipo > 0.5) {
            estrella.style.background = '#fff8cc';
            estrella.style.boxShadow = '0 0 6px #fff8cc, 0 0 12px #ffd700';
        } else {
            estrella.style.background = '#fff';
            estrella.style.boxShadow = '0 0 4px #fff, 0 0 8px #ffd700';
        }
        contenedor.appendChild(estrella);
    }
}

function crearFlorEstrellas() {
    const contenedor = florEstrellas;
    contenedor.innerHTML = '';
    const petalos = 8;
    const puntosPorPetalo = 40;
    const escala = 5.0 * escalaGlobal;
    for (let p = 0; p < petalos; p++) {
        const anguloPetalo = (p / petalos) * Math.PI * 2;
        for (let i = 0; i < puntosPorPetalo; i++) {
            const t = i / puntosPorPetalo;
            const distancia = t * escala * 8;
            const ancho = Math.sin(t * Math.PI) * 15;
            const x = Math.cos(anguloPetalo) * distancia + (Math.random() - 0.5) * ancho;
            const y = Math.sin(anguloPetalo) * distancia + (Math.random() - 0.5) * ancho;
            const estrella = document.createElement('div');
            estrella.classList.add('estrella-flor');
            const tamano = 2 + Math.random() * 3;
            estrella.style.width = tamano + 'px';
            estrella.style.height = tamano + 'px';
            estrella.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            estrella.style.animationDelay = (Math.random() * 2) + 's';
            if (Math.random() > 0.5) {
                estrella.style.background = '#ffd700';
                estrella.style.boxShadow = '0 0 8px #ffd700, 0 0 16px #ffb300';
            }
            contenedor.appendChild(estrella);
        }
    }
    for (let i = 0; i < 50; i++) {
        const angulo = Math.random() * Math.PI * 2;
        const radio = Math.random() * 20 * escalaGlobal;
        const x = Math.cos(angulo) * radio;
        const y = Math.sin(angulo) * radio;
        const estrella = document.createElement('div');
        estrella.classList.add('estrella-flor');
        const tamano = 3 + Math.random() * 2;
        estrella.style.width = tamano + 'px';
        estrella.style.height = tamano + 'px';
        estrella.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        estrella.style.background = '#fff8cc';
        estrella.style.boxShadow = '0 0 10px #fff8cc, 0 0 20px #ffd700';
        contenedor.appendChild(estrella);
    }
}

function crearFlorSilueta(contenedorId, tipo) {
    const contenedor = document.getElementById(contenedorId);
    contenedor.innerHTML = '';
    const escala = 3.5 * escalaGlobal;
    if (tipo === 'loto') {
        for (let i = 0; i < 80; i++) {
            const t = i / 80;
            const angulo = t * Math.PI * 2;
            const radio = (8 + Math.abs(Math.sin(angulo * 3)) * 12) * escala;
            const x = Math.cos(angulo) * radio;
            const y = Math.sin(angulo) * radio;
            const punto = document.createElement('div');
            punto.classList.add('punto-flor-silueta');
            const tamano = (3 + Math.random() * 2) * escalaGlobal;
            punto.style.width = tamano + 'px';
            punto.style.height = tamano + 'px';
            punto.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            contenedor.appendChild(punto);
        }
    } else {
        for (let p = 0; p < 5; p++) {
            const anguloPetalo = (p / 5) * Math.PI * 2 - Math.PI / 2;
            for (let i = 0; i < 40; i++) {
                const t = i / 40;
                const dist = t * 35 * escala;
                const ancho = Math.sin(t * Math.PI) * 12 * escala;
                const x = Math.cos(anguloPetalo) * dist + (Math.random() - 0.5) * ancho;
                const y = Math.sin(anguloPetalo) * dist + (Math.random() - 0.5) * ancho;
                const punto = document.createElement('div');
                punto.classList.add('punto-flor-silueta');
                const tamano = (3 + Math.random() * 2) * escalaGlobal;
                punto.style.width = tamano + 'px';
                punto.style.height = tamano + 'px';
                punto.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                contenedor.appendChild(punto);
            }
        }
    }
}

function crearCorazonParticulas() {
    const contenedor = document.getElementById('corazon-particulas');
    contenedor.innerHTML = '';
    const puntos = 200;
    const escala = 6.0 * escalaGlobal;
    for (let i = 0; i < puntos; i++) {
        const t = (i / puntos) * Math.PI * 2;
        const corazonX = 16 * Math.pow(Math.sin(t), 3);
        const corazonY = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        const punto = document.createElement('div');
        punto.classList.add('punto-corazon');
        const tamano = (5 + Math.random() * 3) * escalaGlobal;
        punto.style.width = tamano + 'px';
        punto.style.height = tamano + 'px';
        const variacion = (Math.random() - 0.5) * 15;
        const pz = (Math.random() - 0.5) * 30;
        const colores = ['#ffd700', '#ffe066', '#ffb300', '#ffcc00'];
        punto.style.background = colores[Math.floor(Math.random() * colores.length)];
        punto.style.transform = `translate3d(${corazonX * escala + variacion}px, ${corazonY * escala + variacion}px, ${pz}px)`;
        contenedor.appendChild(punto);
    }
    for (let i = 0; i < 60; i++) {
        const punto = document.createElement('div');
        punto.classList.add('punto-corazon');
        const tamano = (4 + Math.random() * 3) * escalaGlobal;
        punto.style.width = tamano + 'px';
        punto.style.height = tamano + 'px';
        const angulo = Math.random() * Math.PI * 2;
        const radio = (40 + Math.random() * 50) * escalaGlobal;
        const px = Math.cos(angulo) * radio;
        const py = Math.sin(angulo) * radio;
        const pz = (Math.random() - 0.5) * 40;
        punto.style.transform = `translate3d(${px}px, ${py}px, ${pz}px)`;
        contenedor.appendChild(punto);
    }
}

function crearCorazonEsquina(contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;
    contenedor.innerHTML = '';

    const corazon = document.createElement('div');
    corazon.classList.add('corazon-lleno');

    contenedor.appendChild(corazon);
}

function crearUniverso() {
    objetos3d.innerHTML = '';
    objetos.length = 0;

    const totalImagenes = datosImagenes.length;
    const radioBase = 400 * escalaGlobal;

    datosImagenes.forEach((dato, i) => {
        const phi = Math.acos(1 - 2 * (i + 0.5) / totalImagenes);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const radio = radioBase + (i % 4) * 60 * escalaGlobal;

        const x = radio * Math.sin(phi) * Math.cos(theta);
        const y = radio * Math.cos(phi) * 0.5 + 80;
        const z = radio * Math.sin(phi) * Math.sin(theta);

        const contenedor = document.createElement('div');
        contenedor.classList.add('objeto-3d');

        const img = document.createElement('img');
        img.src = dato.src;
        img.classList.add('imagen-3d');
        
        img.addEventListener('mouseenter', () => mostrarFrase(dato.frase));
        img.addEventListener('mouseleave', ocultarFrase);
        img.addEventListener('click', () => mostrarFrase(dato.frase));
        img.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            mostrarFrase(dato.frase);
        });

        contenedor.appendChild(img);
        objetos3d.appendChild(contenedor);

        objetos.push({ elemento: contenedor, x: x, y: y, z: z });
    });

    for (let i = 0; i < 50; i++) {
        const emojisFlores = ['🌻', '🌼', '💛', '✨', '🌻', '🌺', '🌸', '🌻'];
        const contenedor = document.createElement('div');
        contenedor.classList.add('objeto-3d');

        const flor = document.createElement('div');
        flor.classList.add('flor-3d');
        flor.textContent = emojisFlores[Math.floor(Math.random() * emojisFlores.length)];

        contenedor.appendChild(flor);
        objetos3d.appendChild(contenedor);

        const angulo = Math.random() * Math.PI * 2;
        const radio = (200 + Math.random() * 700) * escalaGlobal;
        const x = Math.cos(angulo) * radio;
        const z = Math.sin(angulo) * radio;
        const y = (Math.random() - 0.3) * 100 + 50;

        objetos.push({ elemento: contenedor, x: x, y: y, z: z });
    }

    for (let i = 0; i < 25; i++) {
        const contenedor = document.createElement('div');
        contenedor.classList.add('objeto-3d');

        const texto = document.createElement('div');
        texto.classList.add('texto-3d');
        texto.textContent = frasesSuelo[Math.floor(Math.random() * frasesSuelo.length)];

        contenedor.appendChild(texto);
        objetos3d.appendChild(contenedor);

        const angulo = Math.random() * Math.PI * 2;
        const radio = (250 + Math.random() * 600) * escalaGlobal;
        const x = Math.cos(angulo) * radio;
        const z = Math.sin(angulo) * radio;
        const y = (Math.random() - 0.4) * 60 + 30;

        objetos.push({ elemento: contenedor, x: x, y: y, z: z });
    }
}

function crearParticulas() {
    const cantidad = window.innerWidth < 600 ? 120 : 200;
    for (let i = 0; i < cantidad; i++) {
        const p = document.createElement('div');
        p.classList.add('particula');
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animationDuration = (6 + Math.random() * 8) + 's';
        p.style.animationDelay = Math.random() * 10 + 's';
        const size = 2 + Math.random() * 2;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        particulasContainer.appendChild(p);
    }
}

function crearFugaces() {
    setInterval(() => {
        if (document.hidden) return;
        const f = document.createElement('div');
        f.classList.add('fugaz');
        f.style.left = Math.random() * 50 + '%';
        f.style.top = Math.random() * 30 + '%';
        fugacesContainer.appendChild(f);
        setTimeout(() => f.remove(), 3000);
    }, 8000);
}

function mostrarFrase(texto) {
    fraseFlotante.textContent = texto;
    fraseFlotante.classList.add('visible');
}

function ocultarFrase() {
    fraseFlotante.classList.remove('visible');
}

universo.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
    velocidadX = 0;
    velocidadY = 0;
});

universo.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;
    velocidadY = deltaX * 0.4;
    velocidadX = -deltaY * 0.2;
    objetivoY += velocidadY;
    objetivoX += velocidadX;
    objetivoX = Math.max(-30, Math.min(30, objetivoX));
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

universo.addEventListener('mouseup', () => {
    isDragging = false;
});
universo.addEventListener('mouseleave', () => {
    isDragging = false;
});

universo.addEventListener('touchstart', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    velocidadX = 0;
    velocidadY = 0;
}, { passive: true });

universo.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const deltaX = e.touches[0].clientX - previousMousePosition.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.y;
    velocidadY = deltaX * 0.4;
    velocidadX = -deltaY * 0.2;
    objetivoY += velocidadY;
    objetivoX += velocidadX;
    objetivoX = Math.max(-30, Math.min(30, objetivoX));
    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: false });

universo.addEventListener('touchend', () => {
    isDragging = false;
});

function animar() {
    if (!isDragging) {
        objetivoY += 0.08;
        objetivoY += velocidadY;
        objetivoX += velocidadX;
        velocidadY *= 0.94;
        velocidadX *= 0.94;
        if (Math.abs(velocidadY) < 0.01) velocidadY = 0;
        if (Math.abs(velocidadX) < 0.01) velocidadX = 0;
        objetivoX = Math.max(-30, Math.min(30, objetivoX));
    }

    camaraY += (objetivoY - camaraY) * 0.08;
    camaraX += (objetivoX - camaraX) * 0.08;

    const radY = camaraY * Math.PI / 180;
    const radX = camaraX * Math.PI / 180;
    const cosY = Math.cos(radY);
    const sinY = Math.sin(radY);
    const cosX = Math.cos(radX);
    const sinX = Math.sin(radX);

    objetos.forEach(obj => {
        let x = obj.x;
        let y = obj.y;
        let z = obj.z;

        const xTemp = x * cosY + z * sinY;
        const zTemp = -x * sinY + z * cosY;
        x = xTemp;
        z = zTemp;

        const yTemp = y * cosX - z * sinX;
        const zTemp2 = y * sinX + z * cosX;
        y = yTemp;
        z = zTemp2;

        const distancia = Math.sqrt(x*x + y*y + z*z);
        const radioBase = 400 * escalaGlobal;
        const escala = Math.max(0.5, Math.min(1.5, 1 + (radioBase - distancia) / (1500 * escalaGlobal)));
        const opacidad = Math.max(0.4, Math.min(1, 1 - (distancia - radioBase) / (1500 * escalaGlobal)));

        obj.elemento.style.transform = `translate3d(${x}px, ${y}px, ${z}px) scale(${escala})`;
        obj.elemento.style.opacity = opacidad;
    });

    requestAnimationFrame(animar);
}