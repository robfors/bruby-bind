(function(){
  'use strict';

  let RbValue = BRubyBridge.RbValue;
  let RubyObject = BRubyBind.RubyObject;
  let RubyError = BRubyBind.RubyError;
  let ArgumentError = BRubyBind.ArgumentError;


  console.log("start-js-bruby_bind-ruby_error");

  
  test("BRubyBind.RubyObject.prototype.rb_value");
  // test with real BRubyBind.RubyError
  (function(){
    let v = RbValue.eval('StandardError.new');
    let e = new RubyError(v);
    ensure_result( e.rb_value === v );
  })();
  

  test("BRubyBind.RubyObject.prototype.ruby_object");
  // test with real BRubyBind.RubyError
  (function(){
    let v = RbValue.eval('StandardError.new');
    let e = new RubyError(v);
    let w = e.ruby_object;
    ensure_result( w instanceof RubyObject );
    ensure_result( w.rb_value === v );
  })();


  test("BRubyBind.RubyObject.prototype.name");
  // test with real BRubyBind.RubyError
  (function(){
    let v = RbValue.eval('StandardError.new');
    let e = new RubyError(v);
    ensure_result( e.name === 'StandardError' );
  })();


  //test("BRubyBind.RubyObject.prototype.toString");


  console.log("end-js-bruby_bind-ruby_error");
  
})();