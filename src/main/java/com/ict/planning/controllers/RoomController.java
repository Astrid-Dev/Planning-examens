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
public class RoomController {
	
	@GetMapping("/salles")
	public String pageSalles(Model model, HttpSession session) {
		Object times = session.getAttribute("times");
		Object userSession = session.getAttribute("session");
		Object rooms = session.getAttribute("rooms");
		System.out.println(times);
		if(times == null || userSession == null)
		{
			return times == null ? "redirect:/horaires" : "redirect:/home";
		}
		else {
			model.addAttribute("rooms", rooms);
			model.addAttribute("session", session);
			return "rooms";
		}
	}
}
