package com.diy.springBoot.serviceImpl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.diy.springBoot.constant.Constant;
import com.diy.springBoot.dao.UserDAO;
import com.diy.springBoot.service.ModuleService;
import com.diy.springBoot.service.UserService;
import com.diy.springBoot.shiro.dto.ModuleInfo;
import com.diy.springBoot.shiro.dto.UserInfo;

@Service
public class UserServiceImpl implements UserService{
	@Autowired
	private UserDAO userDAO;
	@Autowired
	private ModuleService moduleService;

	/**
	 * 根据账号Account查询当前用户
	 * @param account
	 * @return
	 */
	public UserInfo findByAccount(String account) {
		return userDAO.findUserInfoByAccount(account);
	}

	/**
	 * 获取资源集合
	 * @param account
	 * @return
	 */
	public Set<String> findPermissions(String account) {
		Set<String> set =new HashSet();
		UserInfo user = findByAccount(account);
		List<ModuleInfo>modules = moduleService.findModuleByUserId(user.getId());
		
		for(ModuleInfo info: modules) {
			set.add(info.getModuleKey());
		}
		return set;
	}

	/**
	 * 获取URL权限
	 * @param account
	 * @return
	 */
	public List<String> findPermissionUrl(String account) {
		List<String> list = new ArrayList();
		UserInfo user = findByAccount(account);
		List<ModuleInfo>modules = moduleService.findModuleByUserId(user.getId());
		
		for(ModuleInfo info: modules) {
			if(info.getModuleType() == Constant.URL_TYPE) {
				list.add(info.getModulePath());
			}
		}
		return list;
	}
}
