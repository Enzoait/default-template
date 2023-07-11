package com.katappult.cloud.platform.generated.batch;

import com.katappult.core.utils.ObjectIdentifierUtils;
import com.katappult.core.helpers.KatappultCoreServicesHelper;
import com.katappult.core.batch.bean.AbstractLineBean;
import com.katappult.core.batch.exception.VLBatchSkippableException;
import com.katappult.core.model.composite.Container;
import com.katappult.core.batch.bean.ImportLineBean;
import com.katappult.core.model.typed.ITypeManaged;
import com.katappult.core.model.typed.TypeManaged;
import com.katappult.core.service.api.typed.ITypeManagedService;

import com.katappult.cloud.platform.generated.model.Pointer;
import com.katappult.cloud.platform.generated.services.api.IPointerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.stereotype.Component;

import java.util.Iterator;
import java.util.List;

@Component("PointerBatchWriter")
@Scope("step")
public class PointerBatchWriter implements ItemWriter<AbstractLineBean> {

    private static final Logger LOGGER = LoggerFactory.getLogger(PointerBatchWriter.class);

    @Autowired
    private KatappultCoreServicesHelper services;

    @Autowired
    private IPointerService service;

    @Autowired
    private ITypeManagedService typeManagedService;

    @Override
    public void write(final List<? extends AbstractLineBean> items) throws Exception {

        Iterator entityIterator = items.iterator();

        while(entityIterator.hasNext()) {
          ImportLineBean line = (ImportLineBean) entityIterator.next();
          String containerPath = line.getString(1);

          String command = line.getCommand();
          if(command.startsWith("ADD_")){
              Container container = services.containerService().getContainerByPath(containerPath);
              if (container == null) {
                  throw new VLBatchSkippableException("Container not found with path: " + containerPath);
              }

              Pointer entity = (Pointer) line.getRootEntity();

              // TODO handle set type from csv file
              if(entity instanceof ITypeManaged){
                    TypeManaged annotation = AnnotationUtils.findAnnotation(entity.getClass(), TypeManaged.class);
                    typeManagedService.setType((ITypeManaged) entity, annotation.rootType());
              }

              service.batchCreateFromImport(entity, container);
          }

          if(command.startsWith("UPDATE_")){
              Pointer transientEntity = (Pointer) line.getRootEntity();
              String fullId  = ObjectIdentifierUtils.decode((String) line.getExternalEntity("fullId"));
              Long id = ObjectIdentifierUtils.getId(fullId);
              transientEntity.setOid(id);

              service.batchUpdateFromImport(transientEntity);
          }
        }
    }
}
