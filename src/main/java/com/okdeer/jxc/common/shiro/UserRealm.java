/** 
 *@Project: okdeer-jxc-web 
 *@Author: zhangq
 *@Date: 2016年9月8日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */

package com.okdeer.jxc.common.shiro;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Stack;

import javax.annotation.Resource;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.cas.CasRealm;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.PrincipalCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.okdeer.ca.api.common.SysMenuPermissionDto;
import com.okdeer.ca.api.common.SystemUserDto;
import com.okdeer.ca.api.common.enums.SystemCodeEnum;
import com.okdeer.ca.api.sysuser.service.ISysUserApi;
import com.okdeer.jxc.branch.entity.Branches;
import com.okdeer.jxc.branch.service.BranchesServiceApi;
import com.okdeer.jxc.common.constant.Constant;
import com.okdeer.jxc.common.enums.BranchTypeEnum;
import com.okdeer.jxc.common.enums.StatusEnum;
import com.okdeer.jxc.common.exception.BusinessException;
import com.okdeer.jxc.common.utils.StringUtils;
import com.okdeer.jxc.supplier.entity.Supplier;
import com.okdeer.jxc.supplier.service.SupplierServiceApi;
import com.okdeer.jxc.system.entity.SysRole;
import com.okdeer.jxc.system.entity.SysUser;
import com.okdeer.jxc.system.service.SysRoleService;
import com.okdeer.jxc.system.service.SysUserCategoryGrantServiceApi;
import com.okdeer.jxc.system.service.SysUserServiceApi;
import com.okdeer.jxc.utils.UserUtil;

/**
 * ClassName: UserRealm 
 * @Description: 用户登录授权(UserRealm)
 * 
 * 该文件使用注解的形式会导致dubbo无法注入，请在spring-jxc-dubbo.xml用配置XML的方式注入
 * dubbo不要用注解扫描@Reference，而是直接使用@Autowired
 * 
 * @author liwb
 * @date 2016年8月5日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 * 		进销存2.0		2016年8月5日			liwb				用户登录授权
 * 商业管理系统1.0.0    2016年9月8日                     zhangq              规范代码
 */
public class UserRealm extends CasRealm {

	/**
	 * 日志
	 */
	private static final Logger LOG = LoggerFactory.getLogger(UserRealm.class);

	/**
	 * 用户中心系统用户接口api
	 */
	@Autowired
	private ISysUserApi sysUserApi;

	/**
	 * 用户dubbo接口
	 */
	@Autowired
	private SysUserServiceApi sysUserService;

	/**
	 * 用户类别权限Dubbo接口
	 */
	@Autowired
	private SysUserCategoryGrantServiceApi sysUserCategoryGrantServiceApi;

	/**
	 * 机构Dubbo接口
	 */
	@Autowired
	private BranchesServiceApi branchesService;

	/**
	 * 供应商Dubbo接口
	 */
	@Autowired
	private SupplierServiceApi supplierService;

	@Resource
	private SysRoleService sysRoleService;

	// 支持的运算符和运算符优先级
	public static final Map<String, Integer> expMap = new HashMap<String, Integer>() {

		private static final long serialVersionUID = 1L;
		{
			put("not", 0);
			put("!", 0);

			put("and", 0);
			put("&&", 0);

			put("or", 0);
			put("||", 0);

			put("(", 1);
			put(")", 1);
		}
	};

	public static final Set<String> expList = expMap.keySet();

	/**
	 * @Description: 登入令牌
	 * @return info 认证信息
	 * @throws AuthenticationException 认证异常
	 * (non-Javadoc)
	 * @see org.apache.shiro.cas.CasRealm#doGetAuthenticationInfo(org.apache.shiro.authc.AuthenticationToken)
	 */
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
		AuthenticationInfo info = super.doGetAuthenticationInfo(token);
		LOG.info("token : " + token + "，info : " + info);
		try {
			if (info == null) {
				LOG.error("token info 为空，请检查token是否存在, token:{}", token);
				throw new IncorrectCredentialsException("登录账号或密码错误");
			}
			// 获取用户中心登录用户
			String sysUserId = (String) token.getPrincipal();
			SystemUserDto caUser = sysUserApi.loadSysUser(sysUserId);
			if (null == caUser) {
				LOG.error("根据sysUserId:{}找不到对应的系统用户，请检查！", sysUserId);
				throw new IncorrectCredentialsException("登录账号或密码错误");
			}

			// 登录账号被禁用
			if (caUser.getStatus().intValue() == Constant.ONE) {
				LOG.error("sysUserId:{} 用户登录账号被禁用！", sysUserId);
				throw new LockedAccountException("登录账号被禁用");
			}

			// 获取本地用户信息
			SysUser sysUser = sysUserService.getUserById(caUser.getId());
			if (null == sysUser) {
				LOG.error("登录失败，零售系统数据库中无当前用户数据，用户ID：{}", caUser.getId());
				throw new AuthenticationException("登录失败，商业管理系统不存在当前用户信息");
			}

			// 如果是禁用状态
			if (StatusEnum.DISABLE.getCode().equals(sysUser.getStatus())) {
				LOG.error("登录失败，该用户已禁用，用户ID：{}", caUser.getId());
				throw new AuthenticationException("登录失败，该用户已禁用!");
			}

			buildLoginInfo(caUser, sysUser);
		} catch (Exception e) {
			LOG.error("登录验证出错:", e);
			throw new AuthenticationException("登录验证出错！");
		}
		return info;
	}

	/**
	 * @Description: 封装登录用户信息
	 * @param caUser
	 * @param sysUser
	 * @author liwb
	 * @date 2016年9月18日
	 */
	private void buildLoginInfo(SystemUserDto caUser, SysUser sysUser) {
		Session session = UserUtil.getSession();
		sysUser.setLastLoginTime(caUser.getLastVisit());
		sysUser.setLastLoginIp(session.getHost());

		// 获取用户类别权限，并保存到session
		List<String> codes = sysUserCategoryGrantServiceApi.getAllCategoryCodeByUserId(sysUser.getId());
		sysUser.setCategoryCodes(codes);

		Branches branch = branchesService.getBranchInfoById(sysUser.getBranchId());
		if (branch == null) {
			throw new BusinessException("用户对应机构为空！");
		}

		// 获取机构类型完整编码
		sysUser.setBranchCompleCode(branch.getBranchCompleCode());
		sysUser.setBranchName(branch.getBranchName());
		sysUser.setBranchType(branch.getType());
		sysUser.setBranchParentId(branch.getParentId());

		// 获取当前机构默认供应商，如果是总部或者分公司，则直接取当前机构的供应商，如果是店铺则获取父节点分公司的供应商
		String branchId = null;
		if (BranchTypeEnum.HEAD_QUARTERS.getCode().equals(branch.getType())
				|| BranchTypeEnum.BRANCH_OFFICE.getCode().equals(branch.getType())) {
			branchId = branch.getBranchesId();
		} else {
			branchId = branch.getParentId();
		}

		// 设置当前机构默认供应商信息
		Supplier supplier = supplierService.getDefaultSupplierByBranchId(branchId);
		UserUtil.setDefaultSupplier(supplier);

		LOG.info("当前用户信息：{}", sysUser);

		// 设置用户session
		UserUtil.setCurrentUser(sysUser);
		// 设置用户价格权限，必须在设置用户session以后
		// PriceGrantUtil.setPriceGrant(sysUser.getPriceGrant());

		// 更新用户登录信息
		sysUserService.updateLoginInfo(sysUser);
	}

	/**
	 * 授权查询回调函数, 进行鉴权但缓存中无用户的授权信息时调用。
	 * (non-Javadoc)
	 * @see org.apache.shiro.cas.CasRealm#doGetAuthorizationInfo(org.apache.shiro.subject.PrincipalCollection)
	 */
	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
		try {
			SysUser sysUser = UserUtil.getCurrentUser();
			// 用户接受的操作权限类
			SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
			List<SysMenuPermissionDto> list = sysUserApi.findPermissionBySysUserId(sysUser.getId(), SystemCodeEnum.JXC);
			// 如果权限为空
			if (null == list || list.isEmpty()) {
				return null;
			}
			for (SysMenuPermissionDto sysMenuPermissionDto : list) {
				if (StringUtils.isNotBlank(sysMenuPermissionDto.getCode())) {
					info.addStringPermissions(sysMenuPermissionDto.getPermissions(null));
				}
			}
			SysRole role = sysRoleService.getRoleByUserId(sysUser.getId());
			Set<String> roles = new HashSet<String>();
			roles.add(role.getRoleCode());
			info.setRoles(roles);
			return info;
		} catch (Exception e) {
			LOG.error("赋予权限出错{}", e);
		}
		return null;
	}

	/**
	 * 
	 * (non-Javadoc)
	 * @see org.apache.shiro.realm.AuthorizingRealm#clearCachedAuthorizationInfo(org.apache.shiro.subject.PrincipalCollection)
	 */
	@Override
	public void clearCachedAuthorizationInfo(PrincipalCollection principals) {
		super.clearCachedAuthorizationInfo(principals);
	}

	/**
	 * 
	 * (non-Javadoc)
	 * @see org.apache.shiro.realm.AuthenticatingRealm#clearCachedAuthenticationInfo(org.apache.shiro.subject.PrincipalCollection)
	 */
	@Override
	public void clearCachedAuthenticationInfo(PrincipalCollection principals) {
		super.clearCachedAuthenticationInfo(principals);
	}

	/**
	 * 
	 * (non-Javadoc)
	 * @see org.apache.shiro.realm.CachingRealm#clearCache(org.apache.shiro.subject.PrincipalCollection)
	 */
	@Override
	public void clearCache(PrincipalCollection principals) {
		super.clearCache(principals);
	}

	@Override
	public boolean isPermitted(PrincipalCollection principals, String permission) {
		// return super.isPermitted(principals, permission);

		Stack<String> exp = getExp(expList, permission);
		if (exp.size() == 1) {
			return super.isPermitted(principals, exp.pop());
		}
		List<String> expTemp = new ArrayList<>();
		// 将其中的权限字符串解析成true , false
		for (String temp : exp) {
			if (expList.contains(temp)) {
				expTemp.add(temp);
			} else {
				expTemp.add(Boolean.toString(super.isPermitted(principals, temp)));
			}
		}
		LOG.debug("permission:{}  Rpn:{}  parse:{}", permission, exp, expTemp);
		// 计算逆波兰
		return computeRpn(expList, expTemp);
	}

	private static boolean computeRpn(Collection<String> expList, Collection<String> exp) {
		LOG.debug("RPN  exp :{}", exp);
		Stack<Boolean> stack = new Stack<>();
		for (String temp : exp) {
			if (expList.contains(temp)) {
				if ("!".equals(temp) || "not".equals(temp)) {
					stack.push(!stack.pop());
				} else if ("and".equals(temp) || "&&".equals(temp)) {
					Boolean s1 = stack.pop();
					Boolean s2 = stack.pop();
					stack.push(s1 && s2);
				} else {
					Boolean s1 = stack.pop();
					Boolean s2 = stack.pop();
					stack.push(s1 || s2);
				}
			} else {
				stack.push(Boolean.parseBoolean(temp));
			}
		}
		if (stack.size() > 1) {
			LOG.error("computeRpn RESULT ERROR>{}  exp:{}", stack, exp);
			throw new RuntimeException("compute error！ stack: " + exp.toString());
		} else {
			LOG.debug("computeRpn RESULT SUCCESS>{}", stack);
			return stack.pop();
		}
	}

	// 获得逆波兰表达式
	private static Stack<String> getExp(Collection<String> expList, String exp) {
		Stack<String> s1 = new Stack<>();
		Stack<String> s2 = new Stack<>();
		for (String str : exp.split(" ")) {
			str = str.trim();
			String strL = str.toLowerCase();
			if ("".equals(str)) {
				continue;
			}
			if ("(".equals(str)) {
				// 左括号
				s1.push(str);
			} else if (")".equals(str)) {
				// 右括号
				while (!s1.empty()) {
					String temp = s1.pop();
					if ("(".equals(temp)) {
						break;
					} else {
						s2.push(temp);
					}
				}
			} else if (expList.contains(strL)) {
				// 操作符
				if (s1.empty()) {
					s1.push(strL);
				} else {
					String temp = s1.peek();
					if ("(".equals(temp) || ")".equals(temp)) {
						s1.push(strL);
					} else if (expMap.get(strL) >= expMap.get(temp)) {
						s1.push(strL);
					} else {
						s2.push(s1.pop());
						s1.push(strL);
					}
				}
			} else {
				// 运算数
				s2.push(str);
			}
		}
		while (!s1.empty()) {
			s2.push(s1.pop());
		}
		return s2;
	}

	/**
	 * @Description: 清理授权缓存
	 * @author liwb
	 * @date 2016年8月5日
	 */
	public void clearAllCachedAuthorizationInfo() {
		getAuthorizationCache().clear();
	}

	/**
	 * @Description: 清理认证信息缓存
	 * @author liwb
	 * @date 2016年8月5日
	 */
	public void clearAllCachedAuthenticationInfo() {
		getAuthenticationCache().clear();
	}

	/**
	 * @Description: 清理缓存
	 * @author liwb
	 * @date 2016年8月5日
	 */
	public void clearAllCache() {
		clearAllCachedAuthenticationInfo();
		clearAllCachedAuthorizationInfo();
	}
}
