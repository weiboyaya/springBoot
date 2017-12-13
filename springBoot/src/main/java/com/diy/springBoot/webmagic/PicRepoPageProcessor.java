package com.diy.springBoot.webmagic;

import java.io.DataInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.net.URL;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import us.codecraft.webmagic.Page;
import us.codecraft.webmagic.Site;
import us.codecraft.webmagic.processor.PageProcessor;

import com.diy.springBoot.constant.Constant;
import com.diy.springBoot.dao.FileDAO;
import com.diy.springBoot.dto.Filemsg;

@Service
public class PicRepoPageProcessor implements PageProcessor{
	
	@Autowired
	FileDAO fileDao;
	
	 private Site site = Site.me().setRetryTimes(Constant.SPIDER_RETRYTIMES).setSleepTime(Constant.SPIDER_SLEEPTIMES);

	@Override
	public Site getSite() {
		return site;
	}

	@Override
	public void process(Page page) {
		//获取所有img src链接
		List<String> urls=page.getHtml().$("img","src").all();
		try {
			saveFilemsg(urls);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
	private void saveFilemsg(List<String> urls)throws Exception{
		 URL url = null;
		Long max= fileDao.getMaxId();
		max++;
		for (int i=0;i<urls.size();i++) {
			url = new URL(urls.get(i));  
           DataInputStream dataInputStream = new DataInputStream(url.openStream()); 
           String profix="jpg";
           if(urls.get(i).split("[.]").length>1){
        	   profix=urls.get(i).split("[.]")[urls.get(i).split("[.]").length-1];
           }
           String imageName ="";
           long s=new Date().getTime();
           imageName=String.valueOf(s)+"_"+i+"."+profix;
           File file=new File(Constant.FILE_RESOURCE.substring(0,Constant.FILE_RESOURCE.length()-1));    //设置下载路径  
           if(!file.isDirectory()){  
               file.mkdirs();  
           }  
           FileOutputStream fileOutputStream = new FileOutputStream(new File(Constant.FILE_RESOURCE+ imageName.trim()));  
           int size=0; //dataInputStream.available();该方法获取大小可能只是传输中的一部分
           byte[] buffer = new byte[1024];  
           int length;  
           while ((length = dataInputStream.read(buffer)) > 0) {  
               fileOutputStream.write(buffer, 0, length); 
               size+=length;
           }  
           
           dataInputStream.close();  
           fileOutputStream.close(); 
			
           Filemsg po=new Filemsg();
			po.setId(max+i);
			po.setFileName(imageName);
			po.setFileSize(Long.valueOf(size));
			po.setType(1);
			po.setMdate(new Date());
			fileDao.saveAndFlush(po);
			
		}
	}
	
}
