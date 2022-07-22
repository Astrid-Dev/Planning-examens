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
public class ConstraintController {
	
	@GetMapping("/contraintes")
	public String pageContraintes(Model model, HttpSession session) {
		Object exams = session.getAttribute("exams");
		Object rooms = session.getAttribute("rooms");
		Object times = session.getAttribute("times");
		Object days = session.getAttribute("days");
		Object userSession = session.getAttribute("session");
		System.out.println(exams);
		if(exams == null || userSession == null)
		{
			return exams == null ? "redirect:/examens" : "redirect:/home";
		}
		else {
			
			model.addAttribute("exams", exams);
			model.addAttribute("rooms", rooms);
			model.addAttribute("times", times);
			model.addAttribute("days", days);
			
			return "constraints";
		}
	}
}
