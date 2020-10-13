# WriRestorationMarketplaceApi.LandSizesApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**landSizesGet**](LandSizesApi.md#landSizesGet) | **GET** /land_sizes | Read all land sizes


<a name="landSizesGet"></a>
# **landSizesGet**
> LandSizeReadAll landSizesGet()

Read all land sizes

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';

let apiInstance = new WriRestorationMarketplaceApi.LandSizesApi();
apiInstance.landSizesGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**LandSizeReadAll**](LandSizeReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

