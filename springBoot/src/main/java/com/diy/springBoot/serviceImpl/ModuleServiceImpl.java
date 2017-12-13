package com.diy.springBoot.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.diy.springBoot.dao.ModuleDAO;
import com.diy.springBoot.service.ModuleService;
import com.diy.springBoot.shiro.dto.ModuleInfo;

@Service
public class ModuleServiceImpl implements ModuleService{
	@Autowired
	private ModuleDAO moduleDAO;

	/**
	 * 获取角色模块
	 * @param userId
	 * @return
	 */
	public List<ModuleInfo> findModuleByUserId(int userId) {
		return moduleDAO.findModuleInfoByUserId(userId);
	}
}
