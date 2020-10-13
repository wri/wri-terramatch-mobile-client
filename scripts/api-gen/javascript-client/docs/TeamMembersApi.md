# WriRestorationMarketplaceApi.TeamMembersApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**organisationsIDTeamMembersGet**](TeamMembersApi.md#organisationsIDTeamMembersGet) | **GET** /organisations/{ID}/team_members | Read an organisation's team members
[**organisationsIDTeamMembersInspectGet**](TeamMembersApi.md#organisationsIDTeamMembersInspectGet) | **GET** /organisations/{ID}/team_members/inspect | Inspect an organisation's team members
[**teamMembersIDDelete**](TeamMembersApi.md#teamMembersIDDelete) | **DELETE** /team_members/{ID} | Delete a team member
[**teamMembersIDGet**](TeamMembersApi.md#teamMembersIDGet) | **GET** /team_members/{ID} | Read a team member
[**teamMembersIDPatch**](TeamMembersApi.md#teamMembersIDPatch) | **PATCH** /team_members/{ID} | Update a team member
[**teamMembersPost**](TeamMembersApi.md#teamMembersPost) | **POST** /team_members | Create a team member


<a name="organisationsIDTeamMembersGet"></a>
# **organisationsIDTeamMembersGet**
> MaskedTeamMemberReadAll organisationsIDTeamMembersGet(ID)

Read an organisation's team members

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.TeamMembersApi();

let ID = 56; // Number | 

apiInstance.organisationsIDTeamMembersGet(ID).then((data) => {
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

[**MaskedTeamMemberReadAll**](MaskedTeamMemberReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="organisationsIDTeamMembersInspectGet"></a>
# **organisationsIDTeamMembersInspectGet**
> TeamMemberReadAll organisationsIDTeamMembersInspectGet(ID)

Inspect an organisation's team members

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.TeamMembersApi();

let ID = 56; // Number | 

apiInstance.organisationsIDTeamMembersInspectGet(ID).then((data) => {
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

[**TeamMemberReadAll**](TeamMemberReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="teamMembersIDDelete"></a>
# **teamMembersIDDelete**
> Empty teamMembersIDDelete(ID)

Delete a team member

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.TeamMembersApi();

let ID = 56; // Number | 

apiInstance.teamMembersIDDelete(ID).then((data) => {
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

<a name="teamMembersIDGet"></a>
# **teamMembersIDGet**
> TeamMemberRead teamMembersIDGet(ID)

Read a team member

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.TeamMembersApi();

let ID = 56; // Number | 

apiInstance.teamMembersIDGet(ID).then((data) => {
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

[**TeamMemberRead**](TeamMemberRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="teamMembersIDPatch"></a>
# **teamMembersIDPatch**
> TeamMemberRead teamMembersIDPatch(ID, Body)

Update a team member

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.TeamMembersApi();

let ID = 56; // Number | 

let Body = new WriRestorationMarketplaceApi.TeamMemberUpdate(); // TeamMemberUpdate | 

apiInstance.teamMembersIDPatch(ID, Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ID** | **Number**|  | 
 **Body** | [**TeamMemberUpdate**](TeamMemberUpdate.md)|  | 

### Return type

[**TeamMemberRead**](TeamMemberRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="teamMembersPost"></a>
# **teamMembersPost**
> TeamMemberRead teamMembersPost(Body)

Create a team member

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.TeamMembersApi();

let Body = new WriRestorationMarketplaceApi.TeamMemberCreate(); // TeamMemberCreate | 

apiInstance.teamMembersPost(Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Body** | [**TeamMemberCreate**](TeamMemberCreate.md)|  | 

### Return type

[**TeamMemberRead**](TeamMemberRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

