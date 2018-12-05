(function(){

  let RbValue = BRubyBridge.RbValue;
  let ArgumentError = BRubyBind.ArgumentError;


  BRubyBind.RubyObject = class
  {


    // private
    static get_wrapper(rb_value)
    {
      return rb_value[this._backward_reference_key];
    }
    

    // private
    static _key_is_method_name(key)
    {
      return typeof key == 'string';
    }


    // private
    static _new_proxy_target()
    {
      return new Object;
    }


    // private
    static _proxy_get(target, key)
    {
      let backend = target.backend;
      if (backend[key] === undefined && this._key_is_method_name(key))
        return backend._get(key);
      else
        return backend[key];
    }


    // private
    static _proxy_getPrototypeOf(target)
    {
      return Object.getPrototypeOf(target.backend);
    }


    // private
    static _proxy_handlers()
    {
      return {
        get: this._proxy_get.bind(this),
        getPrototypeOf: this._proxy_getPrototypeOf.bind(this),
        has: this._proxy_has.bind(this),
        set: this._proxy_set.bind(this),
      }
    }


    // private
    static _proxy_has(target, key)
    {
      let backend = target.backend;
      if (key in backend)
        return true;
      if (this._key_is_method_name(key))
        return backend._has(key);
      return false;
    }


    // private
    static _proxy_set(target, key, new_value)
    {
      let backend = target.backend;
      if(backend[key] === undefined && this._key_is_method_name(key))
        return backend._set(key, new_value);
      backend[key] = new_value;
      return true;
    }
    

    // private
    static set_wrapper(rb_value, rb_wrapper)
    {
      rb_value[this._backward_reference_key] = rb_wrapper;
    }


    constructor(rb_value, proxy)
    {
      if (arguments.length == 1 && rb_value instanceof BRubyBridge.RbValue)
      {
        let target = this.constructor._new_proxy_target();
        let handlers = this.constructor._proxy_handlers();
        let proxy = new Proxy(target, handlers);
        let ruby_object = new this.constructor(rb_value, proxy);
        target.backend = ruby_object;
        return proxy;
      }
      else if (arguments.length == 2 && rb_value instanceof BRubyBridge.RbValue)
      {
        this._rb_value = rb_value;
        this._proxy = proxy;
        this._active = true;
        this._method_cache = new Map();
      }
      else
        throw new Error('do not call this constructor directly');
    }


    // private
    _ensure_active()
    {
      if (!this._active)
        throw new BRubyBind.StaleRubyObjectReference();
    }
    

    // TODO: replace with js finalizer when available
    // forget()
    // {
    //if (arguments.length != 0)
    //    throw new ArgumentError('no arguments expected');
    //   Module.RbObject.forget(this.proxy);
    //   this.active = false;
    // }


    // private
    _get(property_name)
    {
      let is_constant = (property_name[0] !== property_name[0].toLowerCase());
      if (is_constant)
      {
        if (this.send('respond_to?', 'const_get'))
          return this.send('const_get', property_name);
        else
          throw new TypeError('this ruby object type can not have constants');
      }
      else
        if (this.send('respond_to?', property_name))
          return this._get_method(property_name);
        else
        {
          let error_message = "undefined method '" + property_name + "'";
          let error_rb = RbValue.get('NoMethodError').send('new', RbValue.string(error_message));
          let raise_func = () => RbValue.Kernel.send('raise', error_rb);
          BRubyBind.Convert.convert_call(raise_func);
        }
    }


    // private
    _get_method(method_name)
    {
      if (this._method_cache.has(method_name))
        return this._method_cache.get(method_name);
      else
      {
        let new_method = new BRubyBind.RubyMethod(this._proxy, method_name);
        this._method_cache.set(method_name, new_method);
        return new_method;
      }
    }


    // private
    _has(property_name)
    {
      let is_constant = (property_name[0] !== property_name[0].toLowerCase());
      if (is_constant)
      {
        if (this.send('respond_to?', 'const_get'))
          return this.send('const_defined?', property_name);
        else
          throw new TypeError('this ruby object type can not have constants');
      }
      else
        return this.send('respond_to?', property_name);
    }


    // public
    get rb_value()
    {
      if (arguments.length != 0)
        throw new ArgumentError('no arguments expected');
      return this._rb_value;
    }


    // public
    send(method_name, ...args)
    {
      if (arguments.length < 1)
        throw new ArgumentError('expected a method_name argument');
      this._ensure_active();
      if (typeof method_name == 'string')
        method_name = method_name;
      else if (typeof method_name == 'object' && method_name instanceof String)
        method_name = method_name.toString();
      else
       throw new TypeError('method_name must be a string or String');
      let send_func = (...args) => this._rb_value.send(method_name, ...args);
      return BRubyBind.Convert.convert_call(send_func, ...args);
    }


    // private
    _set(property_name, new_value)
    {
      let is_constant = (property_name[0] !== property_name[0].toLowerCase());
      if (is_constant)
      {
        if (this.send('respond_to?', 'const_set'))
          this.send('const_set', property_name, new_value);
        else
          throw new TypeError('this ruby object type can not have constants');
      }
      else
      {
        property_name += '=';
        this.send(property_name, new_value);
      }
      return true;
    }

    
  }
  BRubyBind.RubyObject._backward_reference_key = Symbol();
  
  // make public so they can be used by BRubyBind.Ruby
  BRubyBind.RubyObject.proxy_handlers = BRubyBind.RubyObject._proxy_handlers;

  // TODO: add other proxy handlers


})();