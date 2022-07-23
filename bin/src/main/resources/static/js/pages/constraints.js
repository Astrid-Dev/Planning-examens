const weekSelect = document.getElementById("week-select");
const planningTable = document.getElementById("week-planning-table");
const planningCeilTitleElt = document.getElementById("planningCeilTitle");
const examsSelect = document.getElementById("exam");
const roomsSelect = document.getElementById("room");
		
const oneWeek = (1000 * 60 * 60 * 24 * 7) - 1000;
const oneDay = (1000 * 60 * 60 * 24);

let session = null;


function setSession(newSession)
{
	session = newSession.session;
	console.log(session)
}

let days = [];
let times = [];
let exams = [];
let rooms = [];

let weekPlanning = [];

let currentCeilPlanning = null;
let currentCeilIndex = 0;

let selectedWeek = 0;

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

function generatePlanning()
{
	planning = [];
	
	let possiblesPlanningIndex = [];
	
	for(let i = 0; i < days.length; i++)
	{
		for(let j = 0; j < times.length; j++)
		{
			possiblesPlanningIndex.push(planning.length);
			planning.push({
				id: planning.length + 1,
				dayId: days[i].id,
				day: days[i],
				timeId: times[j].id,
				time: times[j],
				examId: null,
				exam: null,
				roomId: null,
				room: null,
				sessionId: session?.id
			});
		}
	}
	
	for(let i = 0; i < exams.length; i++)
	{
		const exam = exams[i];
		
		if(possiblesPlanningIndex.length > 0)
		{
			let random = getRandomInt(0, possiblesPlanningIndex.length-1);
			let randomPlanningIndex = possiblesPlanningIndex[random];
			
			for(let i = random; i < possiblesPlanningIndex.length - 1; i++)
			{
				let temp = possiblesPlanningIndex[i];
				possiblesPlanningIndex[i] = possiblesPlanningIndex[i+1];
				possiblesPlanningIndex[i+1] = temp;
			}
			
			possiblesPlanningIndex.pop();
			
			let possiblesExams = getPossiblesExams();
			if(possiblesExams.length > 0)
			{
				let randomExam = possiblesExams[getRandomInt(0, possiblesExams.length-1)];
				
				let possiblesRooms = getPossiblesRoomsForExam(randomExam.studentsNumber);
				let room = possiblesRooms.length === 0 ? null : possiblesRooms[getRandomInt(0, possiblesRooms.length-1)];
				
				planning[randomPlanningIndex].exam = randomExam;
				planning[randomPlanningIndex].examId = randomExam.id;
				planning[randomPlanningIndex].room = room;
				planning[randomPlanningIndex].roomId = room === null ? null : room.id;
			}
			else{
				break;
			}
		}
		else{
			break;
		}
	}
	
	console.log(planning);
	
	console.log(getWeekList());
	
	setWeekSelectOptions();
	setPlanningContent();

}

function getPossiblesExams()
{
	let plannedExamsId = planning.map(elt => elt.examId);
	return exams.filter(exam => !plannedExamsId.includes(exam.id));
}

function getPossiblesRoomsForExam(examStudentsNumber)
{	
	return rooms.filter(room => (examStudentsNumber > 0 ? (examStudentsNumber >= (room.capacity * 0.5) && examStudentsNumber <= room.capacity): true))
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getWeekList()
{
	let result = [];
	if(days.length > 0)
	{
		let minDate = days[0];
		let maxDate = days[0];
		for(let i = 0; i < days.length; i++)
		{
			if(new Date(days[i].date).getTime() < new Date(minDate.date).getTime())
			{
				minDate = days[i];
			}
			
			if(new Date(days[i].date).getTime() > new Date(maxDate.date).getTime())
			{
				maxDate = days[i];
			}
		}
		
		let minTime = new Date(minDate.date).getTime();
		let maxTime = new Date(maxDate.date).getTime();
		
		
		
		while(new Date(minTime).getDay() !== 1)
		{
			minTime = minTime - oneDay;
		}
		
		while(new Date(maxTime).getDay() !== 0)
		{
			maxTime = maxTime + oneDay;
		}
		
		maxTime += oneDay - 1000;
		
		let currentMin = minTime;
		let currentMax = minTime + oneWeek;
		
		while(currentMax <= maxTime)
		{
			
			result.push({
				id: result.length + 1,
				start: currentMin,
				end: currentMax,
				label: new Date(currentMin).toLocaleDateString() + " au " + new Date(currentMax).toLocaleDateString()
			});
			
			currentMin = currentMax + 1000;
			currentMax = currentMin + oneWeek;
		}
	}
	
	
	return result;
}

function setWeekSelectOptions()
{
	let weeks = getWeekList();
	
	weekSelect.innerHTML = "";
		
	weeks.forEach((week, index) =>{
		weekSelect.innerHTML += "<option value='"+index+"'>"+week.label+"</option>"
	});
}

function setPlanningContent()
{
	
	let currentWeek = getWeekList()[selectedWeek];
	
	let date = currentWeek.start;
	
	let weekDays = [];
	while(date <= currentWeek.end)
	{
		weekDays.push({
			date: date,
			display: getDayName(new Date(date).getDay()),
		})
		date += oneDay;
	}
	
	
	let head = "<thead><tr><th>Horaires</th>";
	
	weekDays.forEach((day) =>{
		head += "<th><div>"+day.display+"</div><span class='date-description'>"+new Date(day.date).toLocaleDateString()+"</span></th>";
	})
	
	head += "</tr></thead>";
			                   	
  	weekPlanning = [];
  	
  	let temp = planning.filter((item) =>{
		let date = new Date(item.day.date).getTime(); 
		return date >= new Date(currentWeek.start).getTime() && date <= new Date(currentWeek.end).getTime();
	});
	
	let usedDays = days.filter((item) =>{
		let date = new Date(item.date).getTime();
		return (date >= new Date(currentWeek.start).getTime()) && (date <= new Date(currentWeek.end).getTime());	
	})
	
	let allDayPlanning = usedDays.map((elt) =>{
				return new Date(elt.date).getDay();
			});
	
	let body= "<tbody>";
	times.forEach((time, timeIndex) =>{
		
		body += "<tr><th>"+time.label+"</th>";
		weekDays.forEach((day, dayIndex) =>{
			
			
			let dayPlanning = temp.find((elt) =>{
				return new Date(elt.day.date).getDay() === new Date(day.date).getDay() && elt.time.id === time.id;
			});
			
			let plan = null;
			
			let canModify = allDayPlanning.includes(new Date(day.date).getDay());
		
			if(dayPlanning)
			{
				plan = {
					...dayPlanning,
					canModify: canModify,
					id: weekPlanning.length + 1,
					day: day,
					dayId: day.id,
					time: time,
					id: time.id
				}
			}
			else{
				plan = {
					id: weekPlanning.length + 1,
					examId: null,
					exam: null,
					room: null,
					roomId: null,
					canModify: canModify,
					day: day,
					dayId: day.id,
					time: time,
					id: time.id
				}
			}
			
			weekPlanning.push(plan);
			
			body += "<td "+(plan.canModify ? "onclick='openModal("+JSON.stringify(plan)+")' data-toggle='modal' data-target='#constraintModal' class='clickable'" : "")+">"+
					"<div>"+getExamCode(plan.exam)+"</div>"+
					"<div>"+getRoomCode(plan.room)+"</div>"+
				"</td>"
			
		})
		
		body +="</tr>";
		
	})
	body += "</tbody>";
	
	
	
	planningTable.innerHTML = head + body;
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


function onChangeWeekPlanning(index)
{
	selectedWeek = parseInt(index);
	setPlanningContent();
}

function getExamCode(exam)
{
	return exam !== null ? exam.teachingUnit : "";
}

function getRoomCode(room)
{
	return room !== null ? room.code : "";
}


function openModal(ceilPlanning, index)
{
	currentCeilIndex = index;
	currentCeilPlanning = ceilPlanning;
	
	let date = new Date(ceilPlanning.day.date);
	
	planningCeilTitleElt.textContent = getDayName(date.getDay())+", "+ date.toLocaleDateString() + " De "+ ceilPlanning.time.start + " À " + ceilPlanning.time.end;
	
	
	let examsToShow = exams.filter(elt => elt.id !== ceilPlanning.examId);
	let examStudentsNumber = ceilPlanning.exam === null ? 0 : ceilPlanning.exam.studentsNumber;
	let roomsToShow = getPossiblesRoomsForExam(examStudentsNumber);
	console.log(roomsToShow)
	
	let examsOptions = "";
	let roomsOptions = "";
	
	if(ceilPlanning.examId === null)
	{
		examsOptions += "<option value='' hiddden disabled selected>Choisissez une UE</option>";
	}
	
	if(ceilPlanning.roomId === null)
	{
		roomsOptions += "<option value='' hiddden disabled selected>Choisissez une Salle</option>";
	}
	
	examsToShow.forEach((elt) =>{
		examsOptions += "<option value='"+elt.id+"'>"+elt.teachingUnit+"</option>";
	});
	
	roomsToShow.forEach((elt) =>{
		roomsOptions += "<option value='"+elt.id+"'>"+elt.code+"</option>";
	});
	
	examsSelect.value = ceilPlanning.examId !==  null ? ceilPlanning.examId.toString() : '';
	roomsSelect.value = ceilPlanning.roomId !==  null ? ceilPlanning.roomId.toString() : '';
	
	examsSelect.innerHTML = examsOptions;
	roomsSelect.innerHTML = roomsOptions;
	
	if(ceilPlanning.examId === null)
	{
		roomsSelect.disabled = true;
	}
	
	console.log(ceilPlanning)
}

function onExamChange()
{
	let examId = parseInt(examsSelect.value);
	let exam = exams.find(elt => elt.id === examId);
	currentCeilPlanning = {
		...currentCeilPlanning,
		examId: examId,
		exam: exam
	}
	
	let roomsToShow = getPossiblesRoomsForExam(exam.studentsNumber);
	let roomsOptions = "<option value='' hiddden disabled selected>Choisissez une Salle</option>";
	
	roomsToShow.forEach((elt) =>{
		roomsOptions += "<option value='"+elt.id+"'>"+elt.code+"</option>";
	});
	
	roomsSelect.value = "";
	
	roomsSelect.innerHTML = roomsOptions;
	
	roomsSelect.disabled = false;
}

function onRoomChange()
{
	let roomId = parseInt(roomsSelect.value);
	let room = rooms.find(elt => elt.id === roomId);

	currentCeilPlanning = {
		...currentCeilPlanning,
		roomId: roomId,
		room: room
	}
	
	console.log(currentCeilPlanning);
}

function onApplyChange()
{
	
	let previousData = planning.find(elt => elt.examId === currentCeilPlanning.examId && ((new Date(elt.day.date).getTime() !== new Date(currentCeilPlanning.day.date).getTime()) || (elt.time.label !== currentCeilPlanning.time.label)));
	
	planning.forEach((elt, index, array) =>{
			if(new Date(elt.day.date).getTime() === new Date(currentCeilPlanning.day.date).getTime() && elt.time.label === currentCeilPlanning.time.label)
			{
				let {id, canModify, ...temp} = currentCeilPlanning;
				array[index] = {
					id: elt.id,
					...temp
				}
			}
			else if(new Date(elt.day.date).getTime() === new Date(previousData.day.date).getTime() && elt.time.label === previousData.time.label)
			{
				let {id, canModify, ...temp} = previousData;
				array[index] = {
					id: elt.id,
					...temp,
					exam: null,
					examId: null,
					room: null,
					roomId: null
				}
			}
		});
		
		weekPlanning.forEach((elt, index, array) =>{
			if(new Date(elt.day.date).getTime() === new Date(currentCeilPlanning.day.date).getTime() && elt.time.label === currentCeilPlanning.time.label)
			{
				let {id, canModify, ...temp} = currentCeilPlanning;
				array[index] = {
					id: elt.id,
					...temp
				}
			}
			else if(new Date(elt.day.date).getTime() === new Date(previousData.day.date).getTime() && elt.time.label === previousData.time.label)
			{
				let {id, canModify, ...temp} = previousData;
				array[index] = {
					id: elt.id,
					...temp,
					exam: null,
					examId: null,
					room: null,
					roomId: null
				}
			}
		});
	
	setPlanningContent();
}

function next(){
	const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 201)
      {
        const result = this.responseText;
        window.location.href = "/planning";
      }
    }

    xmlhttp.open("POST", "api/set-planning", true);
	xmlhttp.setRequestHeader("Content-Type", "application/json")
    xmlhttp.send(JSON.stringify(planning));
}