#include "ruby_portal.hpp"


namespace ESRubyBind
{

  // only needed for EMSCRIPTEN_BINDINGS to work
  RubyPortal::RubyPortal()
  {
  }
  
  emscripten::val RubyPortal::eval(emscripten::val js_code)
  {
    if (!js_code.isString())
    {
      printf("'code' must be a string\n");
      throw std::invalid_argument("'code' must be a string");
    }
    mrb_value ruby_code = js_object_to_ruby_object(ESRuby::mrb(), js_code);
    
    mrb_value ruby_return;
    ruby_return = mrb_funcall_argv(ESRuby::mrb(), mrb_top_self(ESRuby::mrb()), mrb_intern_lit(ESRuby::mrb(), "eval"), 1, &ruby_code);
    
    if (ESRuby::mrb()->exc)
    {
      // Error
      mrb_print_error(ESRuby::mrb());
      ESRuby::mrb()->exc = 0;
      throw std::runtime_error("");
    }
    
    emscripten::val js_return = ruby_obj_to_js_object(ESRuby::mrb(), ruby_return);
    return js_return;
  }
  
  EMSCRIPTEN_BINDINGS(ruby_portal)
  {
    emscripten::class_<RubyPortal>("RubyPortal")
      .class_function("eval", &RubyPortal::eval)
    ;
  }

}
