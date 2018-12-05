module BRubyBind
  module Convert
    include BRubyBridge

    
    def self.rb_to_js(object_rb)
      JSValue["BRubyBind.Convert"].call("rb_to_js", object_rb)
    end


    def self.js_to_rb(object_js)
      return object_js unless object_js.is_a?(JSValue)
      
      case

      # should never get RbWrapper
      #when object_js.is_rb_object?
      #  raise

      # auxiliary mappings

      # ...

      # primitive values
      
      when object_js.undefined?
        return nil
      when object_js.null?
        return nil
      when object_js.false?
        return false
      when object_js.true?
        return true
      when object_js.number?
        is_integer = JSValue["Number"].call("isInteger", object_js).to_boolean
        if is_integer
          return object_js.to_integer
        else
          return object_js.to_float
        end
      when object_js.string?
        return object_js.to_string

      # rb type place holders
      # rb Symbol
      when object_js.instanceof(JSValue["BRubyBind.RubySymbol"])
        return object_js["value"].to_symbol
      # rb Float
      when object_js.instanceof(JSValue["BRubyBind.RubyFloat"])
        return object_js["value"].to_float
      # rb Integer
      when object_js.instanceof(JSValue["BRubyBind.RubyInteger"])
        return object_js["value"].to_integer
      # TODO rb Array
      
      # rb wrapper
      when object_js.has?('rb_value')
        return object_js['rb_value']

      # native js object
      else
        # existing js wrapper (in rb)
        js_wrapper = JavaScript::Object.get_wrapper(object_js)
        return js_wrapper if js_wrapper

        js_wrapper = case
        # TODO js Array
        # js error class
        when object_js["prototype"].instanceof(JSValue["Error"]) || object_js == JSValue["Error"]
          JavaScript::Error.new_class(object_js)
        # js error
        when object_js.instanceof(JSValue["Error"])
          JavaScript::Error.new_error(object_js)
        # js Function
        when object_js.typeof == 'function'
          JavaScript::Function.new(object_js)
        # any other js object
        else
          JavaScript::Object.new(object_js)
        end
        JavaScript::Object.set_wrapper(object_js, js_wrapper)
        return js_wrapper
      end
    end

    
  end
end