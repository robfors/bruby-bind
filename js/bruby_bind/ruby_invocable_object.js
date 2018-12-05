BRubyBind.RubyInvocableObject = class extends BRubyBind.RubyObject
{
  

  static _new_proxy_target()
  {
    return new Function;
  }


  // private
  static _proxy_apply(target, this_argument, argument_list)
  {
    return target.backend._apply(argument_list);
  }


  // private
  static _proxy_construct(target, argument_list, new_target)
  {
    return target.backend._construct(argument_list);
  }


  static _proxy_handlers()
  {
    let handlers = {
      apply: this._proxy_apply.bind(this),
      construct: this._proxy_construct.bind(this),
    }
    Object.assign(handlers, super._proxy_handlers());
    return handlers;
  }


  _apply(args)
  {
    throw new TypeError('this type of Ruby object can not be invoked');
  }


  _construct(args)
  {
    throw new TypeError('this type of Ruby object can not construct an instance');
  }


};