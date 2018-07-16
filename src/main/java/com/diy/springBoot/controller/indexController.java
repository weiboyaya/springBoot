package com.diy.springBoot.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class indexController {
	
	@RequestMapping("/index")
	public String idx(HttpServletRequest request){
		return "/page/desktop/index";
	}
	
	@RequestMapping("/timeline")
	public String timeline(HttpServletRequest request){
		return "/page/common/timeline/jn-timeline";
	}
	
	@RequestMapping("/uploadFile")
	public String uploadFile(HttpServletRequest request){
		return "/page/webUpload/uploadFile";
	}
	
	@RequestMapping("/spider")
	public String spider(HttpServletRequest request){
		return "/page/desktop/spider";
	}
	
	@RequestMapping("/Pos")
	public String pos(HttpServletRequest request){
		return "/page/pos/pos";
	}
}
