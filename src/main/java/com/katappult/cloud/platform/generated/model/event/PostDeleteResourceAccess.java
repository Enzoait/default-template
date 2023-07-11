package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;

public class PostDeleteResourceAccess extends KatappultEvent {

    public PostDeleteResourceAccess() {
        super();
    }

    public PostDeleteResourceAccess(Persistable subject) {
        super(subject);
    }
}
