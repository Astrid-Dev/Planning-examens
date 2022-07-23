const dropArea = document.querySelector(".drag-area"),
dragText = dropArea.querySelector(".drag-header"),
button = dropArea.querySelector(".browse-button"),
input = dropArea.querySelector(".upload-input");

const progressDiv = document.getElementById("progress");
const progressDivCont = document.getElementById("progress-cont");

const importDiv = document.getElementById("import");
const fileNameElt = document.getElementById("file-name");

const codeInput = document.getElementById("room-code");
const capacityInput = document.getElementById("room-capacity");

const errorDiv = document.getElementById("required-error");
const errorTextSpan = document.getElementById("error-text");

const roomsResultDiv = document.getElementById("rooms-result");

const SUBMIT_ERROR = "Le code et la capacité sont requis !";

let roomsList = [];


let file = null;
let progress = 0; 

let session = null;


function setSession(newSession)
{
	session = newSession.session;
}

function setRooms(newRooms)
{
	if(newRooms && newRooms.length > 0)
	{
		roomsList = [];
		newRooms.forEach((elt) =>{
			roomsList.push({
				id: elt.id,
				code: elt.code.toUpperCase(),
				capacity: elt.capacity,
				sessionId: session?.id
			})
		});
		setRoomsResultContent();
	}
}

button.onclick = ()=>{
  input.click(); 
}

input.addEventListener("change", function(){
  if(isValidFileType(this.files[0]))
  {
	file = event.dataTransfer.files[0];
	uploadFileSimulator(file);
  }
  dropArea.classList.add("active");
  showFile(); 
});

dropArea.addEventListener("dragover", (event)=>{
  event.preventDefault();
  dropArea.classList.add("active");
  dragText.textContent = "Relâchez pour charger";
});


dropArea.addEventListener("dragleave", ()=>{
  dropArea.classList.remove("active");
  dragText.textContent = "Glissez et déposez votre fichier ici";
});


dropArea.addEventListener("drop", (event)=>{
  event.preventDefault();
  if(isValidFileType(event.dataTransfer.files[0]))
  {
	file = event.dataTransfer.files[0];
	uploadFileSimulator(file);
  }
});

function isValidFileType(file)
{
	let validExtensions = [".csv", "text/csv"];
	let fileType = file?.type; 
	let result = false;
  	if(validExtensions.includes(fileType)){
		result = true;
	}
	else{
  		alert("Uniquement les fichiers .csv sont permis !");
	    result = false;
	}
	
	dropArea.classList.remove("active");
  	dragText.textContent = "Glissez et déposez votre fichier ici";
  	
  	return result;
}

function uploadFileSimulator(file) {
	progress = 0;
    setTimeout(() => {
      if (!file) {
        return;
      } else {
		showProgress(0);
        showImportDiv(file.name);
        const progressInterval = setInterval(() => {
          if (progress === 100) {
            clearInterval(progressInterval);
            hideProgress();
            readFile();
          } else {
            progress += 5;
            showProgress(progress);
          }
        }, 200);
      }
    }, 1000);
  }
  
function showProgress(progress)
{
	progressDiv.style.width = (450 * progress/100)+"px";
	progressDivCont.style.display = "block";
}

function hideProgress(){
	progress = 0;
	progressDivCont.style.display = "none";
	hideImportDiv();
}

function hideImportDiv(){
	importDiv.style.display = "none";
}

function showImportDiv(filename){
	importDiv.style.display = "block";
	fileNameElt.textContent = filename;
}

function readFile(){
	
	
	let fileReader = new FileReader();
	
	fileReader.onloadend = function(){
		let url = this.result;
		console.log(url);
		
		const xmlhttp = new XMLHttpRequest();
	    xmlhttp.onreadystatechange = function(){
	      if(this.readyState == 4 && this.status == 200)
	      {
	        const result = this.responseText;
	        
	        let list = result.split("\n");
	        if(list.length > 1)
	        {
				list.forEach((row, index) =>{
					if(index > 0 && row !== ""){
						let code = row.split(";")[0].replace("\r", "").replace("\t", "");
						let capacity = row.split(";")[1].replace("\r", "").replace("\t", "");
						addRoomToList(code, capacity);
					}
				});
				removeFile();
			}
	        console.log(result);
	      }
	    }
	
	    xmlhttp.open("GET", url, true);
	    xmlhttp.send();
	};
	
	fileReader.readAsDataURL(file);
	
}

function removeFile()
{
	file = null;
}

function addRoom()
{
	let code = codeInput.value;
	let capacity = capacityInput.value;
	
	if(code !== "" && capacity !== "")
	{	
		addRoomToList(code, capacity);
		codeInput.value = "";
		capacityInput.value = "";
	}
	else{
		alert(SUBMIT_ERROR);
	}
}

function addRoomToList(code, capacity)
{
	roomsList.push({
		id: roomsList.length+1,
		code: code.toUpperCase(),
		capacity: capacity,
		sessionId: session?.id
	});
	
	roomsList.sort((a, b) =>{
		return a.code.localeCompare(b.code);
	});
	
	setRoomsResultContent();
}

function deleteRoomFromTable(index){
	roomsList = roomsList.filter((item, i) =>{
		return index !== i;
	});
	setRoomsResultContent();
}

function setRoomsResultContent()
{
	if(roomsList.length === 0)
	{
		roomsResultDiv.innerHTML = "";
	}
	else{
		
		let id = 1;
		
		roomsList.forEach((item, index, array) =>{
			array[index].id = id;
			++id;
		});
		
		const header = "<thead>"+
						  "<tr>"+
						  	"<th>N°</th>"+
	                        "<th>Code</th>"+
	                        "<th>Capacité</th>"+
	                        "<th>Supprimer</th>"+
	                      "</tr>"+
						"</thead>";
						
		let body = "<tbody>";
		
		roomsList.forEach((item, index) =>{
			body +="<tr>"+
						"<td>"+item.id+"</td>"+
						"<td>"+item.code+"</td>"+
						"<td>"+item.capacity+"</td>"+
						"<td>"+
							"<i onclick='deleteRoomFromTable("+index+")' class='clickable fa fa-close text-danger'></i>"+
	                    "</td>"+
					"</tr>";
		});
		
		body += "</tbody>";
		roomsResultDiv.innerHTML = header + body;
	}
	
}


function next(){
	
	if(roomsList.length > 0)
	{
		const xmlhttp = new XMLHttpRequest();
	    xmlhttp.onreadystatechange = function(){
	      if(this.readyState == 4 && this.status == 201)
	      {
	        const result = this.responseText;
	        window.location.href = "/examens";
	      }
	    }
	
	    xmlhttp.open("POST", "api/set-rooms", true);
		xmlhttp.setRequestHeader("Content-Type", "application/json")
	    xmlhttp.send(JSON.stringify(roomsList));
	}
	else{
		alert("Veuillez ajouter une salle !")
	}
	
}


