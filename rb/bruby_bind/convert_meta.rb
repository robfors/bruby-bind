module BRubyBind
  module ConvertMeta

    
    def self.included(base)
      base.send(:include, InstanceMethods)
      base.extend(ClassMethods)
    end


    module ClassMethods
      
      def convert_method(method_name)
        old_method = instance_method(method_name)
        define_method(method_name) do |*arguments_rb|
          convert_call(*arguments_rb) do |*arguments_js|
            return_js = old_method.bind(self).call(*arguments_js)
          end
        end
      end

      def convert_singleton_method(method_name)
        old_method = singleton_method(method_name)
        define_singleton_method(method_name) do |*arguments_rb|
          convert_call(*arguments_rb) do |*arguments_js|
            reutrn_js = old_method.bind(self).call(*arguments_js)
          end
        end
      end

      def convert_call(*arguments)
        arguments_js = arguments.map { |argument| Convert.rb_to_js(argument) }
        begin
          return_js = yield(*arguments_js)
          return Convert.js_to_rb(return_js)
        rescue BRubyBridge::JSError => error
         js_value = error.js_value
         error_rb = nil
         if js_value.typeof == 'object' && js_value.has?('rb_value') # error originally thrown in rb
           error_rb = js_value['rb_value']
         else # error originally thrown in js
           error_rb = Convert.js_to_rb(js_value)
           unless error_rb.is_a?(JavaScript::Error) # js error is not an instance of js Error
            error_rb = JavaScript::BasicException.new(error_rb)
          end
         end
         raise error_rb
        end
      end
    
    end


    module InstanceMethods

      def convert_call(*args, &block)
        self.class.convert_call(*args, &block)
      end

    end
  

  end
end