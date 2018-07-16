package com.diy.springBoot.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.diy.springBoot.shiro.dto.ModuleInfo;

public interface ModuleService {
	/**
	 * 获取角色模块
	 * @param userId
	 * @return
	 */
	List<ModuleInfo> findModuleByUserId(int userId);
}
