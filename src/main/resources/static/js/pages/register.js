const fileInput = document.getElementById("file-input");
const button = document.getElementById("button-icon");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const profileElt = document.getElementById("user-profile");

const userProfile = "";


button.onclick = ()=>{
  fileInput.click(); 
}

fileInput.addEventListener("change", function(){
  if(this.files.length > 0 && isValidFileType(this.files[0]))
  {
	let fileReader = new FileReader();
	fileReader.onloadend = function(){
		profileElt.src = this.result;
	}
	fileReader.readAsDataURL(this.files[0]);
  } 
});

function isValidFileType(file)
{
	let validExtensions = ["image/jpeg", "image/png", "image/jpg"];
	let fileType = file?.type; 
	let result = false;
  	if(validExtensions.includes(fileType)){
		result = true;
	}
	else{
  		alert("Uniquement les fichiers images sont permis !");
	    result = false;
	}
  	
  	return result;
}

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
			if(this.status === 404)
			{
				alert("Email déjà utilisé !");
			}
			else if(this.status === 201)
			{
				alert("Compte créé avec succès ! Veuillez désormais vous connecter !");
				window.location.href = "/login";
			}
	        
	      }
	    }
	
	    xmlhttp.open("POST", "api/auth/register", true);
		xmlhttp.setRequestHeader("Content-Type", "application/json")
	    xmlhttp.send(JSON.stringify({id: null, email: emailInput.value, password: passwordInput.value, profile: userProfile}));
	}
	else{
		alert("Formulaire invalide !")
	}
}