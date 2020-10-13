# WriRestorationMarketplaceApi.SustainableDevelopmentGoalsApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**sustainableDevelopmentGoalsGet**](SustainableDevelopmentGoalsApi.md#sustainableDevelopmentGoalsGet) | **GET** /sustainable_development_goals | Read all sustainable development goals


<a name="sustainableDevelopmentGoalsGet"></a>
# **sustainableDevelopmentGoalsGet**
> SustainableDevelopmentGoalReadAll sustainableDevelopmentGoalsGet()

Read all sustainable development goals

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';

let apiInstance = new WriRestorationMarketplaceApi.SustainableDevelopmentGoalsApi();
apiInstance.sustainableDevelopmentGoalsGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**SustainableDevelopmentGoalReadAll**](SustainableDevelopmentGoalReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

