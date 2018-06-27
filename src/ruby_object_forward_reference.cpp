#include "ruby_object_forward_reference.hpp"


namespace ESRubyBind
{

  RubyObjectForwardReference::RubyObjectForwardReference(mrb_state* mrb, mrb_value ruby_object)
    : RubyObjectReference(mrb, ruby_object)
  {
    _reference_count = (unsigned int*)mrb_malloc(mrb, sizeof(unsigned int));
    *_reference_count = 1;
    mrb_gc_register(_mrb, _ruby_self);
  }
  
  
  RubyObjectForwardReference::RubyObjectForwardReference(const RubyObjectForwardReference &other)
    : RubyObjectReference(other._mrb, other._ruby_self)
  {
    _reference_count = other._reference_count;
    (*_reference_count)++;
  }
  
  
  RubyObjectForwardReference::~RubyObjectForwardReference()
  {
    (*_reference_count)--;
    if (*_reference_count == 0)
    {
      printf("debug|c0\n");
      mrb_value data_object = mrb_funcall(_mrb, _ruby_self, "esruby_bind_backward_reference", 0, NULL);
      emscripten::val* backward_reference = (emscripten::val*)mrb_get_datatype(_mrb, data_object, &js_object_backward_reference_type);
      mrb_free(_mrb, backward_reference);
      mrb_funcall(_mrb, _ruby_self, "esruby_bind_backward_reference=", 1, mrb_nil_value());
      mrb_gc_unregister(_mrb, _ruby_self);
      printf("debug|c5\n");
      free(_reference_count);
    }
  }
  
  
  emscripten::val RubyObjectForwardReference::send(emscripten::val js_method_name, emscripten::val js_args) const
  {
    if (!js_method_name.isString())
    {
      printf("'method_name' must be a string\n");
      throw std::invalid_argument("'method_name' must be a string");
    }
    std::string cpp_method_name = js_method_name.as<std::string>();
    if (cpp_method_name.empty())
    {
      printf("'method_name' must not be empty\n");
      throw std::invalid_argument("'method_name' must not be empty");
    }
    if (!js_args.isArray())
    {
      printf("'args' must be an array\n");
      throw std::invalid_argument("'args' must be an array");
    }
    
    emscripten::val js_arg = emscripten::val::undefined();
    mrb_int arg_count = js_args["length"].as<mrb_int>();
    std::vector<mrb_value> ruby_args;
    
    ruby_args.push_back(js_object_to_ruby_object(_mrb, js_method_name));
    for (mrb_int i = 0; i < arg_count; i++)
    {
      js_arg = js_args.call<emscripten::val>("shift");
      ruby_args.push_back(js_object_to_ruby_object(_mrb, js_arg));
    }
    
    mrb_value ruby_return;
    ruby_return = mrb_funcall_argv(_mrb, _ruby_self, mrb_intern_lit(_mrb, "__send__"), ruby_args.size(), ruby_args.data());
    
    if (_mrb->exc)
    {
      // Error
      mrb_print_error(_mrb);
      _mrb->exc = 0;
      throw std::runtime_error("");
    }
    printf("debug:a0\n");
    emscripten::val js_return = ruby_obj_to_js_object(_mrb, ruby_return);
    printf("debug:a1\n");
    return js_return;
  }
  
  EMSCRIPTEN_BINDINGS(ruby_object_forward_reference)
  {
    emscripten::class_<RubyObjectForwardReference, emscripten::base<RubyObjectReference>>("RubyObjectForwardReference")
      .function("send", &RubyObjectForwardReference::send);
  }

}
