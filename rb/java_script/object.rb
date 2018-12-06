module JavaScript
  class Object
    include BRubyBind::ConvertMeta
    extend BRubyBind::JSMethod
    include BRubyBind::DynamicJSMethod


    def self.backward_reference_key
      :@_bruby_bind_wrapper__backward_reference
    end


    def self.get_wrapper(js_value)
      js_value.instance_variable_get(backward_reference_key)
    end

    def self.set_wrapper(js_value, js_wrapper)
       js_value.instance_variable_set(backward_reference_key, js_wrapper)
      nil
    end


    def initialize(js_value)
      raise TypeError unless js_value.is_a?(BRubyBridge::JSValue)
      @js_value = js_value
    end

    
    declare_js_method :call


    declare_js_method :delete
    

    declare_js_method :equal_js?


    declare_js_method :get
    alias_method :[], :get


    alias_dynamic_method :has_own_property?, :hasOwnProperty


    declare_js_method :has?


    declare_js_method :in?, :in


    declare_js_method :instance_of_constructor?, :instanceof

    
    attr_reader :js_value


    declare_js_method :not_equal_js?


    declare_js_method :set
    alias_method :[]=, :set


    declare_js_method :strictly_equal?

    
    declare_js_method :strictly_not_equal?


    def this_object
      self
    end
    

    def to_h
      raise NotImplementedError
    end


    declare_js_method :type_of, :typeof

    
  end
end
