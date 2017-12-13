package com.diy.springBoot.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.diy.springBoot.shiro.dto.ModuleInfo;

public interface ModuleDAO extends JpaRepository<ModuleInfo,String>{
	/*@Query("select moduleInfo from UserRole userRole JOIN RoleInfo roleInfo  JOIN RoleModule roleModule JOIN ModuleInfo moduleInfo  where userRole.userId=?1")*/
	@Query("select moduleInfo from UserRole userRole, RoleInfo roleInfo, RoleModule roleModule, ModuleInfo moduleInfo where userRole.roleId=roleInfo.id and  roleInfo.id=roleModule.roleId and roleModule.moduleId=moduleInfo.id and   userRole.userId=?1 ")
	List<ModuleInfo> findModuleInfoByUserId(int userId);
}
