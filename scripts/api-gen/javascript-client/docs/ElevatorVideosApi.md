# WriRestorationMarketplaceApi.ElevatorVideosApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**elevatorVideosIDGet**](ElevatorVideosApi.md#elevatorVideosIDGet) | **GET** /elevator_videos/{ID} | Read an elevator video
[**elevatorVideosPost**](ElevatorVideosApi.md#elevatorVideosPost) | **POST** /elevator_videos | Create an elevator video


<a name="elevatorVideosIDGet"></a>
# **elevatorVideosIDGet**
> ElevatorVideoRead elevatorVideosIDGet(ID)

Read an elevator video

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.ElevatorVideosApi();

let ID = 56; // Number | 

apiInstance.elevatorVideosIDGet(ID).then((data) => {
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

[**ElevatorVideoRead**](ElevatorVideoRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="elevatorVideosPost"></a>
# **elevatorVideosPost**
> ElevatorVideoRead elevatorVideosPost(Body)

Create an elevator video

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.ElevatorVideosApi();

let Body = new WriRestorationMarketplaceApi.ElevatorVideoCreate(); // ElevatorVideoCreate | 

apiInstance.elevatorVideosPost(Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Body** | [**ElevatorVideoCreate**](ElevatorVideoCreate.md)|  | 

### Return type

[**ElevatorVideoRead**](ElevatorVideoRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

