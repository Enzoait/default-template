package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;

public class PostDeletePointer extends KatappultEvent {

    public PostDeletePointer() {
        super();
    }

    public PostDeletePointer(Persistable subject) {
        super(subject);
    }
}
