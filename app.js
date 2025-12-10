// Lista de produtos
const produtos = [
    { nome: "VIP Mensal", preco: "R$50,00", id: "vip" },
    { nome: "Level Up", preco: "R$30,00", id: "level" },
    { nome: "Gold Pack", preco: "R$20,00", id: "gold" },
    { nome: "Pacote de Estudos", preco: "R$15,00", id: "estudos" }
];

// Discord link
const discordLink = "https://discord.gg/SEULINK"; // substitua pelo seu link real

// Renderiza produtos na loja
const containerProdutos = document.getElementById("products");
produtos.forEach(prod => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
        <h4>${prod.nome}</h4>
        <p>${prod.preco}</p>
        <button onclick="comprar('${prod.id}')">Comprar</button>
    `;
    containerProdutos.appendChild(div);
});

// Função de compra -> abre Discord
function comprar(item) {
    window.open(discordLink, "_blank");
}
