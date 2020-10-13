# WriRestorationMarketplaceApi.OrganisationTypesApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**organisationTypesGet**](OrganisationTypesApi.md#organisationTypesGet) | **GET** /organisation_types | Read all organisation types


<a name="organisationTypesGet"></a>
# **organisationTypesGet**
> OrganisationTypeReadAll organisationTypesGet()

Read all organisation types

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';

let apiInstance = new WriRestorationMarketplaceApi.OrganisationTypesApi();
apiInstance.organisationTypesGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**OrganisationTypeReadAll**](OrganisationTypeReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

