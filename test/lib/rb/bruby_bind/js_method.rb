JSValue =  BRubyBridge::JSValue

puts "start-rb-bruby_bind-js_method"


test("BRubyBind::JSMethod#declare_js_method")
# we will test JavaScript::Object#call
# calling this method with no arguments should raise ArgumentError
ensure_raise(ArgumentError) { JavaScript.global.call }
# arguments should be converted
js_eval('global.f = function(a, b) { global.a = a; global.b = b }')
JavaScript.global.call('f', 1, 'b')
ensure_js_result('global.a === 1')
ensure_js_result("global.b === 'b'")
js_eval('delete global.f')
js_eval('delete global.a')
js_eval('delete global.b')
# return value should be converted
js_eval('global.f = () => 2')
ensure_result( JavaScript.global.call('f') == 2)
js_eval('delete global.f')
# check that errors get passed up
js_eval('global.e = new TypeError')
js_eval('global.t = function() { throw global.e }')
begin
  JavaScript.global.call('t')
  fail
rescue Exception => e
  ensure_result( e.is_a?(JavaScript::Error) )
  ensure_result( e.class.js_value == JSValue['TypeError'] )
  ensure_result( e.js_value == JSValue['e'] )
end
js_eval('delete global.e')
js_eval('delete global.t')


puts("end-rb-bruby_bind-js_method")