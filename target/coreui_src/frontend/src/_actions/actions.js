/**
 * This file is all actions creators. An action creator takes a single argument in,
 * and returns an object which we refer to as an 'action'
 * 
 * An action is an object that has two properties on it: 'type' and 'payload'
 * 
 * -> payload: is the data we want to send to our reducer (is optional)
 * -> type: is a string for filtering actions
 */

import * as types from './actionTypes.js';

/**
 * Login action, payload should be the user details and 
 * account informations and session_id.
 */
export const loginUser = (userDetails) => ({
    type: types.LOGIN_USER,
    payload: userDetails
});
export const logoutUser = (payload) => ({
    type: types.LOGOUT_USER,
    payload: payload
});
export const doLoginUser = (payload)=> ({
    type: types.DOLOGIN_USER,
    payload: payload
});

/**
 * Set current connected user working container.
 * Some user can switch container, according to business rules.
 */
export const setUserWorkingContainer = (container) => ({
    type: types.SET_USER_WORKING_CONTAINER,
    payload: container
});
export const setApplicationContainer = (container) => ({
    type: types.SET_APPLICATION_CONTAINER,
    payload: container
});
/**
 * Edit attributes group reducers
 */
export const updateAttributesGroup = (payload, filter) => ({
    type: types.SET_APPLICATION_CONTAINER,
    payload: payload,
    filter: filter
});
/**
 * Account management
 */
export const userAccountLocked = (payload) => ({
    type: types.USER_ACCOUNT_LOCKED,
    payload: payload,
});
export const userAccountUnLocked = (payload) => ({
    type: types.USER_ACCOUNT_UNLOCKED,
    payload: payload,
});
export const userAccountUpdatePass = (payload) => ({
    type: types.USER_ACCOUNT_UPDATE_PASS,
    payload: payload,
});
/**
 * Search members components
 */
export const updateSearchMembersTerm = (payload) => ({
    type: types.SEARCHTERM_UPDATE,
    payload: payload,
});
export const updateSearchResults = (payload) => ({
    type: types.SEARCH_RESULTS,
    payload: payload,
});
/**
 * Search all types from client header
 */
export const updateHeaderSearchCompSearchTerm = (payload) => ({
    type: types.SEARCH_HEADER_COMP_SEARCHTERM_UPDATE,
    payload: payload,
});
export const updateHeaderSearchCompSearchResults = (payload) => ({
    type: types.SEARCH_HEADER_COMP_SEARCH_RESULTS,
    payload: payload,
});
/**
 * Business rules management
 */
export const updateBusinessRulesSearchCriterias = (payload) => ({
    type: types.BUSINESS_RULES_SEARCHCRITERIAS_UPDATE,
    payload: payload,
});
/**
 * enumerations
 */
export const updateEnumerationsSelection = (payload) => ({
    type: types.ENUMERATIONS_SELECTION_UPDATE,
    payload: payload,
});

