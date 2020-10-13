# WriRestorationMarketplaceApi.CompatibilityScoresApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**compatibilityScoresPost**](CompatibilityScoresApi.md#compatibilityScoresPost) | **POST** /compatibility_scores | Read a compatibility score


<a name="compatibilityScoresPost"></a>
# **compatibilityScoresPost**
> InlineResponse200 compatibilityScoresPost(Body)

Read a compatibility score

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.CompatibilityScoresApi();

let Body = new WriRestorationMarketplaceApi.CompatibilityScoreCreate(); // CompatibilityScoreCreate | 

apiInstance.compatibilityScoresPost(Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Body** | [**CompatibilityScoreCreate**](CompatibilityScoreCreate.md)|  | 

### Return type

[**InlineResponse200**](InlineResponse200.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

