# WriRestorationMarketplaceApi.RestorationMethodsApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**restorationMethodsGet**](RestorationMethodsApi.md#restorationMethodsGet) | **GET** /restoration_methods | Read all restoration methods


<a name="restorationMethodsGet"></a>
# **restorationMethodsGet**
> RestorationMethodReadAll restorationMethodsGet()

Read all restoration methods

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';

let apiInstance = new WriRestorationMarketplaceApi.RestorationMethodsApi();
apiInstance.restorationMethodsGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**RestorationMethodReadAll**](RestorationMethodReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

