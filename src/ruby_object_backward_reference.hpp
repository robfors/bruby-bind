#ifndef _ESRUBY_BIND_RUBY_OBJECT_BACKWARD_REFERENCE_HPP_
#define _ESRUBY_BIND_RUBY_OBJECT_BACKWARD_REFERENCE_HPP_


#include "ruby_object_reference.hpp"


namespace ESRubyBind
{

  class RubyObjectBackwardReference : public RubyObjectReference
  {
  
    public:
    
    RubyObjectBackwardReference(mrb_state* mrb, mrb_value ruby_object);
    ~RubyObjectBackwardReference();
    
  };
  
}

#endif
