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
import {OrganisationDocumentCreate} from '../model/OrganisationDocumentCreate';
import {OrganisationDocumentRead} from '../model/OrganisationDocumentRead';
import {OrganisationDocumentReadAll} from '../model/OrganisationDocumentReadAll';
import {OrganisationDocumentUpdate} from '../model/OrganisationDocumentUpdate';
import {OrganisationDocumentVersionRead} from '../model/OrganisationDocumentVersionRead';
import {OrganisationDocumentVersionReadAll} from '../model/OrganisationDocumentVersionReadAll';

/**
* OrganisationDocuments service.
* @module api/OrganisationDocumentsApi
* @version 1.0.0
*/
export class OrganisationDocumentsApi {

    /**
    * Constructs a new OrganisationDocumentsApi. 
    * @alias module:api/OrganisationDocumentsApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }



    /**
     * Delete an organisation document
     * @param {Number} ID 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/Empty} and HTTP response
     */
    organisationDocumentsIDDeleteWithHttpInfo(ID) {
      let postBody = null;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling organisationDocumentsIDDelete");
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
      let contentTypes = ['application/json'];
      let accepts = ['application/json'];
      let returnType = Empty;

      return this.apiClient.callApi(
        '/organisation_documents/{ID}', 'DELETE',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Delete an organisation document
     * @param {Number} ID 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Empty}
     */
    organisationDocumentsIDDelete(ID) {
      return this.organisationDocumentsIDDeleteWithHttpInfo(ID)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Read an organisation document
     * @param {Number} ID 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/OrganisationDocumentRead} and HTTP response
     */
    organisationDocumentsIDGetWithHttpInfo(ID) {
      let postBody = null;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling organisationDocumentsIDGet");
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
      let returnType = OrganisationDocumentRead;

      return this.apiClient.callApi(
        '/organisation_documents/{ID}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Read an organisation document
     * @param {Number} ID 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/OrganisationDocumentRead}
     */
    organisationDocumentsIDGet(ID) {
      return this.organisationDocumentsIDGetWithHttpInfo(ID)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Update an organisation document
     * @param {Number} ID 
     * @param {module:model/OrganisationDocumentUpdate} Body 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/OrganisationDocumentVersionRead} and HTTP response
     */
    organisationDocumentsIDPatchWithHttpInfo(ID, Body) {
      let postBody = Body;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling organisationDocumentsIDPatch");
      }

      // verify the required parameter 'Body' is set
      if (Body === undefined || Body === null) {
        throw new Error("Missing the required parameter 'Body' when calling organisationDocumentsIDPatch");
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
      let contentTypes = ['application/json'];
      let accepts = ['application/json'];
      let returnType = OrganisationDocumentVersionRead;

      return this.apiClient.callApi(
        '/organisation_documents/{ID}', 'PATCH',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Update an organisation document
     * @param {Number} ID 
     * @param {module:model/OrganisationDocumentUpdate} Body 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/OrganisationDocumentVersionRead}
     */
    organisationDocumentsIDPatch(ID, Body) {
      return this.organisationDocumentsIDPatchWithHttpInfo(ID, Body)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Create an organisation document
     * @param {module:model/OrganisationDocumentCreate} Body 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/OrganisationDocumentVersionRead} and HTTP response
     */
    organisationDocumentsPostWithHttpInfo(Body) {
      let postBody = Body;

      // verify the required parameter 'Body' is set
      if (Body === undefined || Body === null) {
        throw new Error("Missing the required parameter 'Body' when calling organisationDocumentsPost");
      }


      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['BearerAuth'];
      let contentTypes = ['application/json'];
      let accepts = ['application/json'];
      let returnType = OrganisationDocumentVersionRead;

      return this.apiClient.callApi(
        '/organisation_documents', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Create an organisation document
     * @param {module:model/OrganisationDocumentCreate} Body 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/OrganisationDocumentVersionRead}
     */
    organisationDocumentsPost(Body) {
      return this.organisationDocumentsPostWithHttpInfo(Body)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Read an organisation's organisation documents
     * @param {Number} ID 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/OrganisationDocumentReadAll} and HTTP response
     */
    organisationsIDOrganisationDocumentsGetWithHttpInfo(ID) {
      let postBody = null;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling organisationsIDOrganisationDocumentsGet");
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
      let returnType = OrganisationDocumentReadAll;

      return this.apiClient.callApi(
        '/organisations/{ID}/organisation_documents', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Read an organisation's organisation documents
     * @param {Number} ID 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/OrganisationDocumentReadAll}
     */
    organisationsIDOrganisationDocumentsGet(ID) {
      return this.organisationsIDOrganisationDocumentsGetWithHttpInfo(ID)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Inspect an organisation's organisation documents
     * @param {Number} ID 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/OrganisationDocumentVersionReadAll} and HTTP response
     */
    organisationsIDOrganisationDocumentsInspectGetWithHttpInfo(ID) {
      let postBody = null;

      // verify the required parameter 'ID' is set
      if (ID === undefined || ID === null) {
        throw new Error("Missing the required parameter 'ID' when calling organisationsIDOrganisationDocumentsInspectGet");
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
      let returnType = OrganisationDocumentVersionReadAll;

      return this.apiClient.callApi(
        '/organisations/{ID}/organisation_documents/inspect', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Inspect an organisation's organisation documents
     * @param {Number} ID 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/OrganisationDocumentVersionReadAll}
     */
    organisationsIDOrganisationDocumentsInspectGet(ID) {
      return this.organisationsIDOrganisationDocumentsInspectGetWithHttpInfo(ID)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


}
