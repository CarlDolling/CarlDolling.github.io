let colors = [];
let creatures = [];
let creatureCount = 0;

function generateMap(){
    let container = document.getElementById("map-container");
    for (let i = 0; i < 700; i++) {
        container.innerHTML += `<div class="grid-item drop-area" id="`+ i +`" onclick="toggleColor(this)"></div>`;
    }
    let dropItems = document.querySelectorAll(".drop-item");
    dropItems.forEach((element) => {
        element.draggable = true;
        element.addEventListener("dragstart", dragStart, false);
        element.addEventListener("dragover", dragOver, false);
        element.addEventListener("drop", drop, false);
        element.addEventListener("touchstart", dragStart, false);
        element.addEventListener("touchmove", drop, false);
    });
    let dragItems = document.querySelectorAll(".drag-item");
    dragItems.forEach((element) => {
        element.draggable = true;
        element.addEventListener("dragstart", dragStart, false);
        element.addEventListener("drop", drop, false);
        element.addEventListener("touchstart", dragStart, false);
        element.addEventListener("touchmove", drop, false);
    });
    let dropAreas = document.querySelectorAll(".drop-area");
    dropAreas.forEach((element) => {
        element.addEventListener("dragover", dragOver, false);
        element.addEventListener("drop", drop, false);
        element.addEventListener("touchstart", dragStart, false);
        element.addEventListener("touchmove", drop, false);
    });
}
function setCustomMap(event){
    let map_container = document.getElementById("map-container");
    map_container.setAttribute("style", "background-image: url('" + URL.createObjectURL(event.target.files[0]) + "')");
}
function updateInitiative(input){
    creatures[input.id.substring(20)] = parseInt(input.value);
    input.setAttribute("value", input.value);
    sortInitiatives();
}
function sortInitiatives(){
    let tmp = [];
    for (let i = 0; i < creatures.length; i++) {
        tmp.push({id: i, ini: creatures[i]});        
    }
    tmp.sort(function(a, b) {
        if (a.ini < b.ini) return 1;
        if (a.ini > b.ini) return -1;
        return 0;
    });
    let orderedList = "";
    for (let i = 0; i < creatures.length; i++) {
        orderedList += document.getElementById("creature-menu-"+ tmp[i].id).outerHTML;
    }
    let creatureList = document.getElementById("creature-list");
    creatureList.innerHTML = orderedList;
    console.log(tmp)
}
function addCreature(){
    let square = document.getElementById("0");
    square.innerHTML += `<div class="creature tooltip drop-item cred" id="creature-`+ creatureCount +`"><span id="tt-`+ creatureCount +`" class="tooltiptext">Creature `+ creatureCount +`</span><span id="dtt-`+ creatureCount +`" class="distancetooltip"></span></div>`;
    
    let dropItems = document.querySelectorAll(".drop-item");
    dropItems.forEach((element) => {
        element.draggable = true;
        element.addEventListener("dragstart", dragStart, false);
        element.addEventListener("dragover", dragOver, false);
        element.addEventListener("drop", drop, false);
        element.addEventListener("touchstart", dragStart, false);
        element.addEventListener("touchmove", drop, false);
    });

    let creatureList = document.getElementById("creature-list");
    creatureList.innerHTML += `
    <div class="creature-menu" id="creature-menu-`+ creatureCount +`">
        <br>
        <input type="text" class="creature-input" value="Creature `+ creatureCount +`" id="creature-name-`+ creatureCount +`" onchange="updateTooltip(this)">
        <input type="number" class="initiative-input" value="10" id="creature-initiative-`+ creatureCount +`" onchange="updateInitiative(this)">
        <select id="creature-color-`+ creatureCount +`" onchange="updateColor(this)">
            <option value="cred">Red</option>
            <option value="cblue">Blue</option>
            <option value="cgreen">Green</option>
            <option value="cpink">Pink</option>
            <option value="cyellow">Yellow</option>
            <option value="cpurple">Purple</option>
            <option value="cbrown">Brown</option>
            <option value="cblack">Black</option>
        </select>
        <button class="remove-btn" id="remove-`+ creatureCount +`" onclick="removeCreature(this)">X</button>
    </div>`;
    colors[creatureCount] = "cred"; //default color
    creatures[creatureCount] = 10;
    ++creatureCount;
    for (let i = 0; i < creatureCount; i++) {
        try{
            let cpicker = document.getElementById("creature-color-"+i);
            cpicker.value = colors[i];    
        } catch {

        }
            
    }
    sortInitiatives();
}
function removeCreature(btn){
    let number = btn.id.substring(7);
    let square = document.getElementById("creature-" + number);
    let cmenu = document.getElementById("creature-menu-" + number);
    square.remove();
    cmenu.remove();
}
function updateTooltip(input){
    input.setAttribute("value", input.value);
    let number = input.id.substring(14);
    let ttip = document.getElementById("tt-"+number);
    ttip.innerHTML = input.value;
}
function updateColor(select){
    let val = select.value;
    let number = select.id.substring(15);
    colors[number] = val;
    let creature = document.getElementById("creature-" + number);

    creature.classList.remove("cred");
    creature.classList.remove("cblue");
    creature.classList.remove("cgreen");
    creature.classList.remove("cpink");
    creature.classList.remove("cyellow");

    creature.classList.add(val);
}
function updateMap(select){
    let map_container = document.getElementById("map-container");

    if(select.value == "none") {
        map_container.removeAttribute("style");
    } else {
        map_container.setAttribute("style", "background-image: url('./map_images/" + select.value + "')");
    }
    
}


let currentElement = "";
let currentDistanceTooltip = "";
let startDrag = "";
let lastDrag = "";
let initialX = 0, initialY = 0;

function calculateDistance(start, end){
    let vertical = Math.abs(Math.floor(start / 35)-Math.floor(end / 35));
    let horizontal = Math.abs(Math.abs(start-end) - (vertical * 35));
    distance = Math.round(Math.sqrt(Math.pow(vertical,2) + Math.pow(horizontal,2))) * 5;
    currentDistanceTooltip.innerHTML = distance + "ft";
}

const isTouchDevice = () => {
    try {
      document.createEvent("TouchEvent");
      return true;
    } catch (e) {
      return false;
    }
};

function dragStart(e) {
    initialX = isTouchDevice() ? e.touches[0].clientX : e.clientX;
    initialY = isTouchDevice() ? e.touches[0].clientY : e.clientY;
    
    if(e.target.classList.contains("drag-item")){
      currentElement = e.target.cloneNode(true);
      currentElement.classList.remove("drag-item");
      currentElement.classList.add("drop-item");
    } else {
      currentElement = e.target;
    }
    if(currentElement.classList.contains("tooltip")){
        let number = currentElement.id.substring(9);
        let dtt = document.getElementById("dtt-"+number);
        startDrag = currentElement.parentElement.id;
        currentDistanceTooltip = dtt;
        currentDistanceTooltip.setAttribute("style", "visibility: visible");
    }
}
function dragOver(e) {
    e.preventDefault();
    if(e.target.classList.contains("drop-area") && e.target.id != lastDrag){
        lastDrag = e.target.id;
        calculateDistance(startDrag, lastDrag);
    }
}

const drop = (e) => {
    e.preventDefault();
    let newX = isTouchDevice() ? e.touches[0].clientX : e.clientX;
    let newY = isTouchDevice() ? e.touches[0].clientY : e.clientY;

    let targetElement = document.elementFromPoint(newX, newY);
    if(targetElement.classList.contains("drop-item")){
        try {
            targetElement.insertAdjacentElement("afterend", currentElement);
        } catch (err) {}
    }
    if(targetElement.classList.contains("drop-area")){
        try {
            targetElement.append(currentElement);
        } catch (err) {}
    }
    currentDistanceTooltip.setAttribute("style", "visibility: hidden");
    currentDistanceTooltip.innerHTML = "";
    currentDistanceTooltip = "";
    currentElement = "";
    startDrag = "";
    lastDrag = "";
};
function toggleColor(element){
    if(!element.innerHTML){
        if(element.classList.contains("clightgrey")){
            element.classList.remove("clightgrey")
        } else {
            element.classList.add("clightgrey")
        }
    }
}