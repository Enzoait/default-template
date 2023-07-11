package com.katappult.cloud.platform.generated.model;

import com.katappult.core.model.persistable.BusinessObject;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttribute;
import com.katappult.core.utils.UIFieldEditor;
import com.katappult.core.utils.common.TransferIgnore;

import java.util.ArrayList;
import java.util.List;
import java.util.Date;

import javax.persistence.*;
import java.io.Serializable;

import java.lang.String;
import com.katappult.core.model.typed.ITypeManaged;
import com.katappult.core.model.typed.TypeInfo;
import com.katappult.core.model.typed.TypeManaged;

import com.katappult.core.model.lifecyclemanaged.ILifecycleManaged;
import com.katappult.core.model.lifecyclemanaged.LifecycleInfo;
// IMPORT


@javax.persistence.Entity
@Table(name = "gen_cardrequest")
@Access(AccessType.PROPERTY)
@TypeManaged(rootType = "com.katappult.cloud.platform.generated.types.CardRequestType")
// ANNOTATIONS
public class CardRequest extends BusinessObject implements Serializable , ITypeManaged, ILifecycleManaged{// KNOER

    private static final long serialVersionUID = 1L;

    private String description;
    private Date requestExpirationDate;
    	private TypeInfo typeInfo;
private LifecycleInfo lifecycleInfo;
// ATTRIBUTES


    @Override
    public void updateFrom(Persistable entity) {
        super.updateFrom(entity);
        setDescription(((CardRequest)entity).getDescription());
        setRequestExpirationDate(((CardRequest)entity).getRequestExpirationDate());
        // UPDATE_ATTRIBUTES
    }

    @Override
    @Transient
    public Class<?> getDomainClass() {
        return CardRequest.class;
    }


    @Id
    @Override
    @SequenceGenerator(name="gen_cardrequest_oid_seq", sequenceName="gen_cardrequest_oid_seq", allocationSize=1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator="gen_cardrequest_oid_seq")
    @Column(columnDefinition = "serial", updatable = false)
    public Long getOid() {
        return super._getOid();
    }

    
	@Embedded
    @Override
    public TypeInfo getTypeInfo() {
        return typeInfo;
    }

    @Override
    public void setTypeInfo(TypeInfo typeInfo) {
        this.typeInfo = typeInfo;
    }

	@Embedded
    @Override
    public LifecycleInfo getLifecycleInfo() {
        return lifecycleInfo;
    }

    @Override
    public void setLifecycleInfo(LifecycleInfo lifecycleInfo) {
        this.lifecycleInfo = lifecycleInfo;
    }
// GETTERS AND SETTERS
    @UIAttribute(fieldName = "description", required = false, blankAllowed = false, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "description")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @UIAttribute(fieldName = "requestExpirationDate", required = false, blankAllowed = false, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "requestexpirationdate")
    public Date getRequestExpirationDate() {
        return requestExpirationDate;
    }

    public void setRequestExpirationDate(Date requestExpirationDate) {
        this.requestExpirationDate = requestExpirationDate;
    }


}

