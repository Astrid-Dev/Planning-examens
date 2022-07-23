const dropArea = document.querySelector(".drag-area"),
dragText = dropArea.querySelector(".drag-header"),
button = dropArea.querySelector(".browse-button"),
input = dropArea.querySelector(".upload-input");

const progressDiv = document.getElementById("progress");
const progressDivCont = document.getElementById("progress-cont");

const importDiv = document.getElementById("import");
const fileNameElt = document.getElementById("file-name");

const startingHourInput = document.getElementById("starting-hour");
const endingHourInput = document.getElementById("ending-hour");

const errorDiv = document.getElementById("time-interval-error");
const errorTextSpan = document.getElementById("error-text");

const timesResultDiv = document.getElementById("times-result");

const TIME_INTERVAL_ERROR = "L'heure de fin doit être supérieure à l'heure de début !";

let timesList = [];


let file = null;
let progress = 0;

let session = null;


function setSession(newSession)
{
	session = newSession.session;
}

function setTimes(newTimes)
{
	if(newTimes && newTimes.length > 0)
	{
		timesList = [];
		newTimes.forEach((elt) =>{
			timesList.push({
				id: elt.id,
				start: elt.start,
				end: elt.end,
				label: elt.label,
				sessionId: session?.id
			});
		});
		setTimesResultContent();
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
						let start = row.split(";")[0].replace("\r", "").replace("\t", "");
						let end = row.split(";")[1].replace("\r", "").replace("\t", "");
						addTimeToList(start, end);
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

function addTime()
{
	let start = startingHourInput.value;
	let end = endingHourInput.value;
	
	if(start !== "" && end !== "")
	{	
		let startingDate = new Date("2002-10-10, "+start);
		let endingDate = new Date("2002-10-10, "+end);
		
		if(startingDate.getTime() >= endingDate.getTime())
		{
			displayErrorIntervalDiv();
		}
		else{
			
			addTimeToList(start, end);
			startingHourInput.value = "";
			endingHourInput.value = "";
		}
	}
	else{
		alert("Veuillez renseigner l'heure de début et de fin de la plage !")
	}
}

function addTimeToList(startingHour, endingHour)
{
	timesList.push({
		id: timesList.length+1,
		start: startingHour.replace(":", "h"),
		end: endingHour.replace(":", "h"),
		label: startingHour.replace(":", "h")+  " - " +endingHour.replace(":", "h"),
		sessionId: session?.id
	});
	
	timesList.sort((a, b) =>{
		let date1 = new Date("2002-10-10, ".concat(a.start.replace("h", ":")));
		let date2 = new Date("2002-10-10, ".concat(b.start.replace("h", ":")));
		
		if(date1.getTime() === date2.getTime())
		{
			return 0;
		}
		else if(date1.getTime() > date2.getTime())
		{
			return 1;
		}
		else
		{
			return -1;
		}
	});
	
	setTimesResultContent();
}

function deleteTimeFromTable(index){
	timesList = timesList.filter((item, i) =>{
		return index !== i;
	});
	setTimesResultContent();
}

function setTimesResultContent()
{
	if(timesList.length === 0)
	{
		timesResultDiv.innerHTML = "";
	}
	else{
		
		let id = 1;
		
		timesList.forEach((item, index, array) =>{
			array[index].id = id;
			++id;
		});
		
		const header = "<thead>"+
						  "<tr>"+
						  	"<th>N°</th>"+
	                        "<th>Heure de début</th>"+
	                        "<th>Heure de fin</th>"+
	                        "<th>Supprimer</th>"+
	                      "</tr>"+
						"</thead>";
						
		let body = "<tbody>";
		
		timesList.forEach((item, index) =>{
			body +="<tr>"+
						"<td>"+item.id+"</td>"+
						"<td>"+item.start+"</td>"+
						"<td>"+item.end+"</td>"+
						"<td>"+
							"<i onclick='deleteTimeFromTable("+index+")' class='clickable fa fa-close text-danger'></i>"+
	                    "</td>"+
					"</tr>";
		});
		
		body += "</tbody>";
		timesResultDiv.innerHTML = header + body;
	}
	
}

function hideErrorIntervalDiv(){
	errorDiv.style.display = "none";
}

function displayErrorIntervalDiv(){
	errorDiv.style.display = "block";
	errorTextSpan.textContent = TIME_INTERVAL_ERROR;
	alert(TIME_INTERVAL_ERROR);
}

function next(){
	
	if(timesList.length > 0)
	{
		const xmlhttp = new XMLHttpRequest();
	    xmlhttp.onreadystatechange = function(){
	      if(this.readyState == 4 && this.status == 201)
	      {
	        const result = this.responseText;
	        window.location.href = "/salles";
	      }
	    }
	
	    xmlhttp.open("POST", "api/set-times", true);
		xmlhttp.setRequestHeader("Content-Type", "application/json")
	    xmlhttp.send(JSON.stringify(timesList));
	}
	else{
		alert("Veuillez ajouter une plage horaire !")
	}
	
}

