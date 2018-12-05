BRubyBind.RubyInteger = class
{
  

  constructor(value)
  {
    let integer = parseInt(value);
    if (isNaN(integer))
      throw 'Parameter is not a number!';
    // TODO: add type check to ensure argument is an integer (and not a float) 
    this._value = integer;
  }
  

  get value()
  {
    return this._value;
  }

  
};