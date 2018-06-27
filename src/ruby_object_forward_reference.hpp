#ifndef _ESRUBY_BIND_RUBY_OBJECT_FORWARD_REFERENCE_HPP_
#define _ESRUBY_BIND_RUBY_OBJECT_FORWARD_REFERENCE_HPP_


#include "ruby_object_reference.hpp"


namespace ESRubyBind
{

  class RubyObjectForwardReference : public RubyObjectReference
  {
  
    public:
    
    RubyObjectForwardReference(mrb_state* mrb, mrb_value ruby_object);
    RubyObjectForwardReference(const RubyObjectForwardReference &other);
    ~RubyObjectForwardReference();
    emscripten::val send(emscripten::val js_method_name, emscripten::val js_args) const;
    
    private:
    
    unsigned int* _reference_count;
    
  };
  
}

#endif
