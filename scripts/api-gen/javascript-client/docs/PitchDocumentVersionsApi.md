# WriRestorationMarketplaceApi.PitchDocumentVersionsApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**pitchDocumentVersionsIDApprovePatch**](PitchDocumentVersionsApi.md#pitchDocumentVersionsIDApprovePatch) | **PATCH** /pitch_document_versions/{ID}/approve | Approve a pitch document version
[**pitchDocumentVersionsIDDelete**](PitchDocumentVersionsApi.md#pitchDocumentVersionsIDDelete) | **DELETE** /pitch_document_versions/{ID} | Delete a pitch document version
[**pitchDocumentVersionsIDGet**](PitchDocumentVersionsApi.md#pitchDocumentVersionsIDGet) | **GET** /pitch_document_versions/{ID} | Read a pitch document version
[**pitchDocumentVersionsIDRejectPatch**](PitchDocumentVersionsApi.md#pitchDocumentVersionsIDRejectPatch) | **PATCH** /pitch_document_versions/{ID}/reject | Reject a pitch document version
[**pitchDocumentVersionsIDRevivePatch**](PitchDocumentVersionsApi.md#pitchDocumentVersionsIDRevivePatch) | **PATCH** /pitch_document_versions/{ID}/revive | Revive a pitch document version
[**pitchDocumentsIDPitchDocumentVersionsGet**](PitchDocumentVersionsApi.md#pitchDocumentsIDPitchDocumentVersionsGet) | **GET** /pitch_documents/{ID}/pitch_document_versions | Read a pitch document's pitch document versions


<a name="pitchDocumentVersionsIDApprovePatch"></a>
# **pitchDocumentVersionsIDApprovePatch**
> PitchDocumentVersionRead pitchDocumentVersionsIDApprovePatch(ID)

Approve a pitch document version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchDocumentVersionsApi();

let ID = 56; // Number | 

apiInstance.pitchDocumentVersionsIDApprovePatch(ID).then((data) => {
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

[**PitchDocumentVersionRead**](PitchDocumentVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="pitchDocumentVersionsIDDelete"></a>
# **pitchDocumentVersionsIDDelete**
> Empty pitchDocumentVersionsIDDelete(ID)

Delete a pitch document version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchDocumentVersionsApi();

let ID = 56; // Number | 

apiInstance.pitchDocumentVersionsIDDelete(ID).then((data) => {
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

<a name="pitchDocumentVersionsIDGet"></a>
# **pitchDocumentVersionsIDGet**
> PitchDocumentVersionRead pitchDocumentVersionsIDGet(ID)

Read a pitch document version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchDocumentVersionsApi();

let ID = 56; // Number | 

apiInstance.pitchDocumentVersionsIDGet(ID).then((data) => {
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

[**PitchDocumentVersionRead**](PitchDocumentVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="pitchDocumentVersionsIDRejectPatch"></a>
# **pitchDocumentVersionsIDRejectPatch**
> PitchDocumentVersionRead pitchDocumentVersionsIDRejectPatch(ID, Body)

Reject a pitch document version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchDocumentVersionsApi();

let ID = 56; // Number | 

let Body = new WriRestorationMarketplaceApi.PitchDocumentVersionReject(); // PitchDocumentVersionReject | 

apiInstance.pitchDocumentVersionsIDRejectPatch(ID, Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **Body** | [**PitchDocumentVersionReject**](PitchDocumentVersionReject.md)|  | 

### Return type

[**PitchDocumentVersionRead**](PitchDocumentVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="pitchDocumentVersionsIDRevivePatch"></a>
# **pitchDocumentVersionsIDRevivePatch**
> PitchDocumentVersionRead pitchDocumentVersionsIDRevivePatch(ID)

Revive a pitch document version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchDocumentVersionsApi();

let ID = 56; // Number | 

apiInstance.pitchDocumentVersionsIDRevivePatch(ID).then((data) => {
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

[**PitchDocumentVersionRead**](PitchDocumentVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="pitchDocumentsIDPitchDocumentVersionsGet"></a>
# **pitchDocumentsIDPitchDocumentVersionsGet**
> PitchDocumentVersionReadAll pitchDocumentsIDPitchDocumentVersionsGet(ID)

Read a pitch document's pitch document versions

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchDocumentVersionsApi();

let ID = 56; // Number | 

apiInstance.pitchDocumentsIDPitchDocumentVersionsGet(ID).then((data) => {
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

[**PitchDocumentVersionReadAll**](PitchDocumentVersionReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

