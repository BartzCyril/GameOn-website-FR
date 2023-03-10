function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const modalBody = document.querySelector('.modal-body')
const formData = document.querySelectorAll(".formData");
const form = document.querySelector('form')
const close = document.querySelector('.close')
const firstname = document.querySelector('#first')
const name = document.querySelector('#last')
const email = document.querySelector('#email')
const birthdate = document.querySelector('#birthdate')
const quantity = document.querySelector('#quantity')
const checkbox = document.querySelectorAll('.checkbox-input')

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

// launch modal form
function launchModal() {
  modalbg.style.display = "block";
}

// close modal form
close.addEventListener('click', function () {
  modalbg.style.display = "none";
})

// error dataset 

function addErrorDataSet(index, message) {
  formData[index].dataset.error = message
  formData[index].dataset.errorVisible = true
}

function removeErrorDataSet(index) {
  formData[index].removeAttribute('data-error')
  formData[index].dataset.errorVisible = false
}

// save valid data 

function saveFormData() {
  let data = {}
  for (let i = 0; i < formData.length; i++) {
      const elements = formData[i].querySelector('input')
      if (elements.name)
          if (elements.name === "location") {
              let dataLocation = {}
              for (let i = 0; i < checkbox.length - 2; i++) {
                  dataLocation[i + 1] = checkbox[i].checked
              }
              data[elements.name] = dataLocation
          } else if (elements.name === "condition") {
            let dataCondition = {}
            for (let i=checkbox.length-2; i < checkbox.length; i++) {
              dataCondition[i - (checkbox.length-3)] = checkbox[i].checked
            }
            data[elements.name] = dataCondition
          } 
          else {
              data[elements.name] = elements.value
          }

  }
  localStorage.setItem("data", JSON.stringify(data))
}

// show valid data

const data = JSON.parse(localStorage.getItem("data"))
console.log(data)
if (data != null) {
    firstname.value = data.first
    name.value = data.last
    email.value = data.email
    birthdate.value = data.birthdate
    quantity.value = data.quantity
    for (let i = 0; i < checkbox.length - 2; i++) {
        let numCountry = i + 1
        checkbox[i].checked = data.location[numCountry]
    }
    for (let i=checkbox.length - 2; i < checkbox.length; i++) {
      let numCondition = i+1
      checkbox[i].checked = data.location[numCondition]
    }
}

// check data form

function isValidFirstName() {
  if (firstname.value.trim() === "") {
    addErrorDataSet(0, "Vous avez oublié de saisir le prénom")
    return false
  } else if (firstname.value.trim().length < 2) {
    addErrorDataSet(0, "Le prénom ne posséde pas assez de caractères")
    return false
  } else {
    removeErrorDataSet(0)
    return true
  }
}

function isValidName() {
  if (name.value.trim() === "") {
    addErrorDataSet(1, "Vous avez oublié de saisir le nom")
    return false
  } else if (name.value.trim().length < 2) {
    addErrorDataSet(1, "Le nom ne posséde pas assez de caractères")
    return false
  } else {
    removeErrorDataSet(1)
    return true
  }
}

function isValidEmail() {
  const regex = /[a-z0-9-_.]+@[a-z0-9-_.]+\.[a-z]{2,}/
  if (email.value.trim() === "") {
      addErrorDataSet(2, "Vous avez oublié de saisir l'email")
      return false
  } else if (!regex.test(email.value)) {
      addErrorDataSet(2, "Le format de l'email est incorrect")
      return false
  } else {
      removeErrorDataSet(2)
      return true
  }
}

function isValidBirthdate() {
  if (birthdate.value.trim() !== "") {
      const transformBirthdate = birthdate.value.split("-")
      const year = parseInt(transformBirthdate[0])
      const date = new Date()
      const currentYear = date.getFullYear()
      if (year <= 1900 || year >= (currentYear - 18)) {
          addErrorDataSet(3, "L'année est incorrect")
          return false
      } else {
          removeErrorDataSet(3)
          return true
      }
  }
  addErrorDataSet(3, "Vous avez oublié de saisir la date")
  return false
}

function isValidQuantity() {
  const regex = /^\d+$/
  if (quantity.value.trim() === "") {
      addErrorDataSet(4, "Vous avez oublié de saisir la quantité de participation")
      return false
  } else if (!regex.test(quantity.value)) {
      addErrorDataSet(4, "Vous n'avez pas écrit de nombre")
      return false
  }
  removeErrorDataSet(4)
  return true
}

function isValidCheckBox() {
  for (let i = 0; i < checkbox.length - 2; i++) {
      if (checkbox[i].checked) {
          removeErrorDataSet(5)
          return true
      }
  }
  addErrorDataSet(5, "Vous avez oublié de saisir une ville")
  return false
}

function isValidConditionsOfUse() {
  if (checkbox[checkbox.length - 2].checked) {
      removeErrorDataSet(6)
      return true
  }
  addErrorDataSet(6, "Vous avez oublié d'accepter les conditions d'utilisations")
  return false
}

function successfulRegistration() {
  localStorage.removeItem("data")
  form.style.display = "none"
  const p = document.createElement('p')
  p.innerText = "Merci pour votre inscription"
  p.style.padding = "75% 25%"
  p.style.textAlign = "center"
  modalBody.appendChild(p)
  const button = document.createElement('button')
  button.innerText = "Fermer"
  button.classList.add("btn-submit")
  button.addEventListener('click', function() {
    modalbg.style.display = "none";
  })
  modalBody.appendChild(button)
}

form.addEventListener('submit', function (e) {
  e.preventDefault()
  saveFormData()
  const isValid = [isValidFirstName(), isValidName(), isValidEmail(), isValidBirthdate(), isValidQuantity(), isValidCheckBox(), isValidConditionsOfUse()].every(Boolean);
  if (isValid) {
    successfulRegistration()
  }
})