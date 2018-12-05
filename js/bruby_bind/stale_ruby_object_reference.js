BRubyBind.StaleRubyObjectReference = class extends Error
{
  constructor(...args)
  {
    super(...args);
    if (typeof Error.captureStackTrace === 'function')
      Error.captureStackTrace(this, this.constructor);
    else
      this.stack = (new Error(this.message)).stack;
  }
};




//throw new StaleRubyObjectReference();
