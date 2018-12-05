JSValue =  BRubyBridge::JSValue
Convert = BRubyBind::Convert

puts "start-rb-bruby_bind-convert"


test("BRubyBind::Convert#js_to_rb")
# passing a rb object should return the rb object
ensure_result( Convert.js_to_rb(nil) == nil )
# passing js undefined should return rb nil
ensure_result( Convert.js_to_rb(JSValue.undefined) == nil )
# passing js null should return rb nil
ensure_result( Convert.js_to_rb(JSValue.null) == nil )
# passing js false should return rb false
ensure_result( Convert.js_to_rb(JSValue.false) == false )
# passing js true should reutrn rb true
ensure_result( Convert.js_to_rb(JSValue.true) == true )
# passing a js number rounded to integer should return an equal rb Integer
n = Convert.js_to_rb(JSValue.number(1.0))
ensure_result( n.is_a?(Integer) )
ensure_result( n == 1 )
n = nil
# passing a js number with a non zero decimal value should return an equal rb Float
n = Convert.js_to_rb(JSValue.number(1.5))
ensure_result( n.is_a?(Float) )
ensure_result( n == 1.5 )
n = nil
# passing a js string should return an equal rb String
ensure_result( Convert.js_to_rb(JSValue.string('a')) == 'a' )
# passing a place holder for a rb Symbol should return an equal rb Symbol
v = JSValue["BRubyBind.RubySymbol"].new(JSValue.string('a'))
ensure_result( Convert.js_to_rb(v) == :a )
v = nil
# passing a place holder for a rb Float should return an equal rb Float
v = JSValue["BRubyBind.RubyFloat"].new(JSValue.number(1))
o = Convert.js_to_rb(v)
ensure_result( o.is_a?(Float) )
ensure_result( o == 1.0 )
v, o = nil
# passing a place holder for a rb Integer should return an equal rb Integer
v = JSValue["BRubyBind.RubyInteger"].new(JSValue.number(1.9))
o = Convert.js_to_rb(v)
ensure_result( o.is_a?(Integer) )
ensure_result( o == 1 )
v, o = nil
# passing a js object that has a rb_value property should return that RbValue
v = Object.new
w = JSValue["BRubyBind.RubyObject"].new(v)
r = Convert.js_to_rb(w)
ensure_result( r == v )
v, w, r = nil
# passing a js object that alrady has a JSWrapper built for it should
#   return the previously built JSWrapper
v = JSValue['Object'].new
w1 = Convert.js_to_rb(v)
ensure_result( w1.is_a?(JavaScript::Object) )
w2 = Convert.js_to_rb(v)
ensure_result( w2.equal?(w1) )
v, w1, w2 = nil
# passing js Error should return rb JavaScipt::Error 
w = Convert.js_to_rb(JSValue['Error'])
ensure_result( w.equal?(JavaScript::Error) )
w = nil
# passing a js subclass of Error should return a rb subclass of JavaScipt::Error 
v = JSValue.global['ReferenceError']
JSValue.global.set('tt', v)
w = Convert.js_to_rb(v)
ensure_result( w < JavaScript::Error )
ensure_result( w.js_value == v )
w = nil
# passing a js instance of Error should return an rb instance of JavaScipt::Error
v = JSValue['Error'].new
w = Convert.js_to_rb(v)
ensure_result( w.instance_of?(JavaScript::Error) )
ensure_result( w.js_value == v )
v, w = nil
# passing a js instance of a subclass of Error
#   should return a rb instance a subclass of JavaScipt::Error
v = JSValue['TypeError'].new
w = Convert.js_to_rb(v)
ensure_result_not( w.instance_of?(JavaScript::Error) )
ensure_result( w.is_a?(JavaScript::Error) )
ensure_result( w.js_value == v )
v, w = nil
# passing a js function should reutrn a JavaScript::Function
v = JSValue['Function'].new
w = Convert.js_to_rb(v)
ensure_result( w.is_a?(JavaScript::Function) )
ensure_result( w.js_value == v )
v, w = nil
# passing any other js object should reutrn a JavaScript::Object
v = JSValue['Object'].new
w = Convert.js_to_rb(v)
ensure_result( w.is_a?(JavaScript::Object) )
ensure_result( w.js_value == v )
v, w = nil


test("BRubyBind::Convert#rb_to_js")
# passing rb nil should return a js value of null
ensure_result( Convert.rb_to_js(nil).null? )
# passing rb true should return a js value of true
ensure_result( Convert.rb_to_js(true).true? )
# the reminding possibilities will be tested on the js side


puts("end-rb-bruby_bind-convert")