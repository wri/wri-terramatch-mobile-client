# WriRestorationMarketplaceApi.DocumentTypesApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**documentTypesGet**](DocumentTypesApi.md#documentTypesGet) | **GET** /document_types | Read all document types


<a name="documentTypesGet"></a>
# **documentTypesGet**
> DocumentTypeReadAll documentTypesGet()

Read all document types

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';

let apiInstance = new WriRestorationMarketplaceApi.DocumentTypesApi();
apiInstance.documentTypesGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**DocumentTypeReadAll**](DocumentTypeReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

