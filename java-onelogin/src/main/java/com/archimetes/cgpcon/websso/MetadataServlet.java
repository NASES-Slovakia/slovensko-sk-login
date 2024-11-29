package com.archimetes.cgpcon.websso;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.cert.CertificateEncodingException;

public class MetadataServlet extends HttpServlet {
    private static final Logger logger = LoggerFactory.getLogger(new Object() {}.getClass().getEnclosingClass());

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        resp.setContentType("application/xml");
        resp.setCharacterEncoding("UTF-8");
        try {
            resp.getOutputStream().print(  Settings.loadSettings().getSPMetadata() );
        } catch (CertificateEncodingException e) {
            throw new RuntimeException(e);
        }

    }

}
