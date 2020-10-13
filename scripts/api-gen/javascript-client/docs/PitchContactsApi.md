# WriRestorationMarketplaceApi.PitchContactsApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**pitchContactsIDDelete**](PitchContactsApi.md#pitchContactsIDDelete) | **DELETE** /pitch_contacts/{ID} | Delete a pitch contact
[**pitchContactsPost**](PitchContactsApi.md#pitchContactsPost) | **POST** /pitch_contacts | Create a pitch contact
[**pitchesIDPitchContactsGet**](PitchContactsApi.md#pitchesIDPitchContactsGet) | **GET** /pitches/{ID}/pitch_contacts | Read a pitch's pitch contacts


<a name="pitchContactsIDDelete"></a>
# **pitchContactsIDDelete**
> Empty pitchContactsIDDelete(ID)

Delete a pitch contact

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchContactsApi();

let ID = 56; // Number | 

apiInstance.pitchContactsIDDelete(ID).then((data) => {
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

<a name="pitchContactsPost"></a>
# **pitchContactsPost**
> PitchContactRead pitchContactsPost(Body)

Create a pitch contact

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchContactsApi();

let Body = new WriRestorationMarketplaceApi.PitchContactCreate(); // PitchContactCreate | 

apiInstance.pitchContactsPost(Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Body** | [**PitchContactCreate**](PitchContactCreate.md)|  | 

### Return type

[**PitchContactRead**](PitchContactRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="pitchesIDPitchContactsGet"></a>
# **pitchesIDPitchContactsGet**
> PitchContactReadAll pitchesIDPitchContactsGet(ID)

Read a pitch's pitch contacts

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchContactsApi();

let ID = 56; // Number | 

apiInstance.pitchesIDPitchContactsGet(ID).then((data) => {
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

[**PitchContactReadAll**](PitchContactReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

