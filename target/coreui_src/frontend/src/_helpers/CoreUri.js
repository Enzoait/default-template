import {commons} from "_helpers/commons";

export const coreUri = {
  clientSideRenderedURL,
  backOfficeViewURL,
  backOfficeHomeURL,
  backOfficeRealViewURL
}

function backOfficeHomeURL(){
  return "/backoffice/#/view?tab=platform&name=businessRules";
}

function backOfficeRealViewURL(tabName, viewName, params){
  let targetURL = '/view?tab=' + tabName + '&name=' + viewName;
  if(params){
    params.map(param => {
      targetURL =  targetURL + '&' + param;
    })
  }

  return targetURL;
}

function backOfficeViewURL(tabName, viewName, params){
  let currentTabName = commons.getValueFromUrl('tab');
  let targetURL = '/view?tab=' + currentTabName + '&name=' + viewName;

  if(params){
    params.map(param => {
      targetURL =  targetURL + '&' + param;
    })
  }

  return targetURL;
}

function clientSideRenderedURL(uri){
  return process.env.PUBLIC_URL + '/backOffice/#' + uri;
}

