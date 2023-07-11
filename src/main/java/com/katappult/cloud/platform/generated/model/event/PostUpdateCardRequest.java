package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PostUpdateCardRequest extends KatappultEvent {

   private UIAttributes uiAttributes;

    public PostUpdateCardRequest() {
        super();
    }

    public PostUpdateCardRequest(Persistable subject) {
        super(subject);
    }

    public PostUpdateCardRequest(Persistable subject, UIAttributes uiAttributes) {
        super(subject);
        this.uiAttributes = uiAttributes;
        setAdditionnalAtributes(uiAttributes.getAllAttributesFromUI());
    }
}
