// FORM ==================================================================


// Função para validar o email
function validarEmail(email) {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(email);
}

// Função para validar o telefone no formato brasileiro
function validarTelefone(telefone) {
  const regexTelefone = /^\([1-9]{2}\) (?:[2-8]|9[0-9])[0-9]{3}\-[0-9]{4}$/;
  return regexTelefone.test(telefone);
}


// Clear validations

const inputs = document.querySelectorAll('.form-control');

inputs.forEach(function (field) {

  field.addEventListener('focus', function () {
    field.classList.remove('is-invalid');

    const feedbackElement = field.nextElementSibling;

    if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
      feedbackElement.classList.remove('invalid-feedback');
    }
  });
});


// Mask phone field

const phoneInput = document.getElementById('phone');

phoneInput.addEventListener('input', function (event) {

  const input = event.target;
  const value = input.value.replace(/\D/g, ''); // Remove todos os não dígitos

  if (value.length <= 2) {
    // Formato: (DD)
    input.value = `(${value}`;
  } else if (value.length <= 7) {
    // Formato: (DD) DDDDD
    input.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
  } else if (value.length <= 10) {
    // Formato: (DD) DDDDD-DDD
    input.value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
  } else {
    // Formato completo: (DD) DDDDD-DDDD
    input.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
  }
});


function enableFields(){
  document.getElementById('name').disabled          = false;
  document.getElementById('email').disabled         = false;
  document.getElementById('phone').disabled         = false;
  document.getElementById('submitBtn').disabled     = false;
  document.getElementById('submitBtn').textContent  = "Quero receber o Contato";
}

async function makeRequest() {
  
  // Elements
  const elName      = document.getElementById('name');
  const elNameHelp  = document.getElementById('nameHelp');
  const elEmail     = document.getElementById('email');
  const elEmailHelp = document.getElementById('emailHelp');
  const elPhone     = document.getElementById('phone');
  const elPhoneHelp = document.getElementById('phoneHelp');
  const elSubmitBtn = document.getElementById('submitBtn');

  // Disabling Inputs

  elName.disabled         = true;
  elEmail.disabled        = true;
  elPhone.disabled        = true;
  elSubmitBtn.disabled    = true;
  elSubmitBtn.textContent = "Aguarde ...";

  // Data
  const name  = elName.value;
  const email = elEmail.value;
  const phone = elPhone.value;

  // Validação dos campos
  if (name.length < 3) {
    
    elName.classList.add('is-invalid');
    elNameHelp.classList.add('invalid-feedback');
    enableFields();
    return;
  }

  if (!validarEmail(email)) {

    elEmail.classList.add('is-invalid');
    elEmailHelp.classList.add('invalid-feedback');
    enableFields();
    return;
  }

  if (!validarTelefone(phone)) {
    elPhone.classList.add('is-invalid');
    elPhoneHelp.classList.add('invalid-feedback');
    enableFields();
    return;
  }


  // Object to request

  const deal = {
    name: name,
    email: email,
    phone: phone,
  };

  try {
    const response = await fetch('https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/namespaces/fn-e56a410d-4116-4e76-8991-6062e5b04b2e/actions/floux-site-form-integration?blocking=true&result=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic OTdmMTM2MjAtY2Y5Yy00ZjA0LWI4NjAtOWU5ZjNiMjZkNjQ2OlVjcnRYTmNMTFlxMjJGVGpyeFVmbXl6anpiQXhvOElWTHpCZG9WbHphVTI2SUtGY05CM2lXR1BmeWJFaDhtSjQ',
      },
      body: JSON.stringify(deal)
    });
    
    if (response.ok) {
      
      console.log(response);

      let responseData = await response.json();
      
      console.log(responseData);
      
      if(responseData.statusCode == 201){
        
        elName.value  = '';
        elEmail.value = '';
        elPhone.value = '';
      
        successModal.show();

      }
      else{
        errorModal.show();
        console.error('Erro devolvido pela função: ', responseData.message)
      }
    }
    else {
      errorModal.show();
      console.error('Erro ao enviar os dados para criação de deal.');
    }
  } 
  catch (error) {
    errorModal.show();
    console.error('Erro na requisição para criação de deal:', error);
  }
  
  // Enabling inputs
  enableFields();
}

// Modals
var successModal  = new bootstrap.Modal(document.getElementById('successModal'));
var errorModal    = new bootstrap.Modal(document.getElementById('errorModal'));

document.getElementById("sendcontact").addEventListener("submit", async function(event) {
  event.preventDefault();

  await makeRequest();
});