#include "js_object_wrapper.hpp"


namespace ESRubyBind
{
  namespace JSObjectWrapper
  {
  
    mrb_value build(mrb_state* mrb, mrb_value ruby_self)
    {
      mrb_value ruby_object = mrb_obj_new(mrb, js_object_wrapper_rb_class, 0, NULL);
      
      emscripten::val* forward_reference = (emscripten::val*)mrb_malloc(mrb, sizeof(emscripten::val));
      new (forward_reference) emscripten::val(emscripten::val::object());
      mrb_value data_object =
        mrb_obj_value(Data_Wrap_Struct(mrb, mrb->object_class, &js_object_forward_reference_type, forward_reference));
      mrb_iv_set(mrb, ruby_object, mrb_intern_lit(mrb, "@forward_reference"), data_object);
      
      RubyObjectBackwardReference backward_reference = RubyObjectBackwardReference(mrb, ruby_object);
      forward_reference->set("esruby_bind_backward_reference", backward_reference);
            
      return ruby_object;
    }
    
    mrb_value get(mrb_state* mrb, mrb_value ruby_self)
    {
      mrb_value ruby_key;
      mrb_get_args(mrb, "o", &ruby_key);
      emscripten::val js_key = ruby_obj_to_js_object(mrb, ruby_key);
      
      mrb_value data_object = mrb_iv_get(mrb, ruby_self, mrb_intern_lit(mrb, "@forward_reference"));
      emscripten::val forward_reference = *(emscripten::val*)mrb_get_datatype(mrb, data_object, &js_object_forward_reference_type);
      emscripten::val js_return = forward_reference[js_key];
      mrb_value ruby_return = js_object_to_ruby_object(mrb, js_return);
      return ruby_return;
    }
    
    mrb_value set(mrb_state* mrb, mrb_value ruby_self)
    {
      mrb_value ruby_key;
      mrb_value ruby_new_value;
      mrb_get_args(mrb, "oo", &ruby_key, &ruby_new_value);
      emscripten::val js_key = ruby_obj_to_js_object(mrb, ruby_key);
      
      emscripten::val js_new_value = ruby_obj_to_js_object(mrb, ruby_new_value);
      
      mrb_value data_object = mrb_iv_get(mrb, ruby_self, mrb_intern_lit(mrb, "@forward_reference"));
      emscripten::val forward_reference = *(emscripten::val*)mrb_get_datatype(mrb, data_object, &js_object_forward_reference_type);
      forward_reference.set(js_key, js_new_value); // returns void
      
      // don't just return 'ruby_new_value' as the type may have changed during the conversion to/from js
      emscripten::val js_return = forward_reference[js_key];
      mrb_value ruby_return = js_object_to_ruby_object(mrb, js_return);
      return ruby_return;
    }
    
  }
}
