# WriRestorationMarketplaceApi.OffersApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**offersIDCompletePatch**](OffersApi.md#offersIDCompletePatch) | **PATCH** /offers/{ID}/complete | Mark an offer as complete
[**offersIDGet**](OffersApi.md#offersIDGet) | **GET** /offers/{ID} | Read an offer
[**offersIDPatch**](OffersApi.md#offersIDPatch) | **PATCH** /offers/{ID} | Update an offer
[**offersIDVisibilityPatch**](OffersApi.md#offersIDVisibilityPatch) | **PATCH** /offers/{ID}/visibility | Update an offer's visibility
[**offersMostRecentGet**](OffersApi.md#offersMostRecentGet) | **GET** /offers/most_recent | Read all offers by created date
[**offersPost**](OffersApi.md#offersPost) | **POST** /offers | Create an offer
[**offersSearchPost**](OffersApi.md#offersSearchPost) | **POST** /offers/search | Search all offers
[**organisationsIDOffersGet**](OffersApi.md#organisationsIDOffersGet) | **GET** /organisations/{ID}/offers | Read an organisation's offers
[**organisationsIDOffersInspectGet**](OffersApi.md#organisationsIDOffersInspectGet) | **GET** /organisations/{ID}/offers/inspect | Inspect an organisation's offers


<a name="offersIDCompletePatch"></a>
# **offersIDCompletePatch**
> OfferRead offersIDCompletePatch(ID, Body)

Mark an offer as complete

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OffersApi();

let ID = 56; // Number | 

let Body = new WriRestorationMarketplaceApi.OfferComplete(); // OfferComplete | 

apiInstance.offersIDCompletePatch(ID, Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **Body** | [**OfferComplete**](OfferComplete.md)|  | 

### Return type

[**OfferRead**](OfferRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="offersIDGet"></a>
# **offersIDGet**
> OfferRead offersIDGet(ID)

Read an offer

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OffersApi();

let ID = 56; // Number | 

apiInstance.offersIDGet(ID).then((data) => {
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

[**OfferRead**](OfferRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="offersIDPatch"></a>
# **offersIDPatch**
> OfferRead offersIDPatch(ID, Body)

Update an offer

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OffersApi();

let ID = 56; // Number | 

let Body = new WriRestorationMarketplaceApi.OfferUpdate(); // OfferUpdate | 

apiInstance.offersIDPatch(ID, Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **Body** | [**OfferUpdate**](OfferUpdate.md)|  | 

### Return type

[**OfferRead**](OfferRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="offersIDVisibilityPatch"></a>
# **offersIDVisibilityPatch**
> OfferRead offersIDVisibilityPatch(ID, Body)

Update an offer's visibility

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OffersApi();

let ID = 56; // Number | 

let Body = new WriRestorationMarketplaceApi.OfferVisibility(); // OfferVisibility | 

apiInstance.offersIDVisibilityPatch(ID, Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **Body** | [**OfferVisibility**](OfferVisibility.md)|  | 

### Return type

[**OfferRead**](OfferRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="offersMostRecentGet"></a>
# **offersMostRecentGet**
> OfferReadAll offersMostRecentGet(opts)

Read all offers by created date

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OffersApi();

let opts = { 
  'limit': 56 // Number | 
};
apiInstance.offersMostRecentGet(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **Number**|  | [optional] 

### Return type

[**OfferReadAll**](OfferReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="offersPost"></a>
# **offersPost**
> OfferRead offersPost(Body)

Create an offer

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OffersApi();

let Body = new WriRestorationMarketplaceApi.OfferCreate(); // OfferCreate | 

apiInstance.offersPost(Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Body** | [**OfferCreate**](OfferCreate.md)|  | 

### Return type

[**OfferRead**](OfferRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="offersSearchPost"></a>
# **offersSearchPost**
> OfferReadAll offersSearchPost(Body)

Search all offers

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OffersApi();

let Body = new WriRestorationMarketplaceApi.FilterSearch(); // FilterSearch | 

apiInstance.offersSearchPost(Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Body** | [**FilterSearch**](FilterSearch.md)|  | 

### Return type

[**OfferReadAll**](OfferReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="organisationsIDOffersGet"></a>
# **organisationsIDOffersGet**
> OfferReadAll organisationsIDOffersGet(ID)

Read an organisation's offers

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OffersApi();

let ID = 56; // Number | 

apiInstance.organisationsIDOffersGet(ID).then((data) => {
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

[**OfferReadAll**](OfferReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="organisationsIDOffersInspectGet"></a>
# **organisationsIDOffersInspectGet**
> OfferReadAll organisationsIDOffersInspectGet(ID)

Inspect an organisation's offers

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OffersApi();

let ID = 56; // Number | 

apiInstance.organisationsIDOffersInspectGet(ID).then((data) => {
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

[**OfferReadAll**](OfferReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

