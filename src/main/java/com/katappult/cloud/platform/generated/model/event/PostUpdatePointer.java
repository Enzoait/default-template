package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PostUpdatePointer extends KatappultEvent {

   private UIAttributes uiAttributes;

    public PostUpdatePointer() {
        super();
    }

    public PostUpdatePointer(Persistable subject) {
        super(subject);
    }

    public PostUpdatePointer(Persistable subject, UIAttributes uiAttributes) {
        super(subject);
        this.uiAttributes = uiAttributes;
        setAdditionnalAtributes(uiAttributes.getAllAttributesFromUI());
    }
}
