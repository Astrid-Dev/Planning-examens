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
public class DayController {
	
	@GetMapping("/jours")
	public String pageJours(Model model, HttpSession session) {
		Object days = session.getAttribute("days");
		Object userSession = session.getAttribute("session");
		System.out.println(days);
		if(userSession == null)
		{
			return "redirect:/home";
		}
		else {
			model.addAttribute("session", session);
			model.addAttribute("days", days);
			return "days";
		}
	}
}
