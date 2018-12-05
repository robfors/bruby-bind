BRubyBind.RubyFloat = class
{
  

  constructor(value)
  {
    let float = parseFloat(value);
    if (isNaN(float))
      throw 'Parameter is not a number!';
    this._value = float;
  }
  
  
  get value()
  {
    return this._value;
  }

  
};