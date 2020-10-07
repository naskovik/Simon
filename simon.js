const colors = ['rojo','amarillo','verde','azul'];


const SimonsOrder = function() {
  
  let playing;
  let playersKeys;
  let difficulty;
  let currentColors;

  function calculateColors() {
    return [...Array(difficulty).keys()].map(() => colors[Math.floor(Math.random() * 4)]);
  }

  function compareColors(arr1, arr2) {
    return arr1.slice(-difficulty).toString() === arr2.slice(-difficulty).toString();
  }


  return {
    oninit: (vnode) => {
      currentColors = calculateColors();
      difficulty = vnode.attrs.difficulty;
      playing = vnode.attrs.playing;
      playersKeys = vnode.attrs.playersKeys;
    },
    view: () => {
      return [
         [...Array(difficulty).keys()].map(() => m(`.ui.segment.green`, [
          m('label', {
            style: { marginLeft: '20px', fontSize: '25px'}
          }, currentColors),
        ],
        ))
      ]
    },
    onbeforeupdate: () => {
      console.log(playersKeys.slice(- difficulty).toString() === currentColors.slice(-difficulty).toString());
      console.log(currentColors.slice(-difficulty).toString());
      compareColors(playersKeys, currentColors) ? currentColors = calculateColors() : null;
    },
  }
}


const Simon = function(){
  let playing;
  let playersKeys;
  let secretShowTimeout;
  let baseColor;
  let difficulty;

  function addColorToArray(color) {
    playersKeys.push(color);
  }
  function showColors(show) { return show; }

  return {
    oninit: () => { 
      baseColor  = 'DarkGrey';
      secretShowTimeout = 300;
      playing = false;
      playersKeys = [];
      difficulty = 1;
      showColors(false);
    },
    view: (vnode) => {
      return [
        m('.ui.large.header',{ style: { marginTop: '10px', textAlign: 'center'} },  'Simon Says'),
        m('.ui.container', [
          m('.ui.button', { onclick: () => playersKeys.length = 0 }, 'RESET'),
          m('.ui.label', `Colores Pulsados: ${playersKeys.toString()}`),
        ]),
        m('.ui.container', { style: { 'margin-top': '19px' } }, [
          m('.ui.circular.icon.button', { 
            style: { 'font-size': '19' },
            onclick: () => difficulty < 4 ? difficulty++ : null
          }, '+'),
          m('.ui.circular.icon.button', { 
            style: { 'font-size': '19' },
            onclick: () => difficulty > 1 ? difficulty-- : null
          }, '-')
        ], `DIFICULTAD ${difficulty}`),
        m('.ui.divider'),
        playing ? m(SimonsOrder, { playing:playing, playersKeys, difficulty }): null,

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

          // ?BOTONES

          // Amarillo
          m('path.a', { 
            d: 'M 290 332 H 50 C 50 332, 70 80, 350 50 V 280 C 350 280, 300 300, 290 332', 
            fill: showColors ? 'yellow' : baseColor, 
            stroke: 'black', 'stroke-width': '10', 
            onclick: (e) => {
              addColorToArray('amarillo');
              e.target.style.fill = 'yellow';
              setTimeout(()=> e.target.style.fill = baseColor, secretShowTimeout)
            }
          }),
          // Rojo
          m('path', { 
            d: 'M 420 332 H 650 C 650 332, 650 80, 350 50 V 280 C 350 280, 400 300, 420 332', 
            fill: showColors ? 'red' : baseColor, 
            stroke: 'black', 'stroke-width': '10',
            onclick: (e) => {
              addColorToArray('rojo');
              e.target.style.fill = 'red';
              setTimeout(() => e.target.style.fill = baseColor, secretShowTimeout);
            }
          }),
          // Azul
          m('path', {
            d: 'M 290 332 H 50 C 50 332, 40 620, 350 650 V 420 C 332 420, 280 400, 290 332',
            fill: showColors ? 'blue': baseColor, 
            stroke: 'black', 'stroke-width': '10',
            onclick: (e) => {
              addColorToArray('azul');
              e.target.style.fill = 'blue';
              setTimeout(() => e.target.style.fill = baseColor, secretShowTimeout)
            }
          }),
          // Verde
          m('path', {
            d: 'M 420 332 H 650 C 650 332, 650 650 , 350 650 V 420 C 350 420, 400 420, 420 332',
            fill: showColors ? 'green': baseColor,
            stroke: 'black', 'stroke-width': '10',
            onclick: (e) => {
              addColorToArray('verde');
              e.target.style.fill = 'green';
              setTimeout(() => e.target.style.fill = baseColor, secretShowTimeout)
            }
          }),

           // Circulo interior
          m('circle', 
           { cx: '50%', cy: '350',r: '70',stroke: 'black', 'stroke-width': "17", fill: 'orange',
            onclick: () => { 
              playing = !playing;
              showColors(true);
              setTimeout(showColors(false), 3000);
            } 
           },
          ),
          m('text', {x:"50%",y:"355",'font-size':"30",'text-anchor':"middle",fill:"black"},  playing ? 'Terminar' : 'Jugar'),
        ]),
      ]
    },
  }
}



m.mount(document.body, Simon);
