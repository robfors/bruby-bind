module JavaScript
  class BasicException < StandardError
    
    
    def initialize(object)
      @object = object
      message = nil
      case
      when @object.is_a?(Object) && @object.message.is_a?(String)
        message = @object.message
      when @object.is_a?(String)
        message = @object
      end
      super(message)
    end


    def js_value
      Convert.rb_to_js(@object)
    end

    
    def object
      @object
    end
    

  end
end
