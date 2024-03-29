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

import {ApiClient} from '../ApiClient';

/**
 * The OfferRead model module.
 * @module model/OfferRead
 * @version 1.0.0
 */
export class OfferRead {
  /**
   * Constructs a new <code>OfferRead</code>.
   * @alias module:model/OfferRead
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>OfferRead</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/OfferRead} obj Optional instance to populate.
   * @return {module:model/OfferRead} The populated <code>OfferRead</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new OfferRead();
      if (data.hasOwnProperty('id'))
        obj.id = ApiClient.convertToType(data['id'], 'Number');
      if (data.hasOwnProperty('organisation_id'))
        obj.organisation_id = ApiClient.convertToType(data['organisation_id'], 'Number');
      if (data.hasOwnProperty('name'))
        obj.name = ApiClient.convertToType(data['name'], 'String');
      if (data.hasOwnProperty('description'))
        obj.description = ApiClient.convertToType(data['description'], 'String');
      if (data.hasOwnProperty('land_types'))
        obj.land_types = ApiClient.convertToType(data['land_types'], ['String']);
      if (data.hasOwnProperty('land_ownerships'))
        obj.land_ownerships = ApiClient.convertToType(data['land_ownerships'], ['String']);
      if (data.hasOwnProperty('land_size'))
        obj.land_size = ApiClient.convertToType(data['land_size'], 'String');
      if (data.hasOwnProperty('land_continent'))
        obj.land_continent = ApiClient.convertToType(data['land_continent'], 'String');
      if (data.hasOwnProperty('land_country'))
        obj.land_country = ApiClient.convertToType(data['land_country'], 'String');
      if (data.hasOwnProperty('restoration_methods'))
        obj.restoration_methods = ApiClient.convertToType(data['restoration_methods'], ['String']);
      if (data.hasOwnProperty('restoration_goals'))
        obj.restoration_goals = ApiClient.convertToType(data['restoration_goals'], ['String']);
      if (data.hasOwnProperty('funding_sources'))
        obj.funding_sources = ApiClient.convertToType(data['funding_sources'], ['String']);
      if (data.hasOwnProperty('funding_amount'))
        obj.funding_amount = ApiClient.convertToType(data['funding_amount'], 'Number');
      if (data.hasOwnProperty('funding_bracket'))
        obj.funding_bracket = ApiClient.convertToType(data['funding_bracket'], 'String');
      if (data.hasOwnProperty('price_per_tree'))
        obj.price_per_tree = ApiClient.convertToType(data['price_per_tree'], 'Number');
      if (data.hasOwnProperty('long_term_engagement'))
        obj.long_term_engagement = ApiClient.convertToType(data['long_term_engagement'], 'Boolean');
      if (data.hasOwnProperty('reporting_frequency'))
        obj.reporting_frequency = ApiClient.convertToType(data['reporting_frequency'], 'String');
      if (data.hasOwnProperty('reporting_level'))
        obj.reporting_level = ApiClient.convertToType(data['reporting_level'], 'String');
      if (data.hasOwnProperty('sustainable_development_goals'))
        obj.sustainable_development_goals = ApiClient.convertToType(data['sustainable_development_goals'], ['String']);
      if (data.hasOwnProperty('cover_photo'))
        obj.cover_photo = ApiClient.convertToType(data['cover_photo'], 'String');
      if (data.hasOwnProperty('avatar'))
        obj.avatar = ApiClient.convertToType(data['avatar'], 'String');
      if (data.hasOwnProperty('video'))
        obj.video = ApiClient.convertToType(data['video'], 'String');
      if (data.hasOwnProperty('created_at'))
        obj.created_at = ApiClient.convertToType(data['created_at'], 'Date');
      if (data.hasOwnProperty('completed'))
        obj.completed = ApiClient.convertToType(data['completed'], 'Boolean');
      if (data.hasOwnProperty('successful'))
        obj.successful = ApiClient.convertToType(data['successful'], 'Boolean');
      if (data.hasOwnProperty('compatibility_score'))
        obj.compatibility_score = ApiClient.convertToType(data['compatibility_score'], 'Number');
      if (data.hasOwnProperty('visibility'))
        obj.visibility = ApiClient.convertToType(data['visibility'], 'String');
    }
    return obj;
  }
}

/**
 * @member {Number} id
 */
OfferRead.prototype.id = undefined;

/**
 * @member {Number} organisation_id
 */
OfferRead.prototype.organisation_id = undefined;

/**
 * @member {String} name
 */
OfferRead.prototype.name = undefined;

/**
 * @member {String} description
 */
OfferRead.prototype.description = undefined;

/**
 * @member {Array.<String>} land_types
 */
OfferRead.prototype.land_types = undefined;

/**
 * @member {Array.<String>} land_ownerships
 */
OfferRead.prototype.land_ownerships = undefined;

/**
 * @member {String} land_size
 */
OfferRead.prototype.land_size = undefined;

/**
 * @member {String} land_continent
 */
OfferRead.prototype.land_continent = undefined;

/**
 * @member {String} land_country
 */
OfferRead.prototype.land_country = undefined;

/**
 * @member {Array.<String>} restoration_methods
 */
OfferRead.prototype.restoration_methods = undefined;

/**
 * @member {Array.<String>} restoration_goals
 */
OfferRead.prototype.restoration_goals = undefined;

/**
 * @member {Array.<String>} funding_sources
 */
OfferRead.prototype.funding_sources = undefined;

/**
 * @member {Number} funding_amount
 */
OfferRead.prototype.funding_amount = undefined;

/**
 * @member {String} funding_bracket
 */
OfferRead.prototype.funding_bracket = undefined;

/**
 * @member {Number} price_per_tree
 */
OfferRead.prototype.price_per_tree = undefined;

/**
 * @member {Boolean} long_term_engagement
 */
OfferRead.prototype.long_term_engagement = undefined;

/**
 * @member {String} reporting_frequency
 */
OfferRead.prototype.reporting_frequency = undefined;

/**
 * @member {String} reporting_level
 */
OfferRead.prototype.reporting_level = undefined;

/**
 * @member {Array.<String>} sustainable_development_goals
 */
OfferRead.prototype.sustainable_development_goals = undefined;

/**
 * @member {String} cover_photo
 */
OfferRead.prototype.cover_photo = undefined;

/**
 * @member {String} avatar
 */
OfferRead.prototype.avatar = undefined;

/**
 * @member {String} video
 */
OfferRead.prototype.video = undefined;

/**
 * @member {Date} created_at
 */
OfferRead.prototype.created_at = undefined;

/**
 * @member {Boolean} completed
 */
OfferRead.prototype.completed = undefined;

/**
 * @member {Boolean} successful
 */
OfferRead.prototype.successful = undefined;

/**
 * @member {Number} compatibility_score
 */
OfferRead.prototype.compatibility_score = undefined;

/**
 * @member {String} visibility
 */
OfferRead.prototype.visibility = undefined;


