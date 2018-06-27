#include "ruby_object_reference.hpp"


namespace ESRubyBind
{

  RubyObjectReference::RubyObjectReference(mrb_state* mrb, mrb_value ruby_object)
    : _mrb(mrb), _ruby_self(ruby_object)
  {
  }
  
  
  RubyObjectReference::~RubyObjectReference()
  {
  }
  
  
  mrb_state* RubyObjectReference::mrb() const
  {
    return _mrb;
  }
  
  
  mrb_value RubyObjectReference::ruby_object() const
  {
    return _ruby_self;
  }
  
  
  EMSCRIPTEN_BINDINGS(ruby_object_reference)
  {
    emscripten::class_<RubyObjectReference>("RubyObjectReference");
  }

}
