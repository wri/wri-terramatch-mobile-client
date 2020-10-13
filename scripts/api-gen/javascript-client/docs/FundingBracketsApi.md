# WriRestorationMarketplaceApi.FundingBracketsApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**fundingBracketsGet**](FundingBracketsApi.md#fundingBracketsGet) | **GET** /funding_brackets | Read all funding brackets


<a name="fundingBracketsGet"></a>
# **fundingBracketsGet**
> FundingBracketReadAll fundingBracketsGet()

Read all funding brackets

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';

let apiInstance = new WriRestorationMarketplaceApi.FundingBracketsApi();
apiInstance.fundingBracketsGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**FundingBracketReadAll**](FundingBracketReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

