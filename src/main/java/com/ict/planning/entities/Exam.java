package com.ict.planning.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "exams")
public class Exam {

	
	@Column(name = "id", nullable =  false)
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "teachingUnit")
	private String teachingUnit;
	
	@Column(name = "studentsNumber")
	private int studentsNumber;
	
	@Column(name = "teacher")
	private String teacher;
	
	@Column(name = "sessionId")
	private Long sessionId;


	public Long getSessionId() {
		return sessionId;
	}


	public void setSessionId(Long sessionId) {
		this.sessionId = sessionId;
	}
	
	public String getTeacher() {
		return teacher;
	}

	public void setTeacher(String teacher) {
		this.teacher = teacher;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTeachingUnit() {
		return teachingUnit;
	}

	public void setTeachingUnit(String teachingUnit) {
		this.teachingUnit = teachingUnit;
	}

	public int getStudentsNumber() {
		return studentsNumber;
	}

	public void setStudentsNumber(int studentsNumber) {
		this.studentsNumber = studentsNumber;
	}
	
	
	
}