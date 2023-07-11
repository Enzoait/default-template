package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;

public class PreDeletePointer extends KatappultEvent {

    public PreDeletePointer() {
            super();
    }

    public PreDeletePointer(Persistable subject) {
        super(subject);
    }
}
