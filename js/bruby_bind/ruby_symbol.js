BRubyBind.RubySymbol = class
{
  
  constructor(value)
  {
    this._value = String(value);
  }
  
  get value()
  {
    return this._value;
  }
  
};
