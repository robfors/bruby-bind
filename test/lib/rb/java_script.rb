JSValue =  BRubyBridge::JSValue

puts "start-rb-java_script"


test("JavaScript::call")
# ensure arguments and return value are converted and passed/returned
js_eval('global.f = a => a + 1')
ensure_result( JavaScript.call('f', 2) == 3 )
js_eval("delete global.f")
# ensure errors are passed up
js_eval('global.e = new TypeError')
js_eval("global.t = function() { throw global.e }")
begin
  JavaScript.call('t')
  fail
rescue Exception => e
  ensure_result( e.is_a?(JavaScript::Error) )
  ensure_result( e.class.js_value == JSValue['TypeError'] )
  ensure_result( e.js_value == JSValue['e'] )
end
js_eval('delete global.e')
js_eval('delete global.t')


test("JavaScript::eval")
# passing no arguments should raise ArgumentError
ensure_raise(ArgumentError) { JavaScript.eval }
# ensure return value is converted and returned
ensure_result( JavaScript.eval("'abc'") == 'abc' )
# passing non string argument should raise TypeError
ensure_raise(TypeError) { JavaScript.eval(1) }
# passing too many arguments should raise ArgumentError
ensure_raise(ArgumentError) { JavaScript.eval('a', 'b') }


test("JavaScript::get")
# passing no arguments should raise ArgumentError
ensure_raise(ArgumentError) { JavaScript.get }
# ensure we can get a propery of global
js_eval('global.a = 1')
ensure_result( JavaScript.get('a') == 1 )
js_eval("delete global.a")
# passing non String argument should raise TypeError
ensure_raise(TypeError) { JavaScript.get(1) }
# passing too many arguments should raise ArgumentError
ensure_raise(ArgumentError) { JavaScript.get('a', 'b') }


test("JavaScript::global")
#
ensure_result( JavaScript.global.js_value == JSValue.global )
# passing any arguments should raise ArgumentError
ensure_raise(ArgumentError) { JavaScript.global('a') }



test("JavaScript::in?")
# passing too few arguments should raise ArgumentError
ensure_raise(ArgumentError) { JavaScript.in? }
ensure_raise(ArgumentError) { JavaScript.in?('a') }
#
js_eval('global.a = 1')
ensure_result( JavaScript.in?('a', JavaScript.global) == true )
ensure_result( JavaScript.in?('b', JavaScript.global) == false )
js_eval("delete global.a")
# passing argument that is not a JavaScript::Object should raise TypeError
ensure_raise(TypeError) { JavaScript.in?('a', {}) }
# passing too many arguments should raise ArgumentError
g = JavaScript.global
ensure_raise(ArgumentError) { JavaScript.in?('a', g, g) }
g = nil


test("JavaScript::instance_of_constructor?")
# passing too few arguments should raise ArgumentError
g = JavaScript.global
ensure_raise(ArgumentError) { JavaScript.instance_of_constructor? }
ensure_raise(ArgumentError) { JavaScript.instance_of_constructor?(g) }
g = nil
#
js_eval('global.c1 = class {}')
js_eval('global.c2 = class {}')
js_eval('global.i = new global.c1')
c1 = JavaScript::Function.new(JSValue['c1'])
c2 = JavaScript::Function.new(JSValue['c2'])
i = JavaScript::Object.new(JSValue['i'])
ensure_result( JavaScript.instance_of_constructor?(i, c1) == true )
ensure_result( JavaScript.instance_of_constructor?(i, c2) == false )
js_eval("delete global.c1")
js_eval("delete global.c2")
js_eval("delete global.i")
# passing object argument that is not a JavaScript::Object should raise TypeError
js_eval('global.c = class {}')
c = JavaScript::Function.new(JSValue['c'])
ensure_raise(TypeError) { JavaScript.instance_of_constructor?({}, c) }
c = nil
# passing constructor argument that is not a JavaScript::Function
#   should raise TypeError
g = JavaScript.global
ensure_raise(TypeError) { JavaScript.instance_of_constructor?(g, {}) }
g = nil
# passing too many arguments should raise ArgumentError
g = JavaScript.global
ensure_raise(ArgumentError) { JavaScript.instance_of_constructor?(g, g, g) }
g = nil


test("JavaScript::method_missing")
# ensure module has been included by making a simple call
js_eval('global.f = a => a + 1')
ensure_result( JavaScript.f(2) == 3 )
js_eval("delete global.f")


test("JavaScript::set")
# passing too few arguments should raise ArgumentError
ensure_raise(ArgumentError) { JavaScript.set }
ensure_raise(ArgumentError) { JavaScript.set('a') }
# ensure we can set a propery of global
ensure_js_result('global.a === undefined')
ensure_result( JavaScript.set('a', 2) == 2 )
ensure_js_result('global.a === 2')
js_eval("delete global.a")
# passing too many arguments should raise ArgumentError
ensure_raise(ArgumentError) { JavaScript.set('a', 'b', 'c') }


test("JavaScript::type_of")
# passing too few arguments should raise ArgumentError
ensure_raise(ArgumentError) { JavaScript.type_of }
#
js_eval('global.n = 1')
n = JavaScript::Object.new(JSValue['n'])
ensure_result( JavaScript.type_of(n) == 'number' )
js_eval("delete global.n")
# passing argument that is not a JavaScript::Object should raise TypeError
ensure_raise(TypeError) { JavaScript.type_of({}) }
# passing too many arguments should raise ArgumentError
g = JavaScript.global
ensure_raise(ArgumentError) { JavaScript.type_of(g, g) }
g = nil


test("JavaScript::undefined")
#
ensure_result( JavaScript.undefined.is_a?(JavaScript::Undefined) )
# passing any arguments should raise ArgumentError
ensure_raise(ArgumentError) { JavaScript.undefined(1) }


test("JavaScript aliases")
ensure_result( JS == JavaScript )
ensure_result( ECMAScript == JavaScript )
ensure_result( ES == JavaScript )

puts("end-rb-java_script")