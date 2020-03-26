// Mudar tema e gravar em localStorage:
export default function themes() {

    const appEvents = {
        down: 'ontouchstart' in window ? 'touchstart' : 'click',
        /*  move: 'ontouchmove' in window ? 'touchmove' : 'mousemove',
         up: 'ontouchend' in window ? 'touchend' : 'mouseup' */
    }

    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

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

        $('[data-tema] span').innerHTML = tema.replace('.css', '').replace('css', '').replace('/', '').replace('themes', '');
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
        estilo.id = 'temadefault';
        estilo.href = localStorage.getItem('temaEscolhido');
        estilo.rel = "stylesheet";
        document.head.appendChild(estilo);

        $('[data-tema] span').innerHTML = localStorage.getItem('temaEscolhido').replace('.css', '').replace('css', '').replace('/', '').replace('themes', '');
        $('#temadefault').setAttribute('href', localStorage.getItem('temaEscolhido'));
    }



}