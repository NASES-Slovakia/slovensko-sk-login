package com.archimetes.cgpcon.websso;

import com.onelogin.saml2.Auth;
import com.onelogin.saml2.logout.LogoutRequestParams;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

public class LogoutServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        try {
            Auth auth = new Auth( Settings.loadSettings() , request, response);
            HttpSession session = request.getSession();
            String nameId = null;
            if (session.getAttribute("nameId") != null) {
                nameId = session.getAttribute("nameId").toString();
            }
            String nameIdFormat = null;
            if (session.getAttribute("nameIdFormat") != null) {
                nameIdFormat = session.getAttribute("nameIdFormat").toString();
            }
            String nameidNameQualifier = null;
            if (session.getAttribute("nameidNameQualifier") != null) {
                nameidNameQualifier = session.getAttribute("nameidNameQualifier").toString();
            }
            String nameidSPNameQualifier = null;
            if (session.getAttribute("nameidSPNameQualifier") != null) {
                nameidSPNameQualifier = session.getAttribute("nameidSPNameQualifier").toString();
            }
            String sessionIndex = null;
            if (session.getAttribute("sessionIndex") != null) {
                sessionIndex = session.getAttribute("sessionIndex").toString();
            }
            LogoutRequestParams logoutRequestParams = new LogoutRequestParams(sessionIndex, nameId, nameIdFormat, nameidNameQualifier, nameidSPNameQualifier);
            auth.logout(request.getParameter("RelayState"), logoutRequestParams);
            return;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
