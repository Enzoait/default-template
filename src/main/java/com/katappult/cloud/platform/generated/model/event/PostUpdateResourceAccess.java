package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PostUpdateResourceAccess extends KatappultEvent {

   private UIAttributes uiAttributes;

    public PostUpdateResourceAccess() {
        super();
    }

    public PostUpdateResourceAccess(Persistable subject) {
        super(subject);
    }

    public PostUpdateResourceAccess(Persistable subject, UIAttributes uiAttributes) {
        super(subject);
        this.uiAttributes = uiAttributes;
        setAdditionnalAtributes(uiAttributes.getAllAttributesFromUI());
    }
}
