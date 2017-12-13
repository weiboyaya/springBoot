package com.diy.springBoot.dto;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Filemsg {
	@Id
	private Long id;
	private String filename;
	private Long filesize;
	private int type;
	private Date mdate;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getFilename() {
		return filename;
	}
	public void setFileName(String filename) {
		this.filename = filename;
	}
	public Long getFilesize() {
		return filesize;
	}
	public void setFileSize(Long filesize) {
		this.filesize = filesize;
	}
	public Date getMdate() {
		return mdate;
	}
	public void setMdate(Date mdate) {
		this.mdate = mdate;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	
	
}
