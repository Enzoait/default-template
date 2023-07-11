package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PreUpdateBadge extends KatappultEvent {

    private UIAttributes uiAttributes;

    public PreUpdateBadge() {
        super();
    }

    public PreUpdateBadge(Persistable subject) {
        super(subject);
    }

     public PreUpdateBadge(Persistable subject, UIAttributes uiAttributes) {
            super(subject);
            this.uiAttributes = uiAttributes;
            setAdditionnalAtributes(uiAttributes.getAllAttributesFromUI());
        }
}
