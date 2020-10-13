# WriRestorationMarketplaceApi.ReportingFrequenciesApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**reportingFrequenciesGet**](ReportingFrequenciesApi.md#reportingFrequenciesGet) | **GET** /reporting_frequencies | Read all reporting frequencies


<a name="reportingFrequenciesGet"></a>
# **reportingFrequenciesGet**
> ReportingFrequencyReadAll reportingFrequenciesGet()

Read all reporting frequencies

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';

let apiInstance = new WriRestorationMarketplaceApi.ReportingFrequenciesApi();
apiInstance.reportingFrequenciesGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ReportingFrequencyReadAll**](ReportingFrequencyReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

