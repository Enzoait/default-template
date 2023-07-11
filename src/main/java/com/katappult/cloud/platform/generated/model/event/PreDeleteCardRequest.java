package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;

public class PreDeleteCardRequest extends KatappultEvent {

    public PreDeleteCardRequest() {
            super();
    }

    public PreDeleteCardRequest(Persistable subject) {
        super(subject);
    }
}
