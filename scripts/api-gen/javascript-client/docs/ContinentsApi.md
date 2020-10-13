# WriRestorationMarketplaceApi.ContinentsApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**continentsGet**](ContinentsApi.md#continentsGet) | **GET** /continents | Read all continents


<a name="continentsGet"></a>
# **continentsGet**
> ContinentReadAll continentsGet()

Read all continents

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';

let apiInstance = new WriRestorationMarketplaceApi.ContinentsApi();
apiInstance.continentsGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ContinentReadAll**](ContinentReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

