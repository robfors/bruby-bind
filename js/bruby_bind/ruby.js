(function() {
  
  let RubyObject = BRubyBind.RubyObject;

  let ruby_backend = {
    
    eval(rb_code)
    {
      let rb_wrapper = BRubyBind.Convert.convert_call( () => BRubyBridge.RbValue.eval(rb_code) );
      return rb_wrapper;
    },

    _get(property_name)
    {
      // search for constant in Object
      if (property_name in this.Object)
        return this.Object[property_name];
      // search for method of main in Kernel
      if (property_name in this.Kernel)
        return this.Kernel[property_name];
      // search for global variable
      if (this._global_variable_exists(property_name))
        return this.Kernel.send('global_variable_get', property_name);
      throw new ReferenceError('no method, constant or global variable exists with that name');
    },

    _global_variable_exists(name)
    {
      return this.eval('$' + name + ' != nil');
    },

    _has(property_name)
    {
      // search for constant in Object then
      //   method of main in Kernel then
      //   global variable
      return property_name in this.Object ||
             property_name in this.Kernel ||
             this._global_variable_exists(property_name);
    },
        
    _set(property_name, new_value)
    {
      let is_constant = (property_name[0] !== property_name[0].toLowerCase());
      if (is_constant)
      {
        // set constant to Object
        this.Object[property_name] = new_value;
        return true;
      }
      let method_exists = this.Kernel.send('respond_to?', property_name + '=');
      if (method_exists)
      {
        // call assignment method of main by calling it in Kernel
        this.Kernel[property_name] = new_value;
        return true;
      }
      // assume a global variable is desired
      this.Kernel.send('global_variable_set', property_name, new_value);
      return true;
    },
    
  }
  ruby_backend.Object = ruby_backend.eval('Object');
  ruby_backend.Kernel = ruby_backend.eval('Kernel');
  

  let target = {backend: ruby_backend};
  let wrapper = new Proxy(target, RubyObject.proxy_handlers());
  BRubyBind.Ruby = wrapper;

})();

Ruby = BRubyBind.Ruby;