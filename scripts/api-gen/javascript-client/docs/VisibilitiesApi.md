# WriRestorationMarketplaceApi.VisibilitiesApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**visibilitiesGet**](VisibilitiesApi.md#visibilitiesGet) | **GET** /visibilities | Read all visibilities


<a name="visibilitiesGet"></a>
# **visibilitiesGet**
> VisibilityReadAll visibilitiesGet()

Read all visibilities

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';

let apiInstance = new WriRestorationMarketplaceApi.VisibilitiesApi();
apiInstance.visibilitiesGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**VisibilityReadAll**](VisibilityReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

