# WriRestorationMarketplaceApi.OfferContactsApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**offerContactsIDDelete**](OfferContactsApi.md#offerContactsIDDelete) | **DELETE** /offer_contacts/{ID} | Delete an offer contact
[**offerContactsPost**](OfferContactsApi.md#offerContactsPost) | **POST** /offer_contacts | Create an offer contact
[**offersIDOfferContactsGet**](OfferContactsApi.md#offersIDOfferContactsGet) | **GET** /offers/{ID}/offer_contacts | Read an offer's offer contacts


<a name="offerContactsIDDelete"></a>
# **offerContactsIDDelete**
> Empty offerContactsIDDelete(ID)

Delete an offer contact

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OfferContactsApi();

let ID = 56; // Number | 

apiInstance.offerContactsIDDelete(ID).then((data) => {
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

<a name="offerContactsPost"></a>
# **offerContactsPost**
> OfferContactRead offerContactsPost(Body)

Create an offer contact

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OfferContactsApi();

let Body = new WriRestorationMarketplaceApi.OfferContactCreate(); // OfferContactCreate | 

apiInstance.offerContactsPost(Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Body** | [**OfferContactCreate**](OfferContactCreate.md)|  | 

### Return type

[**OfferContactRead**](OfferContactRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="offersIDOfferContactsGet"></a>
# **offersIDOfferContactsGet**
> OfferContactReadAll offersIDOfferContactsGet(ID)

Read an offer's offer contacts

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.OfferContactsApi();

let ID = 56; // Number | 

apiInstance.offersIDOfferContactsGet(ID).then((data) => {
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

[**OfferContactReadAll**](OfferContactReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

