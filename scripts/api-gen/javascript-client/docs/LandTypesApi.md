# WriRestorationMarketplaceApi.LandTypesApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**landTypesGet**](LandTypesApi.md#landTypesGet) | **GET** /land_types | Read all land types


<a name="landTypesGet"></a>
# **landTypesGet**
> LandTypeReadAll landTypesGet()

Read all land types

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';

let apiInstance = new WriRestorationMarketplaceApi.LandTypesApi();
apiInstance.landTypesGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**LandTypeReadAll**](LandTypeReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

