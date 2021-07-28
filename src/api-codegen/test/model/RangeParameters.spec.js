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
    describe('RangeParameters', function() {
      beforeEach(function() {
        instance = new OsuCollector.RangeParameters();
      });

      it('should create an instance of RangeParameters', function() {
        // TODO: update the code to test RangeParameters
        expect(instance).to.be.a(OsuCollector.RangeParameters);
      });

      it('should have the property startFrom (base name: "startFrom")', function() {
        // TODO: update the code to test the property startFrom
        expect(instance).to.have.property('startFrom');
        // expect(instance.startFrom).to.be(expectedValueLiteral);
      });

      it('should have the property count (base name: "count")', function() {
        // TODO: update the code to test the property count
        expect(instance).to.have.property('count');
        // expect(instance.count).to.be(expectedValueLiteral);
      });

    });
  });

}));
