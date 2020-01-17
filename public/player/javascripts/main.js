import * as random from '../../common/javascripts/randomString.js'

if (!localStorage.getItem('unique_id')){
  const id = random.generateId(16);
  localStorage.setItem('unique_id', id)
}

const socket = io('/players', {
  query: {
    unique_id: localStorage.getItem('unique_id')
  }
})

socket.on('connect', onConnected)
socket.on('cleanInput', cleanInput)
socket.on('lockInput', lockInput)
socket.on('unlockInput', unlockInput)
socket.on('validAnswer', validAnswer)
socket.on('invalidAnswer', invalidAnswer)
socket.on('score', updateScore)

function onConnected () {
  //document.getElementById('clientId').innerHTML = localStorage.getItem('unique_id')
  document.getElementById('form').addEventListener('submit', sendMessage)
  document.getElementById('m').addEventListener('input', updateText)
  document.getElementById('username').addEventListener('input', sendUsername)

  document.getElementById('username').value = localStorage.getItem('username');
  sendUsername()
}

function cleanInput () {
  document.getElementById('m').value = ''
  socket.emit('message', '')
  writeCurrentAnswer(null)
}

function lockInput () {
  document.getElementById('m').setAttribute('disabled', true)
  document.getElementById('submitMessageBtn').setAttribute('disabled', true)
}

function unlockInput () {
  document.getElementById('m').removeAttribute('disabled')
  document.getElementById('submitMessageBtn').removeAttribute('disabled')
}

function validAnswer ({answer}) {
  addAnswer(answer, true)
}

function invalidAnswer ({answer}) {
  addAnswer(answer, false)
}

function updateScore ({score}) {
  document.getElementById('score').innerText = `Score: ${score} pts`;
}

function addAnswer (answer, isValid) {
  const answers = document.getElementById('answers')
  const answerSpan = document.createElement('span')
  const i = document.createElement('i')
  const text = document.createTextNode(' ' + answer)

  answerSpan.appendChild(i)
  answerSpan.appendChild(text)
  i.classList.add('fa')
  if (isValid) {
    answerSpan.style.color = '#28a745'
    i.classList.add('fa-check')
  } else {
    answerSpan.style.color = '#dc3545'
    i.classList.add('fa-times')
  }

  answers.appendChild(answerSpan)

  scrollBottom()
}

function writeCurrentAnswer (answer) {
  const container = document.getElementById('currentAnswer')

  while (container.firstChild) {
    container.removeChild(container.firstChild)
  }

  if (answer == null) {
    return
  }

  const answerSpan = document.createElement('span')
  const i = document.createElement('i')
  const text = document.createTextNode(' ' + answer)

  answerSpan.appendChild(i)
  answerSpan.appendChild(text)
  i.classList.add('fa')
  i.classList.add('fa-question')
  answerSpan.style.color = '#4682B4'

  container.appendChild(answerSpan)

  scrollBottom()
}

function sendUsername () {
  let username = document.getElementById('username').value
  localStorage.setItem('username', username)
  socket.emit('username', username)
}
function sendMessage () {
  // Prevent form submit to reload the page
  event.preventDefault()

  // Find the message value from the input
  let message = document.getElementById('m').value

  // Send the message to socket
  socket.emit('message', message)

  writeCurrentAnswer(message)

  return true
}
function updateText () {
  // Prevent form submit to reload the page
  event.preventDefault()

  let message = document.getElementById('m').value
  socket.emit('partial', message)
}

function scrollBottom(){
  var element = document.getElementById("answers-container");

  element.scrollTop = element.scrollHeight - element.clientHeight;
}

function scrollTop(){
  var element = document.getElementById("answers-container");

  element.scrollTop = element.scrollHeight - element.clientHeight;
}