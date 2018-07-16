package com.diy.springBoot.dao;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.diy.springBoot.dto.Goods;

public interface GoodsDAO extends JpaRepository<Goods,String>{
	List<Goods> findAll();
	List<Goods> findByType(String type);
	@SuppressWarnings("unchecked")
	Goods saveAndFlush(Goods good);
	@Query("select max(id) from Goods ")
	Long getMaxId();
	@Modifying
	@Transactional
	@Query("update Goods a set a.name=?1,a.type=?2,a.price=?3,a.picture=?4 where a.id=?5 ")
	int updateGoodInfoById(String name,String type,double price,String picture,long id)throws Exception;
	
	@Modifying
	@Transactional
	Long deleteById(Long id);
}
