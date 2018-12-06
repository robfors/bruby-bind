module JavaScript
  include BRubyBind::ConvertMeta
  extend BRubyBind::DynamicJSMethod
  

  # public
  def self.call(*args)
    global.call(*args)
  end
  

  # public
  # warn: performance losses
  def self.eval(code)
    raise TypeError, 'code must be a String' unless code.is_a?(String)
    global.call('eval', code)
  end
  
  
  # public
  def self.get(property_path)
    convert_call { BRubyBridge::JSValue.get(property_path) }
  end
  alias_singleton_method :[], :get


  # public
  def self.global
    convert_call { BRubyBridge::JSValue.global }
  end
  alias_singleton_method :window, :global
  
  
  # public
  def self.in?(key, object)
    raise TypeError, "must pass JavaScript::Object" unless object.is_a?(Object)
    convert_call(key, object) { |key, object| key.in(object) }
  end
  

  # public
  def self.instance_of_constructor?(object, constructor)
    unless object.is_a?(Object)
      raise TypeError, "passed object must be a JavaScript::Object"
    end
    unless constructor.is_a?(Function)
      raise TypeError, "passed object must be a JavaScript::Function"
    end
    object.instance_of_constructor?(constructor)
  end
  

  # public
  def self.set(key, value)
    global.set(key, value)
  end
  alias_singleton_method :[]=, :set
  

  # perivate
  def self.this_object
    global
  end


  # public
  def self.type_of(object)
    raise TypeError, "must pass JavaScript::Object" unless object.is_a?(Object)
    object.type_of
  end


  # public
  def self.undefined
    Undefined.new
  end
  
end


# aliases
# reference by desired dialect
JS ||= JavaScript
ECMAScript ||= JavaScript
ES ||= JavaScript
