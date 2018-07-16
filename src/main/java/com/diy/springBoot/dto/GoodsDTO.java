package com.diy.springBoot.dto;

import java.util.ArrayList;

public class GoodsDTO {
	private long id;
	private String name;
	private double price;
	private long count;
	private String picture;
	private String type;
	/**
	 * 套餐
	 */
	private ArrayList<GoodsDTO> mealGoods;
	/**
	 * 主食
	 */
	private ArrayList<GoodsDTO> foodGoods;
	/**
	 * 小吃
	 */
	private ArrayList<GoodsDTO> snackGoods;
	/**
	 * 饮料
	 */
	private ArrayList<GoodsDTO> drinkGoods;
	/**
	 * 畅销商品
	 */
	private ArrayList<GoodsDTO> wellGoods;
	/**
	 * 商品列表
	 */
	private ArrayList<GoodsDTO> goodsList;
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public double getPrice() {
		return price;
	}
	public void setPrice(double price) {
		this.price = price;
	}
	public long getCount() {
		return count;
	}
	public void setCount(long count) {
		this.count = count;
	}
	public String getPicture() {
		return picture;
	}
	public void setPicture(String picture) {
		this.picture = picture;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public ArrayList<GoodsDTO> getMealGoods() {
		return mealGoods;
	}
	public void setMealGoods(ArrayList<GoodsDTO> mealGoods) {
		this.mealGoods = mealGoods;
	}
	public ArrayList<GoodsDTO> getFoodGoods() {
		return foodGoods;
	}
	public void setFoodGoods(ArrayList<GoodsDTO> foodGoods) {
		this.foodGoods = foodGoods;
	}
	public ArrayList<GoodsDTO> getSnackGoods() {
		return snackGoods;
	}
	public void setSnackGoods(ArrayList<GoodsDTO> snackGoods) {
		this.snackGoods = snackGoods;
	}
	public ArrayList<GoodsDTO> getDrinkGoods() {
		return drinkGoods;
	}
	public void setDrinkGoods(ArrayList<GoodsDTO> drinkGoods) {
		this.drinkGoods = drinkGoods;
	}
	public ArrayList<GoodsDTO> getWellGoods() {
		return wellGoods;
	}
	public void setWellGoods(ArrayList<GoodsDTO> wellGoods) {
		this.wellGoods = wellGoods;
	}
	public ArrayList<GoodsDTO> getGoodsList() {
		return goodsList;
	}
	public void setGoodsList(ArrayList<GoodsDTO> goodsList) {
		this.goodsList = goodsList;
	}
	
	
}
