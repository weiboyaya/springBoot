package com.diy.springBoot.shiro.dto;

import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;


@Entity
@Table(name="t_module")
public class ModuleInfo {
	@Id
	private Integer id;
	private String moduleName;
	private String modulePath;
	private Integer moduleType;
	private String moduleKey;
	private Date createTime;
	@OneToMany
	@JoinColumn(name="moduleId", referencedColumnName="id")
	private List<RoleModule> roleModule;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getModuleName() {
		return moduleName;
	}
	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}
	public String getModulePath() {
		return modulePath;
	}
	public void setModulePath(String modulePath) {
		this.modulePath = modulePath;
	}
	public Integer getModuleType() {
		return moduleType;
	}
	public void setModuleType(Integer moduleType) {
		this.moduleType = moduleType;
	}
	public String getModuleKey() {
		return moduleKey;
	}
	public void setModuleKey(String moduleKey) {
		this.moduleKey = moduleKey;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public List<RoleModule> getRoleModule() {
		return roleModule;
	}
	public void setRoleModule(List<RoleModule> roleModule) {
		this.roleModule = roleModule;
	}
	
	

}
