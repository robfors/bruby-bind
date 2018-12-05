(function(){
  'use strict';

  let RbValue = BRubyBridge.RbValue;
  let RubyClass = BRubyBind.RubyClass;
  let RubyError = BRubyBind.RubyError;


  console.log("start-js-bruby_bind-ruby_class");

  
  test("BRubyBind.RubyClass.prototype._apply");
  // test with real BRubyBind.RubyClass
  // should not be able to invoke non invocable objects
  (function(){
    let w = new RubyClass(RbValue.Object);
    ensure_throw(TypeError, () => w() );
  })();


  test("BRubyBind.RubyClass.prototype._construct");
  // test with real BRubyBind.RubyClass
  // ensure it works with no arguments passed
  (function(){
    let vc = RbValue.eval('Class.new { def m; 1 end }');
    let wc = new RubyClass(vc);
    let wi = new wc;
    ensure_result( wi.m() === 1 )
  })();
  // ensure arguments are converted and passed
  (function(){
    let vc = RbValue.eval('Class.new { attr_reader :a, :b; def initialize(a, b); @a, @b = a, b; end }');
    let wc = new RubyClass(vc);
    let wi = new wc(1, 'c');
    ensure_result( wi.a() === 1 )
    ensure_result( wi.b() === 'c' )
  })();
  // rb object can be any object that responds correctly to #new
  (function(){
    let vc = RbValue.eval('Module.new { def self.new; Object.new; end }');
    let wc = new RubyClass(vc);
    let wi = new wc;
    ensure_result( wi instanceof BRubyBind.RubyObject );
  })();
  // returning a non-object will throw TypeError
  (function(){
    let v = RbValue.eval('Module.new { def self.new; 1; end }');
    let w = new RubyClass(v);
    ensure_throw(TypeError, () => new w);
  })();
  // an rb error raised in #new should be converted to a RubyError
  (function(){
    let v = RbValue.eval('Module.new { def self.new; raise TypeError; end }');
    let w = new RubyClass(v);
    try
    {
      new w;
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
      new w(1);
      fail();
    }
    catch (e)
    {
      ensure_result( e instanceof RubyError );
      ensure_result( e.name === 'ArgumentError' );
    }
  })();

  
  console.log("end-js-bruby_bind-ruby_class");
  
})();