package com.diy.springBoot.shiro.dto;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="t_role_module")
public class RoleModule {
	@Id
	private int id;
	private int roleId;
	private int moduleId;
	@ManyToOne
	private RoleInfo roleInfo;
	@ManyToOne
	private ModuleInfo moduleInfo;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getRoleId() {
		return roleId;
	}
	public void setRoleId(int roleId) {
		this.roleId = roleId;
	}
	public int getModuleId() {
		return moduleId;
	}
	public void setModuleId(int moduleId) {
		this.moduleId = moduleId;
	}
	public RoleInfo getRoleInfo() {
		return roleInfo;
	}
	public void setRoleInfo(RoleInfo roleInfo) {
		this.roleInfo = roleInfo;
	}
	public ModuleInfo getModuleInfo() {
		return moduleInfo;
	}
	public void setModuleInfo(ModuleInfo moduleInfo) {
		this.moduleInfo = moduleInfo;
	}
	
	
}
