package com.katappult.cloud.platform.generated.services.impl;

import com.mysema.query.jpa.JPQLQuery;
import com.mysema.query.types.expr.BooleanExpression;
import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import com.katappult.core.exceptions.BusinessRuleException;
import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import com.katappult.core.model.composite.Container;
import com.katappult.core.service.api.IPersistableService;
import com.katappult.core.service.api.foldered.IContainedService;
import com.katappult.core.utils.UIAttributes;
import org.apache.commons.lang.StringUtils;
import com.katappult.core.dao.api.IPersistableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.katappult.core.model.typed.ITypeManaged;
import com.katappult.core.service.api.typed.ITypeManagedService;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;
import java.util.Map;
import com.katappult.core.model.account.*;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.cloud.platform.generated.services.api.IPointerService;
import com.katappult.cloud.platform.generated.dao.api.IPointerDao;
import com.katappult.cloud.platform.generated.model.event.PreCreatePointer;
import com.katappult.cloud.platform.generated.model.event.PreDeletePointer;
import com.katappult.cloud.platform.generated.model.event.PreUpdatePointer;
import com.katappult.cloud.platform.generated.model.event.PostCreatePointer;
import com.katappult.cloud.platform.generated.model.event.PostDeletePointer;
import com.katappult.cloud.platform.generated.model.event.PostUpdatePointer;
import java.util.List;
// IMPORT

@Component
public class PointerService implements  IPointerService {

    @Autowired
    private IPointerDao dao;

    @Autowired
    private IPersistableService persistableService;

    @Autowired
    private IContainedService containedService;

    @Autowired
    private ApplicationContext applicationContext;

    @Autowired
    private ITypeManagedService typeManagedService;

    @Autowired
    private IPersistableRepository persistableDao;

    @Override
    @Transactional
    public Pointer  create(UIAttributes uiAttributes, Container container) {
        Pointer entity = (Pointer) uiAttributes.getTarget();
        containedService.setContainer(entity, container);

        String businessType = uiAttributes.getAllAttributesFromUI().optString("businessType");
        if(StringUtils.isNotBlank(businessType) && entity instanceof ITypeManaged){
            typeManagedService.setType((ITypeManaged) entity, businessType);
        }

        applicationContext.publishEvent(new PreCreatePointer(entity, uiAttributes));
        persistableService.saveWithoutEvent(entity);
        applicationContext.publishEvent(new PostCreatePointer(entity, uiAttributes));
        return entity;
    }

    @Override
    @Transactional
    public void batchCreateFromImport(final Pointer entity, final Container container) {
        containedService.setContainer(entity, container);

        applicationContext.publishEvent(new PreCreatePointer(entity));
        persistableService.saveWithoutEvent(entity);
        applicationContext.publishEvent(new PostCreatePointer(entity));
    }

    @Override
    @Transactional
    public void batchUpdateFromImport(final Pointer transientEntity) {
        Pointer persistent = (Pointer) persistableService.findById(transientEntity.getOid(), Pointer.class);

        applicationContext.publishEvent(new PreUpdatePointer(persistent));
        persistent.updateFrom(transientEntity);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdatePointer(persistent));
    }


    @Override
    @Transactional
    public Pointer update(UIAttributes uiAttributes, Container container) {
        Pointer transientEntity = (Pointer) uiAttributes.getTarget();
        Pointer persistent = (Pointer) persistableService.findById(transientEntity.getOid(), Pointer.class);

        applicationContext.publishEvent(new PreUpdatePointer(persistent));
        persistent.updateFrom(transientEntity);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdatePointer(persistent));

        return persistent;
    }

    @Override
    @Transactional
    public void delete(Pointer entity, Container container) {
        Pointer persistent  = persistableService.refresh(entity);
        applicationContext.publishEvent(new PreDeletePointer(persistent));
        persistableService.deleteWithoutEvent(persistent);
        applicationContext.publishEvent(new PostDeletePointer(persistent));
    }

    @Override
    public PageResult list(PageRequest pageRequest, Container container, Map<String, String> params) {
        return dao.list(pageRequest, container, params);
    }

    @Override
    public PageResult searchByNameLike(String searchTerm, PageRequest pageRequest, Container container) {
        return dao.searchByNamelike(searchTerm, pageRequest, container);
    }

    // SERVICES
}
