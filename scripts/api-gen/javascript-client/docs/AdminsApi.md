# WriRestorationMarketplaceApi.AdminsApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**adminsAcceptPost**](AdminsApi.md#adminsAcceptPost) | **POST** /admins/accept | Create an admin from an invite
[**adminsGet**](AdminsApi.md#adminsGet) | **GET** /admins | Read all admins
[**adminsIDGet**](AdminsApi.md#adminsIDGet) | **GET** /admins/{ID} | Read an admin
[**adminsIDPatch**](AdminsApi.md#adminsIDPatch) | **PATCH** /admins/{ID} | Update an admin
[**adminsInvitePost**](AdminsApi.md#adminsInvitePost) | **POST** /admins/invite | Invite an admin


<a name="adminsAcceptPost"></a>
# **adminsAcceptPost**
> AdminRead adminsAcceptPost(Body)

Create an admin from an invite

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';

let apiInstance = new WriRestorationMarketplaceApi.AdminsApi();

let Body = new WriRestorationMarketplaceApi.AdminAccept(); // AdminAccept | 

apiInstance.adminsAcceptPost(Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Body** | [**AdminAccept**](AdminAccept.md)|  | 

### Return type

[**AdminRead**](AdminRead.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="adminsGet"></a>
# **adminsGet**
> AdminReadAll adminsGet()

Read all admins

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.AdminsApi();
apiInstance.adminsGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**AdminReadAll**](AdminReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="adminsIDGet"></a>
# **adminsIDGet**
> AdminRead adminsIDGet(ID)

Read an admin

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.AdminsApi();

let ID = 56; // Number | 

apiInstance.adminsIDGet(ID).then((data) => {
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

[**AdminRead**](AdminRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="adminsIDPatch"></a>
# **adminsIDPatch**
> AdminRead adminsIDPatch(ID, Body)

Update an admin

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.AdminsApi();

let ID = 56; // Number | 

let Body = new WriRestorationMarketplaceApi.AdminUpdate(); // AdminUpdate | 

apiInstance.adminsIDPatch(ID, Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **Body** | [**AdminUpdate**](AdminUpdate.md)|  | 

### Return type

[**AdminRead**](AdminRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="adminsInvitePost"></a>
# **adminsInvitePost**
> AdminRead adminsInvitePost(Body)

Invite an admin

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.AdminsApi();

let Body = new WriRestorationMarketplaceApi.AdminInvite(); // AdminInvite | 

apiInstance.adminsInvitePost(Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Body** | [**AdminInvite**](AdminInvite.md)|  | 

### Return type

[**AdminRead**](AdminRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

