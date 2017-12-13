package com.diy.springBoot.shiro.dto;

import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name="t_role")
public class RoleInfo {
	@Id
	private int id;
	private String roleName;
	private String description;
	private Date createTime;
	@OneToMany
	@JoinColumn(name="roleId", referencedColumnName="id")
	private List<UserRole> userRole;
	@OneToMany
	@JoinColumn(name="roleId", referencedColumnName="id")
	private List<RoleModule> roleModule;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getRoleName() {
		return roleName;
	}
	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public List<UserRole> getUserRole() {
		return userRole;
	}
	public void setUserRole(List<UserRole> userRole) {
		this.userRole = userRole;
	}
	public List<RoleModule> getRoleModule() {
		return roleModule;
	}
	public void setRoleModule(List<RoleModule> roleModule) {
		this.roleModule = roleModule;
	}
	
	
	
}
