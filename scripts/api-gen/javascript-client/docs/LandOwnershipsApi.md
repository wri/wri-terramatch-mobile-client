# WriRestorationMarketplaceApi.LandOwnershipsApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**landOwnershipsGet**](LandOwnershipsApi.md#landOwnershipsGet) | **GET** /land_ownerships | Read all land ownerships


<a name="landOwnershipsGet"></a>
# **landOwnershipsGet**
> LandOwnershipReadAll landOwnershipsGet()

Read all land ownerships

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';

let apiInstance = new WriRestorationMarketplaceApi.LandOwnershipsApi();
apiInstance.landOwnershipsGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**LandOwnershipReadAll**](LandOwnershipReadAll.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

