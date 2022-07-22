const dropArea = document.querySelector(".drag-area"),
dragText = dropArea.querySelector(".drag-header"),
button = dropArea.querySelector(".browse-button"),
input = dropArea.querySelector(".upload-input");

const progressDiv = document.getElementById("progress");
const progressDivCont = document.getElementById("progress-cont");

const importDiv = document.getElementById("import");
const fileNameElt = document.getElementById("file-name");

const teachingUnitInput = document.getElementById("teaching-unit-code");
const studentsNumberInput = document.getElementById("exam-students-number");
const teacherInput = document.getElementById("exam-teacher");

const errorDiv = document.getElementById("required-error");
const errorTextSpan = document.getElementById("error-text");

const examsResultDiv = document.getElementById("exams-result");

const SUBMIT_ERROR = "L'unité d'enseignement et l'effectif' sont requis !";

let examsList = [];


let file = null;
let progress = 0; 

let session = null;


function setSession(newSession)
{
	session = newSession.session;
}

function setExams(newExams)
{
	if(newExams && newExams.length > 0)
	{
		examsList = [];
		newExams.forEach((elt) =>{
			examsList.push({
				id: elt.id,
				teachingUnit: elt.teachingUnit,
				studentsNumber: elt.studentsNumber,
				teacher: elt.teacher,
				sessionId: session?.id
			})
		});
		setExamsResultContent();
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
						let teachingUnit = row.split(";")[0].replace("\r", "").replace("\t", "");
						let studentsNumber = row.split(";")[1].replace("\r", "").replace("\t", "");
						let teacher = row.split(";")[2].replace("\r", "").replace("\t", "");
						addExamToList(teachingUnit, studentsNumber, teacher);
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

function addExam()
{
	let teachingUnit = teachingUnitInput.value;
	let studentsNumber = studentsNumberInput.value;
	let teacher = teacherInput.value;
	
	if(teachingUnit !== "" && (studentsNumber !== "" && !isNaN(parseInt(studentsNumber))) && teacher !== "")
	{	
		addExamToList(teachingUnit, studentsNumber, teacher);
		teachingUnitInput.value = "";
		studentsNumberInput.value = "";
		teacherInput.value = "";
	}
	else{
		alert(SUBMIT_ERROR);
	}
}

function addExamToList(teachingUnit, studentsNumber, teacher)
{
	examsList.push({
		id: examsList.length+1,
		teachingUnit: teachingUnit.toUpperCase(),
		studentsNumber: studentsNumber,
		teacher: teacher,
		sessionId: session?.id
	});
	
	examsList.sort((a, b) =>{
		return a.teachingUnit.localeCompare(b.teachingUnit);
	});
	
	setExamsResultContent();
}

function deleteExamFromTable(index){
	examsList = examsList.filter((item, i) =>{
		return index !== i;
	});
	setExamsResultContent();
}

function setExamsResultContent()
{
	if(examsList.length === 0)
	{
		examsResultDiv.innerHTML = "";
	}
	else{
		
		let id = 1;
		
		examsList.forEach((item, index, array) =>{
			array[index].id = id;
			++id;
		});
		
		const header = "<thead>"+
						  "<tr>"+
						  	"<th>N°</th>"+
	                        "<th>Unité d'enseignement</th>"+
	                        "<th>Effectif</th>"+
	                        "<th>Enseignant</th>"+
	                        "<th>Supprimer</th>"+
	                      "</tr>"+
						"</thead>";
						
		let body = "<tbody>";
		
		examsList.forEach((item, index) =>{
			body +="<tr>"+
						"<td>"+item.id+"</td>"+
						"<td>"+item.teachingUnit+"</td>"+
						"<td>"+item.studentsNumber+"</td>"+
						"<td>"+item.teacher+"</td>"+
						"<td>"+
							"<i onclick='deleteExamFromTable("+index+")' class='clickable fa fa-close text-danger'></i>"+
	                    "</td>"+
					"</tr>";
		});
		
		body += "</tbody>";
		examsResultDiv.innerHTML = header + body;
	}
	
}

function next(){
	
	if(examsList.length > 0)
	{
		console.log(examsList)
		const xmlhttp = new XMLHttpRequest();
	    xmlhttp.onreadystatechange = function(){
	      if(this.readyState == 4 && this.status == 201)
	      {
	        const result = this.responseText;
	        window.location.href = "/contraintes";
	      }
	    }
	
	    xmlhttp.open("POST", "api/set-exams", true);
		xmlhttp.setRequestHeader("Content-Type", "application/json")
	    xmlhttp.send(JSON.stringify(examsList));
	}
	else{
		alert("Veuillez ajouter un examen !")
	}
	
}

