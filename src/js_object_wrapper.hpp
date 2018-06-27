#ifndef _ESRUBY_BIND_JS_OBJECT_WRAPPER_HPP_
#define _ESRUBY_BIND_JS_OBJECT_WRAPPER_HPP_


#include <emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <stdio.h>
#include <math.h>
#include <mruby.h>
#include <mruby/array.h>
#include <mruby/class.h>
#include <mruby/data.h>
#include <mruby/proc.h>
#include <mruby/string.h>
#include <mruby/value.h>
#include <mruby/variable.h>

#include "esruby_bind_extern.hpp"
#include "ruby_object_backward_reference.hpp"

namespace ESRubyBind
{
  
  namespace JSObjectWrapper
  {
  
    mrb_value build(mrb_state* mrb, mrb_value ruby_self);
    mrb_value get(mrb_state* mrb, mrb_value ruby_self);
    mrb_value set(mrb_state* mrb, mrb_value ruby_self);
    
  };
  
}

#endif
