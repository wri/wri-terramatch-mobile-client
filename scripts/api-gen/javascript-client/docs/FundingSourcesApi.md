# WriRestorationMarketplaceApi.FundingSourcesApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**fundingSourcesGet**](FundingSourcesApi.md#fundingSourcesGet) | **GET** /funding_sources | Read all funding sources


<a name="fundingSourcesGet"></a>
# **fundingSourcesGet**
> FundingSourceReadAll fundingSourcesGet()

Read all funding sources

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';

let apiInstance = new WriRestorationMarketplaceApi.FundingSourcesApi();
apiInstance.fundingSourcesGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**FundingSourceReadAll**](FundingSourceReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

