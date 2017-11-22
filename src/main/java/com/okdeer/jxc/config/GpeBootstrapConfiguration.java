package com.okdeer.jxc.config;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Role;

import com.okdeer.retail.framework.gpe.config.GpeAnnotationBeanPostProcessor;
import com.okdeer.retail.framework.gpe.config.GpePropertyConfigurer;

/**
 * 
 * ClassName: GpeBootstrapConfiguration 
 * @Description: GPE启动配置
 * @author zhangq
 * @date 2017年9月25日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Configuration
public class GpeBootstrapConfiguration {
	
	/**
	 * 
	 * @Description: GPE注解处理类
	 * @return GpeAnnotationBeanPostProcessor  
	 * @author zhangqin
	 * @date 2017年9月25日
	 */
	@Bean
	@Role(BeanDefinition.ROLE_INFRASTRUCTURE)
	public GpeAnnotationBeanPostProcessor gpeAnnotationBeanPostProcessor() {
		return new GpeAnnotationBeanPostProcessor();
	}

	/**
	 * 
	 * @Description: GPE属性文件配置器
	 * @return GpePropertyConfigurer  
	 * @author zhangq
	 * @date 2017年9月27日
	 */
	@Bean
	@Role(BeanDefinition.ROLE_INFRASTRUCTURE)
	public GpePropertyConfigurer gpePropertyConfigurer() {
		return new GpePropertyConfigurer();
	}
}
