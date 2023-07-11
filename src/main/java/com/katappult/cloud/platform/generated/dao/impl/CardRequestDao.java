package com.katappult.cloud.platform.generated.dao.impl;

import com.mysema.query.jpa.JPQLQuery;
import com.mysema.query.types.expr.BooleanExpression;
import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import com.katappult.core.dao.api.IPersistableRepository;
import com.katappult.core.model.composite.Container;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.katappult.cloud.platform.generated.dao.api.ICardRequestDao;
import com.katappult.cloud.platform.generated.model.QCardRequest;
import java.util.Map;
import com.katappult.core.utils.StringUtils;
import java.util.Objects;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.core.model.account.*;
// IMPORT

@Component
public class CardRequestDao implements  ICardRequestDao{

    @Autowired
    private IPersistableRepository dao;

    @Override
    public PageResult list(PageRequest pageRequest, Container container, Map<String, String> params) {
        QCardRequest qCardRequest = new QCardRequest("entity");
        BooleanExpression whereClause =  qCardRequest.containerInfo().container().eq(container);

        if(Objects.nonNull(params) && params.size() > 0){
            String status = params.get("status");
            if(StringUtils.isNotBlank(status)){
                whereClause = whereClause.and(
                        qCardRequest.lifecycleInfo().currentState.eq(status)
                );
            }
        }
// WHERE CLAUSE

        JPQLQuery jpqlQuery = dao.from(qCardRequest).where(whereClause);
        return dao.readPage(jpqlQuery, qCardRequest, pageRequest);
    }

    @Override
    public boolean existWithName(String name, Container container) {
        QCardRequest qCardRequest = new QCardRequest("entity");
        return false;
    }

    @Override
    public PageResult searchByNamelike(String searchTerm, PageRequest pageRequest, Container container) {
        QCardRequest qCardRequest = new QCardRequest("entity");

        BooleanExpression whereClause = qCardRequest.description.likeIgnoreCase("%" + searchTerm + "%");
// SEARCH ENTITY WHERE CLAUSE

        JPQLQuery jpqlQuery = dao.from(qCardRequest)
                .where(whereClause);

        return dao.readPage(jpqlQuery, qCardRequest, pageRequest);
    }

    // DAO
}
