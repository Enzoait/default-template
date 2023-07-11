package com.katappult.cloud.platform.generated.dao.impl;

import com.mysema.query.jpa.JPQLQuery;
import com.mysema.query.types.expr.BooleanExpression;
import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import com.katappult.core.dao.api.IPersistableRepository;
import com.katappult.core.model.composite.Container;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.katappult.cloud.platform.generated.dao.api.IBadgeDao;
import com.katappult.cloud.platform.generated.model.QBadge;
import java.util.Map;
import com.katappult.core.utils.StringUtils;
import java.util.Objects;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.core.model.account.*;
// IMPORT

@Component
public class BadgeDao implements  IBadgeDao{

    @Autowired
    private IPersistableRepository dao;

    @Override
    public PageResult list(PageRequest pageRequest, Container container, Map<String, String> params) {
        QBadge qBadge = new QBadge("entity");
        BooleanExpression whereClause =  qBadge.containerInfo().container().eq(container);

        // WHERE CLAUSE

        JPQLQuery jpqlQuery = dao.from(qBadge).where(whereClause);
        return dao.readPage(jpqlQuery, qBadge, pageRequest);
    }

    @Override
    public boolean existWithName(String name, Container container) {
        QBadge qBadge = new QBadge("entity");
        return false;
    }

    @Override
    public PageResult searchByNamelike(String searchTerm, PageRequest pageRequest, Container container) {
        QBadge qBadge = new QBadge("entity");

        BooleanExpression whereClause = qBadge.identification.likeIgnoreCase("%" + searchTerm + "%");
// SEARCH ENTITY WHERE CLAUSE

        JPQLQuery jpqlQuery = dao.from(qBadge)
                .where(whereClause);

        return dao.readPage(jpqlQuery, qBadge, pageRequest);
    }

    // DAO
}
