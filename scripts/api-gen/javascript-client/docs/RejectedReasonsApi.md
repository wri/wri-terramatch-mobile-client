# WriRestorationMarketplaceApi.RejectedReasonsApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**rejectedReasonsGet**](RejectedReasonsApi.md#rejectedReasonsGet) | **GET** /rejected_reasons | Read all rejected reasons


<a name="rejectedReasonsGet"></a>
# **rejectedReasonsGet**
> RejectedReasonReadAll rejectedReasonsGet()

Read all rejected reasons

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';

let apiInstance = new WriRestorationMarketplaceApi.RejectedReasonsApi();
apiInstance.rejectedReasonsGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**RejectedReasonReadAll**](RejectedReasonReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

