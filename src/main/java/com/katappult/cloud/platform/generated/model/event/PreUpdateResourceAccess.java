package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PreUpdateResourceAccess extends KatappultEvent {

    private UIAttributes uiAttributes;

    public PreUpdateResourceAccess() {
        super();
    }

    public PreUpdateResourceAccess(Persistable subject) {
        super(subject);
    }

     public PreUpdateResourceAccess(Persistable subject, UIAttributes uiAttributes) {
            super(subject);
            this.uiAttributes = uiAttributes;
            setAdditionnalAtributes(uiAttributes.getAllAttributesFromUI());
        }
}
