'use strict';
// import for having unique id(s)
import uuid from './uuid.js';

// getting the DOM elements
const input = document.getElementById('input');
const addBtn = document.getElementById('add-btn');
const editBtn = document.getElementById('edit-btn');
const output = document.getElementById('output');

// everything happens in an object
let toDoApp = {
    // edit state for decide if we are editing or adding
    editState : false,
    // array for storing the tasks
    toDos : [],
    addToDo : ()=>{
        // if input is empty show the error modal for 2 seconds
        if (input.value === ""){
            const modal = document.getElementById('modal');
            modal.style.display = "block";
            setInterval(()=>{
                modal.style.display = "none";
            }, 2000)
        }
        // if input is not empty add the task to the array
        if(input.value !== ""){
        const toDo = {
            title: input.value,
            id: uuid(),
        }
        toDoApp.toDos.push(toDo);
        input.value = '';
        // console.log(toDoApp.toDos)
        toDoApp.saveToLocalStorage();
        toDoApp.render()}
    },
    // function for displaying the tasks which is called after each operation
    render: function(){
        output.innerHTML = '';
        this.toDos.forEach(function(toDo){
            const task = document.createElement('div');
            task.className = "w-100 d-flex justify-content-between align-content-center px-2 py-1 mb-2 rounded-2";
            task.style.backgroundColor = '#'+Math.floor(Math.random()*16777215).toString(16);
            const title = document.createElement('h4');
            title.className = "text-white text-center line-height-custom m-0";
            title.innerHTML = toDo.title;
            const wrapper = document.createElement('div');
            wrapper.className = "d-flex justify-content-center align-content-center gap-2";
            const deleteBtn = document.createElement('button');
            deleteBtn.onclick = ()=> {toDoApp.deleteTask(toDo.id)};
            deleteBtn.className = "custom-btn";
            deleteBtn.innerHTML = '<img src="https://img.icons8.com/external-flatart-icons-solid-flatarticons/25/ffffff/external-delete-user-interface-flatart-icons-solid-flatarticons.png"/>';
            const editTaskBtn = document.createElement('button');
            editTaskBtn.onclick = () => {toDoApp.editTask(toDo.id)};
            editTaskBtn.className = "custom-btn";
            editTaskBtn.innerHTML = '<img src="https://img.icons8.com/external-becris-lineal-becris/25/ffffff/external-edit-mintab-for-ios-becris-lineal-becris.png"/>';
            wrapper.appendChild(deleteBtn);
            wrapper.appendChild(editTaskBtn);
            task.appendChild(title);
            task.appendChild(wrapper);
            output.appendChild(task);
        }
        )
    },
    // for deleting tasks
    deleteTask: function(id){
        const index = toDoApp.toDos.findIndex((todo) => todo.id === id);
        const agreement = confirm(`Are you sure you want to delete ${toDoApp.toDos[index].title}?`);
        if(agreement === true){
        toDoApp.toDos = toDoApp.toDos.filter((toDo) => toDo.id !== id);
        // console.log(toDoApp.toDos)
        toDoApp.saveToLocalStorage();
        toDoApp.render();}
        else{
            return;
        }
    },
    // for editing tasks
    editTask: function(id){
        toDoApp.editState = true; // now Enter key will edit the task
        const index = toDoApp.toDos.findIndex((todo) => todo.id === id);
        input.value = toDoApp.toDos[index].title;
        addBtn.style.display = "none";
        editBtn.style.display = "block";
        editBtn.onclick = () => {toDoApp.editBtnfunc(index)};
        input.addEventListener('keyup', (e)=>{
            if(e.keyCode === 13 && toDoApp.editState === true){
                toDoApp.editBtnfunc(index)
            }
        })
        
    },
    // for edit Button whenever it has been clicked
    editBtnfunc: function(index){
        if (input.value === ""){
            const modal = document.getElementById('modal');
            modal.style.display = "block";
            setInterval(()=>{
                modal.style.display = "none";
            }, 2000)
        } else {
        toDoApp.toDos[index].title = input.value;
        input.value = "";
        addBtn.style.display = "block";
        editBtn.style.display = "none";
        toDoApp.editState = false;
        toDoApp.render();}
        toDoApp.saveToLocalStorage();
    },
    // 2 function for saving and loading the tasks from local storage
    saveToLocalStorage: function(){
        localStorage.setItem('toDos', JSON.stringify(toDoApp.toDos));
    },
    loadLocalStorageData: function(){
        localStorage.getItem('toDos') ? toDoApp.toDos = JSON.parse(localStorage.getItem('toDos')) : toDoApp.toDos = [];
        toDoApp.render();
    }
}
// calling the functions. first load from local storage if there is any data
toDoApp.loadLocalStorageData();

// for adding tasks by click on Add button
addBtn.addEventListener('click', toDoApp.addToDo);

// for adding tasks by pressing enter
input.addEventListener('keyup', (e)=>{
    if(e.keyCode === 13 && toDoApp.editState === false){
        toDoApp.addToDo();
    }
})
