const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const userProfile = "";

function onSubmit()
{
	if(emailInput.checkValidity() && passwordInput.checkValidity())
	{
		const xmlhttp = new XMLHttpRequest();
	    xmlhttp.onreadystatechange = function(){
	      if(this.readyState == 4)
	      {
			const result = this.responseText;
	        console.log(result)
			if(this.status === 400)
			{
				alert("Identifiants incorrects !!");
			}
			else if(this.status === 200)
			{
				alert("Vous êtes désormais connecté !");
				window.location.href = "/home";
			}
	        
	      }
	    }
	
	    xmlhttp.open("POST", "api/auth/login", true);
		xmlhttp.setRequestHeader("Content-Type", "application/json")
	    xmlhttp.send(JSON.stringify({email: emailInput.value, password: passwordInput.value}));
	}
	else{
		alert("Formulaire invalide !")
	}
}