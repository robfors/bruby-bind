module BRubyBind
  module DynamicJSMethod
    
    
    def method_missing(method_name, *arguments, &block)
      result = parse_method_name(method_name)
      super unless result[:valid]
      arguments << block if block_given?
      case result[:action]
      when :get
        property = get(result[:key])
        if property.is_a?(JavaScript::Function)
          property.invoke_with_context(this_object, *arguments)
        else
          raise ArgumentError, "no arguments can be passed to getter" if arguments.any?
          property
        end
      when :set
        set(result[:key], arguments.first)
      else
        raise
      end
    end


    def respond_to_missing?(method_name, include_private = false)
      result = parse_method_name(method_name)
      super unless result[:valid]
      this_object.has?(result[:key])
    end


    def parse_method_name(method_name)
      method_name = method_name.to_s
      match = /^(?<key>[^=]+)(?<assignment>=?)$/.match(method_name)
      result = {}
      if match
        result[:valid] = true
        result[:key] = match[:key]
        result[:action] = match[:assignment].empty? ? :get : :set
      else
        result[:valid] = false
      end
      result
    end


  end
end
