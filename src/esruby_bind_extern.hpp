#ifndef _ESRUBY_BIND_EXTERN_HPP_
#define _ESRUBY_BIND_EXTERN_HPP_


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
#include <new>

#include "ruby_object_reference.hpp"
//#include "ruby_object_forward_reference.hpp"
//#include "ruby_object_backward_reference.hpp"

namespace ESRubyBind
{

  extern RClass* js_portal_rb_module;
  extern RClass* js_object_wrapper_rb_class;
  extern RClass* js_function_wrapper_rb_class;
  
  extern void js_object_forward_reference_type_gc(mrb_state* mrb, void* ptr);
  extern struct mrb_data_type js_object_forward_reference_type;
  extern void js_object_backward_reference_type_gc(mrb_state* mrb, void* ptr);
  extern struct mrb_data_type js_object_backward_reference_type;
  
  extern emscripten::val ruby_obj_to_js_object(mrb_state* mrb, mrb_value ruby_object);
  extern mrb_value js_object_to_ruby_object(mrb_state* mrb, emscripten::val js_object);
  
}

#endif

