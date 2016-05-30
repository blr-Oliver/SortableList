function Loader(settings, lag){
  if(typeof (settings) === 'string')
    settings = {
      url: settings
    };
  this.settings = $.extend({
    method: 'GET',
    dataType: 'json',
    traditional: true
  }, settings);
  this.lag = lag;
}

Loader.prototype = {
  load: function(data, settings){
    settings = $.extend({
      data: data
    }, this.settings, settings);
    if(this.lag > 0){
      var deferred = new $.Deferred();
      var timeouts = [];
      function delayedCall(callback, delay){
        return function(){
          var args = [].slice.call(arguments);
          timeouts.push(setTimeout(function(){
            callback.apply(deferred, args);
          }, delay));
        }
      }
      var jqXhr = $.ajax(settings);
      jqXhr.then(delayedCall(deferred.resolve, this.lag),
          delayedCall(deferred.reject, this.lag),
          delayedCall(deferred.notify, this.lag));
      var result = deferred.promise();
      result.abort = function(){
        jqXhr.abort();
        timeouts.forEach(function(id){
          clearTimeout(id);
        });
      }
      return result;
    }else
      return $.ajax(settings);
  }
}
