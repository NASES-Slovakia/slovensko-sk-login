package com.archimetes.cgpcon.websso;

import com.onelogin.saml2.Auth;
import com.onelogin.saml2.exception.SettingsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class ProtectedFilter implements Filter {
    private static final Logger logger = LoggerFactory.getLogger(new Object() {
    }.getClass().getEnclosingClass());

    public void init(FilterConfig config) throws ServletException {
    }

    public void destroy() {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws ServletException, IOException {
        if (request instanceof HttpServletRequest) {
            HttpServletRequest req = (HttpServletRequest) request;
            if (req.getSession().getAttribute("nameId") == null) {
                try {
                    Auth auth = new Auth(Settings.loadSettings(), req, (HttpServletResponse) response);
                    auth.login(req.getRequestURI());
                    return;
                } catch (SettingsException ex) {
                    logger.error("Exception caught", ex);
                }
            }
        }
        chain.doFilter(request, response);
    }
}
