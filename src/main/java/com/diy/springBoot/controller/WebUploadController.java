package com.diy.springBoot.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.tomcat.util.http.fileupload.disk.DiskFileItemFactory;
import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipOutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.diy.springBoot.constant.Constant;
import com.diy.springBoot.dao.FileDAO;
import com.diy.springBoot.dto.Filemsg;

@Controller
@RequestMapping("/WebUploadAction.do")
public class WebUploadController {
	@Autowired
	FileDAO fileDao;
	
	@RequestMapping(params = "method=upload")
	public String upload(ModelMap modelMap,HttpServletRequest request,
			HttpServletResponse response)throws Exception{
		long fileSize = 0;
		String fileName = null;
		JSONObject json=new JSONObject();
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=UTF-8");
		PrintWriter out=response.getWriter();
		DiskFileItemFactory factory=new DiskFileItemFactory();
		factory.setSizeThreshold(1024000);
		long maxSize = 1024000l;
		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest)request;
		Iterator<?> fileNames = multipartRequest.getFileNames();
        if(fileNames.hasNext()){
        	 String name = ((String)fileNames.next()).toString();
             MultipartFile file = multipartRequest.getFile(name);
             fileSize = file.getSize() / 1024L;
             if(fileSize > maxSize){
                 json.put("success", Boolean.valueOf(false));
                 json.put("msg", (new StringBuilder("\u4F20\u9001\u7684\u6587\u4EF6\u8FC7\u5927(")).append(fileSize).append("K)\uFF0C\u4E0D\u80FD\u8D85\u8FC7").append(maxSize).append("K").toString());
                 out.println(json.toString());
                 out.flush();
                 return null;
             }
             
             InputStream stream = file.getInputStream();
             fileName = file.getOriginalFilename().trim().toLowerCase();
             if(fileName.length() > 36)
             {
                 json.put("success", Boolean.valueOf(false));
                 json.put("msg", "\u4F20\u9001\u7684\u6587\u4EF6\u540D\u4E0D\u80FD\u8D85\u8FC736\u4E2A\u5B57\u7B26");
                 out.println(json.toString());
                 out.flush();
                 return null;
             }
             File files=new File(Constant.FILE_RESOURCE+new String(fileName.getBytes("ISO-8859-1"),"UTF-8"));
             OutputStream  bos=new FileOutputStream(files);
             int bytesRead = 0;
             int bufferSize = 8192;
             byte buffer[] = new byte[bufferSize];
             while((bytesRead = stream.read(buffer, 0, bufferSize)) != -1) 
                 bos.write(buffer, 0, bytesRead);
             bos.close();
             stream.close();
             
             json.put("filename", fileName);
             json.put("filePath", Constant.FILE_RESOURCE);
             json.put("filesize", Long.valueOf(fileSize));
             json.put("success", true);
             out.println(json.toString());
             out.flush();
        }
        
        return null;
	}
	
	@RequestMapping(params = "method=batchDownLoad")
	public String download(ModelMap modelMap,HttpServletRequest request,
			HttpServletResponse response)throws Exception{
		String fileNoList=request.getParameter("fileNoList");
		String downFileName=new String(("download.zip").getBytes("ISO8859-1"), "UTF-8");
		String zipPath=Constant.FILE_RESOURCE+downFileName;
		ZipOutputStream zos=new ZipOutputStream(new FileOutputStream(zipPath)); 
		ArrayList<Long> ids=new ArrayList<Long>();
		String [] s= fileNoList.split(",");
		for(int i=0;i<s.length;i++){
			ids.add(i,Long.valueOf(s[i]));
		}
		List<Filemsg> list= fileDao.findByIdIn(ids);
		for(int i=0;i<list.size();i++){
			String fileName=list.get(i).getFilename();
			zos.setEncoding("GBK");
	        zos.putNextEntry(new ZipEntry("".equals(fileName)||null==fileName?"tmp"+i+".txt":fileName));
	        FileInputStream is=new FileInputStream(Constant.FILE_RESOURCE+new String(fileName.getBytes("ISO-8859-1"),"UTF-8"));
	        //BufferedInputStream bis=new BufferedInputStream(is);
	        int si=is.available();
			byte data[]=new byte[si];
			is.read(data); 
			zos.write(data, 0, si);
			is.close();
			zos.closeEntry();
		}
		zos.close();
		downFile(response,downFileName);
		
		return "";
	}
	
	private void downFile(HttpServletResponse response,String fileName) throws IOException{
		OutputStream os=null;
		try{
		String path=Constant.FILE_RESOURCE+fileName;
		File file=new File(path);
		if(file.exists()){
			InputStream is=new FileInputStream(path);
			BufferedInputStream bis=new BufferedInputStream(is);
			String contentType = "application/force-download;charset=UTF-8";
		    String recommendedName = new String(fileName.getBytes(), "ISO8859_1");
		    response.setContentType(contentType);
		    response.setHeader("Content-Disposition", "attachment; filename=" + recommendedName);
		    os=response.getOutputStream();
			BufferedOutputStream bos=new BufferedOutputStream(os);
			int bytesRead=0;
			byte [] buffer =new byte[8912];
			while ((bytesRead = bis.read(buffer, 0, 8192)) != -1) {  
                bos.write(buffer, 0, bytesRead);  
            }  
			bos.flush();
            is.close();  
            bis.close();  
            os.close();  
            bos.close(); 
            file.delete();
		}
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			if(os!=null)
				os.close();
		}
	}
	
	
	@RequestMapping(params="method=getFile")
	public String getFile(ModelMap modelMap,HttpServletRequest request,
			HttpServletResponse response){
		InputStream is = null;
		try {
			String fileName=request.getParameter("filename");
			is=new FileInputStream(Constant.FILE_RESOURCE+new String(fileName.getBytes("ISO-8859-1"),"UTF-8"));
			int i=is.available();
			byte data[]=new byte[i];
			is.read(data); 
			int index=fileName.toLowerCase().lastIndexOf(".");
			if(!Constant.POSTFIX_JPG.equals(fileName.substring(index+1))&&
					!Constant.POSTFIX_JPEG.equals(fileName.substring(index+1))&&
					!Constant.POSTFIX_GIF.equals(fileName.substring(index+1))&&
					!Constant.POSTFIX_PNG.equals(fileName.substring(index+1))&&
					!Constant.POSTFIX_BMP.equals(fileName.substring(index+1))){
				response.setHeader("Content-Disposition", "attachment; filename=" + java.net.URLEncoder.encode(fileName, "UTF-8"));
			}
			OutputStream toClient=response.getOutputStream();
			toClient.write(data); 
			toClient.flush();
			toClient.close();
			is.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
		
	}
	
	@RequestMapping(params="method=getFileList")
	public String getFileList(ModelMap modelMap,HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		JSONObject json=new JSONObject();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		ArrayList<Filemsg> fList=new ArrayList<Filemsg>();
		ArrayList<Filemsg> list=(ArrayList<Filemsg>) fileDao.findAll();
		for(int i=0;i<list.size();i++){
			Filemsg fm=new Filemsg();
			fm.setId(Long.valueOf(list.get(i).getId().toString()));
			fm.setFileName(list.get(i).getFilename().toString());
			fm.setFileSize(Long.valueOf(list.get(i).getFilesize().toString()));
			fm.setMdate(list.get(i).getMdate());
			fList.add(fm);
		}
		JSONArray rlist=JSONArray.fromObject(fList);
		json.put("success",true);
		json.put("data", rlist.toString());
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(json);
		response.getWriter().flush();
		response.getWriter().close();
		return null;
	}
	
	@RequestMapping(params="method=saveFilemsg")
	public String saveFilemsg(ModelMap modelMap,HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		Long max= fileDao.getMaxId();
		
		Filemsg po=new Filemsg();
		po.setId(max+1);
		po.setFileName(request.getParameter("filename"));
		po.setFileSize(Long.valueOf(request.getParameter("filesize")));
		po.setType(0);
		po.setMdate(new Date());
		fileDao.saveAndFlush(po);
		JSONObject json=new JSONObject();
		json.put("success",true);
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(json);
		response.getWriter().flush();
		response.getWriter().close();
		return null;
	}
	
	@RequestMapping(params="method=removeFile")
	public String removeFile(ModelMap modelMap,HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		String fileNo=request.getParameter("id");
		//String fileName=request.getParameter("filename");
		Long v=fileDao.deleteById(Long.valueOf(fileNo));
		JSONObject json=new JSONObject();
		json.put("success",v>0?true:false);
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(json);
		response.getWriter().flush();
		response.getWriter().close();
		return null;
	}
	
}
