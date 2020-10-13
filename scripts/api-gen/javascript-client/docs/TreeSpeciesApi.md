# WriRestorationMarketplaceApi.TreeSpeciesApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**pitchesIDTreeSpeciesGet**](TreeSpeciesApi.md#pitchesIDTreeSpeciesGet) | **GET** /pitches/{ID}/tree_species | Read a pitch's tree species
[**pitchesIDTreeSpeciesInspectGet**](TreeSpeciesApi.md#pitchesIDTreeSpeciesInspectGet) | **GET** /pitches/{ID}/tree_species/inspect | Inspect a pitch's tree species
[**treeSpeciesIDDelete**](TreeSpeciesApi.md#treeSpeciesIDDelete) | **DELETE** /tree_species/{ID} | Delete a tree species
[**treeSpeciesIDGet**](TreeSpeciesApi.md#treeSpeciesIDGet) | **GET** /tree_species/{ID} | Read a tree species
[**treeSpeciesIDPatch**](TreeSpeciesApi.md#treeSpeciesIDPatch) | **PATCH** /tree_species/{ID} | Update a tree species
[**treeSpeciesPost**](TreeSpeciesApi.md#treeSpeciesPost) | **POST** /tree_species | Create a tree species


<a name="pitchesIDTreeSpeciesGet"></a>
# **pitchesIDTreeSpeciesGet**
> TreeSpeciesReadAll pitchesIDTreeSpeciesGet(ID)

Read a pitch's tree species

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesApi();

let ID = 56; // Number | 

apiInstance.pitchesIDTreeSpeciesGet(ID).then((data) => {
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

[**TreeSpeciesReadAll**](TreeSpeciesReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="pitchesIDTreeSpeciesInspectGet"></a>
# **pitchesIDTreeSpeciesInspectGet**
> TreeSpeciesVersionReadAll pitchesIDTreeSpeciesInspectGet(ID)

Inspect a pitch's tree species

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesApi();

let ID = 56; // Number | 

apiInstance.pitchesIDTreeSpeciesInspectGet(ID).then((data) => {
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

[**TreeSpeciesVersionReadAll**](TreeSpeciesVersionReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="treeSpeciesIDDelete"></a>
# **treeSpeciesIDDelete**
> Empty treeSpeciesIDDelete(ID)

Delete a tree species

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesApi();

let ID = 56; // Number | 

apiInstance.treeSpeciesIDDelete(ID).then((data) => {
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

<a name="treeSpeciesIDGet"></a>
# **treeSpeciesIDGet**
> TreeSpeciesRead treeSpeciesIDGet(ID)

Read a tree species

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesApi();

let ID = 56; // Number | 

apiInstance.treeSpeciesIDGet(ID).then((data) => {
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

[**TreeSpeciesRead**](TreeSpeciesRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="treeSpeciesIDPatch"></a>
# **treeSpeciesIDPatch**
> TreeSpeciesVersionRead treeSpeciesIDPatch(ID, Body)

Update a tree species

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesApi();

let ID = 56; // Number | 

let Body = new WriRestorationMarketplaceApi.TreeSpeciesUpdate(); // TreeSpeciesUpdate | 

apiInstance.treeSpeciesIDPatch(ID, Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **Body** | [**TreeSpeciesUpdate**](TreeSpeciesUpdate.md)|  | 

### Return type

[**TreeSpeciesVersionRead**](TreeSpeciesVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="treeSpeciesPost"></a>
# **treeSpeciesPost**
> TreeSpeciesVersionRead treeSpeciesPost(Body)

Create a tree species

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesApi();

let Body = new WriRestorationMarketplaceApi.TreeSpeciesCreate(); // TreeSpeciesCreate | 

apiInstance.treeSpeciesPost(Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Body** | [**TreeSpeciesCreate**](TreeSpeciesCreate.md)|  | 

### Return type

[**TreeSpeciesVersionRead**](TreeSpeciesVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

