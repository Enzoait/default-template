package com.katappult.cloud.platform.generated.model;

import com.mysema.query.types.Path;
import com.mysema.query.types.PathMetadata;
import com.mysema.query.types.path.EntityPathBase;
import com.mysema.query.types.path.NumberPath;
import com.mysema.query.types.path.PathInits;
import com.mysema.query.types.path.StringPath;

// IMPORT
import javax.annotation.Generated;

import static com.mysema.query.types.PathMetadataFactory.forVariable;


/**
 * QBadge is a Querydsl query type for Badge
 */
@Generated("com.mysema.query.codegen.EntitySerializer")
public class QBadge extends EntityPathBase<Badge> {

    private static final long serialVersionUID = -118259594L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QBadge badge = new QBadge("badge");

    public final com.katappult.core.model.persistable.QBusinessObject _super;

    // inherited
    protected com.katappult.core.model.composite.QContainerInfo containerInfo;

    public final NumberPath<Long> oid = createNumber("oid", Long.class);

    // inherited
    protected com.katappult.core.model.persistable.QPersistenceInfo persistenceInfo;


    //inherited
    public final NumberPath<Long> version;

     public final com.mysema.query.types.path.StringPath identification = createString("identification");
 public final com.mysema.query.types.path.DatePath<java.util.Date> expirationDate = createDate("expirationDate", java.util.Date.class);
 public final com.mysema.query.types.path.BooleanPath isActive = createBoolean("isActive");
// ATTRIBUTES

    public QBadge(String variable) {
        this(Badge.class, forVariable(variable), INITS);

        // CONSTRUCTOR
    }

    public QBadge(Path<? extends Badge> path) {
        this(path.getType(), path.getMetadata(), path.getMetadata().isRoot() ? INITS : PathInits.DEFAULT);
    }

    public QBadge(PathMetadata<?> metadata) {
        this(metadata, metadata.isRoot() ? INITS : PathInits.DEFAULT);
    }

    public QBadge(PathMetadata<?> metadata, PathInits inits) {
        this(Badge.class, metadata, inits);
    }

    public QBadge(Class<? extends Badge> type, PathMetadata<?> metadata, PathInits inits) {
        super(type, metadata, inits);
        this._super = new com.katappult.core.model.persistable.QBusinessObject(type, metadata, inits);
        this.version = _super.version;
    }

    public com.katappult.core.model.composite.QContainerInfo containerInfo() {
        if (containerInfo == null) {
            containerInfo = new com.katappult.core.model.composite.QContainerInfo(forProperty("containerInfo"));
        }
        return containerInfo;
    }

    public com.katappult.core.model.persistable.QPersistenceInfo persistenceInfo() {
        if (persistenceInfo == null) {
            persistenceInfo = new com.katappult.core.model.persistable.QPersistenceInfo(forProperty("persistenceInfo"));
        }
        return persistenceInfo;
    }

    // METHODS
}

