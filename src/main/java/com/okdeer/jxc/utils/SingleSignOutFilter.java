
package com.okdeer.jxc.utils;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.jasig.cas.client.session.SessionMappingStorage;
import org.jasig.cas.client.session.SingleSignOutHandler;
import org.jasig.cas.client.util.AbstractConfigurationFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.okdeer.jxc.common.constant.Constant;

/**
 * Implements the Single Sign Out protocol.  It handles registering the session and destroying the session.
 *
 * @author Scott Battaglia
 * @version $Revision$ $Date$
 * @since 3.1
 */
public final class SingleSignOutFilter extends AbstractConfigurationFilter {
	
	/**
	 * logger 日志
	 */
	private static final Logger logger = LoggerFactory.getLogger(SingleSignOutFilter.class);
	
	private static final SingleSignOutHandler HANDLER = new SingleSignOutHandler();

	public void init(final FilterConfig filterConfig) throws ServletException {
		if (!isIgnoreInitConfiguration()) {
			HANDLER.setArtifactParameterName(getPropertyFromInitParams(filterConfig, "artifactParameterName", "ticket"));
			HANDLER.setLogoutParameterName(getPropertyFromInitParams(filterConfig, "logoutParameterName",
					"logoutRequest"));
		}
		HANDLER.init();
	}

	public void setArtifactParameterName(final String name) {
		HANDLER.setArtifactParameterName(name);
	}

	public void setLogoutParameterName(final String name) {
		HANDLER.setLogoutParameterName(name);
	}

	public void setSessionMappingStorage(final SessionMappingStorage storage) {
		HANDLER.setSessionMappingStorage(storage);
	}

	public void doFilter(final ServletRequest servletRequest, final ServletResponse servletResponse,
			final FilterChain filterChain) throws IOException, ServletException {
		final HttpServletRequest request = (HttpServletRequest) servletRequest;
		final HttpSession session = request.getSession();

		if (HANDLER.isTokenRequest(request)) {
			HANDLER.recordSession(request);
		} else if (HANDLER.isLogoutRequest(request)) {
			HANDLER.destroySession(request);
			// Do not continue up filter chain
			return;
		} else {
			logger.trace("Ignoring URI:{}",request.getRequestURI());

			// 登陆url
			String contextPath = request.getContextPath();
			String url = request.getRequestURI();
			String compareUrl = url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
			if (!compareUrl.equals(contextPath) && session.getAttribute(Constant.SESSION_USER) == null) {
				String str = "<script language='javascript'>window.top.onbeforeunload = null;"
						+ "window.top.location.href='" + contextPath + "';</script>";
				// 解决中文乱码
				servletResponse.setContentType("text/html;charset=UTF-8");
				try {
					PrintWriter writer = servletResponse.getWriter();
					writer.write(str);
					writer.flush();
					writer.close();
					return;
				} catch (Exception e) {
					logger.warn("输出会话异常错误", e);
				}
			}
		}

		filterChain.doFilter(servletRequest, servletResponse);
	}

	public void destroy() {
		// nothing to do
	}

	protected static SingleSignOutHandler getSingleSignOutHandler() {
		return HANDLER;
	}
}