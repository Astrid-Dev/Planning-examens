const sessionTitleInput = document.getElementById("session-title");
const sessionsTableElt = document.getElementById("sessions");

let user = null;

let sessions = [];

function setSessions(newSessions)
{
	sessions = newSessions;
	sessions.sort((a, b) => parseInt(b.createdOn) - parseInt(a.createdOn));
	
	setSessionsListContent();
}

function setSessionsListContent()
{
	let body ="";
	
	sessions.forEach((elt, index) =>{
		let date = new Date(parseInt(elt.createdOn));
		body += "<tr><td>"+(index+1)+"</td><td>"+elt?.title+"</td><td>"+ date.toLocaleString()+"</td><td><i onclick='loadASession("+elt.id+")' class='text-success cursor-pointer fa fa-play'></i></td><td><i onclick='deleteASession("+elt.id+")' class='fa fa-close text-danger cursor-pointer'></i></td></tr>";
	});
	if(sessions.length === 0)
	{
		body = "<tr><td colspan='5' class='text-md-center text-italic'>Aucune session trouvée !</td></tr>"
	}
	
	sessionsTableElt.innerHTML = body;
}

function setUser(newUser)
{
	console.log(newUser)
	user = newUser;
}

function createSession()
{
	if(sessionTitleInput.value !== "")
	{
		const xmlhttp = new XMLHttpRequest();
		let session = {
			id: null,
			userId: user.id,
			title: sessionTitleInput.value,
			createdOn: new Date().getTime()
		}
		console.log(session)
	    xmlhttp.onreadystatechange = function(){
	      if(this.readyState == 4 && this.status == 201)
	      {
	        const result = this.responseText;
	        window.location.href = "/jours";
	      }
	      else if(this.readyState == 4 && this.status === 500)
	      {
			alert("Une erreur s'est produite !'");
		  }
	    }
	
	    xmlhttp.open("POST", "api/new-session", true);
		xmlhttp.setRequestHeader("Content-Type", "application/json")
	    xmlhttp.send(JSON.stringify(session));
	}
	else{
		alert("Veuillez renseigner un titre !");
	}
}

function loadASession(id)
{
	const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200)
      {
        const result = this.responseText;
        
        console.log(result);
        alert("La session a été chargée avec succès !");
		window.location.href="/"+result;
      }
      else if(this.readyState == 4 && this.status >= 400)
      {
		alert("Une erreur s'est produite lors du chargement de la session!");
	  }
    }

    xmlhttp.open("GET", "api/load-session/"+id, true);
	xmlhttp.setRequestHeader("Content-Type", "application/json")
    xmlhttp.send();
}

function deleteASession(id){
	let choice = confirm("Confirmez-vous la suppression de cette session ?");
	if(choice)
	{
		const xmlhttp = new XMLHttpRequest();
	    xmlhttp.onreadystatechange = function(){
	      if(this.readyState == 4 && this.status == 200)
	      {
	        const result = this.responseText;
	        alert("La session a été supprimée avec succès !");
	        
			sessions = sessions.filter(elt => elt.id !== id);
			setSessionsListContent();
	      }
	      else if(this.readyState == 4 && this.status >= 400)
	      {
			alert("Une erreur s'est produite lors de la suppression de la session!");
		  }
	    }
	
	    xmlhttp.open("DELETE", "api/delete-session/"+id, true);
		xmlhttp.setRequestHeader("Content-Type", "application/json")
	    xmlhttp.send();
	}
	console.log(choice);
}