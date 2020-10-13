# WriRestorationMarketplaceApi.RestorationGoalsApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**restorationGoalsGet**](RestorationGoalsApi.md#restorationGoalsGet) | **GET** /restoration_goals | Read all restoration goals


<a name="restorationGoalsGet"></a>
# **restorationGoalsGet**
> RestorationGoalReadAll restorationGoalsGet()

Read all restoration goals

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';

let apiInstance = new WriRestorationMarketplaceApi.RestorationGoalsApi();
apiInstance.restorationGoalsGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**RestorationGoalReadAll**](RestorationGoalReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

