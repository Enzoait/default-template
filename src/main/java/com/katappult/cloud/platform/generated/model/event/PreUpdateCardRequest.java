package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PreUpdateCardRequest extends KatappultEvent {

    private UIAttributes uiAttributes;

    public PreUpdateCardRequest() {
        super();
    }

    public PreUpdateCardRequest(Persistable subject) {
        super(subject);
    }

     public PreUpdateCardRequest(Persistable subject, UIAttributes uiAttributes) {
            super(subject);
            this.uiAttributes = uiAttributes;
            setAdditionnalAtributes(uiAttributes.getAllAttributesFromUI());
        }
}
