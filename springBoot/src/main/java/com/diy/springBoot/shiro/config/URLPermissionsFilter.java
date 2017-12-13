package com.diy.springBoot.shiro.config;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authz.PermissionsAuthorizationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.diy.springBoot.service.UserService;

@Component("urlPermissionsFilter")
public class URLPermissionsFilter extends PermissionsAuthorizationFilter{
	@Autowired
	private UserService userService;

	@Override
	public boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) throws IOException {
		String curUrl = getRequestUrl(request);
		Subject subject = SecurityUtils.getSubject();
		curUrl=curUrl.substring(0,curUrl.indexOf(";")<0?curUrl.length():curUrl.indexOf(";"));
		String url=curUrl.substring(0, curUrl.indexOf("?")<0?curUrl.length():curUrl.indexOf("?"));
		
		
		
		if(/*subject.getPrincipal() == null 
				||*/( StringUtils.endsWith(curUrl, ".js")|| StringUtils.endsWith(curUrl, ".css")|| StringUtils.endsWith(curUrl, ".html")
				|| StringUtils.endsWith(curUrl, ".jpg")|| StringUtils.endsWith(curUrl, ".jpg")|| StringUtils.endsWith(curUrl, ".jpeg")
				|| StringUtils.endsWith(curUrl, ".jpeg")||StringUtils.endsWith(curUrl, ".png")||StringUtils.endsWith(curUrl, ".gif"))
				||StringUtils.endsWith(url, ".eot")||StringUtils.endsWith(url, ".svg")||StringUtils.endsWith(url, ".ttf")
				||StringUtils.endsWith(url, ".woff")
				||StringUtils.equals(curUrl, "/")||StringUtils.startsWith(curUrl, "/Login")) {
			return true;
		}
		if(subject.getPrincipal() == null){
			return false;
		}
		
		List<String> urls = userService.findPermissionUrl(subject.getPrincipal().toString());
		
		return urls.contains(curUrl);
	}
	
	/**
	 * 获取当前URL+Parameter
	 * @author lance
	 * @since  2014年12月18日 下午3:09:26
	 * @param request	拦截请求request
	 * @return			返回完整URL
	 */
	private String getRequestUrl(ServletRequest request) {
		HttpServletRequest req = (HttpServletRequest)request;
		String queryString = req.getQueryString();

		queryString = StringUtils.isBlank(queryString)?"": "?"+queryString;
		return req.getRequestURI()+queryString;
	}
}
