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
public class PlanningController {
	
	@GetMapping("/planning")
	public String pageContraintes(Model model, HttpSession session) {
		Object exams = session.getAttribute("exams");
		Object rooms = session.getAttribute("rooms");
		Object times = session.getAttribute("times");
		Object days = session.getAttribute("days");
		Object planning = session.getAttribute("planning");
		Object userSession = session.getAttribute("session");
		if(planning == null || userSession == null)
		{
			return planning == null ? "redirect:/contraintes" : "redirect:/home";
		}
		else {
			
			model.addAttribute("exams", exams);
			model.addAttribute("rooms", rooms);
			model.addAttribute("times", times);
			model.addAttribute("days", days);
			model.addAttribute("planning", planning);
			
			return "planning";
		}
	}
}
