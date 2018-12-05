BRubyBind.RubyError = class extends Error
{
  
  
  constructor(rb_value)
  {
    let rb_wrapper = new BRubyBind.RubyObject(rb_value);
    let message = rb_wrapper.message();
    super(message);
    // TODO: possibility set up stack
    this._rb_wrapper = rb_wrapper;
  }

  
  get name()
  {
    return this._rb_wrapper.class().name();
  }


  get rb_value()
  {
    return this._rb_wrapper.rb_value;
  }


  get ruby_object()
  {
    return this._rb_wrapper;
  }
  

  toString()
  {
    let string = "ruby error"
    string += "message: " + this._rb_wrapper.message() + "\n";
    string += "backtrace:\n  "
    string += this._rb_wrapper.backtrace().join("\n  ");
    return string;
  }


};