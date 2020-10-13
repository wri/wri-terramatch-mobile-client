# WriRestorationMarketplaceApi.ReportingLevelsApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**reportingLevelsGet**](ReportingLevelsApi.md#reportingLevelsGet) | **GET** /reporting_levels | Read all reporting levels


<a name="reportingLevelsGet"></a>
# **reportingLevelsGet**
> ReportingLevelReadAll reportingLevelsGet()

Read all reporting levels

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';

let apiInstance = new WriRestorationMarketplaceApi.ReportingLevelsApi();
apiInstance.reportingLevelsGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ReportingLevelReadAll**](ReportingLevelReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

