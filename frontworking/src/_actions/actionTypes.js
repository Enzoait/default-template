/**
 * This file contains all action type constants.
 * Can be used to dispatch action with redux.
 * 
 * It is a common usage to have all actions types constants in one file,
 * easing maintenance and merge.
 */

/**
 * Container and session id
 */
export const SET_USER_WORKING_CONTAINER = 'SET_USER_WORKING_CONTAINER'; 
export const SET_APPLICATION_CONTAINER = 'SET_APPLICATION_CONTAINER';

/**
 * Login and logout
 */
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const DOLOGIN_USER = 'DOLOGIN_USER';

/**
 * GENERIC ACTIONS
 */
export const EDIT_FORM = 'EDIT_FORM';
export const CANCEL_EDIT_FORM = 'CANCEL_EDIT_FORM';
export const SAVE_FORM = 'SAVE_FORM';
/**
 * PROFILE MANAGEMENT
 */
export const EDIT_PROFILE_SUMMARY='EDIT_PROFILE_SUMMARY'
export const UPDATE_PROFILE_SUMMARY='UPDATE_PROFILE_SUMMARY'
/**
 * Account management
 */
export const USER_ACCOUNT_LOCKED='USER_ACCOUNT_LOCKED'
export const USER_ACCOUNT_UNLOCKED='USER_ACCOUNT_UNLOCKED'
export const USER_ACCOUNT_UPDATE_PASS='USER_ACCOUNT_UPDATE_PASS'
/**
 * Search members
 */
export const SEARCHTERM_UPDATE='SEARCHTERM_UPDATE'
export const SEARCH_RESULTS='SEARCH_RESULTS'
/**
 * Search header components
 */
export const SEARCH_HEADER_COMP_SEARCHTERM_UPDATE='SEARCH_HEADER_COMP_SEARCHTERM_UPDATE'
export const SEARCH_HEADER_COMP_SEARCH_RESULTS='SEARCH_HEADER_COMP_SEARCH_RESULTS'
/**
 * Business rules
 */
export const BUSINESS_RULES_SEARCHCRITERIAS_UPDATE = 'BUSINESS_RULES_SEARCHCRITERIAS_UPDATE'
/**
 * Enumerations
 */
export const ENUMERATIONS_LIST_UPDATE = 'ENUMERATIONS_LIST_UPDATE'
export const ENUMERATIONS_SELECTION_UPDATE = 'ENUMERATIONS_SELECTION_UPDATE'
		

export const SWITCH_TO_CONTAINER = 'SWITCH_TO_CONTAINER'
	
	
	

