# WriRestorationMarketplaceApi.PitchDocumentsApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**pitchDocumentsIDDelete**](PitchDocumentsApi.md#pitchDocumentsIDDelete) | **DELETE** /pitch_documents/{ID} | Delete a pitch document
[**pitchDocumentsIDGet**](PitchDocumentsApi.md#pitchDocumentsIDGet) | **GET** /pitch_documents/{ID} | Read a pitch document
[**pitchDocumentsIDPatch**](PitchDocumentsApi.md#pitchDocumentsIDPatch) | **PATCH** /pitch_documents/{ID} | Update a pitch document
[**pitchDocumentsPost**](PitchDocumentsApi.md#pitchDocumentsPost) | **POST** /pitch_documents | Create a pitch document
[**pitchesIDPitchDocumentsGet**](PitchDocumentsApi.md#pitchesIDPitchDocumentsGet) | **GET** /pitches/{ID}/pitch_documents | Read a pitch's pitch documents
[**pitchesIDPitchDocumentsInspectGet**](PitchDocumentsApi.md#pitchesIDPitchDocumentsInspectGet) | **GET** /pitches/{ID}/pitch_documents/inspect | Inspect a pitch's pitch documents


<a name="pitchDocumentsIDDelete"></a>
# **pitchDocumentsIDDelete**
> Empty pitchDocumentsIDDelete(ID)

Delete a pitch document

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchDocumentsApi();

let ID = 56; // Number | 

apiInstance.pitchDocumentsIDDelete(ID).then((data) => {
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

<a name="pitchDocumentsIDGet"></a>
# **pitchDocumentsIDGet**
> PitchDocumentRead pitchDocumentsIDGet(ID)

Read a pitch document

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchDocumentsApi();

let ID = 56; // Number | 

apiInstance.pitchDocumentsIDGet(ID).then((data) => {
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

[**PitchDocumentRead**](PitchDocumentRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="pitchDocumentsIDPatch"></a>
# **pitchDocumentsIDPatch**
> PitchDocumentVersionRead pitchDocumentsIDPatch(ID, Body)

Update a pitch document

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchDocumentsApi();

let ID = 56; // Number | 

let Body = new WriRestorationMarketplaceApi.PitchDocumentUpdate(); // PitchDocumentUpdate | 

apiInstance.pitchDocumentsIDPatch(ID, Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **Body** | [**PitchDocumentUpdate**](PitchDocumentUpdate.md)|  | 

### Return type

[**PitchDocumentVersionRead**](PitchDocumentVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="pitchDocumentsPost"></a>
# **pitchDocumentsPost**
> PitchDocumentVersionRead pitchDocumentsPost(Body)

Create a pitch document

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchDocumentsApi();

let Body = new WriRestorationMarketplaceApi.PitchDocumentCreate(); // PitchDocumentCreate | 

apiInstance.pitchDocumentsPost(Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Body** | [**PitchDocumentCreate**](PitchDocumentCreate.md)|  | 

### Return type

[**PitchDocumentVersionRead**](PitchDocumentVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="pitchesIDPitchDocumentsGet"></a>
# **pitchesIDPitchDocumentsGet**
> PitchDocumentReadAll pitchesIDPitchDocumentsGet(ID)

Read a pitch's pitch documents

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchDocumentsApi();

let ID = 56; // Number | 

apiInstance.pitchesIDPitchDocumentsGet(ID).then((data) => {
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

[**PitchDocumentReadAll**](PitchDocumentReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="pitchesIDPitchDocumentsInspectGet"></a>
# **pitchesIDPitchDocumentsInspectGet**
> PitchDocumentVersionReadAll pitchesIDPitchDocumentsInspectGet(ID)

Inspect a pitch's pitch documents

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchDocumentsApi();

let ID = 56; // Number | 

apiInstance.pitchesIDPitchDocumentsInspectGet(ID).then((data) => {
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

