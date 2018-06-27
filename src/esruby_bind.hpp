#ifndef _ESRUBY_BIND_HPP_
#define _ESRUBY_BIND_HPP_


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

#include "java_script_portal.hpp"
#include "js_object_wrapper.hpp"
#include "js_function_wrapper.hpp"
#include "ruby_portal.hpp"
#include "ruby_object_forward_reference.hpp"
#include "ruby_object_backward_reference.hpp"


namespace ESRubyBind
{

  RClass* js_portal_rb_module;
  RClass* js_object_wrapper_rb_class;
  RClass* js_function_wrapper_rb_class;
  
  void js_object_forward_reference_type_gc(mrb_state* mrb, void* ptr);
  struct mrb_data_type js_object_forward_reference_type =
    {"js_object_forward_reference_type", js_object_forward_reference_type_gc};
  void js_object_backward_reference_type_gc(mrb_state* mrb, void* ptr);
  struct mrb_data_type js_object_backward_reference_type =
    {"js_object_backward_reference_type", js_object_backward_reference_type_gc};
  //void rb_object_backend_type_gc(mrb_state* mrb, void* ptr);
  //struct mrb_data_type rb_object_backend_type = {"rb_object_backend", rb_object_backend_type_gc};
  
  emscripten::val ruby_obj_to_js_object(mrb_state* mrb, mrb_value ruby_object);
  mrb_value js_object_to_ruby_object(mrb_state* mrb, emscripten::val js_object);
  void initialize_gem(mrb_state* mrb);
  void finalize_gem(mrb_state* mrb);
}

extern "C"
void mrb_esruby_bind_gem_init(mrb_state* mrb);

extern "C"
void mrb_esruby_bind_gem_final(mrb_state* mrb);


#endif

