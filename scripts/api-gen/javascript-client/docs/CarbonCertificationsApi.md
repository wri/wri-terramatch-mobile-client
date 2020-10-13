# WriRestorationMarketplaceApi.CarbonCertificationsApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**carbonCertificationsIDDelete**](CarbonCertificationsApi.md#carbonCertificationsIDDelete) | **DELETE** /carbon_certifications/{ID} | Delete a carbon certification
[**carbonCertificationsIDGet**](CarbonCertificationsApi.md#carbonCertificationsIDGet) | **GET** /carbon_certifications/{ID} | Read a carbon certification
[**carbonCertificationsIDPatch**](CarbonCertificationsApi.md#carbonCertificationsIDPatch) | **PATCH** /carbon_certifications/{ID} | Update a carbon certification
[**carbonCertificationsPost**](CarbonCertificationsApi.md#carbonCertificationsPost) | **POST** /carbon_certifications | Create a carbon certification
[**pitchesIDCarbonCertificationsGet**](CarbonCertificationsApi.md#pitchesIDCarbonCertificationsGet) | **GET** /pitches/{ID}/carbon_certifications | Read a pitch's carbon certifications
[**pitchesIDCarbonCertificationsInspectGet**](CarbonCertificationsApi.md#pitchesIDCarbonCertificationsInspectGet) | **GET** /pitches/{ID}/carbon_certifications/inspect | Inspect a pitch's carbon certifications


<a name="carbonCertificationsIDDelete"></a>
# **carbonCertificationsIDDelete**
> Empty carbonCertificationsIDDelete(ID)

Delete a carbon certification

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.CarbonCertificationsApi();

let ID = 56; // Number | 

apiInstance.carbonCertificationsIDDelete(ID).then((data) => {
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

<a name="carbonCertificationsIDGet"></a>
# **carbonCertificationsIDGet**
> CarbonCertificationRead carbonCertificationsIDGet(ID)

Read a carbon certification

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.CarbonCertificationsApi();

let ID = 56; // Number | 

apiInstance.carbonCertificationsIDGet(ID).then((data) => {
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

[**CarbonCertificationRead**](CarbonCertificationRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="carbonCertificationsIDPatch"></a>
# **carbonCertificationsIDPatch**
> CarbonCertificationVersionRead carbonCertificationsIDPatch(ID, Body)

Update a carbon certification

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.CarbonCertificationsApi();

let ID = 56; // Number | 

let Body = new WriRestorationMarketplaceApi.CarbonCertificationUpdate(); // CarbonCertificationUpdate | 

apiInstance.carbonCertificationsIDPatch(ID, Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **Body** | [**CarbonCertificationUpdate**](CarbonCertificationUpdate.md)|  | 

### Return type

[**CarbonCertificationVersionRead**](CarbonCertificationVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="carbonCertificationsPost"></a>
# **carbonCertificationsPost**
> CarbonCertificationVersionRead carbonCertificationsPost(Body)

Create a carbon certification

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.CarbonCertificationsApi();

let Body = new WriRestorationMarketplaceApi.CarbonCertificationCreate(); // CarbonCertificationCreate | 

apiInstance.carbonCertificationsPost(Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Body** | [**CarbonCertificationCreate**](CarbonCertificationCreate.md)|  | 

### Return type

[**CarbonCertificationVersionRead**](CarbonCertificationVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="pitchesIDCarbonCertificationsGet"></a>
# **pitchesIDCarbonCertificationsGet**
> CarbonCertificationReadAll pitchesIDCarbonCertificationsGet(ID)

Read a pitch's carbon certifications

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.CarbonCertificationsApi();

let ID = 56; // Number | 

apiInstance.pitchesIDCarbonCertificationsGet(ID).then((data) => {
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

[**CarbonCertificationReadAll**](CarbonCertificationReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="pitchesIDCarbonCertificationsInspectGet"></a>
# **pitchesIDCarbonCertificationsInspectGet**
> CarbonCertificationVersionReadAll pitchesIDCarbonCertificationsInspectGet(ID)

Inspect a pitch's carbon certifications

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.CarbonCertificationsApi();

let ID = 56; // Number | 

apiInstance.pitchesIDCarbonCertificationsInspectGet(ID).then((data) => {
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

[**CarbonCertificationVersionReadAll**](CarbonCertificationVersionReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

