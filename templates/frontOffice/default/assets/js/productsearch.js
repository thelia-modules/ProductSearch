(function() {


  this.ProductSearch = function() {
    this.productsearch = null;
    this.displayedItems = [];
    this.items = [];
    this.url = window.location.protocol+'//'+window.location.hostname;

    // Define option defaults 
    var defaults = {
      locale: 'en_EN',
      currency: 'USD',
      currencySymbol: '$',
      templateItem: $('#item-template').html(),
      noResultTemplate: '<li class="col-sm-12">Sorry, no result for your search</li>',
      listResult: document.getElementById('list-result'),
      searchButton: 'search-button',
      closeButton: 'close-search',
      submitSearch: 'search-query-form',
      inputSubmitSearch: 'search-query',
      searchBlock: 'search-block',
      pageWrapper: 'page',
      apiUrl: '/api/public/search',
      indexCode: '',
      params: {}
    }

    // Create options by extending defaults with the passed in arguments
    if (arguments[0] && typeof arguments[0] === "object") {
      this.options = extendDefaults(defaults, arguments[0]);
    }

    this.se = new SearchEngine(this.url+this.options.apiUrl);

  }

  // Public Methods

  ProductSearch.prototype.init = function() {
    var self = this;
    var launchSearch = document.getElementById(self.options.searchButton);
    var closeSearch = document.getElementById(self.options.closeButton);
    var submitSearch = document.getElementById(self.options.submitSearch);

    launchSearch.addEventListener('click', function() {
      self.open();
    });   
    closeSearch.addEventListener('click', function() {
      self.close();
    });
    submitSearch.addEventListener('submit', function(e) {
      e.preventDefault();
      self.search();
    });
  }

  ProductSearch.prototype.open = function() {
    var self = this;
    var searchBlock = document.getElementById(self.options.searchBlock);
    var pageWrapper = document.getElementsByClassName(self.options.pageWrapper);

    if (searchBlock.classList)
      searchBlock.classList.add('active');
    else
      searchBlock.className += ' ' + 'active';

    if (pageWrapper[0].classList)
      pageWrapper[0].classList.add('hidden');
    else
      pageWrapper[0].className += ' ' + 'hidden';
  }

  ProductSearch.prototype.close = function() {
    var self = this;
    var searchBlock = document.getElementById(self.options.searchBlock);
    var pageWrapper = document.getElementsByClassName(self.options.pageWrapper);

    if (searchBlock.classList)
      searchBlock.classList.remove('active');
    else
      searchBlock.className = searchBlock.className.replace(new RegExp('(^|\\b)' + 'hidden'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');

    if (pageWrapper[0].classList)
      pageWrapper[0].classList.remove('hidden');
    else
      pageWrapper[0].className = pageWrapper[0].className.replace(new RegExp('(^|\\b)' + 'hidden'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');    
  }

  ProductSearch.prototype.search = function(){
    self = this;
    var inputSubmitSearch = document.getElementById(self.options.inputSubmitSearch);
    var searchQuery = inputSubmitSearch.value;

    // reset what's displayed (to improve!!)
    this.displayedItems = [];
       
    while (this.options.listResult.firstChild) {
        this.options.listResult.removeChild(this.options.listResult.firstChild);
    }


    var resultSearchQuery = this.fetchResult(searchQuery);
    this.processResultItem(resultSearchQuery);
  }

  ProductSearch.prototype.fetchResult = function(search){
    var cachedParams = this.options.params;
    for(var key in cachedParams ) {
        cachedParams[key][1] = cachedParams[key][1].replace('', search);
    }    

    var results =  this.se.find(
      this.options.indexCode.toString(), // Then index configuration code
      cachedParams,
      {
          // Here you can play with the client's behaviour
          // You can define the results limit and offset ( for pagination )
          // And give your own success/fail callback
          fail: function(xhr) {
              //alert(xhr.status);
          }
      }
    );
    return results;
  }

  ProductSearch.prototype.processResultItem = function(result){
    var results = result['results'];
    for (var i=0; i < results.length;i++){
      if (this.displayedItems.indexOf(results[i].id) === -1){
        var item = new createItem(results[i], this.options.locale, this.options.currency, this.options.templateItem);
        var populatedItem = populateItem(item, this.options.currency);
        this.populateDOM(populatedItem);
      }    
    }
    if (this.displayedItems.length < 1){
      var wrapper= document.createElement('div');
      wrapper.innerHTML= this.options.noResultTemplate;
      this.options.listResult.appendChild(wrapper.firstElementChild);
    }          
  }    

  ProductSearch.prototype.populateDOM = function(item){
    // kind of an ugly way to parse item template to inject into DOM
    var wrapper= document.createElement('div');
    wrapper.innerHTML= item.template;
    this.options.listResult.appendChild(wrapper.firstElementChild);
    this.displayedItems.push(item.id);
  }


  // Private Methods

  function createItem(item, locale, currency, templateItem){
    this.id = item.id;
    this.name = item["title_"+locale];
    this.description = item["description_"+locale];
    this.url = item["url_"+locale];
    this.price = item["price_"+currency];
    this.promoPrice = '';
    this.image = item.image_url;
    this.template = templateItem;
  }    

  function populateItem(item, currencySymbol){
    item.template = item.template.replace('{{name}}', item.name);
    item.template = item.template.replace(/{{url}}/g, item.url);
    item.template = item.template.replace('{{price}}', item.price +' '+currencySymbol);
    item.template = item.template.replace('{{image}}', item.image);

    return item;
  }

  function extendDefaults(source, properties) {
    var property;
    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  }


}());