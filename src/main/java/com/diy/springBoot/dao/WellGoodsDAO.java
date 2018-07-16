package com.diy.springBoot.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.diy.springBoot.dto.WellGoods;

/**
 * Pos数据库操作类
 * @author lenovo
 *
 */
public interface WellGoodsDAO extends JpaRepository<WellGoods,String>{
	
	List<WellGoods> findAll();

}
