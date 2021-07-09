function createElement(tagName, classN) {
  const element = document.createElement(tagName);
  element.className = classN;
  return element;
}
function Barreira(inverse = false) {
  this.elemento = createElement("div", "bar");
  const borda = createElement("div", "corpo");
  const cabeca = createElement("div", "head");
  this.elemento.appendChild(inverse ? borda : cabeca);
  this.elemento.appendChild(inverse ? cabeca : borda);

  this.SetAltura = (h) => (borda.style.height = `${h}px`);
}
function ParDeBarreiras(h, abertura, x) {
  this.element = createElement("div", "par-de-barreiras");
  this.superior = new Barreira(true);
  this.bottom = new Barreira();

  this.element.appendChild(this.superior.elemento);
  this.element.appendChild(this.bottom.elemento);

  this.sortearAbertura = () => {
    const alturaSuperior = Math.random() * (h - abertura);
    const alturainferior = h - alturaSuperior - abertura;
    this.superior.SetAltura(alturaSuperior);
    this.bottom.SetAltura(alturainferior);
  };
  this.getX = () => parseInt(this.element.style.left.split("px")[0]);
  this.setX = (x) => (this.element.style.left = `${x}px`);
  this.getLargu = () => this.element.clientWidth;

  this.sortearAbertura();
  this.setX(x);
}

function Barreiras(altura, largura, abertura, entre, notificarPonto) {
  this.pares = [
    new ParDeBarreiras(altura, abertura, largura),
    new ParDeBarreiras(altura, abertura, largura + entre),
    new ParDeBarreiras(altura, abertura, largura + entre * 2),
    new ParDeBarreiras(altura, abertura, largura + entre * 3),
  ];

  let deslocamento = 1;
  this.animar = () => {
    this.pares.forEach((e) => {
      e.setX(e.getX() - deslocamento);

      if (e.getX() < -e.getLargu()) {
        e.setX(e.getX() + entre * this.pares.length);
        e.sortearAbertura();
      }

      const meio = largura / 2;
      const cruzouomeio = e.getX() + deslocamento >= meio && e.getX() < meio;

      if (cruzouomeio) {
        notificarPonto();
      }
    });
  };
}

function Passaro(alturaJogo) {
  let voando = false;
  let m = 0;

  this.element = createElement("img", "passaro");
  this.element.src = "./IMG/passaro.png";

  this.getY = () => parseInt(this.element.style.bottom.split("px")[0]);
  this.setY = (y) => (this.element.style.bottom = `${y}px`);

  window.onkeydown = () => {
    voando = true;
  };
  window.onkeyup = () => {
    voando = false;
  };

  this.animar = () => {
    let novoY;
    if (!voando) {
      m = m + 0.15;
      let gra = -0.5;
      let calc = gra * m;
      novoY = this.getY() + calc;
    } else {
      m = 0;
      novoY = this.getY() + 2;
    }
    const alturaMaxima = alturaJogo - this.element.clientHeight;

    if (novoY < 0) {
      this.setY(0);
    } else if (novoY >= alturaMaxima) {
      this.setY(alturaMaxima);
    } else {
      this.setY(novoY);
    }
  };
  this.setY(alturaJogo / 2);
}

function Progresso() {
  this.element = new createElement("span", "pontuacao");
  this.atualizarPonto = (pontos) => {
    this.element.innerHTML = pontos;
  };
  this.atualizarPonto(0);
}

// const b = new Barreiras(450, 1200, 200, 450)
// const bird = new Passaro(450);
// const gameArea = document.querySelector("[flappy-bird]")
// gameArea.appendChild(bird.element)
// gameArea.appendChild(new Progresso().element)
// b.pares.forEach(par => gameArea.appendChild(par.element))
// setInterval(() => {
//     b.animar()
//     bird.animar();
// }, 6)

function estaoSobrepostos(elemA, elemB) {
  const a = elemA.getBoundingClientRect();
  const b = elemB.getBoundingClientRect();

  const horizontal = a.left + a.width >= b.left
        && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top
    return horizontal && vertical
}

function conflito(bird, barreiras) {
  let colidiu = false;
  barreiras.pares.forEach((par) => {
    if (!colidiu) {
      const superior = par.superior.elemento;
      const inferior = par.bottom.elemento;

      colidiu =
        estaoSobrepostos(bird.element, superior) ||
        estaoSobrepostos(bird.element, inferior);
    }
  });
  return colidiu
}

function flappyBird() {
  let pontos = 0;

  const gameArea = document.querySelector("[flappy-bird]");
  const altura = gameArea.clientHeight;
  const largura = gameArea.clientWidth;
  const bird = new Passaro(altura);
  const progresso = new Progresso();
  const barreiras = new Barreiras(altura, largura, 200, 400, () =>
    progresso.atualizarPonto(++pontos)
  );
  gameArea.appendChild(bird.element);
  gameArea.appendChild(progresso.element);
  barreiras.pares.forEach((e) => gameArea.appendChild(e.element));

  this.start = () => {
    const temp = setInterval(() => {
      barreiras.animar();
      bird.animar();
     
      if (conflito(bird, barreiras)){
          clearInterval(temp)
      }
    
    }, 6);
  };
}
new flappyBird().start();
