module JavaScript
  class Error < StandardError
    include BRubyBind::ConvertMeta

    
    @js_value = BRubyBridge::JSValue['Error']

    #def ==(other_object)
    #  message == other_object.message &&
    #  self.class == other_object.class &&
    #  backtrace == other_object.backtrace
    #end


    # public
    def self.exception(message = nil)
      case message
      when nil
        error_js = convert_call { @js_value.new }
      when String
        error_js = convert_call(message) { |message_js| @js_value.new(message_js) }
      else
        raise TypeError, 'a given message must be a String'
      end
    end

    
    # public
    singleton_attr_accessor :js_value


    # private
    def self.new_class(js_value)
      return self if js_value == @js_value
      klass = Class.new(self)
      klass.js_value = js_value
      klass
    end


    # private
    def self.new_error(js_value)
      klass = BRubyBind::Convert.js_to_rb(js_value['constructor'])
      klass.new(js_value)
    end


    def initialize(js_value)
      @js_wrapper = Function.new(js_value)
      message = @js_wrapper.message
      super(message)
    end


    # public
    def backtrace
      stack = []
      stack_frames = JavaScript.ErrorStackParser.parse(@js_wrapper).js_value.to_array
      stack = stack_frames.map do |item|
        line = ""
        if item_js.has?("fileName")
          line += item["fileName"]
        else
          line += "<anonymous>"
        end
        line += ":"
        line += item["lineNumber"].to_s
        if item_js.has?("functionName")
          line += ": in `#{item["functionName"]}"
        else
          line += "."
        end
        line
      end
      stack
    end
    

    # public
    def backtrace_locations
      raise NotImplementedError
    end

    
    #TODO: we could assign a function to window.onerror to track last js error
    # public
    def cause
      raise NotImplementedError
    end

    
    # public
    def exception(message = nil)
      case message
      when nil, self.message
        self
      when String
        self.class.exception(message)
      else
        raise TypeError, 'a given message must be a String'
      end
    end

    
    # public
    #full_message
    
    
    # public
    #inspect


    # public
    def java_script_object
      @js_wrapper
    end


    # public
    def js_value
      @js_wrapper.js_value
    end


    # public
    def set_backtrace(new_backtrace)
      # ignore new backtrace
    end

    
    # public
    #to_s
    

  end
end
