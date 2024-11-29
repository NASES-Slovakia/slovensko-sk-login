package com.archimetes.cgpcon.websso;

import com.onelogin.saml2.Auth;
import com.onelogin.saml2.servlet.ServletUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public class SamlServlet extends HttpServlet {
    private static final Logger logger = LoggerFactory.getLogger(new Object() {}.getClass().getEnclosingClass());

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            Auth auth = new Auth( Settings.loadSettings() , request, response);
            auth.processResponse();
            String relayState = request.getParameter("RelayState");

            Map<String, List<String>> attributes = auth.getAttributes();
            String nameId = auth.getNameId();
            String nameIdFormat = auth.getNameIdFormat();
            String sessionIndex = auth.getSessionIndex();
            String nameidNameQualifier = auth.getNameIdNameQualifier();
            String nameidSPNameQualifier = auth.getNameIdSPNameQualifier();

            HttpSession session = request.getSession();
            session.setAttribute("attributes", attributes);
            session.setAttribute("nameId", nameId);
            session.setAttribute("nameIdFormat", nameIdFormat);
            session.setAttribute("sessionIndex", sessionIndex);
            session.setAttribute("nameidNameQualifier", nameidNameQualifier);
            session.setAttribute("nameidSPNameQualifier", nameidSPNameQualifier);

            if (relayState != null && !relayState.isEmpty() && !relayState.equals(ServletUtils.getSelfRoutedURLNoQuery(request)) &&
                    !relayState.contains("/login")) { // We don't want to be redirected to login.jsp neither
                response.sendRedirect(request.getParameter("RelayState"));
            } else {
                response.sendRedirect("/");
            }

        } catch (Exception ex) {
            logger.error("Exception caught", ex);
        }
    }
}
