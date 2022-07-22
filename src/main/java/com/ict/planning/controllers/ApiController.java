package com.ict.planning.controllers;

import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.ict.planning.entities.Day;
import com.ict.planning.entities.Exam;
import com.ict.planning.entities.Planning;
import com.ict.planning.entities.Room;
import com.ict.planning.entities.Session;
import com.ict.planning.entities.Time;
import com.ict.planning.entities.User;
import com.ict.planning.repositories.DayRepository;
import com.ict.planning.repositories.ExamRepository;
import com.ict.planning.repositories.PlanningRepository;
import com.ict.planning.repositories.RoomRepository;
import com.ict.planning.repositories.SessionRepository;
import com.ict.planning.repositories.TimeRepository;
import com.ict.planning.repositories.UserRepository;


@RestController
@RequestMapping("/api")
@Transactional
public class ApiController {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private SessionRepository sessionRepository;
	
	@Autowired
	private DayRepository dayRepository;
	
	@Autowired
	private TimeRepository timeRepository;
	
	@Autowired
	private ExamRepository examRepository;
	
	@Autowired
	private RoomRepository roomRepository;
	
	@Autowired
	private PlanningRepository planningRepository;
	
	@PostMapping(value="/set-days", produces={ "application/json"})
	@ResponseStatus(code=HttpStatus.CREATED)
	public ResponseEntity<Object> createDays(@RequestBody List<Day> body, HttpSession session) {
		
		session.setAttribute("days", body);
		Session userSession = ((Session)session.getAttribute("session"));
		dayRepository.deleteBySessionId(userSession.getId());
		dayRepository.saveAll(body);
		
		System.out.println(session.getAttribute("days"));
		
		return ResponseEntity.created(null).body(body);
	}
	
	@PostMapping(value="/set-times", produces={ "application/json"})
	@ResponseStatus(code=HttpStatus.CREATED)
	public ResponseEntity<Object> createTimes(@RequestBody List<Time> body, HttpSession session) {
		
		session.setAttribute("times", body);
		Session userSession = ((Session)session.getAttribute("session"));
		timeRepository.deleteBySessionId(userSession.getId());
		timeRepository.saveAll(body);
		
		return ResponseEntity.created(null).body(body);
	}
	
	@PostMapping(value="/set-rooms", produces={ "application/json"})
	@ResponseStatus(code=HttpStatus.CREATED)
	public ResponseEntity<Object> createRooms(@RequestBody List<Room> body, HttpSession session) {
		
		session.setAttribute("rooms", body);
		Session userSession = ((Session)session.getAttribute("session"));
		roomRepository.deleteBySessionId(userSession.getId());
		roomRepository.saveAll(body);
		
		return ResponseEntity.created(null).body(body);
	}
	
	@PostMapping(value="/set-exams", produces={ "application/json"})
	@ResponseStatus(code=HttpStatus.CREATED)
	public ResponseEntity<Object> createExams(@RequestBody List<Exam> body, HttpSession session) {
		
		session.setAttribute("exams", body);
		Session userSession = ((Session)session.getAttribute("session"));
		examRepository.deleteBySessionId(userSession.getId());
		System.out.println(body);
		examRepository.saveAll(body);
		
		return ResponseEntity.created(null).body(body);
	}
	
	@PostMapping(value="/set-planning", produces={ "application/json"})
	@ResponseStatus(code=HttpStatus.CREATED)
	public ResponseEntity<Object> createPlanning(@RequestBody List<Planning> body, HttpSession session) {
		
		session.setAttribute("planning", body);
		Session userSession = ((Session)session.getAttribute("session"));
		planningRepository.deleteBySessionId(userSession.getId());
		planningRepository.saveAll(body);
		
		return ResponseEntity.created(null).body(body);
	}
	
	@PostMapping(value="/auth/register", produces={ "application/json"})
	@ResponseStatus(code=HttpStatus.CREATED)
	public ResponseEntity<Object> register(@RequestBody User user, HttpSession session) {
		User temp = userRepository.findByEmail(user.getEmail());
		if(temp == null)
		{
			userRepository.save(user);
			return ResponseEntity.created(null).body(user);
		}
		else {
			return ResponseEntity.status(404).body("Email déjà utilisé !");
		}
		
	}
	
	@PostMapping(value="/auth/login", produces={ "application/json"})
	@ResponseStatus(code=HttpStatus.CREATED)
	public ResponseEntity<Object> login(@RequestBody User user, HttpSession session) {
		
		User temp = userRepository.findByEmail(user.getEmail());
		if(temp == null)
		{
			return ResponseEntity.badRequest().body("Identifiants incorrects !");
		}
		else {
			if(temp.getPassword().equals(user.getPassword()))
			{
				session.setAttribute("user", temp);
				System.out.println(temp);
				return ResponseEntity.ok().body(temp);
			}
			else {
				return ResponseEntity.badRequest().body("Identifiants incorrects !");
			}
			
		}
	}
	
	@PostMapping(value="/new-session", produces={ "application/json"})
	@ResponseStatus(code=HttpStatus.CREATED)
	public ResponseEntity<Object> createSession(@RequestBody Session body, HttpSession session) {
		session.removeAttribute("days");
		session.removeAttribute("times");
		session.removeAttribute("rooms");
		session.removeAttribute("planning");
		session.removeAttribute("exams");
		sessionRepository.save(body);
		session.setAttribute("session", body);
		
		return ResponseEntity.created(null).body(body);
	}
	
	@DeleteMapping(value="/delete-session/{id}", produces= {"application/json"})
	public ResponseEntity<Object> deleteSession(@PathVariable Long id, HttpSession session){
		Long sessionId = id;
		/*dayRepository.deleteBySessionId(sessionId);
		timeRepository.deleteBySessionId(sessionId);
		roomRepository.deleteBySessionId(sessionId);
		examRepository.deleteBySessionId(sessionId);
		planningRepository.deleteBySessionId(sessionId);*/
		
		sessionRepository.deleteById(id);
		return ResponseEntity.ok().body("La session a été supprimée avec succès");
	}
	
	@GetMapping(value="/load-session/{id}", produces= {"application/json"})
	public ResponseEntity<Object> loadSession(@PathVariable Long id, HttpSession session){
		Optional<Session> planningSession = sessionRepository.findById(id);
		if(planningSession != null)
		{
			List<Day> days = dayRepository.findAllBySessionId(id);
			List<Time> times = timeRepository.findAllBySessionId(id);
			List<Room> rooms = roomRepository.findAllBySessionId(id);
			List<Exam> exams = examRepository.findAllBySessionId(id);
			List<Planning> planning = planningRepository.findAllBySessionId(id);
			
			session.removeAttribute("days");
			session.removeAttribute("times");
			session.removeAttribute("rooms");
			session.removeAttribute("planning");
			session.removeAttribute("exams");
			
			Session temp = planningSession.get();
			System.out.println("------------");
			System.out.println(temp.getId());
			System.out.println(temp.getTitle());
			System.out.println(days.size());
			System.out.println("------------");
			
			session.setAttribute("session", temp);
			
			String url = "jours";
			
			if(days.size() > 0)
			{
				url = "horaires";
				session.setAttribute("days", days);
				
				if(times.size() > 0)
				{
					url = "salles";
					session.setAttribute("times", times);
					
					if(rooms.size() > 0)
					{
						url = "examens";
						session.setAttribute("rooms", rooms);
						
						if(exams.size() > 0)
						{
							url = "contraintes";
							session.setAttribute("exams", exams);
							
							if(planning.size() > 0)
							{
								url = "planning";
								session.setAttribute("planning", planning);
							}
						}
					}
				}
			}
			
			System.out.println(url);
			
			return ResponseEntity.ok().body(url);
		}
		else {
			return ResponseEntity.badRequest().body("Session non trouvée !");
		}
		
	}
}
