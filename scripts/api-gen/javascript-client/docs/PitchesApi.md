# WriRestorationMarketplaceApi.PitchesApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**continentsCONTINENTPitchesGet**](PitchesApi.md#continentsCONTINENTPitchesGet) | **GET** /continents/{CONTINENT}/pitches | Read all approved pitches by continent
[**continentsPitchesGet**](PitchesApi.md#continentsPitchesGet) | **GET** /continents/pitches | Count all approved pitches by continent
[**organisationsIDPitchesGet**](PitchesApi.md#organisationsIDPitchesGet) | **GET** /organisations/{ID}/pitches | Read an organisation's pitches
[**organisationsIDPitchesInspectGet**](PitchesApi.md#organisationsIDPitchesInspectGet) | **GET** /organisations/{ID}/pitches/inspect | Inspect an organisation's pitches
[**pitchesIDCompletePatch**](PitchesApi.md#pitchesIDCompletePatch) | **PATCH** /pitches/{ID}/complete | Mark a pitch as complete
[**pitchesIDGet**](PitchesApi.md#pitchesIDGet) | **GET** /pitches/{ID} | Read a pitch
[**pitchesIDPatch**](PitchesApi.md#pitchesIDPatch) | **PATCH** /pitches/{ID} | Update a pitch
[**pitchesIDVisibilityPatch**](PitchesApi.md#pitchesIDVisibilityPatch) | **PATCH** /pitches/{ID}/visibility | Update a pitch's visibility
[**pitchesMostRecentGet**](PitchesApi.md#pitchesMostRecentGet) | **GET** /pitches/most_recent | Read all approved pitches by created date
[**pitchesPost**](PitchesApi.md#pitchesPost) | **POST** /pitches | Create a pitch
[**pitchesSearchPost**](PitchesApi.md#pitchesSearchPost) | **POST** /pitches/search | Search all pitches


<a name="continentsCONTINENTPitchesGet"></a>
# **continentsCONTINENTPitchesGet**
> PitchReadAll continentsCONTINENTPitchesGet(CONTINENT)

Read all approved pitches by continent

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchesApi();

let CONTINENT = "CONTINENT_example"; // String | 

apiInstance.continentsCONTINENTPitchesGet(CONTINENT).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **CONTINENT** | **String**|  | 

### Return type

[**PitchReadAll**](PitchReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="continentsPitchesGet"></a>
# **continentsPitchesGet**
> PitchByContinentReadAll continentsPitchesGet()

Count all approved pitches by continent

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchesApi();
apiInstance.continentsPitchesGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**PitchByContinentReadAll**](PitchByContinentReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="organisationsIDPitchesGet"></a>
# **organisationsIDPitchesGet**
> PitchReadAll organisationsIDPitchesGet(ID)

Read an organisation's pitches

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchesApi();

let ID = 56; // Number | 

apiInstance.organisationsIDPitchesGet(ID).then((data) => {
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

[**PitchReadAll**](PitchReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="organisationsIDPitchesInspectGet"></a>
# **organisationsIDPitchesInspectGet**
> PitchVersionReadAll organisationsIDPitchesInspectGet(ID)

Inspect an organisation's pitches

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchesApi();

let ID = 56; // Number | 

apiInstance.organisationsIDPitchesInspectGet(ID).then((data) => {
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

<a name="pitchesIDCompletePatch"></a>
# **pitchesIDCompletePatch**
> PitchRead pitchesIDCompletePatch(ID, Body)

Mark a pitch as complete

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchesApi();

let ID = 56; // Number | 

let Body = new WriRestorationMarketplaceApi.PitchComplete(); // PitchComplete | 

apiInstance.pitchesIDCompletePatch(ID, Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **Body** | [**PitchComplete**](PitchComplete.md)|  | 

### Return type

[**PitchRead**](PitchRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="pitchesIDGet"></a>
# **pitchesIDGet**
> PitchRead pitchesIDGet(ID)

Read a pitch

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchesApi();

let ID = 56; // Number | 

apiInstance.pitchesIDGet(ID).then((data) => {
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

[**PitchRead**](PitchRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="pitchesIDPatch"></a>
# **pitchesIDPatch**
> PitchVersionRead pitchesIDPatch(ID, Body)

Update a pitch

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchesApi();

let ID = 56; // Number | 

let Body = new WriRestorationMarketplaceApi.PitchUpdate(); // PitchUpdate | 

apiInstance.pitchesIDPatch(ID, Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **Body** | [**PitchUpdate**](PitchUpdate.md)|  | 

### Return type

[**PitchVersionRead**](PitchVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="pitchesIDVisibilityPatch"></a>
# **pitchesIDVisibilityPatch**
> PitchRead pitchesIDVisibilityPatch(ID, Body)

Update a pitch's visibility

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchesApi();

let ID = 56; // Number | 

let Body = new WriRestorationMarketplaceApi.PitchVisibility(); // PitchVisibility | 

apiInstance.pitchesIDVisibilityPatch(ID, Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **Body** | [**PitchVisibility**](PitchVisibility.md)|  | 

### Return type

[**PitchRead**](PitchRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="pitchesMostRecentGet"></a>
# **pitchesMostRecentGet**
> PitchReadAll pitchesMostRecentGet(opts)

Read all approved pitches by created date

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchesApi();

let opts = { 
  'limit': 56 // Number | 
};
apiInstance.pitchesMostRecentGet(opts).then((data) => {
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

[**PitchReadAll**](PitchReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="pitchesPost"></a>
# **pitchesPost**
> PitchVersionRead pitchesPost(Body)

Create a pitch

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchesApi();

let Body = new WriRestorationMarketplaceApi.PitchCreate(); // PitchCreate | 

apiInstance.pitchesPost(Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Body** | [**PitchCreate**](PitchCreate.md)|  | 

### Return type

[**PitchVersionRead**](PitchVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="pitchesSearchPost"></a>
# **pitchesSearchPost**
> PitchReadAll pitchesSearchPost(Body)

Search all pitches

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.PitchesApi();

let Body = new WriRestorationMarketplaceApi.FilterSearch(); // FilterSearch | 

apiInstance.pitchesSearchPost(Body).then((data) => {
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

[**PitchReadAll**](PitchReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

