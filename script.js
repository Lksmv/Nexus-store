const API_URL = 'http://localhost:3000/produtos';

let produtos = [];
let carrinho = carregarCarrinho();

function carregarCarrinho() {
  return JSON.parse(localStorage.getItem('carrinho')) || [];
}

function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarQuantidadeCarrinho();
}

function atualizarQuantidadeCarrinho() {
  const badge = document.getElementById('iconCarrinho');
  if (badge) {
    const totalItens = carrinho.reduce((soma, item) => soma + item.qtd, 0);
    badge.textContent = totalItens;
  }
}

function limparCarrinho() {
  carrinho = [];
  salvarCarrinho();
}

async function atualizarEstoqueProdutos() {
  for (const item of carrinho) {
    try {
      const response = await fetch(`${API_URL}/${item.id}`);

      const produtoAtual = await response.json();
      const novoEstoque = produtoAtual.estoque - item.qtd;

      const patch = await fetch(`${API_URL}/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estoque: novoEstoque })
      });

      if (patch.ok) {
        console.log(`Estoque do produto ${item.id} atualizado para ${novoEstoque}`);
        const produtoLocal = produtos.find(p => p.id == item.id);
        if (produtoLocal) produtoLocal.estoque = novoEstoque;
      } else {
        console.error(`Erro ao atualizar estoque do produto ${item.id}`);
      }

    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
    }
  }
}


document.addEventListener('DOMContentLoaded', () => {
  atualizarQuantidadeCarrinho();
});
