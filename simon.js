const secrets = ['A', 'X', 'E', 'S'];
const colors = ['rojo','amarillo','verde','azul'];
let combinations = {};

const SimonsCombination = function() {
  
  let playing;
  let gameCombination;
  return {
    oninit: (vnode) => {
      gameCombination = [...Array(4).keys()].map(() => colors[Math.floor(Math.random() * 4)]);
      combinations.game = gameCombination.toString();
      console.log(gameCombination);
      playing = vnode.attrs.playing;
    },
    view: (vnode) => {
      return [
        playing ? m('.ui.segment.green', [
          [...Array(4).keys()].map((i) => m('label', {
            style: { marginLeft: '20px', fontSize: '25px' }
          }, gameCombination[i])),
        ]) : null,
      ]
    }
  }
}

const PlayersCombination = function() {
  let playing;
  let combination;
  return {
    oninit: (vnode) => {
      playing = vnode.attrs.playing;
      combination = vnode.attrs.playersCombination;
      combinations.player = combination.toString()
    },
    view: (vnode) => {
      return [
        playing ? m('.ui.segment.green', [
          [...Array(4).keys()].map((i) => m('label', {
            style: { marginLeft: '20px', fontSize: '25px' }
          }, combination[i])),
        ]) : null,
        // vnode.attrs.playersCombination.length = 0,
      ]
    },
  }
}

const Result = function() {
  let playing;
  return {
    oninit: (vnode) => {
      playing = vnode.attrs.playing;
    },
    view: () => {
      return [
        playing ? m('.ui.container', [
          combinations.player === combinations.game  ? 
          m('.ui.segment.inverted.green', `${combinations.game}   VICTORIA`)
          :
          m('.ui.segment.inverted.red', `${combinations.game} - ${combinations.player}    DERROTA`)
        ]) : null,
      ]
    },
  }
}


const Simon = function(){
  let playing;
  let playersCombination = [];
  let secretShowTimeout;
  let showSecrets;
  let baseColor = 'DarkGrey'
  return {
    oninit: () => {
      showSecrets = false;
      secretShowTimeout = 300;
      playing = false;
      playersCombination.length = 0;
    },
    view: (vnode) => {
      return [
        m('.ui.large.header',{ style: { marginTop: '10px', textAlign: 'center'} },  'Simon Says'),
        m('.ui.divider'),
        playing ? m(SimonsCombination, { playing:playing }): null,

        // * *Si el jugador pulsa 4 botones llama al componente que muestra su combinación

        playersCombination.length === 4 ? [
          m(PlayersCombination, { playing : playing, playersCombination }),
          m(Result, { playing: playing })
        ] : null,

        // * *Tablero de Simon
        m('svg', { width: '700px', height: '800px', viewBox: '0, 0, 700, 800', baseProfile: 'full' }, [
          // Circulo exterior
          m('circle', { cx: '50%', cy: '350', r: '300',stroke: 'black', 'stroke-width': '10', fill: 'transparent' }),
          // ?LINEAS
          // Horizontal izquierda
          m('line', { x1:'50', y1: '332', x2: '290', y2: '332', stroke: 'black', 'stroke-width': '10' },),
          // Horizontal derecha
          m('line', { x1:'420', y1: '332', x2: '650', y2: '332', stroke: 'black', 'stroke-width': '10' }),
          // Veritcal arriba
          m('line', { x1:'350', y1: '50', x2: '350', y2: '280', stroke: 'black', 'stroke-width': '10' }),
          // Vertical abajo
          m('line', { x1:'350', y1: '420', x2: '350', y2: '650', stroke: 'black', 'stroke-width': '10' }),

          // ?LETRAS
          // m('text', {x:"200",y:"250",'font-size':"50",'text-anchor':"middle",fill:"black"},  'A'),
          // m('text', {x:"450",y:"250",'font-size':"50",'text-anchor':"middle",fill:"black"},  'X'),
          // m('text', {x:"200",y:"480",'font-size':"50",'text-anchor':"middle",fill:"black"},  'E'),
          // m('text', {x:"450",y:"480",'font-size':"50",'text-anchor':"middle",fill:"black"},  'S'),

          // ?BOTONES

          // Amarillo
          m('path.a', { 
            d: 'M 290 332 H 50 C 50 332, 70 80, 350 50 V 280 C 350 280, 300 300, 290 332', 
            fill: showSecrets ? 'yellow' : baseColor, 
            stroke: 'black', 'stroke-width': '10', 
            onclick: (e) => {
              playersCombination.push('amarillo');
              e.target.style.fill = 'yellow';
              setTimeout(()=> e.target.style.fill = baseColor, secretShowTimeout)
            }
          }),
          // Rojo
          m('path', { 
            d: 'M 420 332 H 650 C 650 332, 650 80, 350 50 V 280 C 350 280, 400 300, 420 332', 
            fill: showSecrets ? 'red' : baseColor, 
            stroke: 'black', 'stroke-width': '10',
            onclick: (e) => {
              playersCombination.push('rojo');
              e.target.style.fill = 'red';
              setTimeout(() => e.target.style.fill = baseColor, secretShowTimeout);
            }
          }),
          // Azul
          m('path', {
            d: 'M 290 332 H 50 C 50 332, 40 620, 350 650 V 420 C 332 420, 280 400, 290 332',
            fill: showSecrets ? 'blue' : baseColor, 
            stroke: 'black', 'stroke-width': '10',
            onclick: (e) => {
              playersCombination.push('azul');
              e.target.style.fill = 'blue';
              setTimeout(() => e.target.style.fill = baseColor, secretShowTimeout)
            }
          }),
          // Verde
          m('path', {
            d: 'M 420 332 H 650 C 650 332, 650 650 , 350 650 V 420 C 350 420, 400 420, 420 332',
            fill: showSecrets ? 'green' : baseColor, 
            stroke: 'black', 'stroke-width': '10',
            onclick: (e) => {
              playersCombination.push('verde');
              e.target.style.fill = 'green';
              setTimeout(() => e.target.style.fill = baseColor, secretShowTimeout)
            }
          }),

           // Circulo interior
          m('circle', 
           { cx: '50%', cy: '350',r: '70',stroke: 'black', 'stroke-width': "17", fill: 'orange',
            onclick: () => { 
              playing = !playing;
              // * *Si pulsa para terminar la partida, resetea la combinación del jugador a vacio.
              if(playing === false) {
                playersCombination.length = 0;
                combinations.player = '';
              } 
            } 
           },
          ),
          m('text', {x:"50%",y:"355",'font-size':"30",'text-anchor':"middle",fill:"black"},  playing ? 'Terminar' : 'Jugar'),
        ]),
      ]
    }
  }
}



m.mount(document.body, Simon);
