# WriRestorationMarketplaceApi.RestorationMethodMetricsApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**pitchesIDRestorationMethodMetricsGet**](RestorationMethodMetricsApi.md#pitchesIDRestorationMethodMetricsGet) | **GET** /pitches/{ID}/restoration_method_metrics | Read a pitch's restoration method metrics
[**pitchesIDRestorationMethodMetricsInspectGet**](RestorationMethodMetricsApi.md#pitchesIDRestorationMethodMetricsInspectGet) | **GET** /pitches/{ID}/restoration_method_metrics/inspect | Inspect a pitch's restoration method metrics
[**restorationMethodMetricsIDDelete**](RestorationMethodMetricsApi.md#restorationMethodMetricsIDDelete) | **DELETE** /restoration_method_metrics/{ID} | Delete a restoration method metric
[**restorationMethodMetricsIDGet**](RestorationMethodMetricsApi.md#restorationMethodMetricsIDGet) | **GET** /restoration_method_metrics/{ID} | Read a restoration method metric
[**restorationMethodMetricsIDPatch**](RestorationMethodMetricsApi.md#restorationMethodMetricsIDPatch) | **PATCH** /restoration_method_metrics/{ID} | Update a restoration method metric
[**restorationMethodMetricsPost**](RestorationMethodMetricsApi.md#restorationMethodMetricsPost) | **POST** /restoration_method_metrics | Create a restoration method metric


<a name="pitchesIDRestorationMethodMetricsGet"></a>
# **pitchesIDRestorationMethodMetricsGet**
> RestorationMethodMetricReadAll pitchesIDRestorationMethodMetricsGet(ID)

Read a pitch's restoration method metrics

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricsApi();

let ID = 56; // Number | 

apiInstance.pitchesIDRestorationMethodMetricsGet(ID).then((data) => {
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

[**RestorationMethodMetricReadAll**](RestorationMethodMetricReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="pitchesIDRestorationMethodMetricsInspectGet"></a>
# **pitchesIDRestorationMethodMetricsInspectGet**
> RestorationMethodMetricVersionReadAll pitchesIDRestorationMethodMetricsInspectGet(ID)

Inspect a pitch's restoration method metrics

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricsApi();

let ID = 56; // Number | 

apiInstance.pitchesIDRestorationMethodMetricsInspectGet(ID).then((data) => {
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

<a name="restorationMethodMetricsIDDelete"></a>
# **restorationMethodMetricsIDDelete**
> Empty restorationMethodMetricsIDDelete(ID)

Delete a restoration method metric

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricsApi();

let ID = 56; // Number | 

apiInstance.restorationMethodMetricsIDDelete(ID).then((data) => {
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

<a name="restorationMethodMetricsIDGet"></a>
# **restorationMethodMetricsIDGet**
> RestorationMethodMetricRead restorationMethodMetricsIDGet(ID)

Read a restoration method metric

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricsApi();

let ID = 56; // Number | 

apiInstance.restorationMethodMetricsIDGet(ID).then((data) => {
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

[**RestorationMethodMetricRead**](RestorationMethodMetricRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="restorationMethodMetricsIDPatch"></a>
# **restorationMethodMetricsIDPatch**
> RestorationMethodMetricVersionRead restorationMethodMetricsIDPatch(ID, Body)

Update a restoration method metric

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricsApi();

let ID = 56; // Number | 

let Body = new WriRestorationMarketplaceApi.RestorationMethodMetricUpdate(); // RestorationMethodMetricUpdate | 

apiInstance.restorationMethodMetricsIDPatch(ID, Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **Body** | [**RestorationMethodMetricUpdate**](RestorationMethodMetricUpdate.md)|  | 

### Return type

[**RestorationMethodMetricVersionRead**](RestorationMethodMetricVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="restorationMethodMetricsPost"></a>
# **restorationMethodMetricsPost**
> RestorationMethodMetricVersionRead restorationMethodMetricsPost(Body)

Create a restoration method metric

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.RestorationMethodMetricsApi();

let Body = new WriRestorationMarketplaceApi.RestorationMethodMetricCreate(); // RestorationMethodMetricCreate | 

apiInstance.restorationMethodMetricsPost(Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Body** | [**RestorationMethodMetricCreate**](RestorationMethodMetricCreate.md)|  | 

### Return type

[**RestorationMethodMetricVersionRead**](RestorationMethodMetricVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

