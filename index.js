const containerProdutos = document.getElementById('produtos');
let categoriaSelecionada = 'todos';
let termoBusca = '';

document.addEventListener('DOMContentLoaded', () => {
  carregarProdutos();

  const links = document.querySelectorAll('#filtroCategorias .nav-link');
  links.forEach(link => {
    link.onclick = e => {
      e.preventDefault();
      categoriaSelecionada = link.dataset.categoria;
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      filtrarEExibir();
    };
  });

  const form = document.getElementById('formBusca');
  form.onsubmit = e => {
    e.preventDefault();
    const input = document.getElementById('inputBusca');
    termoBusca = input.value.trim().toLowerCase();
    filtrarEExibir();
  };
});

async function carregarProdutos() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Erro ao carregar produtos');
    produtos = await res.json();
    filtrarEExibir();
  } catch (error) {
    if (containerProdutos) {
      containerProdutos.innerHTML = `<p class="text-danger">${error.message}</p>`;
    }
  }
}


function filtrarEExibir() {
  if (!produtos.length || !containerProdutos) return;

  let filtrados = produtos;

  if (categoriaSelecionada !== 'todos') {
    filtrados = filtrados.filter(p => p.categoria.toLowerCase() == categoriaSelecionada.toLowerCase());
  }

  if (termoBusca) {
    filtrados = filtrados.filter(p => p.nome.toLowerCase().includes(termoBusca.toLowerCase()));
  }

  exibirProdutos(filtrados);
}

function exibirProdutos(lista) {
  if (!containerProdutos) return;

  containerProdutos.innerHTML = '';

  if (lista.length == 0) {
    containerProdutos.innerHTML = `<p class="text-muted">Nenhum produto encontrado.</p>`;
    return;
  }

  lista.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-md-4 col-lg-3';
    col.innerHTML = `
      <div class="card h-100">
        <img src="${p.imagem}" class="card-img-top" style="height:250px;object-fit:cover" alt="${p.nome}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.nome}</h5>
          <p class="card-text">
            Categoria: ${p.categoria}<br>
            Estoque: ${p.estoque}<br>
            <strong>R$ ${p.valor.toFixed(2)}</strong>
          </p>
          <button class="btn btn-primary mt-auto" ${p.estoque == 0 ? 'disabled' : ''} onclick="adicionarAoCarrinho(${p.id})">
            ${p.estoque == 0 ? 'Indisponível' : 'Adicionar'}
          </button>
        </div>
      </div>
    `;
    containerProdutos.appendChild(col);
  });
}

function adicionarAoCarrinho(id) {
  const produto = produtos.find(produto => produto.id == id);
  if (!produto) return;

  const item = carrinho.find(produto => produto.id == id);
  const qtdCarrinho = item ? item.qtd : 0;

  if (qtdCarrinho >= produto.estoque) {
    return;
  }

  if (item) {
    item.qtd++;
  } else {
    carrinho.push({
      id: produto.id,
      nome: produto.nome,
      imagem: produto.imagem,
      valor: produto.valor,
      qtd: 1
    });
  }

  salvarCarrinho();
}
