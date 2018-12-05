(function(){
  'use strict';

  let RbValue = BRubyBridge.RbValue;
  let RubyClosure = BRubyBind.RubyClosure;
  let RubyError = BRubyBind.RubyError;


  console.log("start-js-bruby_bind-ruby_closure");

  
  test("BRubyBind.RubyClosure.prototype._apply");
  // test with real BRubyBind.RubyClosure
  // ensure arguments are converted and passed
  (function(){
    let v = RbValue.eval('lambda { |a, b| $a, $b = a, b; nil }');
    let w = new RubyClosure(v);
    w(1, 'c');
    ensure_rb_result('$a == 1');
    ensure_rb_result("$b == 'c'");
    rb_eval('$a, $b = nil');
  })();
  // ensure return value is converted returned
  (function(){
    let v = RbValue.eval('Proc.new { 1.1 }');
    let w = new RubyClosure(v);
    ensure_result( w() == 1.1 );
  })();
  // rb object can be any object that responds correctly to #to_proc
  (function(){
    let v = RbValue.eval('Class.new { def self.to_proc; -> { 1 }; end }');
    let w = new RubyClosure(v);
    ensure_result( w() == 1 );
  })();
  // rb object can be any object that responds correctly to #to_proc
  (function(){
    let v = RbValue.eval('Class.new { def self.to_proc; -> { 1 }; end }');
    let w = new RubyClosure(v);
    ensure_result( w() == 1 );
  })();
  // an rb error raised should be converted to a RubyError
  (function(){
    let v = RbValue.eval('lambda { raise TypeError }');
    let w = new RubyClosure(v);
    try
    {
      w();
      fail();
    }
    catch (e)
    {
      ensure_result( e instanceof RubyError );
      ensure_result( e.name === 'TypeError' );
    }
    // wrong number of arguments
    try
    {
      w(1);
      fail();
    }
    catch (e)
    {
      ensure_result( e instanceof RubyError );
      ensure_result( e.name === 'ArgumentError' );
    }
  })();


  test("BRubyBind.RubyClosure.prototype._construct");
  // test with real BRubyBind.RubyClosure
  // should not be able to call constructor on this object type
  (function(){
    let w = new RubyClosure(RbValue.eval('Proc.new {}'));
    ensure_throw(TypeError, () => new w );
    ensure_throw(TypeError, () => new w() );
  })();


  console.log("end-js-bruby_bind-ruby_closure");
  
})();