package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;

public class PreDeleteBadge extends KatappultEvent {

    public PreDeleteBadge() {
            super();
    }

    public PreDeleteBadge(Persistable subject) {
        super(subject);
    }
}
