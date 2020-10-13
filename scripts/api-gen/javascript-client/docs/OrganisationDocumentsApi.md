# WriRestorationMarketplaceApi.OrganisationDocumentsApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**organisationDocumentsIDDelete**](OrganisationDocumentsApi.md#organisationDocumentsIDDelete) | **DELETE** /organisation_documents/{ID} | Delete an organisation document
[**organisationDocumentsIDGet**](OrganisationDocumentsApi.md#organisationDocumentsIDGet) | **GET** /organisation_documents/{ID} | Read an organisation document
[**organisationDocumentsIDPatch**](OrganisationDocumentsApi.md#organisationDocumentsIDPatch) | **PATCH** /organisation_documents/{ID} | Update an organisation document
[**organisationDocumentsPost**](OrganisationDocumentsApi.md#organisationDocumentsPost) | **POST** /organisation_documents | Create an organisation document
[**organisationsIDOrganisationDocumentsGet**](OrganisationDocumentsApi.md#organisationsIDOrganisationDocumentsGet) | **GET** /organisations/{ID}/organisation_documents | Read an organisation's organisation documents
[**organisationsIDOrganisationDocumentsInspectGet**](OrganisationDocumentsApi.md#organisationsIDOrganisationDocumentsInspectGet) | **GET** /organisations/{ID}/organisation_documents/inspect | Inspect an organisation's organisation documents


<a name="organisationDocumentsIDDelete"></a>
# **organisationDocumentsIDDelete**
> Empty organisationDocumentsIDDelete(ID)

Delete an organisation document

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OrganisationDocumentsApi();

let ID = 56; // Number | 

apiInstance.organisationDocumentsIDDelete(ID).then((data) => {
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

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="organisationDocumentsIDGet"></a>
# **organisationDocumentsIDGet**
> OrganisationDocumentRead organisationDocumentsIDGet(ID)

Read an organisation document

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OrganisationDocumentsApi();

let ID = 56; // Number | 

apiInstance.organisationDocumentsIDGet(ID).then((data) => {
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

[**OrganisationDocumentRead**](OrganisationDocumentRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="organisationDocumentsIDPatch"></a>
# **organisationDocumentsIDPatch**
> OrganisationDocumentVersionRead organisationDocumentsIDPatch(ID, Body)

Update an organisation document

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OrganisationDocumentsApi();

let ID = 56; // Number | 

let Body = new WriRestorationMarketplaceApi.OrganisationDocumentUpdate(); // OrganisationDocumentUpdate | 

apiInstance.organisationDocumentsIDPatch(ID, Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **Body** | [**OrganisationDocumentUpdate**](OrganisationDocumentUpdate.md)|  | 

### Return type

[**OrganisationDocumentVersionRead**](OrganisationDocumentVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="organisationDocumentsPost"></a>
# **organisationDocumentsPost**
> OrganisationDocumentVersionRead organisationDocumentsPost(Body)

Create an organisation document

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OrganisationDocumentsApi();

let Body = new WriRestorationMarketplaceApi.OrganisationDocumentCreate(); // OrganisationDocumentCreate | 

apiInstance.organisationDocumentsPost(Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Body** | [**OrganisationDocumentCreate**](OrganisationDocumentCreate.md)|  | 

### Return type

[**OrganisationDocumentVersionRead**](OrganisationDocumentVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="organisationsIDOrganisationDocumentsGet"></a>
# **organisationsIDOrganisationDocumentsGet**
> OrganisationDocumentReadAll organisationsIDOrganisationDocumentsGet(ID)

Read an organisation's organisation documents

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OrganisationDocumentsApi();

let ID = 56; // Number | 

apiInstance.organisationsIDOrganisationDocumentsGet(ID).then((data) => {
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

[**OrganisationDocumentReadAll**](OrganisationDocumentReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="organisationsIDOrganisationDocumentsInspectGet"></a>
# **organisationsIDOrganisationDocumentsInspectGet**
> OrganisationDocumentVersionReadAll organisationsIDOrganisationDocumentsInspectGet(ID)

Inspect an organisation's organisation documents

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OrganisationDocumentsApi();

let ID = 56; // Number | 

apiInstance.organisationsIDOrganisationDocumentsInspectGet(ID).then((data) => {
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

[**OrganisationDocumentVersionReadAll**](OrganisationDocumentVersionReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

