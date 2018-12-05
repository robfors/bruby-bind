(function(){
  'use strict';

  let RbValue = BRubyBridge.RbValue;
  let RubyObject = BRubyBind.RubyObject;
  let RubyError = BRubyBind.RubyError;
  let ArgumentError = BRubyBind.ArgumentError;


  console.log("start-js-bruby_bind-ruby_object");

  
  
  test("BRubyBind.RubyObject._key_is_method_name");
  //
  ensure_result( RubyObject._key_is_method_name('a') == true );
  //
  ensure_result( RubyObject._key_is_method_name(Symbol()) == false );
  //
  ensure_result( RubyObject._key_is_method_name({}) == false );


  test("BRubyBind.RubyObject._new_proxy_target");
  //
  ensure_result( BRubyBind.RubyObject._new_proxy_target().constructor == Object );


  test("BRubyBind.RubyObject._proxy_get");
  // test it using a Proxy
  // test with stubs
  (function(){
    let target = {};
    let backend = { a: 1, _get: function(key) { return key + '_' } };
    target.backend = backend;
    let handlers = { get: RubyObject._proxy_get.bind(RubyObject) };
    let proxy = new Proxy(target, handlers);
    // get property of backend
    ensure_result( proxy.a === 1 );
    // handle property not found in backend
    ensure_result( proxy.b === 'b_' );
    // won't call handle_get for Symbol
    ensure_result( proxy[Symbol()] === undefined );
  })();
  // test with real BRubyBind.RubyObject
  (function(){
    let o = RbValue.eval('Class.new { def m(a = nil); raise TypeError unless a == nil; 1; end }.new');
    let w = new RubyObject(o);
    ensure_result( w.m() === 1 );
    ensure_result( w['m']() === 1 );
    // error should be converted
    try
    {
      w.m(1);
      fail();
    }
    catch (e)
    {
      ensure_result( e instanceof RubyError );
      ensure_result( e.name === 'TypeError' );
    }
  })();


  test("BRubyBind.RubyObject._proxy_getPrototypeOf");
  // test it using a Proxy
  // test with stubs
  (function(){
    let target_class = class {};
    let target = new target_class;
    let backend_class = class {};
    let backend = new backend_class;
    target.backend = backend;
    let handlers = {
      getPrototypeOf: RubyObject._proxy_getPrototypeOf.bind(RubyObject)
    };
    let proxy = new Proxy(target, handlers);
    ensure_result( proxy instanceof backend_class );
    ensure_result_not( proxy instanceof target_class );
  })();
  // test with real BRubyBind.RubyObject
  (function(){
    let w = new RubyObject(RbValue.Object);
    ensure_result( w instanceof RubyObject );
  })();


  test("BRubyBind.RubyObject._proxy_has");
  // test it using a Proxy
  // look for a key that exists in backend
  //   test with stubs
  (function(){
    let target = {};
    let backend = {a: 1};
    target.backend = backend;
    let handlers = { has: RubyObject._proxy_has.bind(RubyObject) };
    let proxy = new Proxy(target, handlers);
    ensure_result( 'a' in proxy );
    // it won't try calling respond_to? (and throw error) for Symbol
    ensure_result_not( Symbol() in proxy );
  })();
  // look for a key that does not exist in backend
  //   test with real BRubyBind.RubyObject
  (function(){
    let o = RbValue.eval('Class.new { def a; 1; end }.new');
    let w = new RubyObject(o);
    ensure_result( 'a' in w );
    ensure_result_not( 'b' in w );
  })();


  test("BRubyBind.RubyObject._proxy_set");
  // test it using a Proxy
  // test with stubs
  (function(){
    let target = {};
    let r;
    let backend = {
      a: 1, _set: function(key, new_value) { r = key + new_value; return true }
    };
    target.backend = backend;
    let handlers = { set: RubyObject._proxy_set.bind(RubyObject) };
    let proxy = new Proxy(target, handlers);
    // set property that already exists in backend
    ensure_result( (proxy.a = 2) === 2 );
    ensure_result( backend.a === 2 );
    // set property that does not exist in backend
    ensure_result( (proxy.b = 'c') === 'c' );
    ensure_result( r === 'bc' );
    // it won't call handle_set for Symbol
    let k = Symbol();
    proxy[k] = 3;
    ensure_result( r === 'bc' );
    ensure_result( backend[k] === 3 );
  })();
  // test with real BRubyBind.RubyObject
  (function(){
    let o = RbValue
      .eval('Class.new { attr_reader :a; def a=(v); raise TypeError if v == nil; @a = v; end }.new');
    let w = new RubyObject(o);
    ensure_result( (w.a = 1) === 1 );
    ensure_result( w.a() === 1 );
    ensure_result( (w['a'] = 2) === 2 );
    ensure_result( w['a']() === 2 );
    // error should be converted
    try
    {
      w.a = null;
      fail();
    }
    catch (e)
    {
      ensure_result( e instanceof RubyError );
      ensure_result( e.name === 'TypeError' );
    }
  })();


  test("BRubyBind.RubyObject.set_wrapper");
  //
  (function(){
    let v = {};
    let w = {};
    RubyObject.set_wrapper(v, w);
    ensure_result( RubyObject.get_wrapper(v) === w );
  })();


  //test("BRubyBind.RubyObject.prototype.ensure_active");


  //test("BRubyBind.RubyObject.prototype.forget");


  test("BRubyBind.RubyObject.prototype._get");
  // test with real BRubyBind.RubyObject
  (function(){
    let vc = RbValue.eval('$c = Class.new { def m(a = nil); raise TypeError unless a == nil; 1; end }');
    let wc = new RubyObject(vc);
    rb_eval('$c::N = 2');
    let vi = RbValue.eval('i = $c.new');
    let wi = new RubyObject(vi);
    // trying to get a constant that exists should return the constant
    ensure_result( wc.N === 2 );
    // trying to get a constant that does not exist should throw RubyError
    try
    {
      wc.NN;
      fail();
    }
    catch (e)
    {
      ensure_result( e instanceof RubyError );
      ensure_result( e.name === 'NameError' );
    }
    // trying to get a constant on rb object that does not support constants
    //   should throw TypeError
    ensure_throw(TypeError, () => wi.N );
    // trying to get a method that exists should return the method
    ensure_result( typeof wi.m == 'function' );
    ensure_result( wi.m() === 1 );
    ensure_result( wi['m']() === 1 );
    // error should be converted
    try
    {
      wi.m(1);
      fail();
    }
    catch (e)
    {
      ensure_result( e instanceof RubyError );
      ensure_result( e.name === 'TypeError' );
    }
    // trying to get a method that does not exist should return throw RubyError
    try
    {
      wi.mm;
      fail();
    }
    catch (e)
    {
      ensure_result( e instanceof RubyError );
      ensure_result( e.name === 'NoMethodError' );
    }
    // clean up
    rb_eval('$c = nil');
  })();


  test("BRubyBind.RubyObject.prototype._get_method");
  //
  (function(){
    let o = RbValue.eval('Class.new { def a; 1; end }.new');
    let w = new RubyObject(o);
    let m1 = w._get_method('a');
    ensure_result( typeof m1 == 'function' );
    ensure_result( m1() === 1 );
    let m2 = w._get_method('a');
    ensure_result( m2 === m1 );
  })();


  test("BRubyBind.RubyObject.prototype._has");
  // test with real BRubyBind.RubyObject
  (function(){
    let vc = RbValue.eval('$c = Class.new { def m; 1; end }');
    let wc = new RubyObject(vc);
    RbValue.eval('$c::N = 2');
    let vi = RbValue.eval('i = $c.new');
    let wi = new RubyObject(vi);
    // looking for a constant that exists should return true
    ensure_result( ('N' in wc) === true );
    // looking for a constant that does not exist should return false
    ensure_result( ('NN' in wc) === false );
    // looking for a constant on rb object that does not support constants
    //   should throw TypeError
    ensure_throw(TypeError, () => 'N' in wi );
    // looking for a method that exists should return true
    ensure_result( ('m' in wi) === true );
    // looking for a method that does not exist should return false
    ensure_result( ('mm' in wi) === false );
    // clean up
    rb_eval('$c = nil');
  })();


  test("BRubyBind.RubyObject.prototype.rb_value");
  //
  ensure_result( (new RubyObject(RbValue.Object)).rb_value === RbValue.Object );


  test("BRubyBind.RubyObject.prototype.send");
  // calling with no arguments should throw ArgumentError
  ensure_throw(ArgumentError, () => (new RubyObject(RbValue.Object)).send() );
  // ensure that any arguments are converted and passed
  (function(){
    let v = RbValue.eval('Class.new { def self.m(*a); $a = a; end }');
    let w = new RubyObject(v);
    w.send('m');
    ensure_rb_result('$a == []');
    w.send('m', 1);
    ensure_rb_result('$a == [1]');
    w.send('m', 1, 'a');
    ensure_rb_result("$a == [1, 'a']");
    rb_eval('$a = nil');
  })();
  // ensure return value is converted and returned
  (function(){
    let v = RbValue.eval('Class.new { def self.m; 1; end }');
    let w = new RubyObject(v);
    ensure_result( w.send('m') === 1 );
    rb_eval('$a = nil');
  })();
  // ensure String will be accepted as a method_name
  (function(){
    let v = RbValue.eval('Class.new { def self.m; 1; end }');
    let w = new RubyObject(v);
    ensure_result( w.send(new String('m')) === 1 );
    rb_eval('$a = nil');
  })();
  // trying to call a method that does not exist should throw RubyError
  (function(){
    let v = RbValue.eval('Class.new');
    let w = new RubyObject(v);
    try
    {
      w.m;
      fail();
    }
    catch (e)
    {
      ensure_result( e instanceof RubyError );
      ensure_result( e.name === 'NoMethodError' );
    }
  })();
  // calling with method name of wrong type should throw TypeError
  ensure_throw(TypeError, () => (new RubyObject(RbValue.Object)).send(1) );
  ensure_throw(TypeError, () => (new RubyObject(RbValue.Object)).send({}) );
  (function(){
    let w = new RubyObject(RbValue.Object);
    ensure_throw(TypeError, () => w.send({toString: () => 1 }) );
  })();


  test("BRubyBind.RubyObject.prototype._set");
  // test with real BRubyBind.RubyObject
  (function(){
    let vc = RbValue
      .eval('$c = Class.new { attr_reader :v; def m=(v); raise TypeError if v == 0; @v = v + 1; end }');
    let wc = new RubyObject(vc);
    let vi = RbValue.eval('i = $c.new');
    let wi = new RubyObject(vi);
    // trying to set a constant on rb object that supports constants
    //   should work
    ensure_result( (wc.N = 2) === 2 );
    rb_eval('$c::NN = $c::N + 1');
    ensure_result( wc.NN === 3 );
    // trying to set a constant that already exists should work
    ensure_result( (wc.NN = 4) === 4 );
    ensure_result( wc.NN === 4 );
    // trying to set a constant on rb object that does not support constants
    //   should throw TypeError
    ensure_throw(TypeError, () => wi.N = 1 );
    // trying to call assignment method that exists should work
    //   ensure non assignment equivalent does not exist
    try
    {
      wi.m;
      fail();
    }
    catch (e)
    {
      ensure_result( e instanceof RubyError );
      ensure_result( e.name === 'NoMethodError' );
    }
    ensure_result( wi.v() === null );
    ensure_result( (wi.m = 5) === 5 );
    ensure_result( wi.v() === 6 );
    ensure_result( (wi['m'] = 7) === 7 );
    ensure_result( wi.v() === 8 );
    // ensure error is converted
    try
    {
      wi.m = 0;
      fail();
    }
    catch (e)
    {
      ensure_result( e instanceof RubyError );
      ensure_result( e.name === 'TypeError' );
    }
    // clean up
    rb_eval('$c = nil');
  })();


  test("BRubyBind.RubyObject is not a function");
  // test with real BRubyBind.RubyObject
  // should not be able to invoke
  (function(){
    let w = new RubyObject(RbValue.Object);
    ensure_throw(TypeError, () => w() );
  })();


  test("BRubyBind.RubyObject is not a constructor");
  // test with real BRubyBind.RubyObject
  // should not be able to call a constructor
  (function(){
    let w = new RubyObject(RbValue.eval('Object.new'));
    ensure_throw(TypeError, () => new w );
    ensure_throw(TypeError, () => new w() );
  })();


  console.log("end-js-bruby_bind-ruby_object");
  
})();