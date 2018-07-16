package com.diy.springBoot.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import us.codecraft.webmagic.Spider;

import com.diy.springBoot.constant.Constant;
import com.diy.springBoot.dao.FileDAO;
import com.diy.springBoot.dto.Filemsg;
import com.diy.springBoot.util.Utils;
import com.diy.springBoot.webmagic.PicRepoPageProcessor;
import com.diy.springBoot.webmagic.dto.webMagicDto;

@Controller
@RequestMapping("/WebMagic.do")
public class WebMagicController {
	@Autowired
	private PicRepoPageProcessor repoPageProcessor;
	
	@Autowired
	FileDAO fileDao;
	
	@RequestMapping(params = "method=start")
	public void start(webMagicDto dto,HttpServletRequest request,
			HttpServletResponse response)throws Exception{
		Spider.create(repoPageProcessor)
        .addUrl(dto.getUrl())
        .thread(Constant.SPIDER_THREAD)
        .run();	
		JSONObject json=new JSONObject();
		json.put("success", "true");
		try {
			Utils.writeRespToPage(json,request,response);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@RequestMapping(params = "method=getSpiderList")
	public void getSpiderList(webMagicDto dto,HttpServletRequest request,
			HttpServletResponse response)throws Exception{
		List<Filemsg> list=fileDao.findByType(1);
		JSONObject json=new JSONObject();
		json.put("success", "true");
		json.put("result", list);
		try {
			Utils.writeRespToPage(json,request,response);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	

}

