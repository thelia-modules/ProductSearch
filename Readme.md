IndexEngine module for Thelia
===

Summary
---

1. [Description](#description_en_US)
2. [Install](#install_en_US)
3. [Usage](#usage_en_US)


1. Description <a name="#description_en_US"></a>
---

This module provides a search pop-in for the front office based on [IndexEngine](https://github.com/thelia-modules/IndexEngine) module.

This is an integration example of the "products" index, provided by default with IndexEngine module.

2. Install <a name="install_en_US"></a>
---

You can install this module with composer:

```sh
$ php composer.phar require thelia/product-search-module:~1.0
```

This module requires [IndexEngine](https://github.com/thelia-modules/IndexEngine) module to work.

3. Usage <a name="usage_en_US"></a>
---

Go to your backOffice and activate the module. A search button should have appeared in your front navbar.

This module provides an overlay to index engine's search for products, using its default configuration.

You can require it this way:

```smarty
{javascripts file="assets/js/SearchEngine.js" source="IndexEngine"}
    <script src="{$asset_url}"></script>
{/javascripts}

{javascripts file="assets/js/productsearch.js" source="ProductSearch"}
    <script src="{$asset_url}"></script>
{/javascripts}
```

You can improve your search with the following constructor parameters:

| Name              | Default value                                              | Definition                                           |
|-------------------|------------------------------------------------------------|------------------------------------------------------|
| locale            | en_US                                                      | The current site locale                              |
| currency          | USD                                                        | The current site currency code                       |
| currencySymbol    | $                                                          | The current site currency symbol                     |
| templateItem      | $('#item-template').html()                                 | The item template to use                             |
| noResultTemplate  | <li class="col-sm-12">Sorry, no result for you search</li> | The template to display if no product is found       |
| listResult        | document.getElementById('list-result')                     | The <ul> element to inject the result list on        |
| searchButton      | search-button                                              | The search button ID                                 |
| closeButton       | close-search                                               | The search overlay close button ID                   |
| submitSearch      | search-query-form                                          | The search <form> tag ID                             |
| inputSubmitSearch | search-query                                               | The search <input/> tag ID                           |
| searchBlock       | search-block                                               | The search overlay container ID                      |
| pageWrapper       | page                                                       | The page container class                             |
| apiUrl            | /api/public/search                                         | Relative search API url                              |
| indexCode         | products                                                   | The index configuration code                         |
| params            | {}                                                         | The filter parameters. Example: {"ref":["LIKE", '']} |