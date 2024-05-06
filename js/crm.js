

function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  
  const options = {
    threshold: 0.5
  };
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target;
        lazyImage.src = lazyImage.dataset.src;
        lazyImage.removeAttribute('data-src');
        observer.unobserve(lazyImage);
      }
    });
  }, options);
  
  images.forEach(image => {
    imageObserver.observe(image);
  });
}


function updateLabelAndPrice(rangeElement) {

    const rangeId = rangeElement.id;
    const value = rangeElement.value;

    // Atualizar o label correspondente
    const labelElement = document.querySelector(`label[for='${rangeId}']`);
    
    if (labelElement) {
      if( rangeId == 'users' ){
        labelElement.textContent = `Até ${value} usuários`;
      }
      if( rangeId == 'leads' ){
        labelElement.textContent = `Até ${value} leads / mês`;
      }
      if( rangeId == 'hours' && value < 2 ){
        labelElement.textContent = `${value} Hora de Consultoria / mês`;
      }
      if( rangeId == 'hours' && value > 1 ){
        labelElement.textContent = `${value} Horas de Consultoria / mês`;
      }
    }

    // Calcular o preço
    calculatePrice();
}

function calculatePrice() {

    const users = parseInt(document.getElementById('users').value, 10);
    const leads = parseInt(document.getElementById('leads').value, 10);
    const hours = parseInt(document.getElementById('hours').value, 10);

    // Exemplo de cálculo de preço
    const price = (users * 50) + (leads * 5) + (hours * 220);  // Altere esta fórmula conforme necessário

    // Atualizar o elemento do preço
    document.getElementById('price-value').textContent = price;
}


function initializePage() {
    
    lazyLoadImages();

    updateLabelAndPrice(document.getElementById('users'));
    updateLabelAndPrice(document.getElementById('leads'));
    updateLabelAndPrice(document.getElementById('hours'));

    // Adicionar event listeners para mudanças futuras
    document.getElementById('users').addEventListener('input', function(event) {
        updateLabelAndPrice(event.target);
    });
    document.getElementById('leads').addEventListener('input', function(event) {
        updateLabelAndPrice(event.target);
    });
    document.getElementById('hours').addEventListener('input', function(event) {
        updateLabelAndPrice(event.target);
    });
}

// Carregar tudo ao iniciar a página
window.addEventListener('DOMContentLoaded', initializePage);
