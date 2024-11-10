package com.archimetes.cgpcon.websso;

import com.onelogin.saml2.Auth;
import com.onelogin.saml2.exception.Error;
import com.onelogin.saml2.exception.SettingsException;
import com.onelogin.saml2.settings.SettingsBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Properties;

public class LoginServlet extends HttpServlet {
    private static final Logger logger = LoggerFactory.getLogger(new Object() {}.getClass().getEnclosingClass());

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            Auth auth = new Auth( Settings.loadSettings() , request, response);
            String redir = request.getParameter("redir");
            if (redir == null) {
                auth.login();
            } else {
                auth.login(redir);
            }
        } catch (SettingsException ex) {
            logger.error("Exception caught", ex);
        }
    }
}
