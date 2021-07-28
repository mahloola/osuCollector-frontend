/*
 * osu! Collector
 * Upload and get osu collections
 *
 * OpenAPI spec version: 1.0.0
 * Contact: junarvi@yahoo.ca
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.4.21
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
    factory(root.expect, root.OsuCollector);
  }
}(this, function(expect, OsuCollector) {
  'use strict';

  var instance;

  describe('(package)', function() {
    describe('CollectionsUploadData', function() {
      beforeEach(function() {
        instance = new OsuCollector.CollectionsUploadData();
      });

      it('should create an instance of CollectionsUploadData', function() {
        // TODO: update the code to test CollectionsUploadData
        expect(instance).to.be.a(OsuCollector.CollectionsUploadData);
      });

      it('should have the property uploader (base name: "uploader")', function() {
        // TODO: update the code to test the property uploader
        expect(instance).to.have.property('uploader');
        // expect(instance.uploader).to.be(expectedValueLiteral);
      });

      it('should have the property description (base name: "description")', function() {
        // TODO: update the code to test the property description
        expect(instance).to.have.property('description');
        // expect(instance.description).to.be(expectedValueLiteral);
      });

      it('should have the property uploaderId (base name: "uploaderId")', function() {
        // TODO: update the code to test the property uploaderId
        expect(instance).to.have.property('uploaderId');
        // expect(instance.uploaderId).to.be(expectedValueLiteral);
      });

      it('should have the property collections (base name: "collections")', function() {
        // TODO: update the code to test the property collections
        expect(instance).to.have.property('collections');
        // expect(instance.collections).to.be(expectedValueLiteral);
      });

    });
  });

}));
