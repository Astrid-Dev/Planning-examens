package com.ict.planning.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;


/**
 * @author Astrid
 *
 */
@Controller
public class LoginController {
	
	@GetMapping("/login")
	public String PageConnexion(Model model, HttpSession session) {
		
		Object user = session.getAttribute("user");
		
		return user == null ? "login" : "redirect:/home";
	}
}
