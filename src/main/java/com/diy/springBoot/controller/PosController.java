package com.diy.springBoot.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javassist.expr.NewArray;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.diy.springBoot.dao.GoodsDAO;
import com.diy.springBoot.dao.WellGoodsDAO;
import com.diy.springBoot.dto.Goods;
import com.diy.springBoot.dto.GoodsDTO;
import com.diy.springBoot.dto.WellGoods;

/**
 * pos收银系统控制器
 * @author lenovo
 *
 */

@Controller
@RequestMapping("/PosAction.do")
public class PosController {
	@Autowired
	private WellGoodsDAO wellGoodsDAO;
	@Autowired
	private GoodsDAO goodsDAO;
	
	/**
	 * 查询畅销商品
	 * @param req
	 * @param resp
	 * @throws IOException
	 */
	@RequestMapping(params="method=getWellGoods")
	public void getWellGoods(HttpServletRequest req,HttpServletResponse resp) throws IOException{
		GoodsDTO retGood=new GoodsDTO();
		ArrayList<GoodsDTO> wellGoods=new ArrayList<GoodsDTO>();
		List<WellGoods> list=wellGoodsDAO.findAll();
		for(WellGoods good:list){
			GoodsDTO dto=new GoodsDTO();
			BeanUtils.copyProperties(good, dto);
			wellGoods.add(dto);
		}
		retGood.setWellGoods(wellGoods);
		
		JSONObject json=new JSONObject();
		json.put("success",true);
		json.put("data", JSONObject.fromObject(retGood));
		resp.setCharacterEncoding("UTF-8");
		resp.getWriter().print(json);
		resp.getWriter().flush();
		resp.getWriter().close();
	}
	
	/**
	 * 查询所有商品并分类返回
	 * @param req
	 * @param resp
	 * @throws IOException
	 */
	@RequestMapping(params="method=getAllGoods")
	public void getAllGoods(HttpServletRequest req,HttpServletResponse resp) throws IOException{
		GoodsDTO retGood=new GoodsDTO();
		ArrayList<GoodsDTO> mealGoods=new ArrayList<GoodsDTO>();
		ArrayList<GoodsDTO> foodGoods=new ArrayList<GoodsDTO>();
		ArrayList<GoodsDTO> snackGoods=new ArrayList<GoodsDTO>();
		ArrayList<GoodsDTO> drinkGoods=new ArrayList<GoodsDTO>();
		
		List<Goods> list=goodsDAO.findAll();
		for(Goods good:list){
			GoodsDTO dto=new GoodsDTO();
			BeanUtils.copyProperties(good, dto);
			if("meal".equalsIgnoreCase(good.getType())){
				mealGoods.add(dto);
			}else if("food".equalsIgnoreCase(good.getType())){
				foodGoods.add(dto);
			}else if("snack".equalsIgnoreCase(good.getType())){
				snackGoods.add(dto);
			}else{
				drinkGoods.add(dto);
			}
		}
		retGood.setMealGoods(mealGoods);
		retGood.setFoodGoods(foodGoods);
		retGood.setSnackGoods(snackGoods);
		retGood.setDrinkGoods(drinkGoods);
		
		JSONObject json=new JSONObject();
		json.put("success",true);
		json.put("data", JSONObject.fromObject(retGood));
		resp.setCharacterEncoding("UTF-8");
		resp.getWriter().print(json);
		resp.getWriter().flush();
		resp.getWriter().close();
	}
	
	/**
	 * 查询商品列表
	 * @param req
	 * @param resq
	 * @throws IOException 
	 */
	@RequestMapping(params="method=getGoodsList")
	public void getGoodsList(HttpServletRequest req,HttpServletResponse resp) throws IOException{
		GoodsDTO retGood=new GoodsDTO();
		ArrayList<GoodsDTO> goodsList=new ArrayList<GoodsDTO>();
		List<Goods> list=goodsDAO.findAll();
		for(Goods good:list){
			GoodsDTO dto=new GoodsDTO();
			BeanUtils.copyProperties(good, dto);
			goodsList.add(dto);
		}
		retGood.setGoodsList(goodsList);
		JSONObject json=new JSONObject();
		json.put("success",true);
		json.put("data", JSONObject.fromObject(retGood));
		resp.setCharacterEncoding("UTF-8");
		resp.getWriter().print(json);
		resp.getWriter().flush();
		resp.getWriter().close();
	}
	
	/**
	 * 保存产品
	 * @param req
	 * @param resp
	 * @param dto
	 * @throws IOException
	 */
	@RequestMapping(params="method=addGood")
	public void addGood(HttpServletRequest req,HttpServletResponse resp,Goods dto) throws IOException{
		boolean success=true;
		String message="";
		try{
			Long maxId=goodsDAO.getMaxId();
			dto.setId(maxId+1);
			dto.setCount(1);
			dto.setName(req.getParameter("name"));
			dto.setPrice(Double.valueOf(req.getParameter("price")));
			dto.setPicture(req.getParameter("picture"));
			dto.setType(req.getParameter("type"));
			goodsDAO.saveAndFlush(dto);
			
		}catch(Exception e){
			success=false;
			message=e.getMessage();
		}
		JSONObject json=new JSONObject();
		json.put("success",success);
		json.put("message",message);
		resp.setCharacterEncoding("UTF-8");
		resp.getWriter().print(json);
		resp.getWriter().flush();
		resp.getWriter().close();
	}
	/**
	 * 更新商品信息
	 * @param req
	 * @param resp
	 * @param dto
	 * @throws IOException
	 */
	@RequestMapping(params="method=updateGood")
	public void updateGood(HttpServletRequest req,HttpServletResponse resp,Goods dto) throws IOException{
		boolean success=true;
		String message="";
		int result=0;
		try{
			dto.setId(Long.valueOf(req.getParameter("id")));
			dto.setName(req.getParameter("name"));
			dto.setType(req.getParameter("type"));
			dto.setPrice(Double.valueOf(req.getParameter("price")));
			dto.setPicture(req.getParameter("picture"));
			
			result=goodsDAO.updateGoodInfoById(dto.getName(),dto.getType(),dto.getPrice(),dto.getPicture(),dto.getId());
			success=result>0?true:false;
		}catch(Exception e){
			e.printStackTrace();
			success=false;
			message=e.getMessage();
		}
		JSONObject json=new JSONObject();
		json.put("success",success);
		json.put("message",message);
		resp.setCharacterEncoding("UTF-8");
		resp.getWriter().print(json);
		resp.getWriter().flush();
		resp.getWriter().close();
	}
	
	/**
	 * 删除商品
	 * @param req
	 * @param resp
	 * @throws IOException
	 */
	@RequestMapping(params="method=deleteGood")
	public void deleteGood(HttpServletRequest req,HttpServletResponse resp) throws IOException{
		Long id=Long.valueOf(req.getParameter("id"));
		Long result=goodsDAO.deleteById(id);
		JSONObject json=new JSONObject();
		json.put("success",result>0?true:false);
		resp.setCharacterEncoding("UTF-8");
		resp.getWriter().print(json);
		resp.getWriter().flush();
		resp.getWriter().close();
	}

}
