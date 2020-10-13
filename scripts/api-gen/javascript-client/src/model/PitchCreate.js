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
 * The PitchCreate model module.
 * @module model/PitchCreate
 * @version 1.0.0
 */
export class PitchCreate {
  /**
   * Constructs a new <code>PitchCreate</code>.
   * @alias module:model/PitchCreate
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>PitchCreate</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PitchCreate} obj Optional instance to populate.
   * @return {module:model/PitchCreate} The populated <code>PitchCreate</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new PitchCreate();
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
      if (data.hasOwnProperty('land_geojson'))
        obj.land_geojson = ApiClient.convertToType(data['land_geojson'], 'String');
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
      if (data.hasOwnProperty('revenue_drivers'))
        obj.revenue_drivers = ApiClient.convertToType(data['revenue_drivers'], ['String']);
      if (data.hasOwnProperty('estimated_timespan'))
        obj.estimated_timespan = ApiClient.convertToType(data['estimated_timespan'], 'Number');
      if (data.hasOwnProperty('long_term_engagement'))
        obj.long_term_engagement = ApiClient.convertToType(data['long_term_engagement'], 'Boolean');
      if (data.hasOwnProperty('reporting_frequency'))
        obj.reporting_frequency = ApiClient.convertToType(data['reporting_frequency'], 'String');
      if (data.hasOwnProperty('reporting_level'))
        obj.reporting_level = ApiClient.convertToType(data['reporting_level'], 'String');
      if (data.hasOwnProperty('sustainable_development_goals'))
        obj.sustainable_development_goals = ApiClient.convertToType(data['sustainable_development_goals'], ['String']);
      if (data.hasOwnProperty('cover_photo'))
        obj.cover_photo = ApiClient.convertToType(data['cover_photo'], 'Number');
      if (data.hasOwnProperty('video'))
        obj.video = ApiClient.convertToType(data['video'], 'Number');
      if (data.hasOwnProperty('problem'))
        obj.problem = ApiClient.convertToType(data['problem'], 'String');
      if (data.hasOwnProperty('anticipated_outcome'))
        obj.anticipated_outcome = ApiClient.convertToType(data['anticipated_outcome'], 'String');
      if (data.hasOwnProperty('who_is_involved'))
        obj.who_is_involved = ApiClient.convertToType(data['who_is_involved'], 'String');
      if (data.hasOwnProperty('local_community_involvement'))
        obj.local_community_involvement = ApiClient.convertToType(data['local_community_involvement'], 'Boolean');
      if (data.hasOwnProperty('training_involved'))
        obj.training_involved = ApiClient.convertToType(data['training_involved'], 'Boolean');
      if (data.hasOwnProperty('training_type'))
        obj.training_type = ApiClient.convertToType(data['training_type'], 'String');
      if (data.hasOwnProperty('training_amount_people'))
        obj.training_amount_people = ApiClient.convertToType(data['training_amount_people'], 'Number');
      if (data.hasOwnProperty('people_working_in'))
        obj.people_working_in = ApiClient.convertToType(data['people_working_in'], 'String');
      if (data.hasOwnProperty('people_amount_nearby'))
        obj.people_amount_nearby = ApiClient.convertToType(data['people_amount_nearby'], 'Number');
      if (data.hasOwnProperty('people_amount_abroad'))
        obj.people_amount_abroad = ApiClient.convertToType(data['people_amount_abroad'], 'Number');
      if (data.hasOwnProperty('people_amount_employees'))
        obj.people_amount_employees = ApiClient.convertToType(data['people_amount_employees'], 'Number');
      if (data.hasOwnProperty('people_amount_volunteers'))
        obj.people_amount_volunteers = ApiClient.convertToType(data['people_amount_volunteers'], 'Number');
      if (data.hasOwnProperty('benefited_people'))
        obj.benefited_people = ApiClient.convertToType(data['benefited_people'], 'Number');
      if (data.hasOwnProperty('future_maintenance'))
        obj.future_maintenance = ApiClient.convertToType(data['future_maintenance'], 'String');
      if (data.hasOwnProperty('use_of_resources'))
        obj.use_of_resources = ApiClient.convertToType(data['use_of_resources'], 'String');
    }
    return obj;
  }
}

/**
 * @member {String} name
 */
PitchCreate.prototype.name = undefined;

/**
 * @member {String} description
 */
PitchCreate.prototype.description = undefined;

/**
 * @member {Array.<String>} land_types
 */
PitchCreate.prototype.land_types = undefined;

/**
 * @member {Array.<String>} land_ownerships
 */
PitchCreate.prototype.land_ownerships = undefined;

/**
 * @member {String} land_size
 */
PitchCreate.prototype.land_size = undefined;

/**
 * @member {String} land_continent
 */
PitchCreate.prototype.land_continent = undefined;

/**
 * @member {String} land_country
 */
PitchCreate.prototype.land_country = undefined;

/**
 * @member {String} land_geojson
 */
PitchCreate.prototype.land_geojson = undefined;

/**
 * @member {Array.<String>} restoration_methods
 */
PitchCreate.prototype.restoration_methods = undefined;

/**
 * @member {Array.<String>} restoration_goals
 */
PitchCreate.prototype.restoration_goals = undefined;

/**
 * @member {Array.<String>} funding_sources
 */
PitchCreate.prototype.funding_sources = undefined;

/**
 * @member {Number} funding_amount
 */
PitchCreate.prototype.funding_amount = undefined;

/**
 * @member {String} funding_bracket
 */
PitchCreate.prototype.funding_bracket = undefined;

/**
 * @member {Array.<String>} revenue_drivers
 */
PitchCreate.prototype.revenue_drivers = undefined;

/**
 * @member {Number} estimated_timespan
 */
PitchCreate.prototype.estimated_timespan = undefined;

/**
 * @member {Boolean} long_term_engagement
 */
PitchCreate.prototype.long_term_engagement = undefined;

/**
 * @member {String} reporting_frequency
 */
PitchCreate.prototype.reporting_frequency = undefined;

/**
 * @member {String} reporting_level
 */
PitchCreate.prototype.reporting_level = undefined;

/**
 * @member {Array.<String>} sustainable_development_goals
 */
PitchCreate.prototype.sustainable_development_goals = undefined;

/**
 * @member {Number} cover_photo
 */
PitchCreate.prototype.cover_photo = undefined;

/**
 * @member {Number} video
 */
PitchCreate.prototype.video = undefined;

/**
 * @member {String} problem
 */
PitchCreate.prototype.problem = undefined;

/**
 * @member {String} anticipated_outcome
 */
PitchCreate.prototype.anticipated_outcome = undefined;

/**
 * @member {String} who_is_involved
 */
PitchCreate.prototype.who_is_involved = undefined;

/**
 * @member {Boolean} local_community_involvement
 */
PitchCreate.prototype.local_community_involvement = undefined;

/**
 * @member {Boolean} training_involved
 */
PitchCreate.prototype.training_involved = undefined;

/**
 * @member {String} training_type
 */
PitchCreate.prototype.training_type = undefined;

/**
 * @member {Number} training_amount_people
 */
PitchCreate.prototype.training_amount_people = undefined;

/**
 * @member {String} people_working_in
 */
PitchCreate.prototype.people_working_in = undefined;

/**
 * @member {Number} people_amount_nearby
 */
PitchCreate.prototype.people_amount_nearby = undefined;

/**
 * @member {Number} people_amount_abroad
 */
PitchCreate.prototype.people_amount_abroad = undefined;

/**
 * @member {Number} people_amount_employees
 */
PitchCreate.prototype.people_amount_employees = undefined;

/**
 * @member {Number} people_amount_volunteers
 */
PitchCreate.prototype.people_amount_volunteers = undefined;

/**
 * @member {Number} benefited_people
 */
PitchCreate.prototype.benefited_people = undefined;

/**
 * @member {String} future_maintenance
 */
PitchCreate.prototype.future_maintenance = undefined;

/**
 * @member {String} use_of_resources
 */
PitchCreate.prototype.use_of_resources = undefined;


