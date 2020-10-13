# WriRestorationMarketplaceApi.TreeSpeciesVersionsApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**treeSpeciesIDTreeSpeciesVersionsGet**](TreeSpeciesVersionsApi.md#treeSpeciesIDTreeSpeciesVersionsGet) | **GET** /tree_species/{ID}/tree_species_versions | Read a tree species's tree species versions
[**treeSpeciesVersionsIDApprovePatch**](TreeSpeciesVersionsApi.md#treeSpeciesVersionsIDApprovePatch) | **PATCH** /tree_species_versions/{ID}/approve | Approve a tree species version
[**treeSpeciesVersionsIDDelete**](TreeSpeciesVersionsApi.md#treeSpeciesVersionsIDDelete) | **DELETE** /tree_species_versions/{ID} | Delete a tree species version
[**treeSpeciesVersionsIDGet**](TreeSpeciesVersionsApi.md#treeSpeciesVersionsIDGet) | **GET** /tree_species_versions/{ID} | Read a tree species version
[**treeSpeciesVersionsIDRejectPatch**](TreeSpeciesVersionsApi.md#treeSpeciesVersionsIDRejectPatch) | **PATCH** /tree_species_versions/{ID}/reject | Reject a tree species version
[**treeSpeciesVersionsIDRevivePatch**](TreeSpeciesVersionsApi.md#treeSpeciesVersionsIDRevivePatch) | **PATCH** /tree_species_versions/{ID}/revive | Revive a tree species version


<a name="treeSpeciesIDTreeSpeciesVersionsGet"></a>
# **treeSpeciesIDTreeSpeciesVersionsGet**
> TreeSpeciesVersionReadAll treeSpeciesIDTreeSpeciesVersionsGet(ID)

Read a tree species's tree species versions

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesVersionsApi();

let ID = 56; // Number | 

apiInstance.treeSpeciesIDTreeSpeciesVersionsGet(ID).then((data) => {
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

<a name="treeSpeciesVersionsIDApprovePatch"></a>
# **treeSpeciesVersionsIDApprovePatch**
> TreeSpeciesVersionRead treeSpeciesVersionsIDApprovePatch(ID)

Approve a tree species version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesVersionsApi();

let ID = 56; // Number | 

apiInstance.treeSpeciesVersionsIDApprovePatch(ID).then((data) => {
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

[**TreeSpeciesVersionRead**](TreeSpeciesVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="treeSpeciesVersionsIDDelete"></a>
# **treeSpeciesVersionsIDDelete**
> Empty treeSpeciesVersionsIDDelete(ID)

Delete a tree species version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesVersionsApi();

let ID = 56; // Number | 

apiInstance.treeSpeciesVersionsIDDelete(ID).then((data) => {
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

<a name="treeSpeciesVersionsIDGet"></a>
# **treeSpeciesVersionsIDGet**
> TreeSpeciesVersionRead treeSpeciesVersionsIDGet(ID)

Read a tree species version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesVersionsApi();

let ID = 56; // Number | 

apiInstance.treeSpeciesVersionsIDGet(ID).then((data) => {
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

[**TreeSpeciesVersionRead**](TreeSpeciesVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="treeSpeciesVersionsIDRejectPatch"></a>
# **treeSpeciesVersionsIDRejectPatch**
> TreeSpeciesVersionRead treeSpeciesVersionsIDRejectPatch(ID, Body)

Reject a tree species version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesVersionsApi();

let ID = 56; // Number | 

let Body = new WriRestorationMarketplaceApi.TreeSpeciesVersionReject(); // TreeSpeciesVersionReject | 

apiInstance.treeSpeciesVersionsIDRejectPatch(ID, Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **Body** | [**TreeSpeciesVersionReject**](TreeSpeciesVersionReject.md)|  | 

### Return type

[**TreeSpeciesVersionRead**](TreeSpeciesVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="treeSpeciesVersionsIDRevivePatch"></a>
# **treeSpeciesVersionsIDRevivePatch**
> TreeSpeciesVersionRead treeSpeciesVersionsIDRevivePatch(ID)

Revive a tree species version

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.TreeSpeciesVersionsApi();

let ID = 56; // Number | 

apiInstance.treeSpeciesVersionsIDRevivePatch(ID).then((data) => {
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

[**TreeSpeciesVersionRead**](TreeSpeciesVersionRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

