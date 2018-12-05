BRubyBind.RubyMethod = class
{
  constructor(ruby_object, method_name)
  {
    let ruby_method = function (...args)
    {
      return ruby_object.send(method_name, ...args);
    };
    
    return ruby_method;
  }
};
