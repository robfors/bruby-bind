(function()
{

  let RbValue = BRubyBridge.RbValue;


  BRubyBind.Convert = class
  {

    static convert_call(func, ...args)
    {
      let args_rb = args.map(arg => this.js_to_rb(arg));
      try
      {
        let return_rb = func(...args_rb);
        return this.rb_to_js(return_rb);
      }
      catch (error)
      {
        if (error instanceof BRubyBridge.RbError)
        {
          let rb_value = error.rb_value;
          let error_js;
          if (rb_value.responds_to('js_value')) // error originally thrown in js
            error_js = rb_value.send('js_value');
          else // error originally thrown in rb
            error_js = this.rb_to_js(rb_value);
          throw error_js;
        }
        else
          throw error;
      }
    }


    static rb_to_js(object_rb)
    {
      if (!(object_rb instanceof RbValue))
        return object_rb;

      // auxiliary mappings

      // ...


      // primitive values

      if (object_rb.equal_to(RbValue.nil))
        return null;
      if (object_rb.equal_to(RbValue.false))
        return false;
      if (object_rb.equal_to(RbValue.true))
        return true;
      if (object_rb.is_a('Numeric') || object_rb.responds_to('to_int'))
        return object_rb.to_number();
      if (object_rb.is_a('String') || object_rb.is_a('Symbol') || object_rb.responds_to('to_str'))
        return object_rb.to_string();

      // js type place holders

      if (object_rb.is_a('JavaScript::Undefined'))
        return undefined;

      // TODO JSSymbol
      // TODO JSArray

      // js wrapper
      // JavaScript::Function
      // JavaScript::Exception
      // JavaScript::Object
      // TODO: list all
      if (object_rb.responds_to('js_value'))
        return object_rb.send('js_value');

      // native rb object

      // existing rb wrapper (in js)
      let rb_wrapper = BRubyBind.RubyObject.get_wrapper(object_rb);
      if (rb_wrapper)
        return rb_wrapper;

      let wrapper_class_name;
      // Method, Proc
      if (object_rb.responds_to('to_proc'))
        wrapper_class_name = 'RubyClosure';
      // Class
      else if (object_rb.responds_to('new'))
        wrapper_class_name = 'RubyClass';
      // Exception
      else if (object_rb.responds_to('exception'))
        wrapper_class_name = 'RubyError';
      // rb Object
      else
        wrapper_class_name = 'RubyObject';
      
      let rb_wrapper_class = BRubyBind[wrapper_class_name];
      rb_wrapper = new rb_wrapper_class(object_rb);
      BRubyBind.RubyObject.set_wrapper(object_rb, rb_wrapper);

      return rb_wrapper;
    }


    static js_to_rb(object_js)
    {
      return RbValue.get('BRubyBind::Convert').send('js_to_rb', object_js);
    }


  }
  


})();
