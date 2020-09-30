let searchInput = null;
let searchedName = '';

let tabUsuario = null;
let spanUsuario = null;
let tabEstatistica = null;
let spanEstatistica = null;

let usuariosEncontrados = 0;
let sexoMasculino = 0;
let sexoFeminino = 0;
let somaIdades = 0;
let mediaIdades = 0;

let usuarios = [];
let estatistica = [];

let btnBuscar = null;

window.addEventListener('load', () => {
  searchInput = document.querySelector('input');
  tabUsuario = document.querySelector('#tabUsuarios');
  spanUsuario = document.querySelector('#spanUsuarios');
  tabEstatistica = document.querySelector('#tabEstatisticas');
  spanEstatistica = document.querySelector('#spanEstatisticas');
  btnBuscar = document.querySelector('#BtnBuscar');

  searchInput.disabled = true;

  fetchUsuarios();
});

async function fetchUsuarios() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  ).catch((e) => {
    fetchUsuarios();
  });

  if (res == null) {
    return;
  }

  searchInput.disabled = false;

  const json = await res.json();

  usuarios = json.results.map((usuario) => {
    return {
      nome: usuario.name.first + ' ' + usuario.name.last,
      sexo: usuario.gender,
      idade: usuario.dob.age,
      imagem: usuario.picture.thumbnail,
    };
  });

  handleSearch();
}

function render() {
  renderUsuarios();
  renderEstatisticas();
}

function renderUsuarios() {
  let usuariosHTML = '<div>';

  let usuariosFiltrados = usuarios
    .filter((usuario) => {
      if (searchInput.value === '') {
        return false;
      } else {
        return usuario.nome
          .toLowerCase()
          .includes(searchInput.value.toLowerCase());
      }
    })
    .sort((a, b) => {
      return a.nome.localeCompare(b.nome);
    });

  usuariosFiltrados.forEach((usuario) => {
    const usuarioHTML = `
      <div class='usuario'>
          <img src='${usuario.imagem}'/>
          <span style="display:inline-block;">${
            usuario.nome + ', ' + usuario.idade + ' anos'
          }</span>
      </div>
    `;
    usuariosHTML += usuarioHTML;
  });

  usuariosHTML += '</div>';
  tabUsuario.innerHTML = usuariosHTML;
  usuariosEncontrados = usuariosFiltrados.length;

  if (usuariosEncontrados === 0) {
    spanUsuario.textContent = 'Nenhum usuário filtrado';
  } else {
    spanUsuario.textContent = usuariosEncontrados + ' usuarios';
    tabUsuario.innerHTML = usuariosHTML;
  }

  sexoMasculino = usuariosFiltrados.filter((usuario) => {
    return usuario.sexo === 'male';
  }).length;

  sexoFeminino = usuariosEncontrados - sexoMasculino;

  somaIdades = usuariosFiltrados.reduce((acc, cur) => {
    return acc + cur.idade;
  }, 0);

  mediaIdades = somaIdades / usuariosEncontrados;
}

function renderEstatisticas() {
  let estatisticasHTML = `
    <ul>
      <li>Sexo masculino: ${sexoMasculino}</li>
      <li>Sexo feminino: ${sexoFeminino}</li>
      <li>Soma das idades: ${somaIdades}</li>
      <li>Média das idades: ${mediaIdades.toFixed(2)}</li>
    </ul>
  `;

  if (usuariosEncontrados === 0) {
    spanEstatistica.textContent = 'Nada a ser exibido';
    tabEstatistica.innerHTML = '';
  } else {
    spanEstatistica.textContent = 'Estatísticas';
    tabEstatistica.innerHTML = estatisticasHTML;
  }
}

function handleSearch() {
  btnBuscar.addEventListener('click', () => {
    render();
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      render();
    }
  });
}
