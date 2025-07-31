const carrinhoContainer = document.getElementById('carrinho');
const btnFinalizar = document.getElementById('btnFinalizar');

function exibirCarrinho() {
  if (!carrinhoContainer) return;

  carrinhoContainer.innerHTML = '';

  if (carrinho.length === 0) {
    carrinhoContainer.innerHTML = '<p class="text-muted">Seu carrinho está vazio.</p>';
    return;
  }

  carrinho.forEach(item => {
    const div = document.createElement('div');
    div.className = 'carrinho-item-card';

    div.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}" />
      <div class="carrinho-item-details">
        <h5>${item.nome}</h5>
        <p><strong>Quantidade:</strong> ${item.qtd}</p>
        <p><strong>Valor unitário:</strong> R$ ${item.valor.toFixed(2)}</p>
        <p><strong>Total:</strong> R$ ${(item.valor * item.qtd).toFixed(2)}</p>
      </div>
      <div class="carrinho-item-actions">
        <button class="btn btn-danger" onclick="removerDoCarrinho(${item.id})">Remover</button>
      </div>
    `;

    carrinhoContainer.appendChild(div);
  });
}

function removerDoCarrinho(id) {
  //retorna a lista do carrinho sem o item com o id informado( item.id != id)
  carrinho = carrinho.filter(item => item.id != id);
  salvarCarrinho();
  exibirCarrinho();
}

document.addEventListener('DOMContentLoaded', () => {
  exibirCarrinho();
  if (btnFinalizar) btnFinalizar.addEventListener('click', finalizarCompra);
});

async function finalizarCompra() {
  await atualizarEstoqueProdutos();
  limparCarrinho();
  exibirCarrinho();
}


