package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PostUpdateBadge extends KatappultEvent {

   private UIAttributes uiAttributes;

    public PostUpdateBadge() {
        super();
    }

    public PostUpdateBadge(Persistable subject) {
        super(subject);
    }

    public PostUpdateBadge(Persistable subject, UIAttributes uiAttributes) {
        super(subject);
        this.uiAttributes = uiAttributes;
        setAdditionnalAtributes(uiAttributes.getAllAttributesFromUI());
    }
}
