package com.diy.springBoot.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.diy.springBoot.util.Utils;

@Controller
public class LoginController {
	
	@RequestMapping(value={"/","/*"},method=RequestMethod.GET)
	public String Login(){
		return "/page/index";
	}
	
	@RequestMapping(value="Login.do",method=RequestMethod.POST)
	public String Login(HttpServletRequest request,HttpServletResponse resp, RedirectAttributes rediect){
		String account = request.getParameter("u");
		String password = request.getParameter("p");
		
		UsernamePasswordToken upt = new UsernamePasswordToken(account, password);
		Subject subject = SecurityUtils.getSubject();
		try {
			subject.login(upt);
		} catch (AuthenticationException e) {
			e.printStackTrace();
			rediect.addFlashAttribute("errorText", "您的账号或密码输入错误!");
			return "redirect:/Login.do";
		}
		return "redirect:/index";
	}
	
	/**
	 * Exit
	 * @return
	 */
	@RequestMapping("/logout")
	public String logout(HttpServletRequest request,HttpServletResponse resp) {
		Subject subject = SecurityUtils.getSubject();
		subject.logout();
		JSONObject json=new JSONObject();
		json.put("success", "true");
		try {
			Utils.writeRespToPage(json,request,resp);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;//"redirect:/page/index";
	}
	
}
