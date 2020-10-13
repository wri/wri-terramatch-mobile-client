# WriRestorationMarketplaceApi.AuthApi

All URIs are relative to *https://dev.wrirestorationmarketplace.cubeapis.com/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**authChangePatch**](AuthApi.md#authChangePatch) | **PATCH** /auth/change | Reset a user's or admin's password
[**authLoginPost**](AuthApi.md#authLoginPost) | **POST** /auth/login | Log a user or admin in
[**authLogoutGet**](AuthApi.md#authLogoutGet) | **GET** /auth/logout | Log the logged in user or admin out
[**authMeGet**](AuthApi.md#authMeGet) | **GET** /auth/me | Read the logged in user or admin
[**authRefreshGet**](AuthApi.md#authRefreshGet) | **GET** /auth/refresh | Refresh the logged in user's or admin's JWT token
[**authResendGet**](AuthApi.md#authResendGet) | **GET** /auth/resend | Send a verification email to the logged in user or admin
[**authResetPost**](AuthApi.md#authResetPost) | **POST** /auth/reset | Send a password reset email to a user or admin
[**authVerifyPatch**](AuthApi.md#authVerifyPatch) | **PATCH** /auth/verify | Verify the logged in user's or admin's email address


<a name="authChangePatch"></a>
# **authChangePatch**
> Empty authChangePatch(Body)

Reset a user's or admin's password

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';

let apiInstance = new WriRestorationMarketplaceApi.AuthApi();

let Body = new WriRestorationMarketplaceApi.AuthChange(); // AuthChange | 

apiInstance.authChangePatch(Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Body** | [**AuthChange**](AuthChange.md)|  | 

### Return type

[**Empty**](Empty.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="authLoginPost"></a>
# **authLoginPost**
> TokenRead authLoginPost(Body)

Log a user or admin in

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';

let apiInstance = new WriRestorationMarketplaceApi.AuthApi();

let Body = new WriRestorationMarketplaceApi.AuthLogIn(); // AuthLogIn | 

apiInstance.authLoginPost(Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Body** | [**AuthLogIn**](AuthLogIn.md)|  | 

### Return type

[**TokenRead**](TokenRead.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="authLogoutGet"></a>
# **authLogoutGet**
> Empty authLogoutGet()

Log the logged in user or admin out

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.AuthApi();
apiInstance.authLogoutGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**Empty**](Empty.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="authMeGet"></a>
# **authMeGet**
> UserRead authMeGet()

Read the logged in user or admin

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.AuthApi();
apiInstance.authMeGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**UserRead**](UserRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="authRefreshGet"></a>
# **authRefreshGet**
> TokenRead authRefreshGet()

Refresh the logged in user's or admin's JWT token

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.AuthApi();
apiInstance.authRefreshGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**TokenRead**](TokenRead.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="authResendGet"></a>
# **authResendGet**
> Empty authResendGet()

Send a verification email to the logged in user or admin

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.AuthApi();
apiInstance.authResendGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**Empty**](Empty.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="authResetPost"></a>
# **authResetPost**
> Empty authResetPost(Body)

Send a password reset email to a user or admin

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';

let apiInstance = new WriRestorationMarketplaceApi.AuthApi();

let Body = new WriRestorationMarketplaceApi.AuthReset(); // AuthReset | 

apiInstance.authResetPost(Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Body** | [**AuthReset**](AuthReset.md)|  | 

### Return type

[**Empty**](Empty.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="authVerifyPatch"></a>
# **authVerifyPatch**
> Empty authVerifyPatch(Body)

Verify the logged in user's or admin's email address

### Example
```javascript
import {WriRestorationMarketplaceApi} from 'wri_restoration_marketplace_api';
let defaultClient = WriRestorationMarketplaceApi.ApiClient.instance;

// Configure API key authorization: BearerAuth
let BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//BearerAuth.apiKeyPrefix = 'Token';

let apiInstance = new WriRestorationMarketplaceApi.AuthApi();

let Body = new WriRestorationMarketplaceApi.AuthVerify(); // AuthVerify | 

apiInstance.authVerifyPatch(Body).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Body** | [**AuthVerify**](AuthVerify.md)|  | 

### Return type

[**Empty**](Empty.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

