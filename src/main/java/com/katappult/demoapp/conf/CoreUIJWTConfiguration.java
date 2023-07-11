
package com.katappult.demoapp.conf;

import com.katappult.core.security.KatappultJWTRequestAuthFilter;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

@Component
public class CoreUIJWTConfiguration extends KatappultJWTRequestAuthFilter {

    public CoreUIJWTConfiguration(){
        super();
    }

    @Override
    protected boolean canCurrentUserAccessRequestedResource(HttpServletRequest request) {
        return super.canCurrentUserAccessRequestedResource(request);
    }
}
