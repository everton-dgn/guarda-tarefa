const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const appEvents = {
    down: 'ontouchstart' in window ? 'touchstart' : 'click',
    /*  move: 'ontouchmove' in window ? 'touchmove' : 'mousemove',
     up: 'ontouchend' in window ? 'touchend' : 'mouseup' */
}

// botões:
const iniciar = $('#iniciar');
const pausar = $('#pausar');
const resetar = $('#resetar');
const guardarVoltas = $('#guardarVoltas');
const salvar = $('#salvar');

// cronômetro:
const segundos = $('#segundos');
const minutos = $('#minutos');
const horas = $('#horas');
const voltas = $('#voltas');
const salvarTarefa = $('#salvarTarefa');

iniciar.addEventListener(appEvents.down, iniciarTempo);
pausar.addEventListener(appEvents.down, pausarTempo);
resetar.addEventListener(appEvents.down, resetarTempo);
guardarVoltas.addEventListener(appEvents.down, volta);

let s = 1;
let m = 0;
let h = 0;
let timer;

function iniciarTempo() {
    timer = setInterval(cronometro, 1000);
    iniciar.setAttribute('disabled', '');
    $('div.cronometro').classList.remove('pulsar');
}

function pausarTempo() {
    clearInterval(timer);
    iniciar.removeAttribute('disabled');
    $('div.cronometro').classList.toggle('pulsar');
}

function resetarTempo() {
    pausarTempo();
    segundos.innerText = '00';
    minutos.innerText = '00';
    horas.innerText = '00';
    s = 0;
    m = 0;
    h = 0;
}

function cronometro() {
    s++;
    if (s == 60) {
        m++;
        s = 0;
    }
    if (m == 60) {
        h++;
        s = 0;
        m = 0;
    }
    h < 10 ? $("#horas").innerHTML = "0" + h : $("#horas").innerHTML = h;
    s < 10 ? $("#segundos").innerHTML = "0" + s : $("#segundos").innerHTML = s;
    m < 10 ? $("#minutos").innerHTML = "0" + m : $("#minutos").innerHTML = m;
    if (h == 99) pausarTempo();
}

function volta() {
    // cria registro das voltas no html:
    voltas.innerHTML += "<div class='contarVolta'><span class='numeroVolta'></span>" + horas.firstChild.data + "<span>h </span>" + minutos.firstChild.data + "<span>m </span>" + segundos.firstChild.data + "<span>s</span></div>";

    // adiciona total de voltas no html:
    $('.contadorVoltas').innerText = $$('.contarVolta').length;

    // adiciona número corresppondente à volta:
    $$('span.numeroVolta').forEach((item, index) => item.innerText = index + 1);
}

// limpa as voltas com duplo click
let touchtime = 0;
resetar.addEventListener("click", () => {
    if (touchtime == 0) {
        touchtime = new Date().getTime();
    } else {
        if (((new Date().getTime()) - touchtime) < 800) {
            voltas.innerHTML = "";
            touchtime = 0;
            localStorage.removeItem('voltas');

            // zera total de voltas no html:
            $('.contadorVoltas').innerText = 0;
        } else {
            touchtime = new Date().getTime();
        }
    }
});

// salvar time e voltas no localStorage:
pausar.addEventListener(appEvents.down, salvarTempo);

function salvarTempo() {
    localStorage.setItem('segundos', segundos.innerText);
    localStorage.setItem('minutos', minutos.innerText);
    localStorage.setItem('horas', horas.innerText);
}

guardarVoltas.addEventListener(appEvents.down, salvarVoltas);

function salvarVoltas() {
    localStorage.setItem('voltas', voltas.innerHTML);
}

resetar.addEventListener(appEvents.down, apagarTempo);

function apagarTempo() {
    localStorage.removeItem('segundos');
    localStorage.removeItem('minutos');
    localStorage.removeItem('horas');
}

window.onload = function () {

    // retorna e trata o tempo armazenado no localStorage para escrevê-lo no cronômetro:
    function getLocalStorageTime(unit) {

        const time = +localStorage.getItem(unit);

        $('#' + unit).innerText = time < 10 ? '0' + time : time;

        return time;
    }

    s = getLocalStorageTime('segundos');
    m = getLocalStorageTime('minutos');
    h = getLocalStorageTime('horas');

    $('#voltas').innerHTML = localStorage.getItem('voltas');

    // recebe, filtra e exibe as tarefas do localStorage na tela:
    let keys = [];
    for (let i = 0, len = localStorage.length; i < len; ++i) {
        keys.push(localStorage.key(i));
    }
    let filtered_keys = keys.filter(value => value.startsWith("#")).sort();

    filtered_keys.forEach((item) => {
        salvarTarefa.innerHTML += localStorage.getItem(item);
    });

    // contador de tarefas
    $('span.contador').innerText = filtered_keys.length;

    // contador de voltas
    $('span.contadorVoltas').innerText = $$('.contarVolta').length;

    let teste;
    for (teste = 0; teste < $$('.contarVolta').length; teste++) {
        $$('.numeroVolta')[teste].innerText = teste + 1;
    }

    // abre modal com opções para tarefas registradas:
    $$('#salvarTarefa > div').forEach(item => item.addEventListener(appEvents.down, modalTarefas));

    function modalTarefas() {
        $$('.tarefa').forEach(() => this.classList.add('excluirTarefa'));

        $('#containerModalTarefas').classList.add('mostrar');
        $('#modalTarefas').classList.add('animarModal');

        // insere nome da tarefa no seu modal de opções:
        $('[data-nome-tarefa]').innerHTML = $('div.tarefa.excluirTarefa div.tituloDaTarefa').innerText;
    }
};

// abre modal para salvar o nome da tarefa e cancela:
const containerModal = $('#containerModal');
const botaoCancelarModal = $('#cancelar');

salvar.addEventListener(appEvents.down, modalCancelar);
botaoCancelarModal.addEventListener(appEvents.down, modalCancelar);

function modalCancelar(e) {
    e.preventDefault();
    containerModal.classList.toggle('mostrar');
    $('#modal').classList.toggle('animarModal');
    $('#input').value = '';
    $('#input').focus();
    $('#ok').removeAttribute('disabled');
}

// Botão de guardar tarefa: grava o nome e tempo da tarefa no html e no localStorage:
const tarefaSalva = () => {
    return salvarTarefa.innerHTML = '<div class="tarefa"><div class="tituloDaTarefa">' + nomeDaTarefa.value + '</div>' + '<div class="timerDaTarefa">' + horas.firstChild.data + '<span>h </span>' + minutos.firstChild.data + '<span>m </span>' + segundos.firstChild.data + '<span>s</span>' + '</div></div>';
}

const form = $('form');
const nomeDaTarefa = $('#input');

form.addEventListener('submit', modalSalvar);

function modalSalvar(e) {
    e.preventDefault();
    localStorage.setItem('#' + nomeDaTarefa.value, tarefaSalva());
    $('#ok').setAttribute('disabled', '');

    // no lugar do reload:
    containerModal.classList.toggle('mostrar');
    $('#modal').classList.toggle('animarModal');

    // exibe número total de tarefas no html:
    let keys = [];
    for (let i = 0, len = localStorage.length; i < len; ++i) {
        keys.push(localStorage.key(i));
    }
    $('span.contador').innerText = keys.filter(value => value.startsWith("#")).length;

    // exibe a lista de tarefas no html após salvar:
    salvarTarefa.innerHTML = '';

    let keys2 = [];
    for (let i = 0, len = localStorage.length; i < len; ++i) {
        keys2.push(localStorage.key(i));
    }
    let filtered_keys2 = keys2.filter(value => value.startsWith("#")).sort();

    filtered_keys2.forEach((item) => {
        salvarTarefa.innerHTML += localStorage.getItem(item);
    });

    // abre modal com opções para tarefas registradas:
    $$('#salvarTarefa > div').forEach(item => item.addEventListener(appEvents.down, modalTarefas));

    function modalTarefas() {
        $$('.tarefa').forEach(() => this.classList.add('excluirTarefa'));

        $('#containerModalTarefas').classList.add('mostrar');
        $('#modalTarefas').classList.add('animarModal');

        // insere nome da tarefa no seu modal de opções:
        $('[data-nome-tarefa]').innerHTML = $('div.tarefa.excluirTarefa div.tituloDaTarefa').innerText;
    }

}

// botões do modal da lista de tarefas:
// cancelar
const containerModalTarefas = $('#containerModalTarefas');

$('#cancelar2').addEventListener(appEvents.down, cancelarModalTarefas);

function cancelarModalTarefas() {
    containerModalTarefas.classList.toggle('mostrar');
    $('#modalTarefas').classList.toggle('animarModal');

    // limpa a classe .excluirTarefa pra evitar conflitos:
    $$('div#salvarTarefa div.tarefa.excluirTarefa').forEach(item => item.classList.remove('excluirTarefa'));
}

// apagar
$('#apagarTarefa').addEventListener(appEvents.down, apagarModalTarefas);

function apagarModalTarefas() {
    $$('div.tarefa.excluirTarefa').forEach(item => item.classList.add('ocultar'));

    containerModalTarefas.classList.toggle('mostrar');
    $('#modalTarefas').classList.toggle('animarModal');

    $$('div.tarefa.excluirTarefa div.tituloDaTarefa').forEach(item => localStorage.removeItem("#" + item.innerText));

    // exibe número de tarefas total no html após exclusão:
    $('span.contador').innerText = $$('div.tarefa').length - $$('div.tarefa.excluirTarefa.ocultar').length;
}

// continuar
$('#continuarTarefa').addEventListener(appEvents.down, continuarTempoTarefas);

function continuarTempoTarefas() {
    const continuarCronometro = $('.tarefa.excluirTarefa .timerDaTarefa').innerText.replace('h', '').replace('m', '').replace('s', '').split(' ');
    const continuarHora = continuarCronometro[0];
    const continuarMinuto = continuarCronometro[1];
    const continuarSegundo = continuarCronometro[2];

    $('#horas').innerText = continuarHora;
    $('#minutos').innerText = continuarMinuto;
    $('#segundos').innerText = continuarSegundo;

    $('#containerModalTarefas').classList.remove('mostrar');

    s = +continuarSegundo;
    m = +continuarMinuto;
    h = +continuarHora;

    // limpa a classe .excluirTarefa pra evitar conflitos:
    $$('div#salvarTarefa div.tarefa.excluirTarefa').forEach(item => item.classList.remove('excluirTarefa'));

    // pausa cronômetro caso precise:
    clearInterval(timer);
    iniciar.removeAttribute('disabled')
    $('div.cronometro').classList.toggle('pulsar');
}

// ================== THEMAS =================== //

// Mudar tema e gravar em localStorage:
$('[data-tema] span').addEventListener(appEvents.down, dropdown);

function dropdown() {
    $('[data-tema] ul').classList.toggle('ocultar2');
}

$('[data-dark1]').addEventListener(appEvents.down, () => mudarTema('css/themes/Dark1.css'));
$('[data-dark2]').addEventListener(appEvents.down, () => mudarTema('css/themes/Dark2.css'));
$('[data-dark3]').addEventListener(appEvents.down, () => mudarTema('css/themes/Dark3.css'));
$('[data-dark4]').addEventListener(appEvents.down, () => mudarTema('css/themes/Dark4.css'));
$('[data-dark5]').addEventListener(appEvents.down, () => mudarTema('css/themes/Dark5.css'));
$('[data-light1]').addEventListener(appEvents.down, () => mudarTema('css/themes/Light1.css'));
$('[data-light2]').addEventListener(appEvents.down, () => mudarTema('css/themes/Light2.css'));
$('[data-light3]').addEventListener(appEvents.down, () => mudarTema('css/themes/Light3.css'));
$('[data-light4]').addEventListener(appEvents.down, () => mudarTema('css/themes/Light4.css'));
$('[data-light5]').addEventListener(appEvents.down, () => mudarTema('css/themes/Light5.css'));

function mudarTema(tema) {
    localStorage.setItem('temaEscolhido', tema);

    $('#temadefault').setAttribute('href', tema);

    $('[data-tema] span').innerHTML = tema.replace('.css', '').replace('css', '').replace('/', '').replace('themes/', '');
}

if (localStorage.getItem('temaEscolhido') === null) {
    let estilo = document.createElement("link");
    estilo.id = 'temadefault';
    estilo.href = 'css/themes/Dark1.css';
    estilo.rel = "stylesheet";
    document.head.appendChild(estilo);

    $('[data-tema] span').innerHTML = 'Dark1';
} else {
    let estilo = document.createElement("link");
    estilo.href = localStorage.getItem('temaEscolhido');
    estilo.rel = "stylesheet";
    estilo.id = 'temadefault';
    document.head.appendChild(estilo);

    $('[data-tema] span').innerHTML = localStorage.getItem('temaEscolhido').replace('.css', '').replace('css', '').replace('/', '').replace('themes/', '');
    $('#temadefault').setAttribute('href', localStorage.getItem('temaEscolhido'));
}

// deixa página visível apenas depois de tudo carregado
document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        setTimeout(function () {
            document.body.style.visibility = "visible"
        }, 100);
    }
}

// fecha menu dropdown de temas ao clicar fora dele no mobile:
const foraMenu = $('div.container');
const body = $('body');
const nav = $('nav');

if ($('[data-tema]') && foraMenu && body) {

    foraMenu.addEventListener(appEvents.down, clickForaModal);
    body.addEventListener(appEvents.down, clickForaModal);
    nav.addEventListener(appEvents.down, clickForaModal);

    // fecha menu:
    function toggleModal() {
        $('[data-tema] ul').classList.remove('ocultar2');
    }

    // clique fora do menu:
    function clickForaModal(e) {
        if (e.target === this)
            toggleModal();
    }

}

// CONFIGURAÇÕES PWA //
// sw.js //
navigator.serviceWorker && !location.href.includes('localhost') && navigator.serviceWorker.register('/sw.js');

// notificações //
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Impedir que o mini-infobar apareça no celular
    e.preventDefault();
    // Armazena o evento para que possa ser acionado mais tarde.
    deferredPrompt = e;
    // Atualizar a interface e notifica o usuário de que pode instalar o PWA
    $('#installApp').style.display = 'flex';
});

$('#installApp').addEventListener('click', (e) => {
    // Ocultar a opção de instalação fornecida pelo aplicativo
    $('#installApp').remove();
    // Mostra o prompt de instalação
    deferredPrompt.prompt();
    // Aguarde o usuário responder ao prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('Você aceitou a instalação do App');
        } else {
            console.log('Infelizmente você não aceitou a instalação do App, pressione "ctrl + F5" e tente novamente');
        }
    });
});

window.addEventListener('appinstalled', (evt) => {
    // Instalação do log no analytics
   console.log('App instalado com sucesso! Executa o ícone criado na área de trabalho para uma experiência de uso melhor.');
  });