const fieldsView = document.getElementById('input-fields')

function addInputField () {
  const template = document.getElementById('field-row').content.cloneNode(true)
  template.getElementById('remove-field').addEventListener('click', (event) => removeFieldInput(event.target.parentNode.parentNode))
  fieldsView.appendChild(template)
}

function removeFieldInput (field) {
  fieldsView.removeChild(field);
}