package com.archimetes.cgpcon.websso;

import com.onelogin.saml2.settings.Saml2Settings;
import com.onelogin.saml2.settings.SettingsBuilder;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class Settings {

    public static Saml2Settings loadSettings() throws IOException {
        Properties conf = new Properties();
        conf.load(new FileInputStream(System.getProperty("catalina.base") + "/conf/webssodemo.saml.properties"));
        return new SettingsBuilder().fromProperties(conf).build();
    }

}
