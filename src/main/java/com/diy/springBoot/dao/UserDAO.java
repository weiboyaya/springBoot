package com.diy.springBoot.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.diy.springBoot.shiro.dto.UserInfo;

public interface UserDAO extends JpaRepository<UserInfo,String>{
	UserInfo findUserInfoByAccount(String account);

}
