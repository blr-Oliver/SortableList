function SortableList(root, data){
  this.root = $(root);
  this.data = data;
  this.render();
}
SortableList.prototype = {
  render: function(){
    this.root.empty().addClass('vertical-container');

    var buttons = ["Name" , "Surname" , "Wealth"];
    var div = $("<div>").addClass('vertical-sidebar').appendTo(this.root);  
    for (var j = 0 ; j < buttons.length; j++) {
      $('<button class="btn">').text(buttons[j]).attr("data-field", buttons[j].toLowerCase()).appendTo(div);
    }

    var ul = $("<ul>").addClass('list-group vertical-content').appendTo(this.root);     

    for(var i = 0; i < this.data.length; i++){
      var obj = this.data[i];
      var str = obj.name + ' ' + obj.surname + ' owns ' + obj.wealth + ' billion $';

      $("<li>").text(str).addClass('list-group-item').appendTo(ul);
    }

    div.click( this.onSortClick.bind( this ) );
  },

  onSortClick : function( event ){
    var target = event.target;
    if( target.tagName.toLowerCase() == 'button' ){
      var field = target.getAttribute( 'data-field' );
      console.log(field);

      this.sortByField(this.data , field);

      this.render();
    }
  },

  getField : function (obj, path) {
    return path.split('.').reduce((obj, prop) => obj && obj[prop], obj);
  },

  sortByField : function (a, field) {
    if (typeof(field) === 'string') return this.sortByField(a, [field]);
    var sort = field.map(function(key) {
      return {
        asc: key[0] !== '-',
        key: (key[0] === '+' || key[0] === '-') ? key.substr(1) : key
      };
    })
    var getField = this.getField;
    return a.sort(function(a, b) {
      for (var i = 0; i < sort.length; ++i) {
        var valueA = getField(a, sort[i].key), valueB = getField(b, sort[i].key);
        if (valueA != valueB)
          return (valueA < valueB ^ sort[i].asc) ? 1 : -1;
      }
      return 0;
    });
  }

}
