function search() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const perfis = document.querySelectorAll('.perfil'); // Seleciona todos os elementos com a classe 'perfil'

  perfis.forEach(perfil => {
    const nome = perfil.querySelector('.nome').textContent.toLowerCase(); // Obtém o texto do nome do perfil
    if (nome.includes(input)) {
      perfil.style.display = 'block'; // Exibe o perfil se o nome corresponder à pesquisa
    } else {
      perfil.style.display = 'none'; // Oculta o perfil se o nome não corresponder à pesquisa
    }
  });
}
