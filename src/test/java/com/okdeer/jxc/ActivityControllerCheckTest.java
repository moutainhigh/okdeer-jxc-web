/** 
 *@Project: okdeer-jxc-web 
 *@Author: xiaoj02
 *@Date: 2016年11月14日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */    
package com.okdeer.jxc;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.okdeer.jxc.common.constant.Constant;
import com.okdeer.jxc.system.entity.SysUser;

/**
 * ClassName: ActivityControllerTest 
 * @author xiaoj02
 * @date 2016年11月14日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
public class ActivityControllerCheckTest {
	
	@Autowired  
    private WebApplicationContext wac;  
  
    private MockMvc mockMvc; 
    
    @Before  
    public void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    }
    
    @Test
    @Rollback(false)//设置是否回滚 
    public void save() throws Exception {
    	MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/sale/activity/check");
    	requestBuilder.contentType(MediaType.APPLICATION_JSON_UTF8);
    	
    	SysUser user = new SysUser();
    	user.setId("junit测试审核用户Id");
    	user.setBranchCode("00000");
    	requestBuilder.sessionAttr(Constant.SESSION_USER, user);
    	
    	requestBuilder.param("activityId", "8a94e7f1586793ed01586793edd40000");
    	
        ResultActions resultActions = mockMvc.perform(requestBuilder);
        resultActions.andDo(MockMvcResultHandlers.print());
    }
	
}
