JSValue =  BRubyBridge::JSValue

puts "start-rb-java_script-object"


test("JavaScript::Object#[]")
#
js_eval("global.a = 'abc'")
ensure_result( JavaScript.global['a'] == 'abc' )
js_eval('delete global.a')


test("JavaScript::Object#[]=")
#
ensure_js_result('global.a === undefined')
ensure_result( (JavaScript.global['a'] = 1) == 1 )
ensure_js_result('global.a === 1')
js_eval('delete global.a')


test("JavaScript::Object#call")
#
js_eval('global.f = n => n + 1')
ensure_result( JavaScript.global.call('f', 1) == 2 )
js_eval('delete global.f')
# ensure errors are passed up
js_eval('global.e = new TypeError')
js_eval("global.a = {t(){ throw global.e }}")
a = JavaScript::Object.new(JSValue['a'])
begin
  a.call('t')
  fail
rescue Exception => e
  ensure_result( e.is_a?(JavaScript::Error) )
  ensure_result( e.class.js_value == JSValue['TypeError'] )
  ensure_result( e.js_value == JSValue['e'] )
end
js_eval('delete global.e')
js_eval('delete global.t')
a = nil


test("JavaScript::Object#delete")
#
js_eval('global.v = true')
ensure_js_result('global.v === true')
ensure_result( JavaScript.global.delete('v') == true )
ensure_js_result('global.v === undefined')


test("JavaScript::Object#equal_js?")
#
js_eval('global.a = {}')
js_eval('global.b = global.a')
js_eval('global.c = {}')
a = JavaScript::Object.new(JSValue['a'])
b = JavaScript::Object.new(JSValue['b'])
c = JavaScript::Object.new(JSValue['c'])
ensure_result( a.equal_js?(b) )
ensure_result_not( a.equal_js?(c) )
js_eval('delete global.a')
js_eval('delete global.b')
js_eval('delete global.c')
a, b, c = nil


test("JavaScript::Object#get")
#
js_eval("global.a = 'abc'")
ensure_result( JavaScript.global.get('a') == 'abc' )
js_eval('delete global.a')
# ensure errors are passed up
js_eval('global.e = new TypeError')
js_eval("global.a = {get t(){ throw global.e }}")
a = JavaScript::Object.new(JSValue['a'])
begin
  a.get('t')
  fail
rescue Exception => e
  ensure_result( e.is_a?(JavaScript::Error) )
  ensure_result( e.class.js_value == JSValue['TypeError'] )
  ensure_result( e.js_value == JSValue['e'] )
end
js_eval('delete global.e')
js_eval('delete global.t')
a = nil


test("JavaScript::Object#has_own_property?")
#
js_eval("global.a = {b:2}")
a = JavaScript::Object.new(JSValue['a'])
ensure_result( a.has_own_property?('b') == true )
ensure_result_not( a.has_own_property?('a') == true )
js_eval('delete global.a')
a = nil


test("JavaScript::Object#has?")
#
js_eval("global.a = {b:2}")
a = JavaScript::Object.new(JSValue['a'])
ensure_result( a.has_own_property?('b') == true )
ensure_result_not( a.has_own_property?('a') == true )
js_eval('delete global.a')
a = nil


test("JavaScript::Object#in?")
#
js_eval("global.k1 = Symbol()")
js_eval("global.k2 = Symbol()")
js_eval("global.o = {[k1]:2}")
k1 = JavaScript::Object.new(JSValue['k1'])
k2 = JavaScript::Object.new(JSValue['k2'])
o = JavaScript::Object.new(JSValue['o'])
ensure_result( k1.in?(o) )
ensure_result_not( k2.in?(o) )
js_eval('delete global.k1')
js_eval('delete global.k2')
js_eval('delete global.o')
k1, k2, o = nil


test("JavaScript::Object#instance_of_constructor?")
#
js_eval("global.c1 = class {}")
js_eval("global.c2 = class {}")
js_eval("global.i = new c1")
c1 = JavaScript::Object.new(JSValue['c1'])
c2 = JavaScript::Object.new(JSValue['c2'])
i = JavaScript::Object.new(JSValue['i'])
ensure_result( i.instance_of_constructor?(c1) )
ensure_result_not( i.instance_of_constructor?(c2))
js_eval('delete global.c1')
js_eval('delete global.c2')
js_eval('delete global.i')
c1, c2, i = nil


test("JavaScript::Object#js_value")
#
g = JSValue.global
ensure_result( JavaScript::Object.new(g).js_value == g )
g = nil


test("JavaScript::Object#method_missing")
# ensure module has been included by making a simple call
js_eval('global.f = a => a + 1')
g = JavaScript::Object.new(JSValue.global)
ensure_result( g.f(2) == 3 )
js_eval("delete global.f")
g = nil


test("JavaScript::Object#not_equal_js?")
#
js_eval('global.a = {}')
js_eval('global.b = global.a')
js_eval('global.c = {}')
a = JavaScript::Object.new(JSValue['a'])
b = JavaScript::Object.new(JSValue['b'])
c = JavaScript::Object.new(JSValue['c'])
ensure_result( a.not_equal_js?(c) )
ensure_result_not( a.not_equal_js?(b) )
js_eval('delete global.a')
js_eval('delete global.b')
js_eval('delete global.c')
a, b, c = nil


test("JavaScript::Object#set")
#
ensure_js_result('global.a === undefined')
ensure_result( JavaScript.global.set('a', 1) == 1 )
ensure_js_result('global.a === 1')
js_eval('delete global.a')
# ensure errors are passed up
js_eval('global.e = new TypeError')
js_eval("global.a = {set t(v){ throw global.e }}")
a = JavaScript::Object.new(JSValue['a'])
begin
  a.set('t', 1)
  fail
rescue Exception => e
  ensure_result( e.is_a?(JavaScript::Error) )
  ensure_result( e.class.js_value == JSValue['TypeError'] )
  ensure_result( e.js_value == JSValue['e'] )
end
js_eval('delete global.e')
js_eval('delete global.t')
a = nil


test("JavaScript::Object#strictly_equal?")
#
js_eval('global.a = {}')
js_eval('global.b = global.a')
js_eval('global.c = {}')
a = JavaScript::Object.new(JSValue['a'])
b = JavaScript::Object.new(JSValue['b'])
c = JavaScript::Object.new(JSValue['c'])
ensure_result( a.strictly_equal?(b) )
ensure_result_not( a.strictly_equal?(c) )
js_eval('delete global.a')
js_eval('delete global.b')
js_eval('delete global.c')
a, b, c = nil


test("JavaScript::Object#strictly_not_equal?")
#
js_eval('global.a = {}')
js_eval('global.b = global.a')
js_eval('global.c = {}')
a = JavaScript::Object.new(JSValue['a'])
b = JavaScript::Object.new(JSValue['b'])
c = JavaScript::Object.new(JSValue['c'])
ensure_result( a.strictly_not_equal?(c) )
ensure_result_not( a.strictly_not_equal?(b) )
js_eval('delete global.a')
js_eval('delete global.b')
js_eval('delete global.c')
a, b, c = nil


test("JavaScript::Object#type_of")
#
js_eval('global.a = 1')
a = JavaScript::Object.new(JSValue['a'])
ensure_result( a.type_of == 'number' )
js_eval('delete global.a')
a = nil


puts("end-rb-java_script-object")