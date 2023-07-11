package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PreUpdatePointer extends KatappultEvent {

    private UIAttributes uiAttributes;

    public PreUpdatePointer() {
        super();
    }

    public PreUpdatePointer(Persistable subject) {
        super(subject);
    }

     public PreUpdatePointer(Persistable subject, UIAttributes uiAttributes) {
            super(subject);
            this.uiAttributes = uiAttributes;
            setAdditionnalAtributes(uiAttributes.getAllAttributesFromUI());
        }
}
