package com.katappult.demoapp.controller;

import com.katappult.cloud.platform.generated.model.ResourceAccess;
import org.primefaces.model.charts.axes.cartesian.CartesianScales;
import org.primefaces.model.charts.axes.cartesian.linear.CartesianLinearTicks;
import org.primefaces.model.charts.axes.cartesian.linear.CartesianLinearAxes;
import com.katappult.cloud.platform.generated.services.api.IResourceAccessService;
import org.primefaces.model.charts.ChartData;
import org.primefaces.model.charts.bar.BarChartDataSet;
import org.primefaces.model.charts.bar.BarChartModel;
import org.primefaces.model.charts.bar.BarChartOptions;
import org.primefaces.model.charts.line.LineChartDataSet;
import org.primefaces.model.charts.line.LineChartModel;
import org.primefaces.model.charts.line.LineChartOptions;
import org.primefaces.model.charts.pie.PieChartDataSet;
import org.primefaces.model.charts.pie.PieChartModel;
import com.katappult.core.bridge.operation.IOperationResult;
import com.katappult.core.jsf.controller.BaseCRUDController;
import com.katappult.core.jsf.dto.ElementMetadataDTO;
import com.katappult.core.jsf.utils.CRUDMessageType;
import org.primefaces.model.charts.optionconfig.title.Title;
import com.katappult.core.jsf.utils.JSFUtils;
import com.katappult.core.model.composite.Container;
import com.katappult.core.model.lifecyclemanaged.ILifecycleManaged;
import com.katappult.core.model.lifecyclemanaged.LifecycleHistory;
import org.primefaces.model.charts.optionconfig.legend.Legend;
import org.primefaces.model.charts.optionconfig.legend.LegendLabel;
import com.katappult.core.model.persistable.IPersistable;
import com.katappult.core.utils.UIAttributes;
import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import javax.servlet.http.HttpServletRequest;

import javax.annotation.ManagedBean;
import javax.annotation.PostConstruct;
import javax.faces.context.FacesContext;
import javax.faces.view.ViewScoped;
import javax.faces.bean.RequestScoped;
import javax.inject.Inject;
import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.ArrayList;
import java.util.Arrays;
import org.primefaces.model.charts.optionconfig.animation.Animation;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.cloud.platform.generated.services.api.*;


@Lazy
@ManagedBean
@ViewScoped
public class ResourceAccessController extends BaseCRUDController<ResourceAccess> implements Serializable {

  private static final Logger LOGGER = LoggerFactory.getLogger(ResourceAccessController.class);

  private String entityName = "ResourceAccess";
  private String entityNameLower = "resourceAccess";
  protected String entityDetailsView = String.format("/secured/client/%s/%sDetails.xhtml", entityName, entityNameLower);
  protected String entityAdminDetailsView = String.format("/secured/admin/%s/%sDetails.xhtml", entityName, entityNameLower);

  private ElementMetadataDTO elementMetadata;
  private ResourceAccess newElement = new ResourceAccess();
  private ResourceAccess detailsElement = null;

  private LineChartModel lineModel;
  private PieChartModel pieModel;
  private BarChartModel barModel;
  private int dashboardModel = 0;

  @Inject
  private IResourceAccessService entityService;

  //ATTRIBUTES

  @PostConstruct
  public void initController(){
    super.initialiseBean();
    reloadChartDatas();

    //CONSTRUCTOR
  }

  public void reloadChartDatas(){
    createPieModel();
    createLineModel();
    createBarModel();
    loadDashboardModel();
  }

  public void loadDashboardModel(){
    long value = entityService.list(
            new PageRequest(0, 1), services.containerService().getApplicationContainer(),
            new HashMap<>()).getTotalElements();
    this.dashboardModel = Long.valueOf(value).intValue();
  }

  protected void loadReachableStates() {
    if (getIsTypeOrLifecycleManaged() && elementMetadata != null) {

      Container container = services.containerService().getApplicationContainer();

      List<String> reachableStates = services.lifecycleManagedService()
              .getStatesBySetState((ILifecycleManaged) elementMetadata.getElement(), container);

      elementMetadata.setReachableStates(reachableStates);

      List<LifecycleHistory> lifecycleHistories = services.lifecycleManagedService()
              .lifecycleHistory((ILifecycleManaged) elementMetadata.getElement(), container);

      elementMetadata.setLifecycleHistories(lifecycleHistories);
    }
  }

  public PageResult loadDataModelPaginatedList(PageRequest pageRequest) {
    PageResult datas;
    if (StringUtils.isEmpty(searchTerm)) {
      datas =
          entityService.list(
              pageRequest, services.containerService().getApplicationContainer(), new HashMap<>());
    } else {
      datas =
          entityService.searchByNameLike(
              searchTerm, pageRequest, services.containerService().getApplicationContainer());
    }

    this.dashboardModel = Long.valueOf(datas.getTotalElements()).intValue();
    return datas;
  }

  public void _doDeleteElement(Long oid) {
    if (Objects.isNull(oid)) {
      addDefaultErrorMessage(CRUDMessageType.PLEASE_SELECT_ELEMENT);
      return;
    }

    IPersistable elementToDelete = services.persistableService().findById(oid, ResourceAccess.class);
    if (Objects.isNull(elementToDelete)) {
      addDefaultErrorMessage(CRUDMessageType.ELEMENT_TO_DELETE_NOT_FOUND);
      return;
    }

    try {
      entityService.delete((ResourceAccess) elementToDelete, getWorkingContainer());
    } catch (Exception ex) {
      LOGGER.error(ex.getMessage(), ex);
      JSFUtils.addErrorMessage(ex.getMessage());
      return;
    }

    reloadChartDatas();
    addDefaultSuccessMessage(CRUDMessageType.ELEMENT_HAVE_BEEN_DELETED);
  }

  public String _doCreateNewElementAction() {

    try {
      UIAttributes uiAttributes = new UIAttributes();
      uiAttributes.setTarget(newElement);

      uiAttributes.validateAttributes(IOperationResult.basicSuccess());
      addLegacyType(uiAttributes);
      ResourceAccess createdElement = entityService.create(uiAttributes, getWorkingContainer());

      reloadChartDatas();

      newElement = new ResourceAccess();
      if(!isAdminRequest()) {
        return entityDetailsView + "?faces-redirect=true&msg=new&id=" + createdElement.getOid();
      }

      return entityAdminDetailsView + "?faces-redirect=true&msg=new&id=" + createdElement.getOid();

    } catch (Exception ex) {
      LOGGER.error(ex.getMessage(), ex);
      JSFUtils.addErrorMessage(ex.getMessage());
    }

    return null;
  }

  public void _doUpdateElement() {

    try {

      UIAttributes uiAttributes = new UIAttributes();
      uiAttributes.setTarget(detailsElement);

      uiAttributes.validateAttributes(IOperationResult.basicSuccess());

      ResourceAccess element = entityService.update(uiAttributes, getWorkingContainer());
      elementMetadata.setElement(element);
      detailsElement = element;

      addDefaultSuccessMessage(CRUDMessageType.ELEMENT_HAVE_BEEN_UPDATED);
    } catch (Exception e) {
      JSFUtils.addErrorMessage(e.getMessage());
    }
  }

  public void _doUpdateElementBySetState(String state) {
    Container container = services.containerService().getApplicationContainer();
    services.lifecycleManagedService()
            .updateStatusBySetState((ILifecycleManaged) elementMetadata.getElement(), state, container);

    loadDetails(true);
  }

  private void loadDetails(boolean refresh) {
    String id =
            FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap().get("id");
    Long previousId = Optional.ofNullable(elementMetadata)
            .map(element -> element.getElement())
            .map(element -> element.getOid())
            .orElse(null);

    if(Objects.isNull(previousId) && StringUtils.isEmpty(id)) {
      return;
    }

    boolean shouldReLoadDatas = !refresh;
    Long targetId = Optional.ofNullable(id).map(Long::valueOf).orElse(previousId);
    if (shouldReLoadDatas || refresh) {

      elementMetadata = new ElementMetadataDTO();
      if (shouldReLoadDatas) {
        ResourceAccess element =
            (ResourceAccess) services.persistableService().findById(targetId, ResourceAccess.class);
        elementMetadata.setElement(element);
        detailsElement = element;
      }

      if (refresh && previousId != null) {
        ResourceAccess element =
            (ResourceAccess)
                services
                    .persistableService()
                    .findByIdFetchType(previousId, ResourceAccess.class);
        elementMetadata.setElement(element);
        detailsElement = element;
      }

      //LOADDETAILS
      loadReachableStates();
    }
  }

  protected boolean isAdminRequest(){
    HttpServletRequest request = (HttpServletRequest) FacesContext.getCurrentInstance().getExternalContext().getRequest();
    String path = request.getRequestURI();
    return path.contains("/admin/");
  }

  public void _doRefreshListAction() {
    loadDataModelPaginatedList(new PageRequest(0, 10));
  }

  @Override
  public Class<ResourceAccess> getTargetEntityClass() {
    return ResourceAccess.class;
  }

  @Override
  protected String getJobType() {
    return "manage" + getEntityName();
  }

  public ElementMetadataDTO getElementMetadata() {
    loadDetails(false);
    return elementMetadata;
  }

  public ResourceAccess getNewElement() {
    return newElement;
  }

  public void setNewElement(ResourceAccess newElement) {
    this.newElement = newElement;
  }

  public String getEntityName() {
    return entityName;
  }

  public void setEntityName(String entityName) {
    this.entityName = entityName;
  }

  public String getEntityNameLower() {
    return entityNameLower;
  }

  public void setEntityNameLower(String entityNameLower) {
    this.entityNameLower = entityNameLower;
  }

  public List<String> getReachableStates() {
    return elementMetadata.getReachableStates();
  }

  public ResourceAccess getDetailsElement() {
    return detailsElement;
  }

  public void setDetailsElement(ResourceAccess detailsElement) {
    this.detailsElement = detailsElement;
  }

  public LineChartModel getLineModel() {
    return lineModel;
  }

  public void setLineModel(LineChartModel lineModel) {
    this.lineModel = lineModel;
  }

  public PieChartModel getPieModel() {
    return pieModel;
  }

  public void setPieModel(PieChartModel pieModel) {
    this.pieModel = pieModel;
  }

  public BarChartModel getBarModel() {
    return barModel;
  }

  public void setBarModel(BarChartModel barModel) {
    this.barModel = barModel;
  }

  //GETTERS


  private void createPieModel() {
    pieModel = new PieChartModel();
    ChartData data = new ChartData();

    PieChartDataSet dataSet = new PieChartDataSet();
    List<Number> values = new ArrayList<>();
    values.add(dashboardModel);
    values.add(dashboardModel);
    values.add(dashboardModel);
    dataSet.setData(values);

    List<String> bgColors = new ArrayList<>();
    bgColors.add("rgb(255, 99, 132)");
    bgColors.add("rgb(54, 162, 235)");
    bgColors.add("rgb(255, 205, 86)");
    dataSet.setBackgroundColor(bgColors);

    data.addChartDataSet(dataSet);
    List<String> labels = new ArrayList<>();
    labels.add("Red");
    labels.add("Blue");
    labels.add("Yellow");
    data.setLabels(labels);

    pieModel.setData(data);
  }


  public void createLineModel() {
    lineModel = new LineChartModel();
    ChartData data = new ChartData();

    LineChartDataSet dataSet = new LineChartDataSet();
    List<Object> values = new ArrayList<>();
    values.add(dashboardModel);
    dataSet.setData(values);
    dataSet.setFill(false);
    dataSet.setLabel("Model");
    dataSet.setBorderColor("rgb(75, 192, 192)");
    dataSet.setTension(0.1);
    data.addChartDataSet(dataSet);

    List<String> labels = new ArrayList<>();
    labels.add("January");
    labels.add("February");
    labels.add("March");
    labels.add("April");
    labels.add("May");
    labels.add("June");
    labels.add("July");
    data.setLabels(labels);

    //Options
    LineChartOptions options = new LineChartOptions();
    Title title = new Title();
    title.setDisplay(true);
    options.setTitle(title);

    lineModel.setOptions(options);
    lineModel.setData(data);
  }

  public void createBarModel() {
    barModel = new BarChartModel();
    ChartData data = new ChartData();

    BarChartDataSet barDataSet = new BarChartDataSet();
    barDataSet.setLabel("Model");

    List<Number> values = new ArrayList<>();
    values.add(dashboardModel);
    barDataSet.setData(values);

    List<String> bgColor = new ArrayList<>();
    bgColor.add("rgba(255, 99, 132, 0.2)");
    bgColor.add("rgba(255, 159, 64, 0.2)");
    bgColor.add("rgba(255, 205, 86, 0.2)");
    bgColor.add("rgba(75, 192, 192, 0.2)");
    bgColor.add("rgba(54, 162, 235, 0.2)");
    bgColor.add("rgba(153, 102, 255, 0.2)");
    bgColor.add("rgba(201, 203, 207, 0.2)");
    barDataSet.setBackgroundColor(bgColor);

    List<String> borderColor = new ArrayList<>();
    borderColor.add("rgb(255, 99, 132)");
    borderColor.add("rgb(255, 159, 64)");
    borderColor.add("rgb(255, 205, 86)");
    borderColor.add("rgb(75, 192, 192)");
    borderColor.add("rgb(54, 162, 235)");
    borderColor.add("rgb(153, 102, 255)");
    borderColor.add("rgb(201, 203, 207)");
    barDataSet.setBorderColor(borderColor);
    barDataSet.setBorderWidth(1);

    data.addChartDataSet(barDataSet);

    List<String> labels = new ArrayList<>();
    labels.add("January");
    labels.add("February");
    labels.add("March");
    labels.add("April");
    labels.add("May");
    labels.add("June");
    labels.add("July");
    data.setLabels(labels);
    barModel.setData(data);

    //Options
    BarChartOptions options = new BarChartOptions();
    CartesianScales cScales = new CartesianScales();
    CartesianLinearAxes linearAxes = new CartesianLinearAxes();
    linearAxes.setOffset(true);
    CartesianLinearTicks ticks = new CartesianLinearTicks();
    ticks.setBeginAtZero(true);
    linearAxes.setTicks(ticks);
    cScales.addYAxesData(linearAxes);
    options.setScales(cScales);

    Title title = new Title();
    title.setDisplay(true);
    options.setTitle(title);

    Legend legend = new Legend();
    legend.setDisplay(true);
    legend.setPosition("top");
    LegendLabel legendLabels = new LegendLabel();
    legendLabels.setFontStyle("bold");
    legendLabels.setFontColor("#2980B9");
    legendLabels.setFontSize(24);
    legend.setLabels(legendLabels);
    options.setLegend(legend);

    // disable animation
    Animation animation = new Animation();
    animation.setDuration(0);
    options.setAnimation(animation);

    barModel.setOptions(options);
  }

  public int getDashboardModel() {
    return dashboardModel;
  }
}
