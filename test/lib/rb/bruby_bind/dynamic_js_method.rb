JSValue =  BRubyBridge::JSValue

puts "start-rb-bruby_bind-dynamic_js_method"


test("BRubyBind::DynamicJSMethod#method_missing")
# set a property
JavaScript.global.a = 1
ensure_js_result('global.a === 1')
js_eval('delete global.a')
# get a property
js_eval('global.a = 2')
ensure_result( JavaScript.global.a == 2 )
js_eval('delete global.a')
# passing argumnets when getting a property should raise ArgumentError
js_eval('global.a = 2')
ensure_raise(ArgumentError) { JavaScript.global.a(1) }
js_eval('delete global.a')
# call a property
js_eval('global.a = () => 3')
ensure_result( JavaScript.global.a == 3 )
js_eval('delete global.a')
# call a property with arguments
js_eval('global.a = (b, c) => b + c')
ensure_result( JavaScript.global.a(4, 5) == 9 )
js_eval('delete global.a')


test("BRubyBind::DynamicJSMethod#respond_to_missing?")
#
js_eval('global.a = 1')
ensure_result( JavaScript.global.respond_to?('a') )
ensure_result( JavaScript.global.respond_to?('a=') )
ensure_result_not( JavaScript.global.respond_to?('b') )
ensure_result_not( JavaScript.global.respond_to?('b=') )
js_eval('delete global.a')


puts("end-rb-bruby_bind-dynamic_js_method")