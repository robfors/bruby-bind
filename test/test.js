if (typeof global == 'undefined')
  window.global = window;


test = function(message, func = function(){})
{
  console.log("test: " + message);
  func();
};


fail = function()
{
  console.log("------ FAIL ------");
};


pass = function()
{
  console.log("pass");
};


ensure_throw = function(error_class, func)
{
  if (typeof error_class != 'function' ||
      (!(error_class.prototype instanceof Error) && error_class !== Error) )
    throw new TypeError('error_class must be Error or a subclass of it');
  try
  {
    func();
    fail();
  }
  catch(error)
  {
    if (error instanceof error_class)
      pass();
    else
      fail();
  }
};


ensure_rb_raise = function(error_class_rb, func)
{
  let rb_value;
  if (typeof error_class == 'string')
    rb_value = BRubyBridge.RbValue.get(error_class);
  else if (typeof error_class == 'object' && error_class instanceof BRubyBind.RubyClass)
    rb_value = error_class.rb_value;
  else
    throw new TypeError('error_class must be a ruby object or a string of the name of one');
  if (!(rb_value.send('<', BRubyBridge.RbValue.get('Exception')).to_boolean()))
    throw new TypeError('ruby object must be Exception or subclass of it');
  try
  {
    func();
    fail();
  }
  catch(error)
  {
    ensure_result( error instanceof BRubyBind.RubyError );
    ensure_result( error.rb_value.is_a(rb_value) );
  }
};


ensure_result = function(result)
{
  if (result === true)
    pass();
  else
    fail();
};


ensure_result_not = function(result)
{
  ensure_result(result === false);
};


ensure_rb_result = function(rb_code, ...values)
{
  rb_code = "( " + rb_code + " ) == true";
  ensure_result(rb_eval(rb_code, ...values).to_boolean());
};


ensure_rb_result_not = function(rb_code, ...values)
{
  rb_code = "( " + rb_code + " ) == false";
  ensure_rb_result(rb_code, ...values);
}


// js_eval = function(js_code, ...values)
// {
//   var value_names = values.map( (_, index) => "v" + index );
//   var f_args = ['js_code', ...value_names, "return eval(js_code)"];
//   var f = new Function(...f_args);
//   return f.bind(window)(js_code, ...values);
// };


// rb_eval = function(rb_code, ...values)
// {
//   return BRubyBind.Object.rb_eval(rb_code_rb, ...values);
// };

js_eval = function(js_code, ...values)
{
  var value_names = values.map( (_, index) => "v" + index );
  var f_args = ['js_code', ...value_names, "return eval(js_code)"];
  var f = new Function(...f_args);
  return f.bind(window)(js_code, ...values);
};


rb_eval = function(rb_code, ...values)
{
  var object_class_rb = BRubyBridge.RbValue.Object;
  var rb_code_rb = BRubyBridge.RbValue.string(rb_code);
  var result_rb = object_class_rb.send("rb_eval", rb_code_rb, ...values);
  return result_rb;
};