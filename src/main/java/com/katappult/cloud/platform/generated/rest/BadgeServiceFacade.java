package com.katappult.cloud.platform.generated.rest;

import com.katappult.core.bridge.operation.IOperationResult;
import com.katappult.core.bridge.result.MultipleResult;
import com.katappult.core.bridge.result.OperationData;
import com.katappult.core.bridge.result.SingleResult;
import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import com.katappult.core.model.composite.Container;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.service.api.IPersistableService;
import org.hibernate.Hibernate;
import com.katappult.core.utils.RestObjectFullId;
import com.katappult.core.utils.common.TransferUtils;
import com.katappult.core.utils.common.ValidationErrorTranslator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.hibernate.Hibernate;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import com.katappult.core.utils.UIAttributes;
import javax.inject.Provider;
import com.katappult.core.dao.api.IPersistableRepository;

import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import com.katappult.cloud.platform.generated.services.api.IBadgeService;
import com.katappult.cloud.platform.generated.model.*;
// IMPORT

@RestController
@RequestMapping("/katappult/cloud/platform/v1/secured/api/badge")
public class BadgeServiceFacade {

  @Autowired
  @Qualifier("ValidationErrorTranslator")
  private ValidationErrorTranslator et;

  @Autowired
  private IBadgeService service;

  @Autowired
  private IPersistableService persistableService;

  @Autowired
  private IPersistableRepository persistableRepository;

  @Autowired
  private Provider<UIAttributes> uiAttributesProvider;


  @PostMapping(path = "/create", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  @ResponseBody
  public Serializable create(@RequestBody String request) {
    IOperationResult result = new SingleResult();

    UIAttributes uiAttributes = uiAttributesProvider.get();
    uiAttributes.from(request, Badge.class);
    uiAttributes.validateAttributes(result);

    Container container = uiAttributes.validateContainer(result);
    service.create(uiAttributes, container);

    OperationData operationData = TransferUtils.toOperationData(uiAttributes.getTarget());
    result.setData(operationData);
    return result;
  }

  @GetMapping(value = "/details", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
  @Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
  @ResponseBody
  public Serializable details(@RequestParam(name = "entityId") final RestObjectFullId entityId,
                            @RequestParam("containerId") Container container)  {

    IOperationResult result = new SingleResult();
    Badge entity = (Badge) entityId.getPersistable();

    OperationData operationData = TransferUtils.toOperationData(entity);
    result.setData(operationData);
    return result;
  }

  @DeleteMapping(value = "/delete", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  @ResponseBody
  public Serializable delete(@RequestParam(name = "entityId") final RestObjectFullId entityId,
                           @RequestParam("containerId") Container container)  {

    IOperationResult result = new SingleResult();
    Badge entity = (Badge) entityId.getPersistable();
    service.delete(entity, container);
    return result;
  }

  @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  @ResponseBody
  public Serializable update(@RequestParam(name = "entityId") final RestObjectFullId entityId,
                           @RequestBody String request,
                           @RequestParam("containerId") Container container) {

    IOperationResult result = new SingleResult();

    UIAttributes uiAttributes = uiAttributesProvider.get();
    uiAttributes.from(request, Badge.class);
    uiAttributes.validateAttributes(result);

    Badge entity = (Badge) entityId.getPersistable();
    uiAttributes.getTarget().setOid(entity.getOid());

    service.update(uiAttributes, container);
    return result;
  }

  @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
  @Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
  @ResponseBody
  public Serializable list(@RequestParam("containerId") Container container,
                         @RequestParam(name = "page", defaultValue = "0") int page,
                         @RequestParam(name = "status", defaultValue = "") String status,
                         @RequestParam(name = "pageSize", defaultValue = "10") int pagesize,
                         @RequestParam(name = "sort", required = false) String sort){

    IOperationResult result = new MultipleResult();
    PageRequest pageRequest = new PageRequest.Builder().page(page).size(pagesize).build();

    Map params = new HashMap();
    params.put("status", status);

    PageResult pageResult = service.list(pageRequest, container, params);
    TransferUtils.toOperationData(pageResult, (MultipleResult)result);

    return result;
  }

  @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
  @Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
  @ResponseBody
  public Serializable search(@RequestParam("containerId") Container container,
                           @RequestParam(name = "searchTerm") String searchTerm,
                           @RequestParam(name = "page", defaultValue = "0") int page,
                           @RequestParam(name = "pageSize", defaultValue = "10") int pagesize,
                           @RequestParam(name = "sort", required = false) String sort){

    IOperationResult result = new MultipleResult();
    PageRequest pageRequest = new PageRequest.Builder().page(page).size(pagesize).build();

    PageResult pageResult = service.searchByNameLike(searchTerm, pageRequest, container);
    TransferUtils.toOperationData(pageResult, (MultipleResult)result);

    return result;
  }

  // SERVICES
}
