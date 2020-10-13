# WriRestorationMarketplaceApi.OfferDocumentsApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**offerDocumentsIDDelete**](OfferDocumentsApi.md#offerDocumentsIDDelete) | **DELETE** /offer_documents/{ID} | Delete an offer document
[**offerDocumentsIDGet**](OfferDocumentsApi.md#offerDocumentsIDGet) | **GET** /offer_documents/{ID} | Read an offer document
[**offerDocumentsIDPatch**](OfferDocumentsApi.md#offerDocumentsIDPatch) | **PATCH** /offer_documents/{ID} | Update an offer document
[**offerDocumentsPost**](OfferDocumentsApi.md#offerDocumentsPost) | **POST** /offer_documents | Create an offer document
[**offersIDOfferDocumentsGet**](OfferDocumentsApi.md#offersIDOfferDocumentsGet) | **GET** /offers/{ID}/offer_documents | Read an offer's offer documents


<a name="offerDocumentsIDDelete"></a>
# **offerDocumentsIDDelete**
> Empty offerDocumentsIDDelete(ID)

Delete an offer document

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OfferDocumentsApi();

let ID = 56; // Number | 

apiInstance.offerDocumentsIDDelete(ID).then((data) => {
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

<a name="offerDocumentsIDGet"></a>
# **offerDocumentsIDGet**
> OfferDocumentRead offerDocumentsIDGet(ID)

Read an offer document

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OfferDocumentsApi();

let ID = 56; // Number | 

apiInstance.offerDocumentsIDGet(ID).then((data) => {
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

[**OfferDocumentRead**](OfferDocumentRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="offerDocumentsIDPatch"></a>
# **offerDocumentsIDPatch**
> OfferDocumentRead offerDocumentsIDPatch(ID, Body)

Update an offer document

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OfferDocumentsApi();

let ID = 56; // Number | 

let Body = new WriRestorationMarketplaceApi.OfferDocumentUpdate(); // OfferDocumentUpdate | 

apiInstance.offerDocumentsIDPatch(ID, Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **Body** | [**OfferDocumentUpdate**](OfferDocumentUpdate.md)|  | 

### Return type

[**OfferDocumentRead**](OfferDocumentRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="offerDocumentsPost"></a>
# **offerDocumentsPost**
> OfferDocumentRead offerDocumentsPost(Body)

Create an offer document

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OfferDocumentsApi();

let Body = new WriRestorationMarketplaceApi.OfferDocumentCreate(); // OfferDocumentCreate | 

apiInstance.offerDocumentsPost(Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Body** | [**OfferDocumentCreate**](OfferDocumentCreate.md)|  | 

### Return type

[**OfferDocumentRead**](OfferDocumentRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="offersIDOfferDocumentsGet"></a>
# **offersIDOfferDocumentsGet**
> OfferDocumentReadAll offersIDOfferDocumentsGet(ID)

Read an offer's offer documents

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OfferDocumentsApi();

let ID = 56; // Number | 

apiInstance.offersIDOfferDocumentsGet(ID).then((data) => {
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

[**OfferDocumentReadAll**](OfferDocumentReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

