const tasks = [];
let time = 0; 
let timer = null;
let timeBreak = null;
let current = 0;

const bAdd = document.querySelector("#bAdd");
const itTask = document.querySelector("#itTask");
const taskName = document.querySelector('#time #taskName')
const form = document.querySelector("#form");

renderTime()
renderTask()

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (itTask.value != "") {
    createTask(itTask.value);
    itTask.value = "";
    renderTask();
  }
});

function createTask(value) {
  //Esta funcion crea objetos de tipo tarea
  const newTask = {
    id: (Math.random() * 100).toString(36).slice(3),
    title: value,
    completed: false,
  };
  tasks.unshift(newTask);
}

function renderTask() {
    /* 
        Esta funcion renderiza las tareas las cuales agrega al html
        mediante una funcion anonima, la cual retorna la estructura html de las tareas.
        Luego en el contenedor donde se acumulan las tareas se agrega la tarea nueva.
    */
  const html = tasks.map((task) => {
    return `
            <div class="task">
                <div class="completed">${
                  task.completed
                    ? `<span class="done">Done</span>`
                    : `<button class="start-button" data-id="${task.id}">Start</button>`
                }</div>
                <div class="titled">${task.title}</div>
            </div>
        `;
  });

  const tasksContainer = document.querySelector("#tasks");
  tasksContainer.innerHTML = html.join("");

  const startButtons = document.querySelectorAll('.task .start-button')
    startButtons.forEach(button =>{
    button.addEventListener('click', e =>{
        if (!timer) {//cambia el mensaje del boton a "in progress..."
            const id = button.getAttribute('data-id')
            startButtonHandler(id)
            button.textContent = 'in progress...'
        }
    })
  })
}



function timerBreakHandler() {// funcion que decrementa el tiempo mientras renderiza el texto del tiempo 
    // durante "tenemos un break"
    time--
    renderTime()
    if(time === 0){
        clearInterval(timeBreak)
        current=null
        timeBreak = null
        taskName.textContent=''
        renderTask()
    }
}

function timeHandler(id = null) {// funcion que decrementa el tiempo mientras renderiza el texto del tiempo 
                                 // durante "se realiza una tarea"
    time--
    renderTime()
    if(time === 0){
        clearInterval(timer)
        markCompleted(id)
        timer = null
        renderTask()
        startBreak()
    }
}

function renderTime() {//Realiza los cambios o cuenta regresiva reseteando los valores
    const timeDiv = document.querySelector('#time #value')
    const minutes = parseInt(time/60)
    const seconds = parseInt(time%60)
    timeDiv.textContent=`${minutes<10 ? "0":''}${minutes}:${seconds< 10 ? "0":""}${seconds}`    
}

function markCompleted(id) { //marca completa una tarea mediante su id
    const taskIndex = tasks.findIndex((task)=>task.id ===id)
    tasks[taskIndex].completed=true
}

function startBreak() {//Funcion con la que inicia el descanso o "break" de 5 minutos
    time = .1 * 60
    taskName.textContent = 'break'
    renderTime()
    timeBreak = setInterval(timerBreakHandler,1000)
}
function startButtonHandler(id) {//Inicia el temporizador en 25 minutos
    time = .1 * 60
    current = id
    const taskIndex = tasks.findIndex(task => task.id===id)
    taskName.textContent = tasks[taskIndex].title
    renderTime()
    //darle formato al tiempo
    timer = setInterval(()=>{
        timeHandler(id)
    },1000)
}