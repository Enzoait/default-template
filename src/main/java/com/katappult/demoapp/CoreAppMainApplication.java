
package com.katappult.demoapp;

import com.katappult.core.conf.KatappultCoreRootConfiguration;
import com.katappult.core.conf.KatappultJWTSecurityConfiguration;
import com.sun.faces.config.FacesInitializer;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import com.katappult.demoapp.conf.CoreUIJWTConfiguration;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import java.util.HashSet;
import java.util.Set;


@SpringBootApplication
@PropertySource(value = {
        "classpath:/application.properties",
        "classpath:/env/${env:int}/application.properties",
        "classpath:override.properties"}, ignoreResourceNotFound = true
)
@Import({
        KatappultCoreRootConfiguration.class,
        CoreUIJWTConfiguration.class
})
@ComponentScan(basePackages = {"com.katappult"})
@EnableWebSecurity
@EnableGlobalMethodSecurity( prePostEnabled = true )
public class CoreAppMainApplication implements ServletContextInitializer{

    /**
     * The entry point of application.
     *
     * @param args the input arguments
     */
    public static void main(String[] args) {
        new SpringApplicationBuilder(CoreAppMainApplication.class)
                .logStartupInfo(false)
                .run(args);
    }

    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {

        // Common
        servletContext.setInitParameter("javax.faces.DEFAULT_SUFFIX", ".xhtml");
        servletContext.setInitParameter("javax.faces.PARTIAL_STATE_SAVING_METHOD", "true");
        servletContext.setInitParameter("javax.faces.STATE_SAVING_METHOD", "client");
        servletContext.setInitParameter("javax.faces.PROJECT_STAGE", "Production");
        servletContext.setInitParameter("facelets.DEVELOPMENT", "false");
        servletContext.setInitParameter("javax.faces.FACELETS_REFRESH_PERIOD", "1");
        servletContext.setInitParameter("com.sun.faces.forceLoadConfiguration", Boolean.TRUE.toString());

        // PrimeFaces
        servletContext.setInitParameter("primefaces.SUBMIT", "partial");
        servletContext.setInitParameter("primefaces.MOVE_SCRIPTS_TO_BOTTOM", "true");
        servletContext.setInitParameter("primefaces.THEME", "siberia-bluegrey");
        servletContext.setInitParameter("primefaces.FONT_AWESOME", "true}");
        servletContext.setInitParameter("primefaces.FACELETS_LIBRARIES", "WEB-INF/primefaces-siberia.taglib.xml}");

        // My faces
        servletContext.setInitParameter("org.apache.myfaces.CACHE_EL_EXPRESSIONS", "alwaysRecompile");
        servletContext.setInitParameter("org.apache.myfaces.SUPPORT_JSP_AND_FACES_EL", "false");
        servletContext.setInitParameter("org.apache.myfaces.NUMBER_OF_VIEWS_IN_SESSION", "15");
        servletContext.setInitParameter("org.apache.myfaces.NUMBER_OF_SEQUENTIAL_VIEWS_IN_SESSION", "3");
        servletContext.setInitParameter("org.apache.myfaces.COMPRESS_STATE_IN_SESSION", "false");
        servletContext.setInitParameter("org.apache.myfaces.CHECK_ID_PRODUCTION_MODE", "false");
        servletContext.setInitParameter("org.apache.myfaces.EARLY_FLUSH_ENABLED", "true");
        servletContext.setInitParameter("org.apache.myfaces.PRETTY_HTML", "false");
        servletContext.setInitParameter("org.apache.myfaces.VIEW_UNIQUE_IDS_CACHE_ENABLED", "true");
        servletContext.setInitParameter("org.apache.myfaces.COMPONENT_UNIQUE_IDS_CACHE_SIZE", "500");

        Set<Class<?>> clazz = new HashSet<Class<?>>();
        clazz.add(CoreAppMainApplication.class); // dummy, enables InitFacesContext

        FacesInitializer facesInitializer = new FacesInitializer();
        facesInitializer.onStartup(clazz, servletContext);
    }
}
