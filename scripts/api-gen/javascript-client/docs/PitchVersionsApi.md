# WriRestorationMarketplaceApi.PitchVersionsApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**pitchVersionsIDApprovePatch**](PitchVersionsApi.md#pitchVersionsIDApprovePatch) | **PATCH** /pitch_versions/{ID}/approve | Approve a pitch version
[**pitchVersionsIDDelete**](PitchVersionsApi.md#pitchVersionsIDDelete) | **DELETE** /pitch_versions/{ID} | Delete a pitch version
[**pitchVersionsIDGet**](PitchVersionsApi.md#pitchVersionsIDGet) | **GET** /pitch_versions/{ID} | Read a pitch version
[**pitchVersionsIDRejectPatch**](PitchVersionsApi.md#pitchVersionsIDRejectPatch) | **PATCH** /pitch_versions/{ID}/reject | Reject a pitch version
[**pitchVersionsIDRevivePatch**](PitchVersionsApi.md#pitchVersionsIDRevivePatch) | **PATCH** /pitch_versions/{ID}/revive | Revive a pitch version
[**pitchesIDPitchVersionsGet**](PitchVersionsApi.md#pitchesIDPitchVersionsGet) | **GET** /pitches/{ID}/pitch_versions | Read a pitch's pitch versions


<a name="pitchVersionsIDApprovePatch"></a>
# **pitchVersionsIDApprovePatch**
> PitchVersionRead pitchVersionsIDApprovePatch(ID)

Approve a pitch version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchVersionsApi();

let ID = 56; // Number | 

apiInstance.pitchVersionsIDApprovePatch(ID).then((data) => {
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

[**PitchVersionRead**](PitchVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="pitchVersionsIDDelete"></a>
# **pitchVersionsIDDelete**
> Empty pitchVersionsIDDelete(ID)

Delete a pitch version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchVersionsApi();

let ID = 56; // Number | 

apiInstance.pitchVersionsIDDelete(ID).then((data) => {
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

<a name="pitchVersionsIDGet"></a>
# **pitchVersionsIDGet**
> PitchVersionRead pitchVersionsIDGet(ID)

Read a pitch version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchVersionsApi();

let ID = 56; // Number | 

apiInstance.pitchVersionsIDGet(ID).then((data) => {
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

[**PitchVersionRead**](PitchVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="pitchVersionsIDRejectPatch"></a>
# **pitchVersionsIDRejectPatch**
> PitchVersionRead pitchVersionsIDRejectPatch(ID, Body)

Reject a pitch version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchVersionsApi();

let ID = 56; // Number | 

let Body = new WriRestorationMarketplaceApi.PitchVersionReject(); // PitchVersionReject | 

apiInstance.pitchVersionsIDRejectPatch(ID, Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **Body** | [**PitchVersionReject**](PitchVersionReject.md)|  | 

### Return type

[**PitchVersionRead**](PitchVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="pitchVersionsIDRevivePatch"></a>
# **pitchVersionsIDRevivePatch**
> PitchVersionRead pitchVersionsIDRevivePatch(ID)

Revive a pitch version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchVersionsApi();

let ID = 56; // Number | 

apiInstance.pitchVersionsIDRevivePatch(ID).then((data) => {
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

[**PitchVersionRead**](PitchVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="pitchesIDPitchVersionsGet"></a>
# **pitchesIDPitchVersionsGet**
> PitchVersionReadAll pitchesIDPitchVersionsGet(ID)

Read a pitch's pitch versions

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchVersionsApi();

let ID = 56; // Number | 

apiInstance.pitchesIDPitchVersionsGet(ID).then((data) => {
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

[**PitchVersionReadAll**](PitchVersionReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

