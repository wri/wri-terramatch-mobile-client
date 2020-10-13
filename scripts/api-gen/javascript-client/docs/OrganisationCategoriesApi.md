# WriRestorationMarketplaceApi.OrganisationCategoriesApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**organisationCategoriesGet**](OrganisationCategoriesApi.md#organisationCategoriesGet) | **GET** /organisation_categories | Read all organisation categories


<a name="organisationCategoriesGet"></a>
# **organisationCategoriesGet**
> OrganisationCategoryReadAll organisationCategoriesGet()

Read all organisation categories

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';

let apiInstance = new WriRestorationMarketplaceApi.OrganisationCategoriesApi();
apiInstance.organisationCategoriesGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**OrganisationCategoryReadAll**](OrganisationCategoryReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

