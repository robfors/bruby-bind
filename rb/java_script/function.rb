module JavaScript
  class Function < Object
  
    
    def invoke(*arguments)
      invoke_with_context(JavaScript.undefined, *arguments)
    end
    
    
    def invoke_with_context(this, *arguments)
      @js_value.call('call', this, *arguments)
    end
    convert_method :invoke_with_context
    
    
    def to_prcc
      Object.new
    end

        # def to_proc
    #   Proc.new { |*arguments| invoke(*arguments) }
    # end
    
    
    #def to_lambda # can we add this?
    #end
    
  end
end
