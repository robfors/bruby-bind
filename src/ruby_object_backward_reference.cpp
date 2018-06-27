#include "ruby_object_backward_reference.hpp"


namespace ESRubyBind
{

  RubyObjectBackwardReference::RubyObjectBackwardReference(mrb_state* mrb, mrb_value ruby_object)
    : RubyObjectReference(mrb, ruby_object)
  {
  }
  
  
  RubyObjectBackwardReference::~RubyObjectBackwardReference()
  {
  }
  
  
  EMSCRIPTEN_BINDINGS(ruby_object_backward_reference)
  {
    emscripten::class_<RubyObjectBackwardReference, emscripten::base<RubyObjectReference>>("RubyObjectBackwardReference");
  }

}
