# WriRestorationMarketplaceApi.CarbonCertificationTypesApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**carbonCertificationTypesGet**](CarbonCertificationTypesApi.md#carbonCertificationTypesGet) | **GET** /carbon_certification_types | Read all carbon certification types


<a name="carbonCertificationTypesGet"></a>
# **carbonCertificationTypesGet**
> CarbonCertificationTypeReadAll carbonCertificationTypesGet()

Read all carbon certification types

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';

let apiInstance = new WriRestorationMarketplaceApi.CarbonCertificationTypesApi();
apiInstance.carbonCertificationTypesGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**CarbonCertificationTypeReadAll**](CarbonCertificationTypeReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

