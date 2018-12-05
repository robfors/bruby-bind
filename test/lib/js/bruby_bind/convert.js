(function(){
  'use strict';
  
  let RbValue = BRubyBridge.RbValue;
  let ArgumentError = BRubyBridge.ArgumentError;
  let Convert = BRubyBind.Convert;


  console.log("start-js-bruby_bind-convert");

  
  test("BRubyBind.Convert#convert_call");
  // passed arguments should be converted
  (function(){
    let a;
    let f = function(...args) { a = args; }
    Convert.convert_call(f, undefined, false);
    ensure_result( a[0].equal_to(RbValue.nil) );
    ensure_result( a[1].equal_to(RbValue.false) );
  })();
  // retuned value should be converted
  (function(){
    let f = () => RbValue.nil;
    ensure_result( Convert.convert_call(f) === null );
  })();
  // a thrown rb error should be rethrown as a BRubyBind.RubyError
  (function(){
    let v = RbValue.eval('StandardError.new');
    let f = function() { throw new BRubyBridge.RbError(v); };
    try
    {
      Convert.convert_call(f);
      fail();
    }
    catch (e)
    {
      ensure_result( e instanceof BRubyBind.RubyError );
      ensure_result( e.rb_value === v );
    }
  })();
  // a thrown js error (JavaScript::Error) should be rethrown its js counterpart
  (function(){
    let e = new TypeError;
    global.t = function() { throw e };
    let c = () => RbValue.eval("BRubyBridge::JSValue.global.call('t')");
    try
    {
      Convert.convert_call(c);
      fail();
    }
    catch (ce)
    {
      ensure_result( ce instanceof TypeError );
      ensure_result( ce === e );
    }
    delete global.t;
  })();
  // a thrown basic js error (JavaScript::BasicException) should be rethrown its js counterpart
  (function(){
    global.t = function() { throw 2 };
    let c = () => RbValue.eval("BRubyBridge::JSValue.global.call('t')");
    try
    {
      Convert.convert_call(c);
      fail();
    }
    catch (ce)
    {
      ensure_result( ce === 2 );
    }
    delete global.t;
  })();


  test("BRubyBind.Convert#rb_to_js");
  // passing js object should return the js object
  ensure_result( Convert.rb_to_js(undefined) === undefined );
  // passing rb nil should return js null
  ensure_result( Convert.rb_to_js(RbValue.eval('nil')) === null );
  // passing rb false should reutrn js false
  ensure_result( Convert.rb_to_js(RbValue.eval('false')) === false );
  // passing rb true should reutrn js true
  ensure_result( Convert.rb_to_js(RbValue.eval('true')) === true );
  // passing a rb Numeric should return equal js number
  ensure_result( Convert.rb_to_js(RbValue.eval('1.1')) === 1.1 );
  // passing rb object that responds to #to_int should return equal js number
  rb_eval('$c = Class.new { def to_int; 1; end }')
  ensure_result( Convert.rb_to_js(RbValue.eval('$c.new')) === 1 );
  rb_eval('$c = nil');
  // passing rb String should return an equal js string
  ensure_result( Convert.rb_to_js(RbValue.eval("'abc'")) === 'abc' );
  // passing rb Symbol should return an equivalent js string
  ensure_result( Convert.rb_to_js(RbValue.eval(":abc")) === 'abc' );
  // passing rb object that responds to #to_str should return an equal js string
  rb_eval("$c = Class.new { def to_str; 'abc'; end }");
  global.v = Convert.rb_to_js(RbValue.eval('$c.new'));
  ensure_result( Convert.rb_to_js(RbValue.eval('$c.new')) === 'abc' );
  rb_eval('$c = nil');
  // passing a place holder for js Undefined should return js Undefined
  (function(){
    let v = RbValue.get('JavaScript::Undefined').send('new');
    ensure_result( Convert.rb_to_js(v) === undefined );
  })();
  // passing a rb object that responds to #js_value should return that JSValue
  (function(){
    let o = ({});
    let v = RbValue.get('JavaScript::Object').send('new', o);
    ensure_result( Convert.rb_to_js(v) === o );
  })();
  // passing a rb object that alrady has a RbWrapper built for it should
  //   return the previously built RbWrapper
  (function(){
    let o = RbValue.get('Object').send('new');
    let w1 = Convert.rb_to_js(o);
    ensure_result( w1 instanceof BRubyBind.RubyObject );
    let w2 = Convert.rb_to_js(o);
    ensure_result( w2 === w1 );
  })();
  // passing a rb object that responds to #to_proc
  //   should reutrn a BRubyBind.RubyClosure
  (function(){
    let o = RbValue.eval('Proc.new {}');
    ensure_result( Convert.rb_to_js(o) instanceof BRubyBind.RubyClosure );
  })();
  // passing a rb object that responds to #new
  //   should return a BRubyBind.RubyClass
  (function(){
    let o = RbValue.eval('Class.new');
    ensure_result( Convert.rb_to_js(o) instanceof BRubyBind.RubyClass );
  })();
  // passing a rb object that responds to #exception (but not to #new)
  //   should return an a BRubyBind.RubyError
  (function(){
    let o = RbValue.eval('StandardError.new');
    ensure_result( Convert.rb_to_js(o) instanceof BRubyBind.RubyError );
    o = RbValue.eval('StandardError');
    ensure_result( Convert.rb_to_js(o) instanceof BRubyBind.RubyClass );
  })();
  // passing any other rb object should reutrn a BRubyBind.RubyObject
  (function(){
    let o = RbValue.get('Object').send('new');
    let w = Convert.rb_to_js(o);
    ensure_result( w instanceof BRubyBind.RubyObject );
  })();


  test("BRubyBind.Convert#js_to_rb");
  // passing js undefined should return a rb value of nil
  ensure_result( Convert.js_to_rb(undefined).equal_to(RbValue.nil) )
  // passing js true should return a rb value of true
  ensure_result( Convert.js_to_rb(true).equal_to(RbValue.true) )
  // the reminding possibilities will be tested on the rb side


  console.log("end-js-bruby_bind-convert");
  
})();