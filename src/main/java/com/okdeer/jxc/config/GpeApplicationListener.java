package com.okdeer.jxc.config;

import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.retail.framework.gpe.facade.UserConfigFacade;
import com.okdeer.retail.framework.gpe.helper.GpeHelper;

/**
 * 
 * ClassName: GpeApplicationListener 
 * @Description: GPE初始化
 * @author zhangqin
 * @date 2017年9月26日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Component
public class GpeApplicationListener implements ApplicationListener<ContextRefreshedEvent> {

	@Reference(version = "1.0.0", check = false)
	private UserConfigFacade userConfigFacade;

	@Override
	public void onApplicationEvent(ContextRefreshedEvent event) {
		//if (event.getApplicationContext().getParent() == null) {
			GpeHelper.userConfigFacade = userConfigFacade;
		//}
	}

}
