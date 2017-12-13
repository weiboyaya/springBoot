package com.diy.springBoot.util;

import java.io.DataInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.diy.springBoot.constant.Constant;

import net.sf.json.JSONObject;

public class Utils {
	
	public static String writeRespToPage(JSONObject json, HttpServletRequest req, 
			HttpServletResponse resp) throws Exception {
		//将json字符串响应到前台
		try {
			req.setCharacterEncoding("UTF-8");
			resp.setCharacterEncoding("UTF-8");
			resp.getWriter().print(json);
			resp.getWriter().flush();
			resp.getWriter().close();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			throw e;
		} catch (IOException e) {
			e.printStackTrace();
			throw e;
		}
		
		return null;
	}
	

    public static void downloadPicture(List<String> urls) {  
        URL url = null;  
        for (int i=0;i<urls.size();i++) {  
            try {  
                url = new URL(urls.get(i));  
                DataInputStream dataInputStream = new DataInputStream(url.openStream());  
                
                String imageName =urls.get(i).split("/")[urls.get(i).split("/").length-1];  
                File file=new File(Constant.FILE_RESOURCE.substring(0,Constant.FILE_RESOURCE.length()-1));    //设置下载路径  
                if(!file.isDirectory()){  
                    file.mkdirs();  
                }  
                FileOutputStream fileOutputStream = new FileOutputStream(new File(Constant.FILE_RESOURCE+ imageName.trim()));  
                byte[] buffer = new byte[1024];  
                int length;  
                while ((length = dataInputStream.read(buffer)) > 0) {  
                    fileOutputStream.write(buffer, 0, length);  
                }  
                dataInputStream.close();  
                fileOutputStream.close();  
            } catch (MalformedURLException e) {  
                e.printStackTrace();  
            } catch (IOException e) {  
                e.printStackTrace();  
            }  
        }  
    }
}
