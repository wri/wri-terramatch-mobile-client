# WriRestorationMarketplaceApi.TasksApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**tasksMatchesGet**](TasksApi.md#tasksMatchesGet) | **GET** /tasks/matches | Read all matches
[**tasksOrganisationsGet**](TasksApi.md#tasksOrganisationsGet) | **GET** /tasks/organisations | Read all pending organisations
[**tasksPitchesGet**](TasksApi.md#tasksPitchesGet) | **GET** /tasks/pitches | Read all pending pitches


<a name="tasksMatchesGet"></a>
# **tasksMatchesGet**
> MatchReadAll tasksMatchesGet()

Read all matches

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.TasksApi();
apiInstance.tasksMatchesGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**MatchReadAll**](MatchReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="tasksOrganisationsGet"></a>
# **tasksOrganisationsGet**
> OrganisationReadAll tasksOrganisationsGet()

Read all pending organisations

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.TasksApi();
apiInstance.tasksOrganisationsGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**OrganisationReadAll**](OrganisationReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="tasksPitchesGet"></a>
# **tasksPitchesGet**
> PitchReadAll tasksPitchesGet()

Read all pending pitches

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.TasksApi();
apiInstance.tasksPitchesGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**PitchReadAll**](PitchReadAll.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

