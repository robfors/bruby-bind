JSValue =  BRubyBridge::JSValue
ConvertMeta = BRubyBind::ConvertMeta

puts "start-rb-bruby_bind-convert_meta"


test("BRubyBind::ConvertMeta#convert_call")
# setup test object so we can access the method
t = Class.new.include(ConvertMeta).new
# passed arguments should be converted
t.convert_call(nil, false) { |v1, v2| $v1, $v2 = v1, v2; nil }
ensure_result( $v1.null? )
ensure_result( $v2.false? )
$v1, $v2 = nil
# retuned value should be converted
r = t.convert_call { JSValue.null }
ensure_result( r == nil )
r = nil
# a thrown js Error should be rethrown as a JavaScript::Error
js_eval('global.e = new Error')
js_eval('global.t = function() { throw global.e }')
begin
  t.convert_call { JSValue.global.call('t') }
  fail
rescue Exception => e
  ensure_result( e.instance_of?(JavaScript::Error) )
  ensure_result( e.class.js_value == JSValue['Error'] )
  ensure_result( e.js_value == JSValue['e'] )
end
js_eval('delete global.e')
js_eval('delete global.t')
# a thrown subclass of js Error should be rethrown as a subclass of JavaScript::Error
js_eval('global.e = new TypeError')
js_eval('global.t = function() { throw global.e }')
begin
  t.convert_call { JSValue.global.call('t') }
  fail
rescue Exception => e
  ensure_result( e.is_a?(JavaScript::Error) )
  ensure_result( e.class.js_value == JSValue['TypeError'] )
  ensure_result( e.js_value == JSValue['e'] )
end
js_eval('delete global.e')
js_eval('delete global.t')
# a thrown js error but not Error, should be rethrown as a JavaScript::BasicException
js_eval('global.t = function() { throw 2 }')
begin
  t.convert_call { JSValue.global.call('t') }
  fail
rescue Exception => e
  ensure_result( e.instance_of?(JavaScript::BasicException) )
  ensure_result( e.object == 2 )
end
js_eval('delete global.t')
# a thrown js BRubyBind.RubyError should be rethrown its rb counterpart
$e = TypeError.new
def r; raise $e; end
js_eval('global.r = function() { BRubyBind.Ruby.r() }')
begin
  t.convert_call { JSValue.global.call('r') }
  fail
rescue Exception => e
  ensure_result( e.instance_of?(TypeError) )
  ensure_result( e == $e )
end
js_eval('delete global.r')
$e = nil
undef :r
# clean up
t = nil


puts("end-rb-bruby_bind-convert_meta")