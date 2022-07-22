const planningResultElt = document.getElementById("planning-result");
const examSessionElt = document.getElementById("session");
const examStudentsNumberElt = document.getElementById("total");

let days = [];
let times = [];
let exams = [];
let rooms = [];
let planning = [];

function setDays(newDays){
	console.log(newDays);
	days = newDays;
}

function setRooms(newRooms){
	console.log(newRooms);
	rooms = newRooms;
}

function setTimes(newTimes){
	console.log(newTimes);
	times = newTimes;
}

function setExams(newExams){
	console.log(newExams);
	exams = newExams;
}

function setPlanning(newPlanning){
	console.log(newPlanning);
	planning = newPlanning;
	
	planning.forEach((plan, index, array) =>{
		array[index] = {
			...plan,
			day: days.find(elt => elt.id === plan.dayId),
			time: times.find(elt => elt.id === plan.timeId),
			room: plan.roomId !== null ? rooms.find(elt => elt.id === plan.roomId) : null,
			exam: plan.examId !== null ? exams.find(elt => elt.id === plan.examId) : null,
		}
	});
}

function showPlanning(){
	let temp = planning.filter(elt => elt.examId !== null);
	let body = "";
	let studentsNumber = 0;
	
	temp.forEach((elt, index) =>{
		studentsNumber += (elt.exam ? elt.exam.studentsNumber : 0);
		body += "<tr>"+
					"<td>"+ (index + 1)+ "</td>"+
					"<td>"+new Date(elt.day.date).toLocaleDateString()+"</td>"+
					"<td>"+ elt.time.label + "</td>"+
					"<td>"+ elt.exam.teacher + "</td>"+
					"<td>"+ elt.exam.teachingUnit+"</td>"+
					"<td>"+ (elt.room ? elt.room.code : "Non renseignée") + "</td>"+
				"</tr>";
	});
	
	let startDate = new Date(days[0].date);
	let endDate = new Date(days[days.length  - 1].date);
	
	let duration = "Du " + startDate.getDate() + " " + getMonthName(startDate.getMonth()) + " au " + endDate.getDate() + " " + getMonthName(endDate.getMonth()) + " " + endDate.getFullYear();
	examStudentsNumberElt.textContent = studentsNumber;
	examSessionElt.textContent = duration;
	planningResultElt.innerHTML = body;
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