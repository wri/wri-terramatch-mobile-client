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

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['expect.js', '../../src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require('../../src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.WriRestorationMarketplaceApi);
  }
}(this, function(expect, WriRestorationMarketplaceApi) {
  'use strict';

  var instance;

  describe('(package)', function() {
    describe('DraftDataReadTreeSpecies', function() {
      beforeEach(function() {
        instance = new WriRestorationMarketplaceApi.DraftDataReadTreeSpecies();
      });

      it('should create an instance of DraftDataReadTreeSpecies', function() {
        // TODO: update the code to test DraftDataReadTreeSpecies
        expect(instance).to.be.a(WriRestorationMarketplaceApi.DraftDataReadTreeSpecies);
      });

      it('should have the property name (base name: "name")', function() {
        // TODO: update the code to test the property name
        expect(instance).to.have.property('name');
        // expect(instance.name).to.be(expectedValueLiteral);
      });

      it('should have the property is_native (base name: "is_native")', function() {
        // TODO: update the code to test the property is_native
        expect(instance).to.have.property('is_native');
        // expect(instance.is_native).to.be(expectedValueLiteral);
      });

      it('should have the property count (base name: "count")', function() {
        // TODO: update the code to test the property count
        expect(instance).to.have.property('count');
        // expect(instance.count).to.be(expectedValueLiteral);
      });

      it('should have the property price_to_plant (base name: "price_to_plant")', function() {
        // TODO: update the code to test the property price_to_plant
        expect(instance).to.have.property('price_to_plant');
        // expect(instance.price_to_plant).to.be(expectedValueLiteral);
      });

      it('should have the property price_to_maintain (base name: "price_to_maintain")', function() {
        // TODO: update the code to test the property price_to_maintain
        expect(instance).to.have.property('price_to_maintain');
        // expect(instance.price_to_maintain).to.be(expectedValueLiteral);
      });

      it('should have the property saplings (base name: "saplings")', function() {
        // TODO: update the code to test the property saplings
        expect(instance).to.have.property('saplings');
        // expect(instance.saplings).to.be(expectedValueLiteral);
      });

      it('should have the property site_prep (base name: "site_prep")', function() {
        // TODO: update the code to test the property site_prep
        expect(instance).to.have.property('site_prep');
        // expect(instance.site_prep).to.be(expectedValueLiteral);
      });

      it('should have the property survival_rate (base name: "survival_rate")', function() {
        // TODO: update the code to test the property survival_rate
        expect(instance).to.have.property('survival_rate');
        // expect(instance.survival_rate).to.be(expectedValueLiteral);
      });

      it('should have the property produces_food (base name: "produces_food")', function() {
        // TODO: update the code to test the property produces_food
        expect(instance).to.have.property('produces_food');
        // expect(instance.produces_food).to.be(expectedValueLiteral);
      });

      it('should have the property produces_firewood (base name: "produces_firewood")', function() {
        // TODO: update the code to test the property produces_firewood
        expect(instance).to.have.property('produces_firewood');
        // expect(instance.produces_firewood).to.be(expectedValueLiteral);
      });

      it('should have the property produces_timber (base name: "produces_timber")', function() {
        // TODO: update the code to test the property produces_timber
        expect(instance).to.have.property('produces_timber');
        // expect(instance.produces_timber).to.be(expectedValueLiteral);
      });

      it('should have the property owner (base name: "owner")', function() {
        // TODO: update the code to test the property owner
        expect(instance).to.have.property('owner');
        // expect(instance.owner).to.be(expectedValueLiteral);
      });

      it('should have the property season (base name: "season")', function() {
        // TODO: update the code to test the property season
        expect(instance).to.have.property('season');
        // expect(instance.season).to.be(expectedValueLiteral);
      });

    });
  });

}));
