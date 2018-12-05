JSValue =  BRubyBridge::JSValue

puts "start-rb-java_script-error"


#test("JavaScript::Error::exception")
#




test("JavaScript::Error::js_value")
#
ensure_result( JavaScript::Error.js_value == JSValue['Error'] )
# subclass
v = JSValue['TypeError']
c = JavaScript::Error.new_class(v)
ensure_result( c.js_value == v )
v, c = nil


test("JavaScript::Error::new_class")
#
v = JSValue['TypeError']
c = JavaScript::Error.new_class(v)
ensure_result( c < JavaScript::Error )
v, c = nil


test("JavaScript::Error::new_error")
#
vc = JSValue['Error']
vi = JSValue['Error'].new
e = JavaScript::Error.new_error(vi)
ensure_result( e.is_a?(JavaScript::Error) )
ensure_result( e.class.js_value == vc )
vc, vi, e = nil
#
vc = JSValue['TypeError']
vi = JSValue['TypeError'].new
e = JavaScript::Error.new_error(vi)
ensure_result( e.is_a?(JavaScript::Error) )
ensure_result( e.class.js_value == vc )
vc, vi, e = nil


#test("JavaScript::Error#backtrace")


#test("JavaScript::Error#exception")
#


test("JavaScript::Error#java_script_object")
#
v = JSValue['Error'].new
e = JavaScript::Error.new_error(v)
w = e.java_script_object
ensure_result( w.is_a?(JavaScript::Object) )
ensure_result( w.js_value == v )
v, e, w = nil


test("JavaScript::Error#js_value")
#
v = JSValue['Error'].new
e = JavaScript::Error.new_error(v)
ensure_result( e.js_value == v )
v, e = nil







puts("end-rb-java_script-error")