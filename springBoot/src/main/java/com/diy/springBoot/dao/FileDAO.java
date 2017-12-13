package com.diy.springBoot.dao;

import java.util.Collection;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.diy.springBoot.dto.Filemsg;


public interface FileDAO extends JpaRepository<Filemsg,String>{
	
	List<Filemsg> findAll();
	Filemsg saveAndFlush(Filemsg file);
	@Modifying
	@Transactional
	Long deleteById(Long id);
	@Query("select max(id) from Filemsg ")
	Long getMaxId();
	
	List<Filemsg> findByIdIn(Collection ids);
	
	List<Filemsg> findByType(int type);
}
