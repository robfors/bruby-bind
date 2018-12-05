class Module

  
  def alias_singleton_method(new_method_name, existing_method_name)
    singleton_class.send(:alias_method, new_method_name, existing_method_name)
    nil
  end


  def singleton_attr_reader(*args)
    singleton_class.class_eval { attr_reader(*args) }
  end


  def singleton_attr_writer(*args)
    singleton_class.class_eval { attr_writer(*args) }
  end


  def singleton_attr_accessor(*args)
    singleton_class.class_eval { attr_accessor(*args) }
  end

  def alias_dynamic_method(new_method_name, existing_method_name)
    define_method(new_method_name) do |*arguments, &block|
      self.send(existing_method_name, *arguments, &block)
    end
  end


end