# WriRestorationMarketplaceApi.RestorationMethodMetricVersionsApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**restorationMethodMetricVersionsIDApprovePatch**](RestorationMethodMetricVersionsApi.md#restorationMethodMetricVersionsIDApprovePatch) | **PATCH** /restoration_method_metric_versions/{ID}/approve | Approve a restoration method metric version
[**restorationMethodMetricVersionsIDDelete**](RestorationMethodMetricVersionsApi.md#restorationMethodMetricVersionsIDDelete) | **DELETE** /restoration_method_metric_versions/{ID} | Delete a restoration method metric version
[**restorationMethodMetricVersionsIDGet**](RestorationMethodMetricVersionsApi.md#restorationMethodMetricVersionsIDGet) | **GET** /restoration_method_metric_versions/{ID} | Read a restoration method metric version
[**restorationMethodMetricVersionsIDRejectPatch**](RestorationMethodMetricVersionsApi.md#restorationMethodMetricVersionsIDRejectPatch) | **PATCH** /restoration_method_metric_versions/{ID}/reject | Reject a restoration method metric version
[**restorationMethodMetricVersionsIDRevivePatch**](RestorationMethodMetricVersionsApi.md#restorationMethodMetricVersionsIDRevivePatch) | **PATCH** /restoration_method_metric_versions/{ID}/revive | Revive a restoration method metric version
[**restorationMethodMetricsIDRestorationMethodMetricVersionsGet**](RestorationMethodMetricVersionsApi.md#restorationMethodMetricsIDRestorationMethodMetricVersionsGet) | **GET** /restoration_method_metrics/{ID}/restoration_method_metric_versions | Read a restoration method metric's restoration method metric versions


<a name="restorationMethodMetricVersionsIDApprovePatch"></a>
# **restorationMethodMetricVersionsIDApprovePatch**
> RestorationMethodMetricVersionRead restorationMethodMetricVersionsIDApprovePatch(ID)

Approve a restoration method metric version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricVersionsApi();

let ID = 56; // Number | 

apiInstance.restorationMethodMetricVersionsIDApprovePatch(ID).then((data) => {
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

[**RestorationMethodMetricVersionRead**](RestorationMethodMetricVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="restorationMethodMetricVersionsIDDelete"></a>
# **restorationMethodMetricVersionsIDDelete**
> Empty restorationMethodMetricVersionsIDDelete(ID)

Delete a restoration method metric version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricVersionsApi();

let ID = 56; // Number | 

apiInstance.restorationMethodMetricVersionsIDDelete(ID).then((data) => {
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

<a name="restorationMethodMetricVersionsIDGet"></a>
# **restorationMethodMetricVersionsIDGet**
> RestorationMethodMetricVersionRead restorationMethodMetricVersionsIDGet(ID)

Read a restoration method metric version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricVersionsApi();

let ID = 56; // Number | 

apiInstance.restorationMethodMetricVersionsIDGet(ID).then((data) => {
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

[**RestorationMethodMetricVersionRead**](RestorationMethodMetricVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="restorationMethodMetricVersionsIDRejectPatch"></a>
# **restorationMethodMetricVersionsIDRejectPatch**
> RestorationMethodMetricVersionRead restorationMethodMetricVersionsIDRejectPatch(ID, Body)

Reject a restoration method metric version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricVersionsApi();

let ID = 56; // Number | 

let Body = new WriRestorationMarketplaceApi.RestorationMethodMetricVersionReject(); // RestorationMethodMetricVersionReject | 

apiInstance.restorationMethodMetricVersionsIDRejectPatch(ID, Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **Body** | [**RestorationMethodMetricVersionReject**](RestorationMethodMetricVersionReject.md)|  | 

### Return type

[**RestorationMethodMetricVersionRead**](RestorationMethodMetricVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="restorationMethodMetricVersionsIDRevivePatch"></a>
# **restorationMethodMetricVersionsIDRevivePatch**
> RestorationMethodMetricVersionRead restorationMethodMetricVersionsIDRevivePatch(ID)

Revive a restoration method metric version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricVersionsApi();

let ID = 56; // Number | 

apiInstance.restorationMethodMetricVersionsIDRevivePatch(ID).then((data) => {
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

[**RestorationMethodMetricVersionRead**](RestorationMethodMetricVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="restorationMethodMetricsIDRestorationMethodMetricVersionsGet"></a>
# **restorationMethodMetricsIDRestorationMethodMetricVersionsGet**
> RestorationMethodMetricVersionReadAll restorationMethodMetricsIDRestorationMethodMetricVersionsGet(ID)

Read a restoration method metric's restoration method metric versions

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricVersionsApi();

let ID = 56; // Number | 

apiInstance.restorationMethodMetricsIDRestorationMethodMetricVersionsGet(ID).then((data) => {
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

[**RestorationMethodMetricVersionReadAll**](RestorationMethodMetricVersionReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

