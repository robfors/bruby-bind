# This file sets up the build environment for a webruby project.
Extraneous::Module::Specification.new do |spec|

  # set the path of the esruby project
  # all other paths specified in this config file will be expanded
  #   relative to this path
  spec.project_directory = File.dirname(__FILE__)

  spec.name = 'bruby-bind'

  spec.build_mode = 'development'

  spec.output_path = 'bin/bruby-bind.js'
  
  # list as many ruby source files as you want
  # keep in mind they will be executed in the order you list them
  spec.source(path: 'js/error-stack-parser.js', type: 'java_script')
  spec.source(path: 'js/bruby_bind.js', type: 'java_script')
  spec.source(path: 'js/bruby_bind/argument_error.js', type: 'java_script')
  spec.source(path: 'js/bruby_bind/convert.js', type: 'java_script')
  spec.source(path: 'js/bruby_bind/ruby_error.js', type: 'java_script')
  spec.source(path: 'js/bruby_bind/ruby_float.js', type: 'java_script')
  spec.source(path: 'js/bruby_bind/ruby_integer.js', type: 'java_script')
  spec.source(path: 'js/bruby_bind/ruby_method.js', type: 'java_script')
  spec.source(path: 'js/bruby_bind/ruby_object.js', type: 'java_script')
  spec.source(path: 'js/bruby_bind/ruby_invocable_object.js', type: 'java_script')
  spec.source(path: 'js/bruby_bind/ruby_class.js', type: 'java_script')
  spec.source(path: 'js/bruby_bind/ruby_closure.js', type: 'java_script')
  spec.source(path: 'js/bruby_bind/ruby_symbol.js', type: 'java_script')
  spec.source(path: 'js/bruby_bind/stale_ruby_object_reference.js', type: 'java_script')
  
  spec.source(path: 'rb/module.rb', type: 'ruby')
  spec.source(path: 'rb/monkey_patch.rb', type: 'ruby')
  spec.source(path: 'rb/bruby_bind.rb', type: 'ruby')
  spec.source(path: 'rb/bruby_bind/convert.rb', type: 'ruby')
  spec.source(path: 'rb/bruby_bind/convert_meta.rb', type: 'ruby')
  spec.source(path: 'rb/bruby_bind/dynamic_js_method.rb', type: 'ruby')
  spec.source(path: 'rb/bruby_bind/js_method.rb', type: 'ruby')
  spec.source(path: 'rb/java_script.rb', type: 'ruby')
  spec.source(path: 'rb/java_script/basic_exception.rb', type: 'ruby')
  spec.source(path: 'rb/java_script/error.rb', type: 'ruby')
  spec.source(path: 'rb/java_script/object.rb', type: 'ruby')
  spec.source(path: 'rb/java_script/function.rb', type: 'ruby')
  spec.source(path: 'rb/java_script/undefined.rb', type: 'ruby')

  spec.source(path: 'js/bruby_bind/ruby.js', type: 'java_script')
  
  
  #dependency mruby-bruby-bridge-interface
  #  spec.license = 'MIT'
  #spec.author  = 'Rob Fors'
  #spec.summary = 'low level minimalist interface between the javascript and ruby environment'
  
end


# mruby-method