package com.ict.planning.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.ui.Model;


/**
 * @author Astrid
 *
 */
@Controller
public class TimeController {
	
	@GetMapping("/horaires")
	public String pageHoraires(Model model, HttpSession session) {
		
		Object days = session.getAttribute("days");
		Object userSession = session.getAttribute("session");
		Object times = session.getAttribute("times");
		System.out.println(days);
		if(days == null || userSession == null)
		{
			return days == null ? "redirect:/jours" : "redirect:/home";
		}
		else {
			model.addAttribute("session", session);
			model.addAttribute("times", times);
			return "times";
		}
	}
}
