JSValue =  BRubyBridge::JSValue

puts "start-rb-java_script-function"


test("JavaScript::Function#invoke")
# ensure arguments are passed and return value is returned
js_eval("global.f = a => a + 1")
f = JavaScript::Function.new(JSValue['f'])
ensure_result( f.invoke(1) == 2 )
js_eval('delete global.f')
# ensure 'this' is undefined
js_eval("global.f = function() { 'use strict'; global.a = this }")
f = JavaScript::Function.new(JSValue['f'])
ensure_result( f.invoke == nil )
ensure_js_result("global.a === undefined")
js_eval('delete global.f')
js_eval('delete global.a')
# ensure errors are passed up
js_eval('global.e = new TypeError')
js_eval('global.t = function() { throw global.e }')
t = JavaScript::Function.new(JSValue['t'])
begin
  t.invoke
  fail
rescue Exception => e
  ensure_result( e.is_a?(JavaScript::Error) )
  ensure_result( e.class.js_value == JSValue['TypeError'] )
  ensure_result( e.js_value == JSValue['e'] )
end
js_eval('delete global.e')
js_eval('delete global.t')


test("JavaScript::Function#invoke_with_context")
# ensure arguments are passed
js_eval("global.f = function(a, b) { global.a = a; global.b = b }")
f = JavaScript::Function.new(JSValue['f'])
ensure_result( f.invoke_with_context(nil, 1, 'c') == nil )
ensure_js_result('global.a === 1')
ensure_js_result("global.b === 'c'")
js_eval('delete global.f')
js_eval('delete global.a')
js_eval('delete global.b')
# ensure return value is returned
js_eval("global.f = () => 1.1")
f = JavaScript::Function.new(JSValue['f'])
ensure_result( f.invoke_with_context(nil) == 1.1 )
js_eval('delete global.f')
# ensure 'this' is passed
js_eval("global.f = function() { global.a = this }")
f = JavaScript::Function.new(JSValue['f'])
ensure_result( f.invoke_with_context(3) == nil )
ensure_js_result("global.a == 3")
js_eval('delete global.f')
js_eval('delete global.a')
# ensure errors are passed up
js_eval('global.e = new TypeError')
js_eval('global.t = function() { throw global.e }')
t = JavaScript::Function.new(JSValue['t'])
begin
  t.invoke_with_context(nil)
  fail
rescue Exception => e
  ensure_result( e.is_a?(JavaScript::Error) )
  ensure_result( e.class.js_value == JSValue['TypeError'] )
  ensure_result( e.js_value == JSValue['e'] )
end
js_eval('delete global.e')
js_eval('delete global.t')


# test("JavaScript::Function#to_proc")
# # ensure arguments are passed and return value is returned
# js_eval("global.f = a => a + 1")
# f = JavaScript::Function.new(JSValue['f'])
# ensure_result( f.to_proc.call(1) == 2 )
# js_eval('delete global.f')
# # ensure 'this' is undefined
# js_eval("global.f = function() { 'use strict'; global.a = this }")
# f = JavaScript::Function.new(JSValue['f'])
# ensure_result( f.to_proc.call == nil )
# ensure_js_result("global.a === undefined")
# js_eval('delete global.f')
# js_eval('delete global.a')
# # ensure errors are passed up
# js_eval('global.e = new TypeError')
# js_eval('global.t = function() { throw global.e }')
# t = JavaScript::Function.new(JSValue['t'])
# begin
#   t.to_proc.call
#   fail
# rescue Exception => e
#   puts e.inspect
#   ensure_result( e.is_a?(JavaScript::Error) )
#   ensure_result( e.class.js_value == JSValue['TypeError'] )
#   ensure_result( e.js_value == JSValue['e'] )
# end
# js_eval('delete global.e')
# js_eval('delete global.t')


puts("end-rb-java_script-function")