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

import com.katappult.core.model.Boolean01Converter;
import java.lang.String;
// IMPORT


@javax.persistence.Entity
@Table(name = "gen_badge")
@Access(AccessType.PROPERTY)
// ANNOTATIONS
public class Badge extends BusinessObject implements Serializable {// KNOER

    private static final long serialVersionUID = 1L;

    private String identification;
    private Date expirationDate;
    private Boolean isActive;
    // ATTRIBUTES


    @Override
    public void updateFrom(Persistable entity) {
        super.updateFrom(entity);
        setIdentification(((Badge)entity).getIdentification());
        setExpirationDate(((Badge)entity).getExpirationDate());
        setIsActive(((Badge)entity).getIsActive());
        // UPDATE_ATTRIBUTES
    }

    @Override
    @Transient
    public Class<?> getDomainClass() {
        return Badge.class;
    }


    @Id
    @Override
    @SequenceGenerator(name="gen_badge_oid_seq", sequenceName="gen_badge_oid_seq", allocationSize=1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator="gen_badge_oid_seq")
    @Column(columnDefinition = "serial", updatable = false)
    public Long getOid() {
        return super._getOid();
    }

    // GETTERS AND SETTERS
    @UIAttribute(fieldName = "identification", required = false, blankAllowed = false, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "identification")
    public String getIdentification() {
        return identification;
    }

    public void setIdentification(String identification) {
        this.identification = identification;
    }

    @UIAttribute(fieldName = "expirationDate", required = false, blankAllowed = false, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "expirationdate")
    public Date getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(Date expirationDate) {
        this.expirationDate = expirationDate;
    }

    @Convert(converter = Boolean01Converter.class)
    @UIAttribute(fieldName = "isActive", required = false, blankAllowed = true, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "isactive")
    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }


}

