puts "start test..."


def fail
  puts "------ FAIL ------"
  nil
end


def pass
  puts "pass"
  nil
end


def test(message)
  # TODO: temp
  BRubyBridge::JSValue.global.call('forget_old_ruby_objects')
  puts "test: #{message}"
  nil
end


def ensure_result(result)
  if result == true
    pass
  else
    fail
  end
  nil
end


def ensure_result_not(result)
  ensure_result(result == false)
end


def ensure_raise(error_class)
  begin
    yield
  rescue error_class
    pass
  else
    fail
  end
end


def ensure_js_result(js_code, *js_values)
  js_code = "( #{js_code} ) === true"
  ensure_result(js_eval(js_code, *js_values).to_boolean)
end


def ensure_js_result_not(js_code, *js_values)
  js_code = "( #{js_code} ) === false"
  ensure_js_result(js_code, *js_values)
end


# def js_eval(js_code, *values)
#   raise TypeError, "js code must be a String" unless js_code.is_a?(String)
#   JavaScript.global.call('js_eval', js_code, *values)
# end


# def rb_eval(rb_code, *values)
#   value_names = values.map.with_index { |value, index| "v#{index}" }
#   proc = eval("Proc.new { |rb_code, #{value_names.join(', ')}| eval(rb_code) }")
#   r = proc.call(rb_code, *values)
# end

def js_eval(js_code, *values)
  raise TypeError, "js code must be a String" unless js_code.is_a?(String)
  key = BRubyBridge::JSValue.string("js_eval")
  js_code = BRubyBridge::JSValue.string(js_code)
  global = BRubyBridge::JSValue.global
  return_js = global.call(key, js_code, *values)
end


def rb_eval(rb_code, *values)
  value_names = values.map.with_index { |value, index| "v#{index}" }
  proc = eval("Proc.new { |rb_code, #{value_names.join(', ')}| eval(rb_code) }")
  r = proc.call(rb_code, *values)
end


# $main_object = self

# def rb_eval(rb_code, values)
#   $main_object.instance_eval do
#     eval(rb_code)
#   end
# end