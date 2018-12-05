BRubyBind.RubyClass = class extends BRubyBind.RubyInvocableObject
{
  
  
  _construct(args)
  {
    let return_value = this.send('new', ...args);
    if (typeof return_value != 'object' && typeof return_value != 'function')
      throw new TypeError("can not return a non-object value from a Proxy construct handler" +
                          "try calling send('new') instead");
    return return_value;
  }

  
};