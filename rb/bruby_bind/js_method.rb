module BRubyBind
  module JSMethod
    
    
    def declare_js_method(method_name, original_method_name = nil)
      raise TypeError unless method_name.is_a?(Symbol) || method_name.is_a?(String)
      method_name = method_name.to_s
      if original_method_name
        raise TypeError unless original_method_name.is_a?(Symbol) || original_method_name.is_a?(String)
        original_method_name = original_method_name.to_s
      else
        original_method_name = method_name
      end
      
      method_proc = Proc.new do |*arguments|
        @js_value.send(original_method_name, *arguments)
      end

      define_method(method_name, &method_proc)
      convert_method(method_name)

      nil
    end


  end
end
