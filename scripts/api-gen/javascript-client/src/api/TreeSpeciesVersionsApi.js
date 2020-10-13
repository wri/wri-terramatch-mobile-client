/*
 * WRI Restoration Marketplace API
 * ### About  This API serves the web and mobile apps for WRI's Restoration Marketplace (AKA TerraMatch).  ### Authentication & Authorisation  JWTs are used for authentication. Upon successful log in a JWT will be provided for you. These expire after 12 hours.  A padlock icon next to an endpoint indicates that it requires an authenticated user. For example:  ![](/images/padlock.png)  ### Requests & Responses  The response bodies documented here will be wrapped in an object adhering to the JSON:API specification.  ### Error Codes  Any errors returned in the body of a response will have a unique code to help identify the type of error. They are:  ``` ACCEPTED, ACTIVE_URL, AFTER, AFTER_OR_EQUAL, ALPHA, ALPHA_DASH, ALPHA_NUM, ARRAY, BEFORE, BEFORE_OR_EQUAL, BETWEEN, BOOLEAN, CARBON_CERTIFICATION_TYPE, CONFIRMED, CONTAIN_LOWER, CONTAIN_NUMBER, CONTAIN_UPPER, CONTINENT, COUNTRY_CODE, CUSTOM, DATE, DATE_EQUALS, DATE_FORMAT, DIFFERENT, DIGITS, DIGITS_BETWEEN, DIMENSIONS, DISTINCT, DOCUMENT_TYPE, EMAIL, ENDS_WITH, EXISTS, FILE, FILLED, FUNDING_BRACKET, FUNDING_SOURCE, GT, GTE, IMAGE, IN, IN_ARRAY, INTEGER, IP, IPV4, IPV6, JSON, LAND_OWNERSHIP, LAND_SIZE, LAND_TYPE, LT, LTE, MAX, MIMES, MIMETYPES, MIN, NOT_IN, NOT_PRESENT, NOT_REGEX, NUMERIC, OTHER_VALUE_PRESENT, OTHER_VALUE_NULL, OTHER_VALUE_STRING, ORGANISATION_CATEGORY, ORGANISATION_TYPE, PRESENT, REGEX, REJECTED_REASON, REPORTING_FREQUENCY, REPORTING_LEVEL, REQUIRED, REQUIRED_IF, REQUIRED_UNLESS, REQUIRED_WITH, REQUIRED_WITH_ALL, REQUIRED_WITHOUT, REQUIRED_WITHOUT_ALL, RESTORATION_GOAL, RESTORATION_METHOD, REVENUE_DRIVER, SAME, SIZE, SOFT_URL, STARTS_WITH, STARTS_WITH_FACEBOOK, STARTS_WITH_TWITTER, STARTS_WITH_INSTAGRAM, STARTS_WITH_LINKEDIN, STRICT_FLOAT, STRING, SUSTAINABLE_DEVELOPMENT_GOAL, TIMEZONE, TREE_SPECIES_OWNER, UNIQUE, UPLOADED, URL, UUID, VISIBILITY ```  ### Uploads  Uploads should first be uploaded to the `/uploads` endpoint. Upon success an ID will be returned, this ID is valid for 1 day. Use this ID in your request body to bind the upload to a property.  ### Elevator Videos  Elevator videos can be created by using the `/elevator_videos` endpoint. After creating an elevator video you will be returned an elevator video ID. Use this to check its status. Elevator videos will start off as `processing` and change to `finished` when it has been build. Once the elevator video is built the `upload_id` property will be present, you can use this just like a regular upload and attach it to a pitch's `video` property. Be sure to use the elevator video's `upload_id` property and not its `id` property. An elevator video's status may end up as `errored` or `timed_out` in which case something has gone wrong.  ### Entity Relationship Diagram  ![](/images/erd.png)  ### Units  * All prices are measured in USD * All land is measured in hectares * All time is measured in months  ### Drafts  When creating a draft the `data` property be equal to a string of JSON containing an empty object. You can then manipulate the `data` property with subsequent updates. When updating a draft you will need to use [JSON Patch](http://jsonpatch.com/) requests to manipulate the `data` property. Operations are relative to the `data` property which means you don't need to preface paths with `/data`. 
 *
 * OpenAPI spec version: 1.0.0
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.4.12
 *
 * Do not edit the class manually.
 *
 */

import {ApiClient} from "../ApiClient";
import {Empty} from '../model/Empty';
import {TreeSpeciesVersionRead} from '../model/TreeSpeciesVersionRead';
import {TreeSpeciesVersionReadAll} from '../model/TreeSpeciesVersionReadAll';
import {TreeSpeciesVersionReject} from '../model/TreeSpeciesVersionReject';

/**
* TreeSpeciesVersions service.
* @module api/TreeSpeciesVersionsApi
* @version 1.0.0
*/
export class TreeSpeciesVersionsApi {

    /**
    * Constructs a new TreeSpeciesVersionsApi. 
    * @alias module:api/TreeSpeciesVersionsApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }



    /**
     * Read a tree species's tree species versions
     * @param {Number} ID 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/TreeSpeciesVersionReadAll} and HTTP response
     */
    treeSpeciesIDTreeSpeciesVersionsGetWithHttpInfo(ID) {
      let postBody = null;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling treeSpeciesIDTreeSpeciesVersionsGet");
      }


      let pathParams = {
        'ID': ID
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['BearerAuth'];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = TreeSpeciesVersionReadAll;

      return this.apiClient.callApi(
        '/tree_species/{ID}/tree_species_versions', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Read a tree species's tree species versions
     * @param {Number} ID 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/TreeSpeciesVersionReadAll}
     */
    treeSpeciesIDTreeSpeciesVersionsGet(ID) {
      return this.treeSpeciesIDTreeSpeciesVersionsGetWithHttpInfo(ID)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Approve a tree species version
     * @param {Number} ID 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/TreeSpeciesVersionRead} and HTTP response
     */
    treeSpeciesVersionsIDApprovePatchWithHttpInfo(ID) {
      let postBody = null;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling treeSpeciesVersionsIDApprovePatch");
      }


      let pathParams = {
        'ID': ID
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['BearerAuth'];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = TreeSpeciesVersionRead;

      return this.apiClient.callApi(
        '/tree_species_versions/{ID}/approve', 'PATCH',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Approve a tree species version
     * @param {Number} ID 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/TreeSpeciesVersionRead}
     */
    treeSpeciesVersionsIDApprovePatch(ID) {
      return this.treeSpeciesVersionsIDApprovePatchWithHttpInfo(ID)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Delete a tree species version
     * @param {Number} ID 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/Empty} and HTTP response
     */
    treeSpeciesVersionsIDDeleteWithHttpInfo(ID) {
      let postBody = null;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling treeSpeciesVersionsIDDelete");
      }


      let pathParams = {
        'ID': ID
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['BearerAuth'];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = Empty;

      return this.apiClient.callApi(
        '/tree_species_versions/{ID}', 'DELETE',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Delete a tree species version
     * @param {Number} ID 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Empty}
     */
    treeSpeciesVersionsIDDelete(ID) {
      return this.treeSpeciesVersionsIDDeleteWithHttpInfo(ID)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Read a tree species version
     * @param {Number} ID 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/TreeSpeciesVersionRead} and HTTP response
     */
    treeSpeciesVersionsIDGetWithHttpInfo(ID) {
      let postBody = null;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling treeSpeciesVersionsIDGet");
      }


      let pathParams = {
        'ID': ID
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['BearerAuth'];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = TreeSpeciesVersionRead;

      return this.apiClient.callApi(
        '/tree_species_versions/{ID}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Read a tree species version
     * @param {Number} ID 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/TreeSpeciesVersionRead}
     */
    treeSpeciesVersionsIDGet(ID) {
      return this.treeSpeciesVersionsIDGetWithHttpInfo(ID)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Reject a tree species version
     * @param {Number} ID 
     * @param {module:model/TreeSpeciesVersionReject} Body 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/TreeSpeciesVersionRead} and HTTP response
     */
    treeSpeciesVersionsIDRejectPatchWithHttpInfo(ID, Body) {
      let postBody = Body;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling treeSpeciesVersionsIDRejectPatch");
      }

      // verify the required parameter 'Body' is set
      if (Body === undefined || Body === null) {
        throw new Error("Missing the required parameter 'Body' when calling treeSpeciesVersionsIDRejectPatch");
      }


      let pathParams = {
        'ID': ID
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['BearerAuth'];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = TreeSpeciesVersionRead;

      return this.apiClient.callApi(
        '/tree_species_versions/{ID}/reject', 'PATCH',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Reject a tree species version
     * @param {Number} ID 
     * @param {module:model/TreeSpeciesVersionReject} Body 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/TreeSpeciesVersionRead}
     */
    treeSpeciesVersionsIDRejectPatch(ID, Body) {
      return this.treeSpeciesVersionsIDRejectPatchWithHttpInfo(ID, Body)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Revive a tree species version
     * @param {Number} ID 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/TreeSpeciesVersionRead} and HTTP response
     */
    treeSpeciesVersionsIDRevivePatchWithHttpInfo(ID) {
      let postBody = null;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling treeSpeciesVersionsIDRevivePatch");
      }


      let pathParams = {
        'ID': ID
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['BearerAuth'];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = TreeSpeciesVersionRead;

      return this.apiClient.callApi(
        '/tree_species_versions/{ID}/revive', 'PATCH',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Revive a tree species version
     * @param {Number} ID 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/TreeSpeciesVersionRead}
     */
    treeSpeciesVersionsIDRevivePatch(ID) {
      return this.treeSpeciesVersionsIDRevivePatchWithHttpInfo(ID)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


}
