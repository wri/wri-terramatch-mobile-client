import firebase from "react-native-firebase";

export function logScheduleDemoEvent(action) {
  logEvent("schedule_demo");
}

export function logSignInEvent(action) {
  logEvent("login");
}

export function logRequestAccountEvent(action) {
  logEvent("user", {
    action: action
  });
}

export function logAddAwardEvent(action) {
  logEvent("organisationCreation", {
    action: action
  });
}

export function logAddProjectEvent(action) {
  logEvent("project", {
    action: action
  });
}

export function logOrganisationCreationEvent(action, params = undefined) {
  logEvent(`organisationCreation_${action}`, params);
}

export function logProjectCreationEvent(action, params = undefined) {
  logEvent(`projectCreation_${action}`, params);
}

export function logFundingOfferCreationEvent(action, params = undefined) {
  logEvent(`fundingOfferCreation_${action}`, params);
}

export function logTeamMemberCreationEvent(action, params = undefined) {
  logEvent(`teamMemberCreation_${action}`, params);
}

export function logRegistrationEvent(action, params = undefined) {
  logEvent(`registration_${action}`, params);
}

export function logUserData(userData) {
  firebase.analytics().setUserProperties(userData);
}

export function logEvent(event, params = undefined) {
  firebase.analytics().logEvent(event, params);
}
