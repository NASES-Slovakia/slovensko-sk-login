package com.archimetes.cgpcon.websso;

import com.onelogin.saml2.Auth;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class SingleLogoutServiceServlet extends HttpServlet {
    private static final Logger logger = LoggerFactory.getLogger(new Object() {}.getClass().getEnclosingClass());

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            Auth auth = new Auth( Settings.loadSettings() , request, response);
            auth.processSLO();

            request.setAttribute("logoutErrors", auth.getErrors());
            if (auth.getErrors().isEmpty()) {
                request.setAttribute("status", "logoutSuccess");
            }
        } catch (Exception ex) {
            logger.warn("Exception caught", ex);
        }
        request.getRequestDispatcher("/index.jsp").forward(request, response);
    }
}
