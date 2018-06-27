#include "esruby_bind.hpp"


namespace ESRubyBind
{

  void js_object_forward_reference_type_gc(mrb_state* mrb, void* ptr)
  {
    emscripten::val* js_object = (emscripten::val*)ptr;
    // free reference first?
    js_object->delete_("esruby_bind_backward_reference");
    js_object->~val();
    mrb_free(mrb, js_object);
  }
  
  void js_object_backward_reference_type_gc(mrb_state* mrb, void* ptr)
  {
    emscripten::val* js_object = (emscripten::val*)ptr;
    printf("debug|b0\n");
    js_object->~val();
    printf("debug|b1\n");
    mrb_free(mrb, js_object);
  }
  
  //void rb_object_backend_type_gc(mrb_state* mrb, void* ptr)
  //{
    //emscripten::val* js_object = (emscripten::val*)ptr;
    //js_object->~val();
    //mrb_free(mrb, js_object);
  //}
  
  emscripten::val ruby_obj_to_js_object(mrb_state* mrb, mrb_value ruby_object)
  {
    emscripten::val js_object = emscripten::val::undefined();
    
    switch (mrb_type(ruby_object))
    {
      case MRB_TT_FALSE:
      {
        if (mrb_nil_p(ruby_object))
        {
          js_object = emscripten::val::null();
          return js_object; // nil
        }
        else
        {
          js_object = emscripten::val(false);
          return js_object; // false
        }
      }
      case MRB_TT_TRUE:
      {
        js_object = emscripten::val(true);
        return js_object;  // true
      }
      case MRB_TT_FIXNUM:
      {
        js_object = emscripten::val(mrb_fixnum(ruby_object));
        return js_object; // number
      }
      case MRB_TT_FLOAT:
      {
        js_object = emscripten::val(mrb_float(ruby_object));
        return js_object; // number
      }
      case MRB_TT_STRING:
      {
        struct RString* ruby_string = mrb_str_ptr(ruby_object);
        std::string cpp_object = std::string(RSTR_PTR(ruby_string), RSTR_LEN(ruby_string));
        js_object = emscripten::val(cpp_object);
        return js_object; // string
      }
      default:
        break; // handle after switch
    }
    
    
    RClass* ruby_class;
    
    // JSUndefined
    ruby_class = mrb_class_get_under(mrb, js_portal_rb_module, "Undefined");
    if (mrb_obj_is_kind_of(mrb, ruby_object, ruby_class))
    {
      js_object = emscripten::val::undefined();
      return js_object;
    }
    
    // TODO JSSymbol
    
    // TODO JSArray
    
    // JSFunction
    // JSObject
    ruby_class = mrb_class_get_under(mrb, js_portal_rb_module, "Object");
    if (mrb_obj_is_kind_of(mrb, ruby_object, ruby_class))
    {
      mrb_value data_object = mrb_iv_get(mrb, ruby_object, mrb_intern_lit(mrb, "@forward_reference"));
      js_object = *(emscripten::val*)mrb_get_datatype(mrb, data_object, &js_object_forward_reference_type);
      return js_object;
    }
    
    // ruby Method
    // ruby Proc
    // ruby Object
    
    printf("debug|0\n");
    
    mrb_funcall(mrb, mrb_top_self(mrb), "ttt", 1, ruby_object); // debug ------------------
    
    if (!mrb_nil_p(mrb_funcall(mrb, ruby_object, "esruby_bind_backward_reference", 0, NULL)))
    {
      printf("debug|1\n");
      mrb_value data_object = mrb_funcall(mrb, ruby_object, "esruby_bind_backward_reference", 0, NULL);
      js_object = *(emscripten::val*)mrb_get_datatype(mrb, data_object, &js_object_backward_reference_type);
      return js_object;
    }
    printf("debug|2\n");
    RClass* ruby_method_class = mrb_class_get(mrb, "Method");
    RClass* ruby_proc_class = mrb_class_get(mrb, "Proc");
    mrb_bool is_method_object = mrb_obj_is_kind_of(mrb, ruby_object, ruby_method_class);
    mrb_bool is_proc_object = mrb_obj_is_kind_of(mrb, ruby_object, ruby_proc_class);
    emscripten::val js_class = emscripten::val::undefined();
    printf("debug|3\n");
    if (is_method_object || is_proc_object)
      js_class = emscripten::val::global()["ESRubyBind"]["RubyClosure"];
    else
      js_class = emscripten::val::global()["ESRubyBind"]["RubyObject"];
    RubyObjectForwardReference forward_reference = RubyObjectForwardReference(mrb, ruby_object);
    js_object = js_class.new_(emscripten::val(forward_reference));
    js_object.set("esruby_bind_forward_reference", forward_reference);
    emscripten::val* backward_reference = (emscripten::val*)mrb_malloc(mrb, sizeof(emscripten::val));
    new (backward_reference) emscripten::val(js_object);
    mrb_value data_object =
      mrb_obj_value(Data_Wrap_Struct(mrb, mrb->object_class, &js_object_backward_reference_type, backward_reference));
    printf("debug|4\n");
    mrb_funcall(mrb, ruby_object, "esruby_bind_backward_reference=", 1, data_object);
    mrb_funcall(mrb, mrb_top_self(mrb), "ttt", 1, ruby_object);
    printf("debug|5\n");
    return js_object;
  }
  
  
  mrb_value js_object_to_ruby_object(mrb_state* mrb, emscripten::val js_object)
  {
    mrb_value ruby_object;
    
    if (js_object.isNull() || js_object.isUndefined())
    {
      ruby_object = mrb_nil_value();
      return ruby_object; // nil
    }
    if (js_object.isFalse())
    {
      ruby_object = mrb_false_value();
      return ruby_object; // false
    }
    if (js_object.isTrue())
    {
      ruby_object = mrb_true_value();
      return ruby_object; // true
    }
    
    std::string type = js_object.typeof().as<std::string>();
    if (type == "number")
    {
      emscripten::val js_number_class = emscripten::val::global("Number");
      bool is_integer = js_number_class.call<bool>("isInteger", js_object);
      if (is_integer)
      {
        mrb_int cpp_object = js_object.as<mrb_int>();
        ruby_object = mrb_fixnum_value(cpp_object);
        return ruby_object; // integer
      }
      else
      {
        mrb_float cpp_object = js_object.as<mrb_float>();
        ruby_object = mrb_float_value(mrb, cpp_object);
        return ruby_object; // float
      }
    }
    if (type == "string")
    {
      std::string cpp_object = js_object.as<std::string>();
      ruby_object = mrb_str_new(mrb, cpp_object.c_str(), cpp_object.length());
      return ruby_object; // string
    }
    
    // --- non primitive ---
    
    emscripten::val js_class = emscripten::val::undefined();
    
    // ruby Symbol
    js_class = emscripten::val::global()["ESRubyBind"]["RubySymbol"];
    if (js_object.instanceof(js_class))
    {
      std::string cpp_object = js_object["value"].as<std::string>();
      ruby_object = mrb_str_new(mrb, cpp_object.c_str(), cpp_object.length());
      return ruby_object;
    }
    
    // ruby Float
    js_class = emscripten::val::global()["ESRubyBind"]["RubyFloat"];
    if (js_object.instanceof(js_class))
    {
      mrb_float cpp_object = js_object["value"].as<mrb_float>();
      ruby_object = mrb_float_value(mrb, cpp_object);
      return ruby_object;
    }
    
    // ruby Integer
    js_class = emscripten::val::global()["ESRubyBind"]["RubyInteger"];
    if (js_object.instanceof(js_class))
    {
      mrb_int cpp_object = js_object["value"].as<mrb_int>();
      ruby_object = mrb_fixnum_value(cpp_object);
      return ruby_object;
    }
    
    // TOODO ruby Array
    
    
    // ruby closure
    // ruby Object
    if (!js_object["esruby_bind_forward_reference"].isUndefined())
    {
      RubyObjectReference forward_reference =
        js_object["esruby_bind_forward_reference"].as<RubyObjectReference>();
      if (mrb != forward_reference.mrb())
        mrb_raise(mrb, E_ARGUMENT_ERROR, "forward_reference belongs to different esruby instance.");
      return forward_reference.ruby_object();
    }
    
    // --- native js object ---
    
    // js Function
    if (type == "function")
    {
      emscripten::val* js_object_copy = (emscripten::val*)mrb_malloc(mrb, sizeof(emscripten::val));
      new (js_object_copy) emscripten::val(js_object);
      mrb_value data_object =
        mrb_obj_value(Data_Wrap_Struct(mrb, mrb->object_class, &js_object_forward_reference_type, js_object_copy));
      ruby_object = mrb_obj_new(mrb, js_function_wrapper_rb_class, 0, NULL); 
      mrb_iv_set(mrb, ruby_object, mrb_intern_lit(mrb, "@forward_reference"), data_object);
      RubyObjectReference backward_reference = RubyObjectReference(mrb, ruby_object);
      js_object_copy->set("esruby_bind_backward_reference", backward_reference);
      return ruby_object;
    }
    
    // TODO js Array
    
    // js Object
    if (emscripten::val("esruby_bind_backward_reference").in(js_object))
    {
      // a wrapper for the object already exists, return it now
      return js_object["esruby_bind_backward_reference"].as<RubyObjectReference>().ruby_object();
    }
    else
    {
      ruby_object = mrb_obj_new(mrb, js_object_wrapper_rb_class, 0, NULL); 
      emscripten::val* js_object_copy = (emscripten::val*)mrb_malloc(mrb, sizeof(emscripten::val));
      new (js_object_copy) emscripten::val(js_object);
      mrb_value data_object =
        mrb_obj_value(Data_Wrap_Struct(mrb, mrb->object_class, &js_object_forward_reference_type, js_object_copy));
      mrb_iv_set(mrb, ruby_object, mrb_intern_lit(mrb, "@forward_reference"), data_object);
      RubyObjectBackwardReference backward_reference = RubyObjectBackwardReference(mrb, ruby_object);
      js_object_copy->set("esruby_bind_backward_reference", backward_reference);
      return ruby_object;
    }
  }
  
  void initialize_gem(mrb_state* mrb)
  {
    js_portal_rb_module = mrb_define_module(mrb, "JavaScript");
    mrb_define_class_method(mrb, js_portal_rb_module, "eval", JavaScriptPortal::eval, MRB_ARGS_REQ(1));
    
    js_object_wrapper_rb_class = mrb_define_class_under(mrb, js_portal_rb_module, "Object", mrb->object_class);
    mrb_define_class_method(mrb, js_object_wrapper_rb_class, "build", JSObjectWrapper::build, MRB_ARGS_NONE());
    mrb_define_method(mrb, js_object_wrapper_rb_class, "get", JSObjectWrapper::get, MRB_ARGS_REQ(1));
    mrb_define_method(mrb, js_object_wrapper_rb_class, "set", JSObjectWrapper::set, MRB_ARGS_REQ(2));
    
    js_function_wrapper_rb_class = mrb_define_class_under(mrb, js_portal_rb_module, "Function", js_object_wrapper_rb_class);
    mrb_define_method(mrb, js_function_wrapper_rb_class, "new", JSFunctionWrapper::new_, MRB_ARGS_ANY());
    mrb_define_method(mrb, js_function_wrapper_rb_class, "invoke_with_context", JSFunctionWrapper::invoke_with_context, MRB_ARGS_REQ(1)|MRB_ARGS_ANY());
    
    (void)RubyPortal(); // only needed for EMSCRIPTEN_BINDINGS to work
  }
  
  
  void finalize_gem(mrb_state* mrb)
  {
  }
  
}


void mrb_esruby_bind_gem_init(mrb_state* mrb)
{
  return ESRubyBind::initialize_gem(mrb);
}


void mrb_esruby_bind_gem_final(mrb_state* mrb)
{
  return ESRubyBind::finalize_gem(mrb);
}
