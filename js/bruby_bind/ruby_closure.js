BRubyBind.RubyClosure = class extends BRubyBind.RubyInvocableObject
{
  

  _apply(args)
  {
    return this.send('to_proc').send('call', ...args);
  }
  

};