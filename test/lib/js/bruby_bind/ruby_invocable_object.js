(function(){
  'use strict';

  
  console.log("start-js-bruby_bind-ruby_invocable_object");

  
  test("BRubyBind.RubyInvocableObject._new_proxy_target");
  //
  ensure_result( BRubyBind.RubyInvocableObject._new_proxy_target().constructor == Function );


  console.log("end-js-bruby_bind-ruby_invocable_object");
  
})();