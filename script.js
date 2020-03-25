const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

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

iniciar.addEventListener('click', iniciarTempo);
pausar.addEventListener('click', pausarTempo);
resetar.addEventListener('click', resetarTempo);
guardarVoltas.addEventListener('click', volta);

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
    iniciar.removeAttribute('disabled')
    $('div.cronometro').classList.toggle('pulsar');
}

function resetarTempo() {
    pausarTempo();
    segundos.innerText = '00';
    minutos.innerText = '00';
    horas.innerText = '00';
    s = 0; m = 0; h = 0;
}

function cronometro() {
    if (s == 60) {
        m++; s = 0;
    }
    if (m == 60) {
        h++; s = 0; m = 0;
    }
    h < 10 ? $("#horas").innerHTML = "0" + h : $("#horas").innerHTML = h;
    s < 10 ? $("#segundos").innerHTML = "0" + s : $("#segundos").innerHTML = s;
    m < 10 ? $("#minutos").innerHTML = "0" + m : $("#minutos").innerHTML = m;
    if (h == 99)
        pausarTempo();
    s++;
}

function volta() {
    voltas.innerHTML += "<div class='contarVolta'><span class='numeroVolta'></span>" + horas.firstChild.data + "<span>h </span>" + minutos.firstChild.data + "<span>m </span>" + segundos.firstChild.data + "<span>s</span></div>";

    const divVolta = document.body.getAttribute('class');
    if (divVolta == 'light')
        $$('#voltas div').forEach(borda => borda.classList.add('lightBorderTop'));
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
            location.reload();
        } else {
            touchtime = new Date().getTime();
        }
    }
});

// salvar time e voltas no localStorage:
pausar.addEventListener('click', salvarTempo);
function salvarTempo() {
    localStorage.setItem('segundos', segundos.innerText);
    localStorage.setItem('minutos', minutos.innerText);
    localStorage.setItem('horas', horas.innerText);
}

guardarVoltas.addEventListener('click', salvarVoltas);
function salvarVoltas() {
    localStorage.setItem('voltas', voltas.innerHTML);
    location.reload();
}

resetar.addEventListener('click', apagarTempo);
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
    var keys = [];
    for (var i = 0, len = localStorage.length; i < len; ++i) {
        keys.push(localStorage.key(i));
    }
    var filtered_keys = keys.filter(value => value.startsWith("#")).sort();

    filtered_keys.forEach((item) => {
        $('#salvarTarefa').innerHTML += localStorage.getItem(item);
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
    $$('#salvarTarefa > div').forEach((item) => {
        item.addEventListener('click', modalTarefas);
    });

    function modalTarefas() {
        $$('.tarefa').forEach(() => {
            this.classList.add('excluirTarefa');
        });

        $('#containerModalTarefas').classList.add('mostrar');
        $('#modalTarefas').classList.add('animarModal');
    }

};

// abre modal para salvar o nome da tarefa e cancela:
const containerModal = $('#containerModal');
const botaoCancelarModal = $('#cancelar');

salvar.addEventListener('click', modalCancelar);
botaoCancelarModal.addEventListener('click', modalCancelar);
function modalCancelar(e) {
    e.preventDefault();
    containerModal.classList.toggle('mostrar');
    $('#modal').classList.toggle('animarModal');
    $('#input').value = '';
    $('#input').focus();
    $('#ok').removeAttribute('disabled');
}

// grava o nome e tempo da tarefa na div o no localStorage:
const form = $('form');
const nomeDaTarefa = $('#input');

form.addEventListener('submit', modalSalvar);

function modalSalvar(e) {
    e.preventDefault();
    localStorage.setItem('#' + nomeDaTarefa.value, tarefaSalva());
    $('#ok').setAttribute('disabled', '');
    location.reload();
}

const tarefaSalva = function () {
    return $('#salvarTarefa').innerHTML = '<div class="tarefa"><div class="tituloDaTarefa">' + nomeDaTarefa.value + '</div>' + '<div class="timerDaTarefa">' + horas.firstChild.data + '<span>h </span>' + minutos.firstChild.data + '<span>m </span>' + segundos.firstChild.data + '<span>s</span>' + '</div></div>';
}

// botões do modal da lista de tarefas:
// cancelar
$('#cancelar2').addEventListener('click', cancelarModalTarefas);

function cancelarModalTarefas() {
    location.reload();
}

// apagar
$('#apagarTarefa').addEventListener('click', apagarModalTarefas);

function apagarModalTarefas() {
    localStorage.removeItem("#" + $('.excluirTarefa .tituloDaTarefa').innerText);
    location.reload();
}

// continuar
$('#continuarTarefa').addEventListener('click', continuarTempoTarefas);

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
}

// Mudar tema e gravar em localStorage:
$('[data-dark1]').addEventListener('click', () => mudarTema('css/Dark1.css'));
$('[data-dark2]').addEventListener('click', () => mudarTema('css/Dark2.css'));
$('[data-dark3]').addEventListener('click', () => mudarTema('css/Dark3.css'));
$('[data-dark4]').addEventListener('click', () => mudarTema('css/Dark4.css'));
$('[data-dark5]').addEventListener('click', () => mudarTema('css/Dark5.css'));
$('[data-light1]').addEventListener('click', () => mudarTema('css/Light1.css'));
$('[data-light2]').addEventListener('click', () => mudarTema('css/Light2.css'));
$('[data-light3]').addEventListener('click', () => mudarTema('css/Light3.css'));
$('[data-light4]').addEventListener('click', () => mudarTema('css/Light4.css'));
$('[data-light5]').addEventListener('click', () => mudarTema('css/Light5.css'));

function mudarTema(tema) {
    localStorage.setItem('temaEscolhido', tema);

    $$("link").item(0).setAttribute('href', tema);

    $('[data-tema] span').innerHTML = tema.replace('.css', '').replace('css', '').replace('/', '');
}

if (localStorage.getItem('temaEscolhido') === null) {
    $('[data-tema] span').innerHTML = 'Dark1';
} else {
    $('[data-tema] span').innerHTML = localStorage.getItem('temaEscolhido').replace('.css', '').replace('css', '').replace('/', '');
    $$("link").item(0).setAttribute('href', localStorage.getItem('temaEscolhido'));
}