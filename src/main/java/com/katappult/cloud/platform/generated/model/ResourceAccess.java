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
// IMPORT


@javax.persistence.Entity
@Table(name = "gen_resourceaccess")
@Access(AccessType.PROPERTY)
// ANNOTATIONS
public class ResourceAccess extends BusinessObject implements Serializable {// KNOER

    private static final long serialVersionUID = 1L;

    private String name;
    private String location;
    private String description;
    // ATTRIBUTES


    @Override
    public void updateFrom(Persistable entity) {
        super.updateFrom(entity);
        setName(((ResourceAccess)entity).getName());
        setLocation(((ResourceAccess)entity).getLocation());
        setDescription(((ResourceAccess)entity).getDescription());
        // UPDATE_ATTRIBUTES
    }

    @Override
    @Transient
    public Class<?> getDomainClass() {
        return ResourceAccess.class;
    }


    @Id
    @Override
    @SequenceGenerator(name="gen_resourceaccess_oid_seq", sequenceName="gen_resourceaccess_oid_seq", allocationSize=1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator="gen_resourceaccess_oid_seq")
    @Column(columnDefinition = "serial", updatable = false)
    public Long getOid() {
        return super._getOid();
    }

    // GETTERS AND SETTERS
    @UIAttribute(fieldName = "name", required = false, blankAllowed = false, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @UIAttribute(fieldName = "location", required = false, blankAllowed = false, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "location")
    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    @UIAttribute(fieldName = "description", required = false, blankAllowed = false, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "description")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


}

