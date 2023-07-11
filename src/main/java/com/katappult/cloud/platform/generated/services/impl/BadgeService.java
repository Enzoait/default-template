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
import com.katappult.cloud.platform.generated.services.api.IBadgeService;
import com.katappult.cloud.platform.generated.dao.api.IBadgeDao;
import com.katappult.cloud.platform.generated.model.event.PreCreateBadge;
import com.katappult.cloud.platform.generated.model.event.PreDeleteBadge;
import com.katappult.cloud.platform.generated.model.event.PreUpdateBadge;
import com.katappult.cloud.platform.generated.model.event.PostCreateBadge;
import com.katappult.cloud.platform.generated.model.event.PostDeleteBadge;
import com.katappult.cloud.platform.generated.model.event.PostUpdateBadge;
import java.util.List;
// IMPORT

@Component
public class BadgeService implements  IBadgeService {

    @Autowired
    private IBadgeDao dao;

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
    public Badge  create(UIAttributes uiAttributes, Container container) {
        Badge entity = (Badge) uiAttributes.getTarget();
        containedService.setContainer(entity, container);

        String businessType = uiAttributes.getAllAttributesFromUI().optString("businessType");
        if(StringUtils.isNotBlank(businessType) && entity instanceof ITypeManaged){
            typeManagedService.setType((ITypeManaged) entity, businessType);
        }

        applicationContext.publishEvent(new PreCreateBadge(entity, uiAttributes));
        persistableService.saveWithoutEvent(entity);
        applicationContext.publishEvent(new PostCreateBadge(entity, uiAttributes));
        return entity;
    }

    @Override
    @Transactional
    public void batchCreateFromImport(final Badge entity, final Container container) {
        containedService.setContainer(entity, container);

        applicationContext.publishEvent(new PreCreateBadge(entity));
        persistableService.saveWithoutEvent(entity);
        applicationContext.publishEvent(new PostCreateBadge(entity));
    }

    @Override
    @Transactional
    public void batchUpdateFromImport(final Badge transientEntity) {
        Badge persistent = (Badge) persistableService.findById(transientEntity.getOid(), Badge.class);

        applicationContext.publishEvent(new PreUpdateBadge(persistent));
        persistent.updateFrom(transientEntity);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdateBadge(persistent));
    }


    @Override
    @Transactional
    public Badge update(UIAttributes uiAttributes, Container container) {
        Badge transientEntity = (Badge) uiAttributes.getTarget();
        Badge persistent = (Badge) persistableService.findById(transientEntity.getOid(), Badge.class);

        applicationContext.publishEvent(new PreUpdateBadge(persistent));
        persistent.updateFrom(transientEntity);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdateBadge(persistent));

        return persistent;
    }

    @Override
    @Transactional
    public void delete(Badge entity, Container container) {
        Badge persistent  = persistableService.refresh(entity);
        applicationContext.publishEvent(new PreDeleteBadge(persistent));
        persistableService.deleteWithoutEvent(persistent);
        applicationContext.publishEvent(new PostDeleteBadge(persistent));
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
