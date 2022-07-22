package com.ict.planning.controllers;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.ict.planning.entities.Session;
import com.ict.planning.entities.User;
import com.ict.planning.repositories.SessionRepository;

import org.springframework.ui.Model;


/**
 * @author Astrid
 *
 */
@Controller
public class HomeController {
	
	@Autowired
	private SessionRepository sessionRepository;

	
	@GetMapping("/home")
	public String accueil(Model model, HttpSession session) {
		
		Object user = session.getAttribute("user");
		System.out.println(user);
		if(user == null)
		{
			return "redirect:/login";
		}
		else {
			List<Session> sessions = sessionRepository.findAllByUserId(((User)user).getId());
			model.addAttribute("sessions", sessions);
			model.addAttribute("user", user);
			return "home";
		}
		
	}
}
