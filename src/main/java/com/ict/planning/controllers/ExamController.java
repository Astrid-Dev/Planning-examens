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
public class ExamController {
	
	@GetMapping("/examens")
	public String pageExamens(Model model, HttpSession session) {
		Object rooms = session.getAttribute("rooms");
		Object exams = session.getAttribute("exams");
		Object userSession = session.getAttribute("session");
		System.out.println(rooms);
		if(rooms == null || userSession == null)
		{
			return rooms == null ? "redirect:/salles" : "redirect:/home";
		}
		else {
			model.addAttribute("session", userSession);
			model.addAttribute("exams", exams);
			return "exams";
		}
	}
}
