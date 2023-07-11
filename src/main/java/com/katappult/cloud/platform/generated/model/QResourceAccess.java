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
 * QResourceAccess is a Querydsl query type for ResourceAccess
 */
@Generated("com.mysema.query.codegen.EntitySerializer")
public class QResourceAccess extends EntityPathBase<ResourceAccess> {

    private static final long serialVersionUID = -118259594L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QResourceAccess resourceAccess = new QResourceAccess("resourceAccess");

    public final com.katappult.core.model.persistable.QBusinessObject _super;

    // inherited
    protected com.katappult.core.model.composite.QContainerInfo containerInfo;

    public final NumberPath<Long> oid = createNumber("oid", Long.class);

    // inherited
    protected com.katappult.core.model.persistable.QPersistenceInfo persistenceInfo;


    //inherited
    public final NumberPath<Long> version;

     public final com.mysema.query.types.path.StringPath name = createString("name");
 public final com.mysema.query.types.path.StringPath location = createString("location");
 public final com.mysema.query.types.path.StringPath description = createString("description");
// ATTRIBUTES

    public QResourceAccess(String variable) {
        this(ResourceAccess.class, forVariable(variable), INITS);

        // CONSTRUCTOR
    }

    public QResourceAccess(Path<? extends ResourceAccess> path) {
        this(path.getType(), path.getMetadata(), path.getMetadata().isRoot() ? INITS : PathInits.DEFAULT);
    }

    public QResourceAccess(PathMetadata<?> metadata) {
        this(metadata, metadata.isRoot() ? INITS : PathInits.DEFAULT);
    }

    public QResourceAccess(PathMetadata<?> metadata, PathInits inits) {
        this(ResourceAccess.class, metadata, inits);
    }

    public QResourceAccess(Class<? extends ResourceAccess> type, PathMetadata<?> metadata, PathInits inits) {
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

