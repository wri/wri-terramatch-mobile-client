# WriRestorationMarketplaceApi.OrganisationVersionsApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**organisationVersionsIDApprovePatch**](OrganisationVersionsApi.md#organisationVersionsIDApprovePatch) | **PATCH** /organisation_versions/{ID}/approve | Approve an organisation version
[**organisationVersionsIDDelete**](OrganisationVersionsApi.md#organisationVersionsIDDelete) | **DELETE** /organisation_versions/{ID} | Delete an organisation version
[**organisationVersionsIDGet**](OrganisationVersionsApi.md#organisationVersionsIDGet) | **GET** /organisation_versions/{ID} | Read an organisation version
[**organisationVersionsIDRejectPatch**](OrganisationVersionsApi.md#organisationVersionsIDRejectPatch) | **PATCH** /organisation_versions/{ID}/reject | Reject an organisation version
[**organisationVersionsIDRevivePatch**](OrganisationVersionsApi.md#organisationVersionsIDRevivePatch) | **PATCH** /organisation_versions/{ID}/revive | Revive an organisation version
[**organisationsIDOrganisationVersionsGet**](OrganisationVersionsApi.md#organisationsIDOrganisationVersionsGet) | **GET** /organisations/{ID}/organisation_versions | Read an organisation's organisation versions


<a name="organisationVersionsIDApprovePatch"></a>
# **organisationVersionsIDApprovePatch**
> OrganisationVersionRead organisationVersionsIDApprovePatch(ID)

Approve an organisation version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OrganisationVersionsApi();

let ID = 56; // Number | 

apiInstance.organisationVersionsIDApprovePatch(ID).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**OrganisationVersionRead**](OrganisationVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="organisationVersionsIDDelete"></a>
# **organisationVersionsIDDelete**
> Empty organisationVersionsIDDelete(ID)

Delete an organisation version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OrganisationVersionsApi();

let ID = 56; // Number | 

apiInstance.organisationVersionsIDDelete(ID).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**Empty**](Empty.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="organisationVersionsIDGet"></a>
# **organisationVersionsIDGet**
> OrganisationVersionRead organisationVersionsIDGet(ID)

Read an organisation version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OrganisationVersionsApi();

let ID = 56; // Number | 

apiInstance.organisationVersionsIDGet(ID).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**OrganisationVersionRead**](OrganisationVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="organisationVersionsIDRejectPatch"></a>
# **organisationVersionsIDRejectPatch**
> OrganisationVersionRead organisationVersionsIDRejectPatch(ID, Body)

Reject an organisation version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OrganisationVersionsApi();

let ID = 56; // Number | 

let Body = new WriRestorationMarketplaceApi.OrganisationVersionReject(); // OrganisationVersionReject | 

apiInstance.organisationVersionsIDRejectPatch(ID, Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **Body** | [**OrganisationVersionReject**](OrganisationVersionReject.md)|  | 

### Return type

[**OrganisationVersionRead**](OrganisationVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="organisationVersionsIDRevivePatch"></a>
# **organisationVersionsIDRevivePatch**
> OrganisationVersionRead organisationVersionsIDRevivePatch(ID)

Revive an organisation version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OrganisationVersionsApi();

let ID = 56; // Number | 

apiInstance.organisationVersionsIDRevivePatch(ID).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**OrganisationVersionRead**](OrganisationVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="organisationsIDOrganisationVersionsGet"></a>
# **organisationsIDOrganisationVersionsGet**
> OrganisationVersionReadAll organisationsIDOrganisationVersionsGet(ID)

Read an organisation's organisation versions

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OrganisationVersionsApi();

let ID = 56; // Number | 

apiInstance.organisationsIDOrganisationVersionsGet(ID).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 

### Return type

[**OrganisationVersionReadAll**](OrganisationVersionReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

