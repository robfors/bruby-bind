#ifndef _ESRUBY_BIND_RUBY_OBJECT_REFERENCE_HPP_
#define _ESRUBY_BIND_RUBY_OBJECT_REFERENCE_HPP_


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
#include <stdexcept>

#include "esruby_bind_extern.hpp"


namespace ESRubyBind
{

  class RubyObjectReference
  {
  
    public:
    
    RubyObjectReference(mrb_state* mrb, mrb_value ruby_object);
    virtual ~RubyObjectReference();
    mrb_state* mrb() const;
    mrb_value ruby_object() const;
    
    protected:
    
    mrb_state* _mrb;
    mrb_value _ruby_self;
    
  };
  
}

#endif
