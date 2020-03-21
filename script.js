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
}

function pausarTempo() {
    clearInterval(timer);
    iniciar.removeAttribute('disabled')
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
    if (h < 10)
        $("#horas").innerHTML = "0" + h;
    else
        $("#horas").innerHTML = h;
    if (s < 10)
        $("#segundos").innerHTML = "0" + s;
    else
        $("#segundos").innerHTML = s;
    if (m < 10)
        $("#minutos").innerHTML = "0" + m;
    else
        $("#minutos").innerHTML = m;
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

// ativa modo light:
const botao = $('.liga-desliga__botao');
function mudarCor() {
    document.body.classList.toggle('light');
    $$('button').forEach(butao => butao.classList.toggle('light'));
    $$('button').forEach(butao => butao.classList.toggle('lightBorder'));
    $$('#voltas div, .contador, h3, #salvarTarefa').forEach(borda => borda.classList.toggle('lightBorderTop'));
    $$('#ponto').forEach(item => item.classList.toggle('lightPonto'));
    $('.cronometro').classList.toggle('lightBorderCronometro');
    $('#voltas').classList.toggle('barra');
}
botao.addEventListener('click', mudarCor);

// salva modo light localStorage:
$('#mudar-cor').addEventListener('click', save);
function save() {
    const checkbox = $('#mudar-cor');
    localStorage.setItem("checkbox1", checkbox.checked);
}

const checado = JSON.parse(localStorage.getItem("checkbox1"));
$('#mudar-cor').checked = checado;

if (!!checado) {
    mudarCor();
}

// salvar time e voltas no localStorage:
pausar.addEventListener('click', salvarTempo);
function salvarTempo() {
    localStorage.setItem('segundos', segundos.innerText);
    localStorage.setItem('minutos', minutos.innerText);
    localStorage.setItem('horas', horas.innerText);
}

guardarVoltas.addEventListener('click', salvarVoltas);
botao.addEventListener('click', salvarVoltas);
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
    if (localStorage.getItem('segundos') < 10) {
        s = +localStorage.getItem('segundos');
        $('#segundos').innerText = '0' + s;
    } else {
        s = +localStorage.getItem('segundos');
        $('#segundos').innerText = s;
    }

    if (localStorage.getItem('minutos') < 10) {
        m = +localStorage.getItem('minutos');
        $('#minutos').innerText = '0' + m;
    } else {
        m = +localStorage.getItem('minutos');
        $('#minutos').innerText = m;
    }

    if (localStorage.getItem('horas') < 10) {
        h = +localStorage.getItem('horas');
        $('#horas').innerText = '0' + h;
    } else {
        h = +localStorage.getItem('horas');
        $('#horas').innerText = h;
    }

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

    // complemento cor modo light:
    if ($('.light')) {
        $$('.numeroVolta, span, .contadorVoltas, .tituloDaTarefa, .timerDaTarefa').forEach(contador => contador.classList.add('lightBorderTop'));

        $$('#modal button, #modalTarefas button').forEach(item => item.classList.add('lightBorderModal'));
        $$('h2').forEach(item => item.classList.add('lightBorderTop'));

        $('#modal').classList.add('lightModaBackground');
        $('#modalTarefas').classList.add('lightModaBackground');
        $('#input').style.boxShadow = 'none';
    } else {
        $$('span').forEach(contador => contador.classList.remove('lightBorderTop'));
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

