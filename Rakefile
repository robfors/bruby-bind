task :clean do
  rm_rf "build"
end

task :build do
  sh "extraneous build"
end

task :test => :build do
  mkdir_p "build/test/www"
  cp "test/resources/extraneous/bin/extraneous.js", "build/test/www/extraneous.js"
  cp "test/resources/bruby-mruby/bin/bruby-mruby.js", "build/test/www/bruby-mruby.js"
  cp "test/resources/bruby-bridge/bin/bruby-bridge.js", "build/test/www/bruby-bridge.js"
  cp "bin/bruby-bind.js", "build/test/www/bruby-bind.js"
  sh "extraneous build test/config.rb"
  cp "test/resources/index.html", "build/test/www/index.html"
  sh "ruby -run -e httpd build/test/www -p 2222"
end