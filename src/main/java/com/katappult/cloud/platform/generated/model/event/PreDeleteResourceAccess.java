package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;

public class PreDeleteResourceAccess extends KatappultEvent {

    public PreDeleteResourceAccess() {
            super();
    }

    public PreDeleteResourceAccess(Persistable subject) {
        super(subject);
    }
}
