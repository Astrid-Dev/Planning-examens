const startingDateInput = document.getElementById("starting-date");
const endingDateInput = document.getElementById("ending-date");
const errorDiv = document.getElementById("date-interval-error");
const errorTextSpan = document.getElementById("error-text");
const datesResultDiv = document.getElementById("dates-result");

const DATE_INTERVAL_ERROR = "La date de fin doit être supérieure ou égale à la date de début !";

let possiblesDates = [];

let user = null;

let session = null;


function setSession(newSession)
{
	session = newSession.session;
}

function setDays(days)
{
	if(days && days.length > 0)
	{
		possiblesDates = [];
		days.forEach((elt) =>{
			possiblesDates.push({
				id: elt.id,
				date: new Date(elt.date),
				checked: true,
				sessionId: session?.id
			})
		});
		setDatesResultContent(possiblesDates);
	}
	console.log(days);
}

function hideErrorIntervalDiv(){
	errorDiv.style.display = "none";
}

function displayErrorIntervalDiv(){
	errorDiv.style.display = "block";
	errorTextSpan.textContent = DATE_INTERVAL_ERROR;
	alert(DATE_INTERVAL_ERROR);
}

function listDates()
{
	possiblesDates = [];
	let start = startingDateInput.value;
	let end = endingDateInput.value;
	
	if(start !== "" && end !== "")
	{
		let startingDate = new Date(start+", 00:00");
		let endingDate = new Date(end+", 00:00");
		
		if(startingDate.getTime() > endingDate.getTime())
		{
			displayErrorIntervalDiv();
		}
		else if(startingDate.getTime() === endingDate.getTime())
		{
			possiblesDates.push({
				id: 1,
				date: startingDate,
				checked: true,
				sessionId: session?.id
			});
		}
		else{
			
			let incomingDateTime = startingDate.getTime();
			
			let id = 1;
			while(incomingDateTime <= endingDate.getTime())
			{
				possiblesDates.push({
					id: id,
					date: new Date(incomingDateTime),
					checked: true,
					sessionId: session?.id
				});
				
				++id;
				
				incomingDateTime += (1000 * 60 * 60 * 24);
			}
		}
		
		if(possiblesDates.length > 0)
		{
			setDatesResultContent(possiblesDates);
		}
		
		console.log(possiblesDates);
	}
	else{
		alert("Veuillez renseigner la date de début et de fin des examens !")
	}
}

function setDatesResultContent(datesList)
{
	const header = "<thead>"+
					  "<tr>"+
					  	"<th>N°</th>"+
                        "<th>Dates</th>"+
                        "<th>Statuts</th>"+
                      "</tr>"+
					"</thead>";
					
	let body = "<tbody>";
	
	datesList.forEach((item, index) =>{
		body +="<tr>"+
					"<td>"+item.id+"</td>"+
					"<td>"+getDisplayDate(item.date)+"</td>"+
					"<td>"+
						"<fieldset>"+
                      		"<input onchange='onDayStatusChange(this, " + index+")' type='checkbox' id='day"+item.id+"'>"+
                    	"</fieldset>"+
                    "</td>"+
				"</tr>";
	});
	
	body += "</tbody>";
	datesResultDiv.innerHTML = header + body;
	
	datesList.forEach((item) =>{
		document.getElementById("day"+item.id).checked = item.checked;
	});
}


function getDisplayDate(date)
{
	return getDayName(date.getDay()) + ", " + date.getDate() + " "+ getMonthName(date.getMonth()) + " "+ date.getFullYear();
}

function getDayName(dayNumber)
{
	let result ="";
	
	if(dayNumber === 0)
	{
		result = "Dimanche";
	}
	else if(dayNumber === 1)
	{
		result = "Lundi";
	}
	else if(dayNumber === 2)
	{
		result = "Mardi";
	}
	else if(dayNumber === 3)
	{
		result = "Mercredi";
	}
	else if(dayNumber === 4)
	{
		result = "Jeudi";
	}
	else if(dayNumber === 5)
	{
		result = "Vendredi";
	}
	else if(dayNumber === 6)
	{
		result = "Samedi";
	}
	
	return result;
}

function getMonthName(monthNumber)
{
	let result ="";
	
	if(monthNumber === 0)
	{
		result = "Janvier";
	}
	else if(monthNumber === 1)
	{
		result = "Février";
	}
	else if(monthNumber === 2)
	{
		result = "Mars";
	}
	else if(monthNumber === 3)
	{
		result = "Avril";
	}
	else if(monthNumber === 4)
	{
		result = "Mai";
	}
	else if(monthNumber === 5)
	{
		result = "Juin";
	}
	else if(monthNumber === 6)
	{
		result = "Juillet";
	}
	else if(monthNumber === 7)
	{
		result = "Août";
	}
	else if(monthNumber === 8)
	{
		result = "Septembre";
	}
	else if(monthNumber === 9)
	{
		result = "Octobre";
	}
	else if(monthNumber === 10)
	{
		result = "Novembre";
	}
	else if(monthNumber === 11)
	{
		result = "Dècembre";
	}
	
	return result;
}

function onDayStatusChange(elt, index)
{
	possiblesDates[index].checked = !possiblesDates[index].checked;
	
	console.log(possiblesDates);
}

function next(){
	let data = [];
	
	possiblesDates.forEach((item) =>{
		if(item.checked)
		{
			data.push({
				id: item.id,
				date: item.date,
				sessionId: session?.id
			})
		}
	})
	
	if(data.length > 0)
	{
		const xmlhttp = new XMLHttpRequest();
	    xmlhttp.onreadystatechange = function(){
	      if(this.readyState == 4 && this.status == 201)
	      {
	        const result = this.responseText;
	        window.location.href = "/horaires";
	      }
	    }
	
	    xmlhttp.open("POST", "api/set-days", true);
		xmlhttp.setRequestHeader("Content-Type", "application/json")
	    xmlhttp.send(JSON.stringify(data));
	}
	else{
		alert("Veuillez ajouter un jour !")
	}
	
}