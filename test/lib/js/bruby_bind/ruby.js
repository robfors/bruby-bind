(function(){
  'use strict';

  let RbValue = BRubyBridge.RbValue;
  let RubyObject = BRubyBind.RubyObject;
  let RubyError = BRubyBind.RubyError;
  let ArgumentError = BRubyBind.ArgumentError;


  console.log("start-js-bruby_bind-ruby_object");

  
  test("Ruby.eval");
  // ensure return value is converted
  ensure_result( Ruby.eval('1') === 1 );
  // catch rb error
  try
  {
    Ruby.eval('raise TypeError');
    fail();
  }
  catch (e)
  {
    ensure_result( e instanceof RubyError );
    ensure_result( e.name === 'TypeError' );
  }


  test("Ruby getting a property");
  // getting an existing constant should return it
  (function(){
    rb_eval('class C; def self.m; 1.8; end; end');
    rb_eval('def C; end');
    let C = Ruby.C;
    ensure_result( C instanceof RubyObject);
    ensure_result( C.m() === 1.8 );
    rb_eval('Object.send(:remove_const, :C)');
    rb_eval('undef :C');
  })();
  // getting an undefined constant should throw ReferenceError
  ensure_throw(ReferenceError, () => Ruby.C );
  // getting an existing method should call it
  (function(){
    rb_eval('$m = 7');
    rb_eval('def m(a, b); raise TypeError if a == nil; a + b; end');
    let m = Ruby.m;
    ensure_result( typeof m == 'function' );
    // ensure arguments and return values work
    ensure_result( m(2, 3) === 5 );
    // a thrown BRubyBridge.RbError should be rethrown as a BRubyBind.RubyError
    try
    {
      m(null, null);
      fail();
    }
    catch (e)
    {
      ensure_result( e instanceof RubyError );
      ensure_result( e.name === 'TypeError' );
    }
    rb_eval('undef :m');
    rb_eval('$m = nil');
  })();
  // getting an undefined method should throw ReferenceError
  ensure_throw(ReferenceError, () => Ruby.m );
  // getting an existing global variable should return it
  rb_eval('$v = 1');
  ensure_result( Ruby.v === 1 );
  rb_eval('$v = nil');
  // getting an undefined global variable should throw ReferenceError
  ensure_throw(ReferenceError, () => Ruby.v );


  test("Ruby searching for a property");
  // searching for an existing constant should return true
  rb_eval('class C; end');
  ensure_result( ('C' in Ruby) === true );
  rb_eval('Object.send(:remove_const, :C)');
  // searching for an undefined constant should return false
  ensure_result( ('C' in Ruby) === false );
  // searching for an existing method should return true
  rb_eval('def m(a); end');
  ensure_result( ('m' in Ruby) === true );
  rb_eval('undef :m');
  // searching for an undefined method should return false
  ensure_result( ('m' in Ruby) === false );
  // searching for an existing global variable should return true
  rb_eval('$v = 1');
  ensure_result( ('v' in Ruby) === true );
  rb_eval('$v = nil');
  // searching for an undefined global variable should return false
  ensure_result( ('v' in Ruby) === false );


  test("Ruby setting a property");
  // setting a constant should work
  ensure_result( (Ruby.N = 2) === 2 );
  ensure_rb_result('N == 2');
  rb_eval('Object.send(:remove_const, :N)');
  // setting an existing constant should work
  rb_eval('N = 3');
  ensure_rb_result('N == 3');
  ensure_result( (Ruby.N = 4) === 4 );
  ensure_rb_result('N == 4');
  rb_eval('Object.send(:remove_const, :N)');
  // calling an assignment method should work
  //   ensure argument is converted and passed
  rb_eval('def m=(a); raise TypeError if a == nil; $a = a; end');
  ensure_result( (Ruby.m = 2) === 2 );
  ensure_rb_result('$a == 2');
  // a thrown BRubyBridge.RbError should be rethrown as a BRubyBind.RubyError
  try
  {
    Ruby.m = null;
    fail();
  }
  catch (e)
  {
    ensure_result( e instanceof RubyError );
    ensure_result( e.name === 'TypeError' );
  }
  rb_eval('undef :m=');
  rb_eval('$a = nil');
  // setting a global variable should work
  ensure_result( (Ruby.v = 3) === 3 );
  ensure_rb_result('$v == 3');
  rb_eval('$v = nil');
  // setting an existing global variable should return it
  rb_eval('$v = 4');
  ensure_rb_result('$v == 4');
  ensure_result( (Ruby.v = 5) === 5 );
  ensure_rb_result('$v == 5');
  rb_eval('$v = nil');


  test("Ruby should be an object");
  //
  ensure_result( typeof Ruby == 'object');


  console.log("end-js-bruby_bind-ruby_object");
  
})();